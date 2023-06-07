import { run, mark, utils } from 'micro-bmark';
import * as sm from 'sm-crypto'
import * as smV2 from 'sm-crypto-v2'

const msg = 'Hello world~!'

const keypair = smV2.sm2.generateKeyPairHex('12345678901234567890')

run(async () => {
  await smV2.sm2.initRNGPool()
  const sig = smV2.sm2.doSignature(msg, keypair.privateKey, { publicKey: keypair.publicKey})

  const RAM = false
  console.log();
  if (RAM) utils.logMem();
  console.log('=== sm-crypto ===')
  await mark('sm2 generateKeyPair', 100, () => sm.sm2.generateKeyPairHex())
  await mark('sm2 encrypt', 500, () => sm.sm2.doEncrypt(msg, keypair.publicKey));
  await mark('sm2 sign', 500, () => sm.sm2.doSignature(msg, keypair.privateKey, { publicKey: keypair.publicKey}));
  await mark('sm2 verify', 500, () => sm.sm2.doVerifySignature(msg, sig, keypair.publicKey));
  if (RAM) utils.logMem();
  if (RAM) utils.logMem();
  console.log('=== sm-crypto-v2 ===')
  await mark('sm2 generateKeyPair', 100, () => smV2.sm2.generateKeyPairHex())
  await mark('sm2 encrypt', 500, () => smV2.sm2.doEncrypt(msg, keypair.publicKey));
  await mark('sm2 sign', 500, () => smV2.sm2.doSignature(msg, keypair.privateKey, { publicKey: keypair.publicKey}));
  await mark('sm2 verify', 500, () => smV2.sm2.doVerifySignature(msg, sig, keypair.publicKey));
  if (RAM) utils.logMem();
});
