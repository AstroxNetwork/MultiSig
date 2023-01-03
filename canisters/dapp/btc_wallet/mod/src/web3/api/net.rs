//! `Net` namespace

use crate::web3::{api::Namespace, helpers::CallFuture, types::U256, Transport};

/// `Net` namespace
#[derive(Debug, Clone)]
pub struct Net<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for Net<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        Net { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> Net<T> {
    /// Returns the network id.
    pub fn version(&self) -> CallFuture<String, T::Out> {
        CallFuture::new(self.transport.execute("net_version", vec![]))
    }

    /// Returns number of peers connected to node.
    pub fn peer_count(&self) -> CallFuture<U256, T::Out> {
        CallFuture::new(self.transport.execute("net_peerCount", vec![]))
    }

    /// Whether the node is listening for network connections
    pub fn is_listening(&self) -> CallFuture<bool, T::Out> {
        CallFuture::new(self.transport.execute("net_listening", vec![]))
    }
}
