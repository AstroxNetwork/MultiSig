//! Partial implementation of the `Accounts` namespace.

// use crate::web3::ic::{ic_raw_sign, recover_address};
use crate::web3::{api::Namespace, signing, types::H256, Transport};

/// `Accounts` namespace
#[derive(Debug, Clone)]
pub struct Accounts<T> {
    transport: T,
}

impl<T: Transport> Namespace<T> for Accounts<T> {
    fn new(transport: T) -> Self
    where
        Self: Sized,
    {
        Accounts { transport }
    }

    fn transport(&self) -> &T {
        &self.transport
    }
}

impl<T: Transport> Accounts<T> {
    /// Hash a message according to EIP-191.
    ///
    /// The data is a UTF-8 encoded string and will enveloped as follows:
    /// `"\x19Ethereum Signed Message:\n" + message.length + message` and hashed
    /// using keccak256.
    pub fn hash_message<S>(&self, message: S) -> H256
    where
        S: AsRef<[u8]>,
    {
        signing::hash_message(message)
    }
}

// #[cfg(feature = "signing")]
mod accounts_signing {
    use super::*;
    use crate::ecdsa_api::{recover_address, sign_with_ecdsa};
    use crate::web3::{
        api::Web3,
        error,
        signing::Signature,
        types::{
            AccessList, Address, Bytes, Recovery, RecoveryMessage, SignedData, SignedTransaction,
            TransactionParameters, U256, U64,
        },
    };
    use rlp::RlpStream;
    use tecdsa_signer::types::ECDSAPublicKey;
    // use std::convert::TryInto;

    const LEGACY_TX_ID: u64 = 0;
    const ACCESSLISTS_TX_ID: u64 = 1;
    const EIP1559_TX_ID: u64 = 2;

    impl<T: Transport> Accounts<T> {
        /// Gets the parent `web3` namespace
        fn web3(&self) -> Web3<T> {
            Web3::new(self.transport.clone())
        }

        // Signs an Ethereum transaction with a given private key.
        //
        // Transaction signing can perform RPC requests in order to fill missing
        // parameters required for signing `nonce`, `gas_price` and `chain_id`. Note
        // that if all transaction parameters were provided, this future will resolve
        // immediately.
        // pub async fn sign_transaction<K: signing::Key>(
        //     &self,
        //     tx: TransactionParameters,
        //     key: K,
        // ) -> error::Result<SignedTransaction> {
        //     macro_rules! maybe {
        //         ($o: expr, $f: expr) => {
        //             async {
        //                 match $o {
        //                     Some(value) => Ok(value),
        //                     None => $f.await,
        //                 }
        //             }
        //         };
        //     }
        //     let from = key.address();

        //     let gas_price = match tx.transaction_type {
        //         Some(tx_type) if tx_type == U64::from(EIP1559_TX_ID) && tx.max_fee_per_gas.is_some() => {
        //             tx.max_fee_per_gas
        //         }
        //         _ => tx.gas_price,
        //     };

        //     let (nonce, gas_price, chain_id) = futures::future::try_join3(
        //         maybe!(tx.nonce, self.web3().eth().transaction_count(from, None)),
        //         maybe!(gas_price, self.web3().eth().gas_price()),
        //         maybe!(tx.chain_id.map(U256::from), self.web3().eth().chain_id()),
        //     )
        //     .await?;
        //     let chain_id = chain_id.as_u64();

        //     let max_priority_fee_per_gas = match tx.transaction_type {
        //         Some(tx_type) if tx_type == U64::from(EIP1559_TX_ID) => {
        //             tx.max_priority_fee_per_gas.unwrap_or(gas_price)
        //         }
        //         _ => gas_price,
        //     };

        //     let tx = Transaction {
        //         to: tx.to,
        //         nonce,
        //         gas: tx.gas,
        //         gas_price,
        //         value: tx.value,
        //         data: tx.data.0,
        //         transaction_type: tx.transaction_type,
        //         access_list: tx.access_list.unwrap_or_default(),
        //         max_priority_fee_per_gas,
        //     };

        //     let signed = tx.sign(key, chain_id);
        //     Ok(signed)
        // }
        pub async fn sign_transaction(
            &self,
            tx: TransactionParameters,
            from: String,
            key_name: String,
            derivation_path: Vec<Vec<u8>>,
            chain_id: u64,
        ) -> error::Result<SignedTransaction> {
            let gas_price = match tx.transaction_type {
                Some(tx_type)
                    if tx_type == U64::from(EIP1559_TX_ID) && tx.max_fee_per_gas.is_some() =>
                {
                    tx.max_fee_per_gas.unwrap()
                }
                _ => tx.gas_price.unwrap(),
            };

            let max_priority_fee_per_gas = match tx.transaction_type {
                Some(tx_type) if tx_type == U64::from(EIP1559_TX_ID) => {
                    tx.max_priority_fee_per_gas.unwrap_or(gas_price)
                }
                _ => gas_price,
            };

            let tx = Transaction {
                to: tx.to,
                nonce: tx.nonce.unwrap(),
                gas: tx.gas,
                gas_price,
                value: tx.value,
                data: tx.data.0,
                transaction_type: tx.transaction_type,
                access_list: tx.access_list.unwrap_or_default(),
                max_priority_fee_per_gas,
            };

            let signed = tx.sign(from, key_name, derivation_path, chain_id).await;
            Ok(signed)
        }

        // Sign arbitrary string data.
        //
        // The data is UTF-8 encoded and enveloped the same way as with
        // `hash_message`. The returned signed data's signature is in 'Electrum'
        // notation, that is the recovery value `v` is either `27` or `28` (as
        // opposed to the standard notation where `v` is either `0` or `1`). This
        // is important to consider when using this signature with other crates.
        // pub fn sign<S>(&self, message: S, key: impl signing::Key) -> SignedData
        // where
        //     S: AsRef<[u8]>,
        // {
        //     let message = message.as_ref();
        //     let message_hash = self.hash_message(message);

        //     let signature = key
        //         .sign(message_hash.as_bytes(), None)
        //         .expect("hash is non-zero 32-bytes; qed");
        //     let v = signature
        //         .v
        //         .try_into()
        //         .expect("signature recovery in electrum notation always fits in a u8");

        //     let signature_bytes = Bytes({
        //         let mut bytes = Vec::with_capacity(65);
        //         bytes.extend_from_slice(signature.r.as_bytes());
        //         bytes.extend_from_slice(signature.s.as_bytes());
        //         bytes.push(v);
        //         bytes
        //     });

        //     // We perform this allocation only after all previous fallible actions have completed successfully.
        //     let message = message.to_owned();

        //     SignedData {
        //         message,
        //         message_hash,
        //         v,
        //         r: signature.r,
        //         s: signature.s,
        //         signature: signature_bytes,
        //     }
        // }

        // Recovers the Ethereum address which was used to sign the given data.
        //
        // Recovery signature data uses 'Electrum' notation, this means the `v`
        // value is expected to be either `27` or `28`.
        // pub fn recover<R>(&self, recovery: R) -> error::Result<Address>
        // where
        //     R: Into<Recovery>,
        // {
        //     let recovery = recovery.into();
        //     let message_hash = match recovery.message {
        //         RecoveryMessage::Data(ref message) => self.hash_message(message),
        //         RecoveryMessage::Hash(hash) => hash,
        //     };
        //     let (signature, recovery_id) = recovery
        //         .as_signature()
        //         .ok_or(error::Error::Recovery(signing::RecoveryError::InvalidSignature))?;
        //     let address = signing::recover(message_hash.as_bytes(), &signature, recovery_id)?;
        //     Ok(address)
        // }
    }
    /// A transaction used for RLP encoding, hashing and signing.
    #[derive(Debug)]
    pub struct Transaction {
        pub to: Option<Address>,
        pub nonce: U256,
        pub gas: U256,
        pub gas_price: U256,
        pub value: U256,
        pub data: Vec<u8>,
        pub transaction_type: Option<U64>,
        pub access_list: AccessList,
        pub max_priority_fee_per_gas: U256,
    }

    impl Transaction {
        fn rlp_append_legacy(&self, stream: &mut RlpStream) {
            stream.append(&self.nonce);
            stream.append(&self.gas_price);
            stream.append(&self.gas);
            if let Some(to) = self.to {
                stream.append(&to);
            } else {
                stream.append(&"");
            }
            stream.append(&self.value);
            stream.append(&self.data);
        }

        fn encode_legacy(&self, chain_id: u64, signature: Option<&Signature>) -> RlpStream {
            let mut stream = RlpStream::new();
            stream.begin_list(9);

            self.rlp_append_legacy(&mut stream);

            if let Some(signature) = signature {
                self.rlp_append_signature(&mut stream, signature);
            } else {
                stream.append(&chain_id);
                stream.append(&0u8);
                stream.append(&0u8);
            }

            stream
        }

        fn encode_access_list_payload(
            &self,
            chain_id: u64,
            signature: Option<&Signature>,
        ) -> RlpStream {
            let mut stream = RlpStream::new();

            let list_size = if signature.is_some() { 11 } else { 8 };
            stream.begin_list(list_size);

            // append chain_id. from EIP-2930: chainId is defined to be an integer of arbitrary size.
            stream.append(&chain_id);

            self.rlp_append_legacy(&mut stream);
            self.rlp_append_access_list(&mut stream);

            if let Some(signature) = signature {
                self.rlp_append_signature(&mut stream, signature);
            }

            stream
        }

        fn encode_eip1559_payload(
            &self,
            chain_id: u64,
            signature: Option<&Signature>,
        ) -> RlpStream {
            let mut stream = RlpStream::new();

            let list_size = if signature.is_some() { 12 } else { 9 };
            stream.begin_list(list_size);

            // append chain_id. from EIP-2930: chainId is defined to be an integer of arbitrary size.
            stream.append(&chain_id);

            stream.append(&self.nonce);
            stream.append(&self.max_priority_fee_per_gas);
            stream.append(&self.gas_price);
            stream.append(&self.gas);
            if let Some(to) = self.to {
                stream.append(&to);
            } else {
                stream.append(&"");
            }
            stream.append(&self.value);
            stream.append(&self.data);

            self.rlp_append_access_list(&mut stream);

            if let Some(signature) = signature {
                self.rlp_append_signature(&mut stream, signature);
            }

            stream
        }

        fn rlp_append_signature(&self, stream: &mut RlpStream, signature: &Signature) {
            stream.append(&signature.v);
            stream.append(&U256::from_big_endian(signature.r.as_bytes()));
            stream.append(&U256::from_big_endian(signature.s.as_bytes()));
        }

        fn rlp_append_access_list(&self, stream: &mut RlpStream) {
            stream.begin_list(self.access_list.len());
            for access in self.access_list.iter() {
                stream.begin_list(2);
                stream.append(&access.address);
                stream.begin_list(access.storage_keys.len());
                for storage_key in access.storage_keys.iter() {
                    stream.append(storage_key);
                }
            }
        }

        fn encode(&self, chain_id: u64, signature: Option<&Signature>) -> Vec<u8> {
            match self.transaction_type.map(|t| t.as_u64()) {
                Some(LEGACY_TX_ID) | None => {
                    let stream = self.encode_legacy(chain_id, signature);
                    stream.out().to_vec()
                }

                Some(ACCESSLISTS_TX_ID) => {
                    let tx_id: u8 = ACCESSLISTS_TX_ID as u8;
                    let stream = self.encode_access_list_payload(chain_id, signature);
                    [&[tx_id], stream.as_raw()].concat()
                }

                Some(EIP1559_TX_ID) => {
                    let tx_id: u8 = EIP1559_TX_ID as u8;
                    let stream = self.encode_eip1559_payload(chain_id, signature);
                    [&[tx_id], stream.as_raw()].concat()
                }

                _ => {
                    panic!("Unsupported transaction type");
                }
            }
        }

        /// Sign and return a raw signed transaction.
        // pub fn sign(self, sign: impl signing::Key, chain_id: u64) -> SignedTransaction {
        //     let adjust_v_value = matches!(self.transaction_type.map(|t| t.as_u64()), Some(LEGACY_TX_ID) | None);

        //     let encoded = self.encode(chain_id, None);

        //     let hash = signing::keccak256(encoded.as_ref());

        //     let signature = if adjust_v_value {
        //         sign.sign(&hash, Some(chain_id))
        //             .expect("hash is non-zero 32-bytes; qed")
        //     } else {
        //         sign.sign_message(&hash).expect("hash is non-zero 32-bytes; qed")
        //     };

        //     let signed = self.encode(chain_id, Some(&signature));
        //     let transaction_hash = signing::keccak256(signed.as_ref()).into();

        //     SignedTransaction {
        //         message_hash: hash.into(),
        //         v: signature.v,
        //         r: signature.r,
        //         s: signature.s,
        //         raw_transaction: signed.into(),
        //         transaction_hash,
        //     }
        // }

        pub async fn sign(
            self,
            from: String,
            key_name: String,
            derivation_path: Vec<Vec<u8>>,
            chain_id: u64,
        ) -> SignedTransaction {
            let adjust_v_value = matches!(
                self.transaction_type.map(|t| t.as_u64()),
                Some(LEGACY_TX_ID) | None
            );

            let encoded = self.encode(chain_id, None);

            let hash = signing::keccak256(encoded.as_ref());

            let res = sign_with_ecdsa(key_name, derivation_path, hash.to_vec()).await;

            let v = if recover_address(hash.clone().to_vec(), res.clone(), 0) == from {
                if adjust_v_value {
                    2 * chain_id + 35 + 0
                } else {
                    0
                }
            } else {
                if adjust_v_value {
                    2 * chain_id + 35 + 1
                } else {
                    1
                }
            };

            let r_arr = H256::from_slice(&res[0..32]);
            let s_arr = H256::from_slice(&res[32..64]);
            let sig = Signature {
                v: v.clone(),
                r: r_arr.clone().into(),
                s: s_arr.clone().into(),
            };

            let signed = self.encode(chain_id, Some(&sig));
            let transaction_hash = signing::keccak256(signed.as_ref()).into();

            SignedTransaction {
                message_hash: hash.into(),
                v,
                r: r_arr.into(),
                s: s_arr.into(),
                raw_transaction: signed.into(),
                transaction_hash,
            }
        }
    }
}
