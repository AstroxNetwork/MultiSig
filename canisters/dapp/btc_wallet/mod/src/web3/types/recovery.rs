use crate::web3::types::{SignedData, SignedTransaction, H256};
use std::{
    error::Error,
    fmt::{Display, Formatter, Result as FmtResult},
};

/// Data for recovering the public address of signed data.
///
/// Note that the signature data is in 'Electrum' notation and may have chain
/// replay protection applied. That means that `v` is expected to be `27`, `28`,
/// or `35 + chain_id * 2` or `36 + chain_id * 2`.
#[derive(Clone, Debug, PartialEq)]
pub struct Recovery {
    /// The message to recover
    pub message: RecoveryMessage,
    /// V value.
    pub v: u64,
    /// R value.
    pub r: H256,
    /// S value.
    pub s: H256,
}

impl Recovery {
    /// Creates new recovery data from its parts.
    pub fn new<M>(message: M, v: u64, r: H256, s: H256) -> Recovery
    where
        M: Into<RecoveryMessage>,
    {
        Recovery {
            message: message.into(),
            v,
            r,
            s,
        }
    }

    /// Creates new recovery data from a raw signature.
    ///
    /// This parses a raw signature which is expected to be 65 bytes long where
    /// the first 32 bytes is the `r` value, the second 32 bytes the `s` value
    /// and the final byte is the `v` value in 'Electrum' notation.
    pub fn from_raw_signature<M, B>(
        message: M,
        raw_signature: B,
    ) -> Result<Recovery, ParseSignatureError>
    where
        M: Into<RecoveryMessage>,
        B: AsRef<[u8]>,
    {
        let bytes = raw_signature.as_ref();

        if bytes.len() != 65 {
            return Err(ParseSignatureError);
        }

        let v = bytes[64];
        let r = H256::from_slice(&bytes[0..32]);
        let s = H256::from_slice(&bytes[32..64]);

        Ok(Recovery::new(message, v as _, r, s))
    }

    /// Retrieve the Recovery Id ("Standard V")
    ///
    /// Returns `None` if `v` value is invalid
    /// (equivalent of returning `4` in some implementaions).
    pub fn recovery_id(&self) -> Option<i32> {
        match self.v {
            27 => Some(0),
            28 => Some(1),
            v if v >= 35 => Some(((v - 1) % 2) as _),
            _ => None,
        }
    }

    /// Retrieves the recovery id & compact signature in it's raw form.
    pub fn as_signature(&self) -> Option<([u8; 64], i32)> {
        let recovery_id = self.recovery_id()?;
        let signature = {
            let mut sig = [0u8; 64];
            sig[..32].copy_from_slice(self.r.as_bytes());
            sig[32..].copy_from_slice(self.s.as_bytes());
            sig
        };

        Some((signature, recovery_id))
    }
}

impl<'a> From<&'a SignedData> for Recovery {
    fn from(signed: &'a SignedData) -> Self {
        Recovery::new(signed.message_hash, signed.v as _, signed.r, signed.s)
    }
}

impl<'a> From<&'a SignedTransaction> for Recovery {
    fn from(tx: &'a SignedTransaction) -> Self {
        Recovery::new(tx.message_hash, tx.v, tx.r, tx.s)
    }
}

/// Recovery message data.
///
/// The message data can either be a binary message that is first hashed
/// according to EIP-191 and then recovered based on the signature or a
/// precomputed hash.
#[derive(Clone, Debug, PartialEq)]
pub enum RecoveryMessage {
    /// Message bytes
    Data(Vec<u8>),
    /// Message hash
    Hash(H256),
}

impl From<&[u8]> for RecoveryMessage {
    fn from(s: &[u8]) -> Self {
        s.to_owned().into()
    }
}

impl From<Vec<u8>> for RecoveryMessage {
    fn from(s: Vec<u8>) -> Self {
        RecoveryMessage::Data(s)
    }
}

impl From<&str> for RecoveryMessage {
    fn from(s: &str) -> Self {
        s.as_bytes().to_owned().into()
    }
}

impl From<String> for RecoveryMessage {
    fn from(s: String) -> Self {
        RecoveryMessage::Data(s.into_bytes())
    }
}

impl From<[u8; 32]> for RecoveryMessage {
    fn from(hash: [u8; 32]) -> Self {
        H256(hash).into()
    }
}

impl From<H256> for RecoveryMessage {
    fn from(hash: H256) -> Self {
        RecoveryMessage::Hash(hash)
    }
}

/// An error parsing a raw signature.
#[derive(Copy, Clone, Debug, Default, Eq, PartialEq)]
pub struct ParseSignatureError;

impl Display for ParseSignatureError {
    fn fmt(&self, f: &mut Formatter) -> FmtResult {
        write!(
            f,
            "error parsing raw signature: wrong number of bytes, expected 65"
        )
    }
}

impl Error for ParseSignatureError {}
