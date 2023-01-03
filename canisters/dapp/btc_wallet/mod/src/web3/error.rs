//! Web3 Error
use crate::web3::rpc::error::Error as RPCError;
use derive_more::{Display, From};
use serde_json::Error as SerdeError;
use std::fmt::{Display, Formatter};
use std::io::Error as IoError;

/// Web3 `Result` type.
pub type Result<T = ()> = std::result::Result<T, Error>;

/// Transport-depended error.
#[derive(Debug, Clone, PartialEq)]
pub enum TransportError {
    /// Transport-specific error code.
    Code(u16),
    /// Arbitrary, developer-readable description of the occurred error.
    Message(String),
}

/// Errors which can occur when attempting to generate resource uri.
#[derive(Debug, From)]
pub enum Error {
    Unreachable,
    /// decoder error
    Decoder(String),
    /// invalid response
    #[from(ignore)]
    InvalidResponse(String),
    /// transport error
    #[from(ignore)]
    Transport(TransportError),
    /// rpc error
    Rpc(RPCError),
    /// io error
    Io(IoError),
    /// recovery error
    Recovery(crate::web3::signing::RecoveryError),
    /// web3 internal error
    Internal,
}

impl Display for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl std::error::Error for Error {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        use self::Error::*;
        match *self {
            Unreachable
            | Decoder(_)
            | InvalidResponse(_)
            | Transport { .. }
            | Internal
            | Recovery(_) => None,
            Rpc(ref e) => Some(e),
            Io(ref e) => Some(e),
        }
    }
}

impl From<SerdeError> for Error {
    fn from(err: SerdeError) -> Self {
        Error::Decoder(format!("{:?}", err))
    }
}

impl Clone for Error {
    fn clone(&self) -> Self {
        use self::Error::*;
        match self {
            Unreachable => Unreachable,
            Decoder(s) => Decoder(s.clone()),
            InvalidResponse(s) => InvalidResponse(s.clone()),
            Transport(s) => Transport(s.clone()),
            Rpc(e) => Rpc(e.clone()),
            Io(e) => Io(IoError::from(e.kind())),
            Recovery(e) => Recovery(e.clone()),
            Internal => Internal,
        }
    }
}

#[cfg(test)]
impl PartialEq for Error {
    fn eq(&self, other: &Self) -> bool {
        use self::Error::*;
        match (self, other) {
            (Unreachable, Unreachable) | (Internal, Internal) => true,
            (Decoder(a), Decoder(b)) | (InvalidResponse(a), InvalidResponse(b)) => a == b,
            (Transport(a), Transport(b)) => a == b,
            (Rpc(a), Rpc(b)) => a == b,
            (Io(a), Io(b)) => a.kind() == b.kind(),
            (Recovery(a), Recovery(b)) => a == b,
            _ => false,
        }
    }
}
