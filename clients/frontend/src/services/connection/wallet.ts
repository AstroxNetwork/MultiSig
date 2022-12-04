import {
  Result_3,
  Result_7,
  _SERVICE,
} from '@/canisters/ego_wallet';
import { idlFactory as walletIdl } from '@/canisters/ego_wallet.idl';
import { BaseConnection } from './base';
import { ActorSubclass, HttpAgent, Identity } from '@dfinity/agent';
import { getActor } from './base';

export class WalletConnection extends BaseConnection<_SERVICE> {
  constructor(
    public identity: Identity,
    public actor: ActorSubclass<_SERVICE>,
    public agent: HttpAgent,
  ) {
    super(
      identity,
      process.env.EGO_WALLET_CANISTERID!,
      walletIdl,
      actor,
      agent,
    );
  }
  static async create(identity: Identity): Promise<WalletConnection> {
    const { actor, agent } = await getActor<_SERVICE>(
      walletIdl,
      process.env.EGO_WALLET_CANISTERID!,
      identity,
    );
    return new WalletConnection(identity, actor, agent);
  }


  async get_apps(): Promise<Result_3> {
    const result = await this._actor.get_apps();
    return result;
  }

  async wallet_balance128(): Promise<Result_7> {
    console.log(this._actor)
    const result = await this._actor.wallet_balance128();
    return result;
  }

  
  
}
