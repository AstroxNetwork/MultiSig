use crate::web3::{
    api::Namespace,
    helpers::{self, CallFuture},
    rpc::Value,
    types::{Bytes, CallRequest, ParityPendingTransactionFilter, Transaction},
    Transport,
};

/// `Parity` namespace
#[derive(Debug, Clone)]
pub struct Parity<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for Parity<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        Parity { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> Parity<T> {
    /// Sequentially call multiple contract methods in one request without changing the state of the blockchain.
    pub fn call(&self, reqs: Vec<CallRequest>) -> CallFuture<Vec<Bytes>, T::Out> {
        let reqs = helpers::serialize(&reqs);

        CallFuture::new(self.transport.execute("parity_call", vec![reqs]))
    }

    /// Get pending transactions
    /// Blocked by https://github.com/openethereum/openethereum/issues/159
    pub fn pending_transactions(
        &self,
        limit: Option<usize>,
        filter: Option<ParityPendingTransactionFilter>,
    ) -> CallFuture<Vec<Transaction>, T::Out> {
        let limit = limit.map(Value::from);
        let filter = filter.as_ref().map(helpers::serialize);
        let params = match (limit, filter) {
            (l, Some(f)) => vec![l.unwrap_or(Value::Null), f],
            (Some(l), None) => vec![l],
            _ => vec![],
        };

        CallFuture::new(self.transport.execute("parity_pendingTransactions", params))
    }
}
