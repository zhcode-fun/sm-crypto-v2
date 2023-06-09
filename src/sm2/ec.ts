import { weierstrass } from '@noble/curves/abstract/weierstrass';
import { Field } from '@noble/curves/abstract/modular'; // finite field for mod arithmetics
import { hmac, sm3 } from './sm3'
import { utf8ToArray } from '@/sm3';
import { concatArray } from './utils';
import { ONE } from './bn';
import { randomBytes } from './rng';



export function createHash() {
  const hashC = (msg: Uint8Array | string): Uint8Array => sm3(typeof msg === 'string' ? utf8ToArray(msg) : msg)
  hashC.outputLen = 256;
  hashC.blockLen = 512;
  hashC.create = () => sm3(Uint8Array.from([]));
  return hashC;
}

export const sm2Fp = Field(BigInt('115792089210356248756420345214020892766250353991924191454421193933289684991999'))
export const sm2Curve = weierstrass({
  // sm2: short weierstrass.
  a: BigInt('115792089210356248756420345214020892766250353991924191454421193933289684991996'),
  b: BigInt('18505919022281880113072981827955639221458448578012075254857346196103069175443'),
  Fp: sm2Fp,
  h: ONE,
  n: BigInt('115792089210356248756420345214020892766061623724957744567843809356293439045923'),
  Gx: BigInt('22963146547237050559479531362550074578802567295341616970375194840604139615431'),
  Gy: BigInt('85132369209828568825618990617112496413088388631904505083283536607588877201568'),
  hash: createHash(),
  hmac: (key: Uint8Array, ...msgs: Uint8Array[]) => hmac(concatArray(...msgs), key),
  randomBytes,
});
// 有限域运算
export const field = Field(BigInt(sm2Curve.CURVE.n))
