//! IC HTTP Transport

use crate::web3::transports::ICHttpClient;
use crate::web3::{
    error::{Error, Result, TransportError},
    helpers, BatchTransport, RequestId, Transport,
};
#[cfg(not(feature = "wasm"))]
use futures::future::BoxFuture;
#[cfg(feature = "wasm")]
use futures::future::LocalBoxFuture as BoxFuture;
use jsonrpc_core::types::{Call, Output, Request, Value};
use serde::de::DeserializeOwned;
use std::{
    collections::HashMap,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
};

/// HTTP Transport
#[derive(Clone, Debug)]
pub struct ICHttp {
    // Client is already an Arc so doesn't need to be part of inner.
    client: ICHttpClient,
    inner: Arc<Inner>,
}

#[derive(Debug)]
struct Inner {
    url: String,
    id: AtomicUsize,
}

impl ICHttp {
    /// Create new HTTP transport connecting to given URL, cycles: cycles amount to perform http call
    ///
    /// Note that the http [Client] automatically enables some features like setting the basic auth
    /// header or enabling a proxy from the environment. You can customize it with
    /// [Http::with_client].
    pub fn new(url: &str, max_resp: Option<u64>, cycles: Option<u64>) -> Result<Self> {
        Ok(Self {
            client: ICHttpClient::new(max_resp, cycles),
            inner: Arc::new(Inner {
                url: url.to_string(),
                id: AtomicUsize::new(0),
            }),
        })
    }

    pub fn set_max_response_bytes(&mut self, v: u64) {
        self.client.set_max_response_bytes(v);
    }

    pub fn set_cycles_per_call(&mut self, v: u64) {
        self.client.set_cycles_per_call(v);
    }

    fn next_id(&self) -> RequestId {
        self.inner.id.fetch_add(1, Ordering::AcqRel)
    }

    fn new_request(&self) -> (ICHttpClient, String) {
        (self.client.clone(), self.inner.url.clone())
    }
}

// Id is only used for logging.
async fn execute_rpc<T: DeserializeOwned>(
    client: &ICHttpClient,
    url: String,
    request: &Request,
    id: RequestId,
) -> Result<T> {
    let response = client
        .post(url, request, None, None)
        .await
        .map_err(|err| Error::Transport(TransportError::Message(err)))?;
    helpers::arbitrary_precision_deserialize_workaround(&response).map_err(|err| {
        Error::Transport(TransportError::Message(format!(
            "failed to deserialize response: {}: {}",
            err,
            String::from_utf8_lossy(&response)
        )))
    })
}

type RpcResult = Result<Value>;

impl Transport for ICHttp {
    type Out = BoxFuture<'static, Result<Value>>;

    fn prepare(&self, method: &str, params: Vec<Value>) -> (RequestId, Call) {
        let id = self.next_id();
        let request = helpers::build_request(id, method, params);
        (id, request)
    }

    fn send(&self, id: RequestId, call: Call) -> Self::Out {
        let (client, url) = self.new_request();
        Box::pin(async move {
            let output: Output = execute_rpc(&client, url, &Request::Single(call), id).await?;
            helpers::to_result_from_output(output)
        })
    }
}

impl BatchTransport for ICHttp {
    type Batch = BoxFuture<'static, Result<Vec<RpcResult>>>;

    fn send_batch<T>(&self, requests: T) -> Self::Batch
    where
        T: IntoIterator<Item = (RequestId, Call)>,
    {
        // Batch calls don't need an id but it helps associate the response log with the request log.
        let id = self.next_id();
        let (client, url) = self.new_request();
        let (ids, calls): (Vec<_>, Vec<_>) = requests.into_iter().unzip();
        Box::pin(async move {
            let outputs: Vec<Output> =
                execute_rpc(&client, url, &Request::Batch(calls), id).await?;
            handle_batch_response(&ids, outputs)
        })
    }
}

// According to the jsonrpc specification batch responses can be returned in any order so we need to
// restore the intended order.
fn handle_batch_response(ids: &[RequestId], outputs: Vec<Output>) -> Result<Vec<RpcResult>> {
    if ids.len() != outputs.len() {
        return Err(Error::InvalidResponse(
            "unexpected number of responses".to_string(),
        ));
    }
    let mut outputs = outputs
        .into_iter()
        .map(|output| {
            Ok((
                id_of_output(&output)?,
                helpers::to_result_from_output(output),
            ))
        })
        .collect::<Result<HashMap<_, _>>>()?;
    ids.iter()
        .map(|id| {
            outputs.remove(id).ok_or_else(|| {
                Error::InvalidResponse(format!("batch response is missing id {}", id))
            })
        })
        .collect()
}

fn id_of_output(output: &Output) -> Result<RequestId> {
    let id = match output {
        Output::Success(success) => &success.id,
        Output::Failure(failure) => &failure.id,
    };
    match id {
        jsonrpc_core::Id::Num(num) => Ok(*num as RequestId),
        _ => Err(Error::InvalidResponse("response id is not u64".to_string())),
    }
}
