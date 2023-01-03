//! `Txpool` namespace

use crate::web3::{
    api::Namespace,
    helpers::CallFuture,
    types::{TxpoolContentInfo, TxpoolInspectInfo, TxpoolStatus},
    Transport,
};

/// `Txpool` namespace
#[derive(Debug, Clone)]
pub struct Txpool<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for Txpool<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        Txpool { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> Txpool<T> {
    /// returns txpool content info
    pub fn content(&self) -> CallFuture<TxpoolContentInfo, T::Out> {
        CallFuture::new(self.transport.execute("txpool_content", vec![]))
    }

    /// returns txpool inspect info
    pub fn inspect(&self) -> CallFuture<TxpoolInspectInfo, T::Out> {
        CallFuture::new(self.transport.execute("txpool_inspect", vec![]))
    }

    /// returns txpool status
    pub fn status(&self) -> CallFuture<TxpoolStatus, T::Out> {
        CallFuture::new(self.transport.execute("txpool_status", vec![]))
    }
}
