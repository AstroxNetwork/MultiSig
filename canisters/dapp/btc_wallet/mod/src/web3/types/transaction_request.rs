use crate::web3::types::{AccessList, Address, Bytes, U256, U64};
use serde::{Deserialize, Serialize};

/// Call contract request (eth_call / eth_estimateGas)
///
/// When using this for `eth_estimateGas`, all the fields
/// are optional. However, for usage in `eth_call` the
/// `to` field must be provided.
#[derive(Clone, Debug, PartialEq, Default, Serialize, Deserialize)]
pub struct CallRequest {
    /// Sender address (None for arbitrary address)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub from: Option<Address>,
    /// To address (None allowed for eth_estimateGas)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub to: Option<Address>,
    /// Supplied gas (None for sensible default)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gas: Option<U256>,
    /// Gas price (None for sensible default)
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "gasPrice")]
    pub gas_price: Option<U256>,
    /// Transfered value (None for no transfer)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<U256>,
    /// Data (None for empty data)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<Bytes>,
    /// Transaction type, Some(1) for AccessList transaction, None for Legacy
    #[serde(rename = "type", default, skip_serializing_if = "Option::is_none")]
    pub transaction_type: Option<U64>,
    /// Access list
    #[serde(
        rename = "accessList",
        default,
        skip_serializing_if = "Option::is_none"
    )]
    pub access_list: Option<AccessList>,
    /// Max fee per gas
    #[serde(rename = "maxFeePerGas", skip_serializing_if = "Option::is_none")]
    pub max_fee_per_gas: Option<U256>,
    /// miner bribe
    #[serde(
        rename = "maxPriorityFeePerGas",
        skip_serializing_if = "Option::is_none"
    )]
    pub max_priority_fee_per_gas: Option<U256>,
}

impl CallRequest {
    /// Funtion to return a builder for a Call Request
    pub fn builder() -> CallRequestBuilder {
        CallRequestBuilder::new()
    }
}

/// Call Request Builder
#[derive(Clone, Debug, Default)]
pub struct CallRequestBuilder {
    call_request: CallRequest,
}

impl CallRequestBuilder {
    /// Retuns a Builder with the Call Request set to default
    pub fn new() -> CallRequestBuilder {
        CallRequestBuilder {
            call_request: CallRequest::default(),
        }
    }

    /// Set sender address (None for arbitrary address)
    pub fn from(mut self, from: Address) -> Self {
        self.call_request.from = Some(from);
        self
    }

    /// Set to address (None allowed for eth_estimateGas)
    pub fn to(mut self, to: Address) -> Self {
        self.call_request.to = Some(to);
        self
    }

    /// Set supplied gas (None for sensible default)
    pub fn gas(mut self, gas: U256) -> Self {
        self.call_request.gas = Some(gas);
        self
    }

    /// Set transfered value (None for no transfer)
    pub fn gas_price(mut self, gas_price: U256) -> Self {
        self.call_request.gas_price = Some(gas_price);
        self
    }

    /// Set transfered value (None for no transfer)
    pub fn value(mut self, value: U256) -> Self {
        self.call_request.value = Some(value);
        self
    }

    /// Set data (None for empty data)
    pub fn data(mut self, data: Bytes) -> Self {
        self.call_request.data = Some(data);
        self
    }

    /// Set transaction type, Some(1) for AccessList transaction, None for Legacy
    pub fn transaction_type(mut self, transaction_type: U64) -> Self {
        self.call_request.transaction_type = Some(transaction_type);
        self
    }

    /// Set access list
    pub fn access_list(mut self, access_list: AccessList) -> Self {
        self.call_request.access_list = Some(access_list);
        self
    }

    /// build the Call Request
    pub fn build(&self) -> CallRequest {
        self.call_request.clone()
    }
}

/// Send Transaction Parameters
#[derive(Clone, Debug, PartialEq, Default, Serialize, Deserialize)]
pub struct TransactionRequest {
    /// Sender address
    pub from: Address,
    /// Recipient address (None for contract creation)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub to: Option<Address>,
    /// Supplied gas (None for sensible default)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gas: Option<U256>,
    /// Gas price (None for sensible default)
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "gasPrice")]
    pub gas_price: Option<U256>,
    /// Transfered value (None for no transfer)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<U256>,
    /// Transaction data (None for empty bytes)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<Bytes>,
    /// Transaction nonce (None for next available nonce)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub nonce: Option<U256>,
    /// Min block inclusion (None for include immediately)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub condition: Option<TransactionCondition>,
    /// Transaction type, Some(1) for AccessList transaction, None for Legacy
    #[serde(rename = "type", default, skip_serializing_if = "Option::is_none")]
    pub transaction_type: Option<U64>,
    /// Access list
    #[serde(
        rename = "accessList",
        default,
        skip_serializing_if = "Option::is_none"
    )]
    pub access_list: Option<AccessList>,
    /// Max fee per gas
    #[serde(rename = "maxFeePerGas", skip_serializing_if = "Option::is_none")]
    pub max_fee_per_gas: Option<U256>,
    /// miner bribe
    #[serde(
        rename = "maxPriorityFeePerGas",
        skip_serializing_if = "Option::is_none"
    )]
    pub max_priority_fee_per_gas: Option<U256>,
}

impl TransactionRequest {
    /// Funtion to return a builder for a Transaction Request
    pub fn builder() -> TransactionRequestBuilder {
        TransactionRequestBuilder::new()
    }
}

/// Transaction Request Builder
#[derive(Clone, Debug, Default)]
pub struct TransactionRequestBuilder {
    transaction_request: TransactionRequest,
}

impl TransactionRequestBuilder {
    /// Retuns a Builder with the Transaction Request set to default
    pub fn new() -> TransactionRequestBuilder {
        TransactionRequestBuilder {
            transaction_request: TransactionRequest::default(),
        }
    }

    /// Set sender address
    pub fn from(mut self, from: Address) -> Self {
        self.transaction_request.from = from;
        self
    }

    /// Set recipient address (None for contract creation)
    pub fn to(mut self, to: Address) -> Self {
        self.transaction_request.to = Some(to);
        self
    }

    /// Set supplied gas (None for sensible default)
    pub fn gas(mut self, gas: U256) -> Self {
        self.transaction_request.gas = Some(gas);
        self
    }

    /// Set transfered value (None for no transfer)
    pub fn value(mut self, value: U256) -> Self {
        self.transaction_request.value = Some(value);
        self
    }

    /// Set transaction data (None for empty bytes)
    pub fn data(mut self, data: Bytes) -> Self {
        self.transaction_request.data = Some(data);
        self
    }

    /// Set transaction nonce (None for next available nonce)
    pub fn nonce(mut self, nonce: U256) -> Self {
        self.transaction_request.nonce = Some(nonce);
        self
    }

    /// Set min block inclusion (None for include immediately)
    pub fn condition(mut self, condition: TransactionCondition) -> Self {
        self.transaction_request.condition = Some(condition);
        self
    }

    /// Set transaction type, Some(1) for AccessList transaction, None for Legacy
    pub fn transaction_type(mut self, transaction_type: U64) -> Self {
        self.transaction_request.transaction_type = Some(transaction_type);
        self
    }

    /// Set access list
    pub fn access_list(mut self, access_list: AccessList) -> Self {
        self.transaction_request.access_list = Some(access_list);
        self
    }

    /// build the Transaction Request
    pub fn build(&self) -> TransactionRequest {
        self.transaction_request.clone()
    }
}

/// Represents condition on minimum block number or block timestamp.
#[derive(Debug, Clone, Eq, PartialEq, Hash, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub enum TransactionCondition {
    /// Valid at this minimum block number.
    #[serde(rename = "block")]
    Block(u64),
    /// Valid at given unix time.
    #[serde(rename = "time")]
    Timestamp(u64),
}
