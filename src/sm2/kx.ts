import { sm2Curve } from './ec';
import { KeyPair, concatArray, hexToArray, leftPad } from './utils';
import * as utils from '@noble/curves/abstract/utils';
import { Field } from '@noble/curves/abstract/modular';
import { sm3 } from './sm3';

export const field = Field(BigInt(sm2Curve.CURVE.n))

// 用到的常数
const wPow2 = utils.hexToNumber('80000000000000000000000000000000')
const wPow2Sub1 = utils.hexToNumber('7fffffffffffffffffffffffffffffff')

// from sm2 sign part, extracted for code reusable.
function hkdf(z: Uint8Array, keylen: number) {
  let t = new Uint8Array() // 256 位
  let msg = new Uint8Array(keylen)
  let ct = 1
  let offset = 0
  const nextT = () => {
    // (1) Hai = hash(z || ct)
    // (2) ct++
    t = sm3(Uint8Array.from([...z, ct >> 24 & 0x00ff, ct >> 16 & 0x00ff, ct >> 8 & 0x00ff, ct & 0x00ff]))
    ct++
    offset = 0
  }
  nextT() // 先生成 Ha1

  for (let i = 0, len = msg.length; i < len; i++) {
    // t = Ha1 || Ha2 || Ha3 || Ha4
    if (offset === t.length) nextT()

    // c2 = msg ^ t
    msg[i] = t[offset++] & 0xff
  }
  return msg
}


export function calculateSharedKey(
  keypairA: KeyPair,
  ephemeralKeypairA: KeyPair,
  publicKeyB: string,
  ephemeralPublicKeyB: string,
  idA: string = '1234567812345678',
  idB: string = '1234567812345678',
  sharedKeyLength: number,
) {
  const RA = sm2Curve.ProjectivePoint.fromHex(ephemeralKeypairA.publicKey)
  const RB = sm2Curve.ProjectivePoint.fromHex(ephemeralPublicKeyB)
  // const PA = sm2Curve.ProjectivePoint.fromHex(keypairA.publicKey) // 暂时用不到
  const PB = sm2Curve.ProjectivePoint.fromHex(publicKeyB)
  const ZA = hexToArray(idA)
  const ZB = hexToArray(idB)
  const rA = utils.hexToNumber(ephemeralKeypairA.privateKey)
  const dA = utils.hexToNumber(keypairA.privateKey)
  // 1.先算tA
  const x1 = RA.x
  // x1_ = 2^w + (x1 & (2^w - 1))
  const x1_ = field.add(wPow2, (x1 & wPow2Sub1))
  // tA = (dA + x1b * rA) mod n
  const tA = field.add(dA, field.mul(x1_, rA))

  // 2.算 U
  // x2_ = 2^w + (x2 & (2^w - 1))
  const x2 = RB.x
  const x2_ = field.add(wPow2, (x2 & wPow2Sub1))
  // U = [h * tA](PB + x2_ * RB)
  const U = RB.multiply(x2_).add(PB).multiply(tA)

  // 3.算 KDF
  // KA = KDF(xU || yU || ZA || ZB, kLen)
  const xU = hexToArray(leftPad(utils.numberToHexUnpadded(U.x), 64))
  const yU = hexToArray(leftPad(utils.numberToHexUnpadded(U.y), 64))
  const KA = hkdf(concatArray(xU, yU, ZA, ZB), sharedKeyLength)
  return KA
}
