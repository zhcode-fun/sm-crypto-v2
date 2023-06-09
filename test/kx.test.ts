import { sm2 } from '@/index';
import { calculateSharedKey, leftPad, verifyPublicKey } from '@/sm2';
import { describe, expect, it } from 'vitest';
import * as utils from '@noble/curves/abstract/utils';
import { sm2Curve } from '@/sm2/ec';

describe('key exchange', () => {
  const keyPairA = sm2.generateKeyPairHex()
  const keyPairB = sm2.generateKeyPairHex()
  const ephemeralKeypairA = sm2.generateKeyPairHex()
  const ephemeralKeypairB = sm2.generateKeyPairHex()
  it('agree a key', () => {
    const sharedKeyFromA = sm2.calculateSharedKey(keyPairA, ephemeralKeypairA, keyPairB.publicKey, ephemeralKeypairB.publicKey, 'alice@yahoo.com', 'bob@yahoo.com', 233)
    const sharedKeyFromB = sm2.calculateSharedKey(keyPairB, ephemeralKeypairB, keyPairA.publicKey, ephemeralKeypairA.publicKey, 'alice@yahoo.com', 'bob@yahoo.com', 233)
    console.log({
      sharedKeyFromA,
      sharedKeyFromB,
    })
    expect(sharedKeyFromA).toEqual(sharedKeyFromB)
  })
})
