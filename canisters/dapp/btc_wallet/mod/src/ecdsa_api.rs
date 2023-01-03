use ic_cdk::{api::call::call_with_payment, call, export::Principal};
use libsecp256k1::{recover, Message, RecoveryId, Signature};

use crate::types::*;
use crate::web3::signing;

/// Returns the ECDSA public key of this canister at the given derivation path.
pub async fn ecdsa_public_key(key_name: String, derivation_path: Vec<Vec<u8>>) -> Vec<u8> {
    // Retrieve the public key of this canister at the given derivation path
    // from the ECDSA API.
    let res: (ECDSAPublicKeyReply,) = call(
        Principal::management_canister(),
        "ecdsa_public_key",
        (ECDSAPublicKey {
            canister_id: None,
            derivation_path,
            key_id: EcdsaKeyId {
                curve: EcdsaCurve::Secp256k1,
                name: key_name,
            },
        },),
    )
    .await
    .unwrap();

    res.0.public_key
}

pub async fn sign_with_ecdsa(
    key_name: String,
    derivation_path: Vec<Vec<u8>>,
    message_hash: Vec<u8>,
) -> Vec<u8> {
    let res: (SignWithECDSAReply,) = call_with_payment(
        Principal::management_canister(),
        "sign_with_ecdsa",
        (SignWithECDSA {
            message_hash,
            derivation_path,
            key_id: EcdsaKeyId {
                curve: EcdsaCurve::Secp256k1,
                name: key_name,
            },
        },),
        10_000_000_000,
    )
    .await
    .unwrap();

    res.0.signature
}

// recover address from signature
// rec_id < 4
pub fn recover_address(msg: Vec<u8>, sig: Vec<u8>, rec_id: u8) -> String {
    let message = Message::parse_slice(&msg).unwrap();
    let signature = Signature::parse_overflowing_slice(&sig).unwrap();
    let recovery_id = RecoveryId::parse(rec_id).unwrap();

    match recover(&message, &signature, &recovery_id) {
        Ok(pubkey) => {
            let uncompressed_pubkey = pubkey.serialize();
            // let hash = keccak256_hash(&uncompressed_pubkey[1..65]);
            let hash = signing::keccak256(&uncompressed_pubkey[1..65]);
            let mut result = [0u8; 20];
            result.copy_from_slice(&hash[12..]);
            hex::encode(result)
        }
        Err(_) => "".into(),
    }
}
