use crate::web3::{
    api::Namespace,
    helpers::{self, CallFuture},
    types::{Address, H256},
    Transport,
};

/// `Parity_Accounts` namespace
#[derive(Debug, Clone)]
pub struct ParityAccounts<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for ParityAccounts<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        ParityAccounts { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> ParityAccounts<T> {
    /// Given an address of an account and its password deletes the account from the parity node
    pub fn parity_kill_account(&self, address: &Address, pwd: &str) -> CallFuture<bool, T::Out> {
        let address = helpers::serialize(&address);
        let pwd = helpers::serialize(&pwd);
        CallFuture::new(
            self.transport
                .execute("parity_killAccount", vec![address, pwd]),
        )
    }
    /// Imports an account from a given seed/phrase
    /// Retunrs the address of the corresponding seed vinculated account
    pub fn parity_new_account_from_phrase(
        &self,
        seed: &str,
        pwd: &str,
    ) -> CallFuture<Address, T::Out> {
        let seed = helpers::serialize(&seed);
        let pwd = helpers::serialize(&pwd);
        CallFuture::new(
            self.transport
                .execute("parity_newAccountFromPhrase", vec![seed, pwd]),
        )
    }
    /// Imports an account from a given secret key.
    /// Returns the address of the corresponding Sk vinculated account.
    pub fn new_account_from_secret(&self, secret: &H256, pwd: &str) -> CallFuture<Address, T::Out> {
        let secret = helpers::serialize(&secret);
        let pwd = helpers::serialize(&pwd);
        CallFuture::new(
            self.transport
                .execute("parity_newAccountFromSecret", vec![secret, pwd]),
        )
    }
    /// Imports an account from a JSON encoded Wallet file.
    /// Returns the address of the corresponding wallet.
    pub fn parity_new_account_from_wallet(
        &self,
        wallet: &str,
        pwd: &str,
    ) -> CallFuture<Address, T::Out> {
        let wallet = helpers::serialize(&wallet);
        let pwd = helpers::serialize(&pwd);
        CallFuture::new(
            self.transport
                .execute("parity_newAccountFromWallet", vec![wallet, pwd]),
        )
    }
    /// Removes the address of the Parity node addressbook.
    /// Returns true if the operation suceeded.
    pub fn parity_remove_address(&self, address: &Address) -> CallFuture<bool, T::Out> {
        let address = helpers::serialize(&address);
        CallFuture::new(
            self.transport
                .execute("parity_removeAddress", vec![address]),
        )
    }
}
