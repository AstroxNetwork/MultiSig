export type CanisterIdString = string;
export type NeuronId = bigint;
export type AccountIdentifier = string;
export type BlockHeight = bigint;
export type E8s = bigint;
export type Memo = bigint;
export type PrincipalString = string;
export type SubAccount = Uint8Array;
export enum WalletType {
  nns = 'nns',
  plug = 'plug',
  stoic = 'stoic',
  me = 'me',
  unknown = 'unknown',
}

export interface Balance {
  value: string;
  decimals: number;
}
export const btc_network = {
  regtest: { Regtest: null },
  mainnet: { Mainnet: null },
  testnet: { Testnet: null },
};
