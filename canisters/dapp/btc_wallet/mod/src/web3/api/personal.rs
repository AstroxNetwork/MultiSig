//! `Personal` namespace

use crate::web3::{
    api::Namespace,
    helpers::{self, CallFuture},
    types::{Address, Bytes, RawTransaction, TransactionRequest, H256, H520},
    Transport,
};

/// `Personal` namespace
#[derive(Debug, Clone)]
pub struct Personal<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for Personal<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        Personal { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> Personal<T> {
    /// Returns a list of available accounts.
    pub fn list_accounts(&self) -> CallFuture<Vec<Address>, T::Out> {
        CallFuture::new(self.transport.execute("personal_listAccounts", vec![]))
    }

    /// Creates a new account and protects it with given password.
    /// Returns the address of created account.
    pub fn new_account(&self, password: &str) -> CallFuture<Address, T::Out> {
        let password = helpers::serialize(&password);
        CallFuture::new(
            self.transport
                .execute("personal_newAccount", vec![password]),
        )
    }

    /// Unlocks the account with given password for some period of time (or single transaction).
    /// Returns `true` if the call was successful.
    pub fn unlock_account(
        &self,
        address: Address,
        password: &str,
        duration: Option<u16>,
    ) -> CallFuture<bool, T::Out> {
        let address = helpers::serialize(&address);
        let password = helpers::serialize(&password);
        let duration = helpers::serialize(&duration);
        CallFuture::new(
            self.transport
                .execute("personal_unlockAccount", vec![address, password, duration]),
        )
    }

    /// Sends a transaction from locked account.
    /// Returns transaction hash.
    pub fn send_transaction(
        &self,
        transaction: TransactionRequest,
        password: &str,
    ) -> CallFuture<H256, T::Out> {
        let transaction = helpers::serialize(&transaction);
        let password = helpers::serialize(&password);
        CallFuture::new(
            self.transport
                .execute("personal_sendTransaction", vec![transaction, password]),
        )
    }

    /// Signs an Ethereum specific message with `sign(keccak256("\x19Ethereum Signed Message: " + len(data) + data)))`
    ///
    /// The account does not need to be unlocked to make this call, and will not be left unlocked after.
    /// Returns encoded signature.
    pub fn sign(&self, data: Bytes, account: Address, password: &str) -> CallFuture<H520, T::Out> {
        let data = helpers::serialize(&data);
        let address = helpers::serialize(&account);
        let password = helpers::serialize(&password);
        CallFuture::new(
            self.transport
                .execute("personal_sign", vec![data, address, password]),
        )
    }

    /// Signs a transaction without dispatching it to the network.
    /// The account does not need to be unlocked to make this call, and will not be left unlocked after.
    /// Returns a signed transaction in raw bytes along with it's details.
    pub fn sign_transaction(
        &self,
        transaction: TransactionRequest,
        password: &str,
    ) -> CallFuture<RawTransaction, T::Out> {
        let transaction = helpers::serialize(&transaction);
        let password = helpers::serialize(&password);
        CallFuture::new(
            self.transport
                .execute("personal_signTransaction", vec![transaction, password]),
        )
    }

    /// Imports a raw key and protects it with the given password.
    /// Returns the address of created account.
    pub fn import_raw_key(
        &self,
        private_key: &[u8; 32],
        password: &str,
    ) -> CallFuture<Address, T::Out> {
        let private_key = hex::encode(private_key);
        let private_key = helpers::serialize(&private_key);
        let password = helpers::serialize(&password);

        CallFuture::new(
            self.transport
                .execute("personal_importRawKey", vec![private_key, password]),
        )
    }
}
