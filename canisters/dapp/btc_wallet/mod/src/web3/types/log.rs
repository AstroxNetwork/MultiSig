use crate::web3::types::{BlockNumber, Bytes, Index, H160, H256, U256, U64};
use serde::{Deserialize, Serialize, Serializer};

/// A log produced by a transaction.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Log {
    /// H160
    pub address: H160,
    /// Topics
    pub topics: Vec<H256>,
    /// Data
    pub data: Bytes,
    /// Block Hash
    #[serde(rename = "blockHash")]
    pub block_hash: Option<H256>,
    /// Block Number
    #[serde(rename = "blockNumber")]
    pub block_number: Option<U64>,
    /// Transaction Hash
    #[serde(rename = "transactionHash")]
    pub transaction_hash: Option<H256>,
    /// Transaction Index
    #[serde(rename = "transactionIndex")]
    pub transaction_index: Option<Index>,
    /// Log Index in Block
    #[serde(rename = "logIndex")]
    pub log_index: Option<U256>,
    /// Log Index in Transaction
    #[serde(rename = "transactionLogIndex")]
    pub transaction_log_index: Option<U256>,
    /// Log Type
    #[serde(rename = "logType")]
    pub log_type: Option<String>,
    /// Removed
    pub removed: Option<bool>,
}

impl Log {
    /// Returns true if the log has been removed.
    pub fn is_removed(&self) -> bool {
        match self.removed {
            Some(val_removed) => return val_removed,
            None => (),
        }
        match self.log_type {
            Some(ref val_log_type) => {
                if val_log_type == "removed" {
                    return true;
                }
            }
            None => (),
        }
        false
    }
}

#[derive(Default, Debug, PartialEq, Clone)]
struct ValueOrArray<T>(Vec<T>);

impl<T> Serialize for ValueOrArray<T>
where
    T: Serialize,
{
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self.0.len() {
            0 => serializer.serialize_none(),
            1 => Serialize::serialize(&self.0[0], serializer),
            _ => Serialize::serialize(&self.0, serializer),
        }
    }
}

/// Filter
#[derive(Default, Debug, PartialEq, Clone, Serialize)]
pub struct Filter {
    /// From Block
    #[serde(rename = "fromBlock", skip_serializing_if = "Option::is_none")]
    from_block: Option<BlockNumber>,
    /// To Block
    #[serde(rename = "toBlock", skip_serializing_if = "Option::is_none")]
    to_block: Option<BlockNumber>,
    /// Block Hash
    #[serde(rename = "blockHash", skip_serializing_if = "Option::is_none")]
    block_hash: Option<H256>,
    /// Address
    #[serde(skip_serializing_if = "Option::is_none")]
    address: Option<ValueOrArray<H160>>,
    /// Topics
    #[serde(skip_serializing_if = "Option::is_none")]
    topics: Option<Vec<Option<ValueOrArray<H256>>>>,
    /// Limit
    #[serde(skip_serializing_if = "Option::is_none")]
    limit: Option<usize>,
}

/// Filter Builder
#[derive(Default, Clone)]
pub struct FilterBuilder {
    filter: Filter,
}

impl FilterBuilder {
    /// Sets `from_block`. The fields `from_block` and `block_hash` are
    /// mutually exclusive. Setting `from_block` will clear a previously set
    /// `block_hash`.
    pub fn from_block(mut self, block: BlockNumber) -> Self {
        self.filter.block_hash = None;
        self.filter.from_block = Some(block);
        self
    }

    /// Sets `to_block`. The fields `to_block` and `block_hash` are mutually
    /// exclusive. Setting `to_block` will clear a previously set `block_hash`.
    pub fn to_block(mut self, block: BlockNumber) -> Self {
        self.filter.block_hash = None;
        self.filter.to_block = Some(block);
        self
    }

    /// Sets `block_hash`. The field `block_hash` and the pair `from_block` and
    /// `to_block` are mutually exclusive. Setting `block_hash` will clear a
    /// previously set `from_block` and `to_block`.
    pub fn block_hash(mut self, hash: H256) -> Self {
        self.filter.from_block = None;
        self.filter.to_block = None;
        self.filter.block_hash = Some(hash);
        self
    }

    /// Single address
    pub fn address(mut self, address: Vec<H160>) -> Self {
        self.filter.address = Some(ValueOrArray(address));
        self
    }

    /// Topics
    pub fn topics(
        mut self,
        topic1: Option<Vec<H256>>,
        topic2: Option<Vec<H256>>,
        topic3: Option<Vec<H256>>,
        topic4: Option<Vec<H256>>,
    ) -> Self {
        let mut topics = vec![topic1, topic2, topic3, topic4]
            .into_iter()
            .rev()
            .skip_while(Option::is_none)
            .map(|option| option.map(ValueOrArray))
            .collect::<Vec<_>>();
        topics.reverse();

        self.filter.topics = Some(topics);
        self
    }

    /// Sets the topics according to the given `ethabi` topic filter
    pub fn topic_filter(self, topic_filter: ethabi::TopicFilter) -> Self {
        self.topics(
            topic_to_option(topic_filter.topic0),
            topic_to_option(topic_filter.topic1),
            topic_to_option(topic_filter.topic2),
            topic_to_option(topic_filter.topic3),
        )
    }

    /// Limit the result
    pub fn limit(mut self, limit: usize) -> Self {
        self.filter.limit = Some(limit);
        self
    }

    /// Returns filter
    pub fn build(&self) -> Filter {
        self.filter.clone()
    }
}

/// Converts a `Topic` to an equivalent `Option<Vec<T>>`, suitable for `FilterBuilder::topics`
fn topic_to_option<T>(topic: ethabi::Topic<T>) -> Option<Vec<T>> {
    match topic {
        ethabi::Topic::Any => None,
        ethabi::Topic::OneOf(v) => Some(v),
        ethabi::Topic::This(t) => Some(vec![t]),
    }
}
