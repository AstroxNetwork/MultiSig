//! Contract call/query error.

use crate::web3::error::Error as ApiError;
use derive_more::{Display, From};
use ethabi::Error as EthError;
use std::fmt::{Display, Formatter};

/// Contract error.
#[derive(Debug, From)]
pub enum Error {
    /// invalid output type requested by the caller
    InvalidOutputType(String),
    /// eth abi error
    Abi(EthError),
    /// Rpc error
    Api(ApiError),
    /// An error during deployment.
    Deployment(crate::web3::contract::deploy::Error),
    /// Contract does not support this interface.
    InterfaceUnsupported,
}

impl Display for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl std::error::Error for Error {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match *self {
            Error::InvalidOutputType(_) => None,
            Error::Abi(ref e) => Some(e),
            Error::Api(ref e) => Some(e),
            Error::Deployment(ref e) => Some(e),
            Error::InterfaceUnsupported => None,
        }
    }
}

pub mod deploy {
    use crate::web3::{error::Error as ApiError, types::H256};
    use derive_more::From;
    use std::fmt::{Display, Formatter};

    /// Contract deployment error.
    #[derive(Debug, From)]
    pub enum Error {
        /// eth abi error
        Abi(ethabi::Error),
        /// Rpc error
        Api(ApiError),
        /// Contract deployment failed
        ContractDeploymentFailure(H256),
    }

    impl Display for Error {
        fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
            todo!()
        }
    }

    impl std::error::Error for Error {
        fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
            match *self {
                Error::Abi(ref e) => Some(e),
                Error::Api(ref e) => Some(e),
                Error::ContractDeploymentFailure(_) => None,
            }
        }
    }
}
