use crate::web3::{
    api::Namespace,
    helpers::{self, CallFuture},
    types::{Address, ParityPeerType, H256},
    Transport,
};

#[derive(Debug, Clone)]
/// `Parity_Set` Specific API
pub struct ParitySet<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for ParitySet<T> {
    fn new(transport: T) -> Self {
        ParitySet { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> ParitySet<T> {
    /// Set Parity to accept non-reserved peers (default behavior)
    pub fn accept_non_reserved_peers(&self) -> CallFuture<bool, T::Out> {
        CallFuture::new(
            self.transport()
                .execute("parity_acceptNonReservedPeers", vec![]),
        )
    }

    /// Add a reserved peer
    pub fn add_reserved_peer(&self, enode: &str) -> CallFuture<bool, T::Out> {
        let enode = helpers::serialize(&enode);
        CallFuture::new(
            self.transport()
                .execute("parity_addReservedPeer", vec![enode]),
        )
    }

    /// Set Parity to drop all non-reserved peers. To restore default behavior call parity_acceptNonReservedPeers
    pub fn drop_non_reserved_peers(&self) -> CallFuture<bool, T::Out> {
        CallFuture::new(
            self.transport()
                .execute("parity_dropNonReservedPeers", vec![]),
        )
    }

    /// Get list of connected/connecting peers.
    pub fn parity_net_peers(&self) -> CallFuture<ParityPeerType, T::Out> {
        CallFuture::new(self.transport.execute("parity_netPeers", vec![]))
    }

    /// Attempts to upgrade Parity to the version specified in parity_upgradeReady
    pub fn execute_upgrade(&self) -> CallFuture<bool, T::Out> {
        CallFuture::new(self.transport().execute("parity_executeUpgrade", vec![]))
    }

    /// Creates a hash of a file at a given URL
    pub fn hash_content(&self, url: &str) -> CallFuture<H256, T::Out> {
        let url = helpers::serialize(&url);
        CallFuture::new(self.transport().execute("parity_hashContent", vec![url]))
    }

    /// Remove a reserved peer
    pub fn remove_reserved_peer(&self, enode: &str) -> CallFuture<bool, T::Out> {
        let enode = helpers::serialize(&enode);
        CallFuture::new(
            self.transport()
                .execute("parity_removeReservedPeer", vec![enode]),
        )
    }

    /// Changes author (coinbase) for mined blocks
    pub fn set_author(&self, author: &Address) -> CallFuture<bool, T::Out> {
        let address = helpers::serialize(&author);
        CallFuture::new(self.transport().execute("parity_setAuthor", vec![address]))
    }

    /// Sets the network spec file Parity is using
    pub fn set_chain(&self, chain: &str) -> CallFuture<bool, T::Out> {
        let chain = helpers::serialize(&chain);
        CallFuture::new(self.transport().execute("parity_setChain", vec![chain]))
    }

    /// Sets an authority account for signing consensus messages
    pub fn set_engine_signer(&self, address: &Address, password: &str) -> CallFuture<bool, T::Out> {
        let address = helpers::serialize(&address);
        let password = helpers::serialize(&password);
        CallFuture::new(
            self.transport()
                .execute("parity_setEngineSigner", vec![address, password]),
        )
    }

    /// Changes extra data for newly mined blocks
    pub fn set_extra_data(&self, data: &H256) -> CallFuture<bool, T::Out> {
        let data = helpers::serialize(&data);
        CallFuture::new(self.transport().execute("parity_setExtraData", vec![data]))
    }

    /// Sets new gas ceiling target for mined blocks
    pub fn set_gas_ceil_target(&self, quantity: &H256) -> CallFuture<bool, T::Out> {
        let quantity = helpers::serialize(&quantity);
        CallFuture::new(
            self.transport()
                .execute("parity_setGasCeilTarget", vec![quantity]),
        )
    }

    /// Sets a new gas floor target for mined blocks
    pub fn set_gas_floor_target(&self, quantity: &H256) -> CallFuture<bool, T::Out> {
        let quantity = helpers::serialize(&quantity);
        CallFuture::new(
            self.transport()
                .execute("parity_setGasFloorTarget", vec![quantity]),
        )
    }

    /// Sets the maximum amount of gas a single transaction may consume
    pub fn set_max_transaction_gas(&self, quantity: &H256) -> CallFuture<bool, T::Out> {
        let quantity = helpers::serialize(&quantity);
        CallFuture::new(
            self.transport()
                .execute("parity_setMaxTransactionGas", vec![quantity]),
        )
    }

    /// Changes minimal gas price for transaction to be accepted to the queue
    pub fn set_min_gas_price(&self, quantity: &H256) -> CallFuture<bool, T::Out> {
        let quantity = helpers::serialize(&quantity);
        CallFuture::new(
            self.transport()
                .execute("parity_setMinGasPrice", vec![quantity]),
        )
    }

    /// Changes the operating mode of Parity.
    pub fn set_mode(&self, mode: &str) -> CallFuture<bool, T::Out> {
        let mode = helpers::serialize(&mode);
        CallFuture::new(self.transport().execute("parity_setMode", vec![mode]))
    }

    /// Changes limit for transactions in queue. (NOT WORKING !)
    pub fn set_transactions_limit(&self, limit: &H256) -> CallFuture<bool, T::Out> {
        let limit = helpers::serialize(&limit);
        CallFuture::new(
            self.transport()
                .execute("parity_setTransactionsLimit", vec![limit]),
        )
    }

    /// Returns a ReleaseInfo object describing the release which is available for upgrade or null if none is available.
    pub fn upgrade_ready(&self) -> CallFuture<Option<String>, T::Out> {
        CallFuture::new(self.transport().execute("parity_upgradeReady", vec![]))
    }
}
