//! `Web3` namespace

use crate::web3::{
    api::Namespace,
    helpers::{self, CallFuture},
    types::{Bytes, H256},
    Transport,
};

/// `Web3` namespace
#[derive(Debug, Clone)]
pub struct Web3<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for Web3<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        Web3 { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> Web3<T> {
    /// Returns client version
    pub fn client_version(&self) -> CallFuture<String, T::Out> {
        CallFuture::new(self.transport.execute("web3_clientVersion", vec![]))
    }

    /// Returns sha3 of the given data
    pub fn sha3(&self, bytes: Bytes) -> CallFuture<H256, T::Out> {
        let bytes = helpers::serialize(&bytes);
        CallFuture::new(self.transport.execute("web3_sha3", vec![bytes]))
    }
}
