import { weierstrass } from '@noble/curves/abstract/weierstrass';
import { Field } from '@noble/curves/abstract/modular'; // finite field for mod arithmetics
import { hmac, sm3 } from './sm3'
import { utf8ToArray } from '@/sm3';
import { concatArray } from './utils';


export function createHash() {
  const hashC = (msg: Uint8Array | string): Uint8Array => sm3(typeof msg === 'string' ? utf8ToArray(msg) : msg)
  hashC.outputLen = 256;
  hashC.blockLen = 512;
  hashC.create = () => sm3(Uint8Array.from([]));
  return hashC;
}

export const sm2Fp = Field(115792089210356248756420345214020892766250353991924191454421193933289684991999n)
export const sm2Curve = weierstrass({
  // sm2: short weierstrass.
  a: 115792089210356248756420345214020892766250353991924191454421193933289684991996n,
  b: 18505919022281880113072981827955639221458448578012075254857346196103069175443n,
  Fp: sm2Fp,
  h: 1n,
  n: 115792089210356248756420345214020892766061623724957744567843809356293439045923n,
  Gx: 22963146547237050559479531362550074578802567295341616970375194840604139615431n,
  Gy: 85132369209828568825618990617112496413088388631904505083283536607588877201568n,
  hash: createHash(),
  hmac: (key: Uint8Array, ...msgs: Uint8Array[]) => hmac(concatArray(...msgs), key),
  randomBytes: (n) => {
    return new Uint8Array(n ?? 0).map(() => Math.floor(Math.random() * 256));
  },
});