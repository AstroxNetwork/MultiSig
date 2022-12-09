import { CreateActorResult, IConnector } from '@connect2ic/core';
import { ActorSubclass } from '@dfinity/agent';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';

export function hasOwnProperty<
  X extends Record<string, unknown>,
  Y extends PropertyKey,
>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function file2Buffer(file: File): Promise<Buffer> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    const readFile = function (event: any) {
      const buffer = reader.result;
      resolve(buffer as Buffer);
    };
    reader.addEventListener('load', readFile);
    reader.readAsArrayBuffer(file);
  });
}

export const getActor = async <T>(
  provider: IConnector,
  canisterId: string,
  idl: InterfaceFactory,
): Promise<ActorSubclass<T> | undefined> => {
  const resp = (await provider.createActor(
    canisterId,
    idl,
  )) as CreateActorResult<T>;
  const controllerActor = resp.isOk() ? resp.value : null;
  if (controllerActor !== null) {
    return controllerActor;
  } else {
    throw new Error('createActor error');
    // return undefined;
  }
};
