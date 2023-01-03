use crate::web3::{
    api::Namespace,
    helpers::{self, CallFuture},
    types::{
        BlockId, BlockNumber, BlockTrace, Bytes, CallRequest, Index, Trace, TraceFilter, TraceType,
        H256,
    },
    Transport,
};

/// `Trace` namespace
#[derive(Debug, Clone)]
pub struct Traces<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for Traces<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        Traces { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> Traces<T> {
    /// Executes the given call and returns a number of possible traces for it
    pub fn call(
        &self,
        req: CallRequest,
        trace_type: Vec<TraceType>,
        block: Option<BlockNumber>,
    ) -> CallFuture<BlockTrace, T::Out> {
        let req = helpers::serialize(&req);
        let block = helpers::serialize(&block.unwrap_or(BlockNumber::Latest));
        let trace_type = helpers::serialize(&trace_type);
        CallFuture::new(
            self.transport
                .execute("trace_call", vec![req, trace_type, block]),
        )
    }

    /// Performs multiple call traces on top of the same block. Allows to trace dependent transactions.
    pub fn call_many(
        &self,
        reqs_with_trace_types: Vec<(CallRequest, Vec<TraceType>)>,
        block: Option<BlockId>,
    ) -> CallFuture<Vec<BlockTrace>, T::Out> {
        let reqs_with_trace_types = helpers::serialize(&reqs_with_trace_types);
        let block = helpers::serialize(&block.unwrap_or_else(|| BlockNumber::Latest.into()));
        CallFuture::new(
            self.transport
                .execute("trace_callMany", vec![reqs_with_trace_types, block]),
        )
    }

    /// Traces a call to `eth_sendRawTransaction` without making the call, returning the traces
    pub fn raw_transaction(
        &self,
        data: Bytes,
        trace_type: Vec<TraceType>,
    ) -> CallFuture<BlockTrace, T::Out> {
        let data = helpers::serialize(&data);
        let trace_type = helpers::serialize(&trace_type);
        CallFuture::new(
            self.transport
                .execute("trace_rawTransaction", vec![data, trace_type]),
        )
    }

    /// Replays a transaction, returning the traces
    pub fn replay_transaction(
        &self,
        hash: H256,
        trace_type: Vec<TraceType>,
    ) -> CallFuture<BlockTrace, T::Out> {
        let hash = helpers::serialize(&hash);
        let trace_type = helpers::serialize(&trace_type);
        CallFuture::new(
            self.transport
                .execute("trace_replayTransaction", vec![hash, trace_type]),
        )
    }

    /// Replays all transactions in a block returning the requested traces for each transaction
    pub fn replay_block_transactions(
        &self,
        block: BlockNumber,
        trace_type: Vec<TraceType>,
    ) -> CallFuture<Vec<BlockTrace>, T::Out> {
        let block = helpers::serialize(&block);
        let trace_type = helpers::serialize(&trace_type);
        CallFuture::new(
            self.transport
                .execute("trace_replayBlockTransactions", vec![block, trace_type]),
        )
    }

    /// Returns traces created at given block
    pub fn block(&self, block: BlockNumber) -> CallFuture<Vec<Trace>, T::Out> {
        let block = helpers::serialize(&block);
        CallFuture::new(self.transport.execute("trace_block", vec![block]))
    }

    /// Return traces matching the given filter
    ///
    /// See [TraceFilterBuilder](../types/struct.TraceFilterBuilder.html)
    pub fn filter(&self, filter: TraceFilter) -> CallFuture<Vec<Trace>, T::Out> {
        let filter = helpers::serialize(&filter);
        CallFuture::new(self.transport.execute("trace_filter", vec![filter]))
    }

    /// Returns trace at the given position
    pub fn get(&self, hash: H256, index: Vec<Index>) -> CallFuture<Trace, T::Out> {
        let hash = helpers::serialize(&hash);
        let index = helpers::serialize(&index);
        CallFuture::new(self.transport.execute("trace_get", vec![hash, index]))
    }

    /// Returns all traces of a given transaction
    pub fn transaction(&self, hash: H256) -> CallFuture<Vec<Trace>, T::Out> {
        let hash = helpers::serialize(&hash);
        CallFuture::new(self.transport.execute("trace_transaction", vec![hash]))
    }
}
