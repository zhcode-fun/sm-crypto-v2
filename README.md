# sm-crypto-v2

[![npm version](https://badge.fury.io/js/sm-crypto-v2.svg)](https://www.npmjs.com/package/sm-crypto-v2)
[![status](https://img.shields.io/github/actions/workflow/status/cubelrti/sm-crypto-v2/test.yml?branch=master)](https://github.com/cubelrti/sm-crypto-v2/actions)
[![cov](https://cubelrti.github.io/sm-crypto-v2/badges/coverage.svg)](https://github.com/cubelrti/sm-crypto-v2/actions)

国密算法 sm2、sm3 和 sm4 的 TypeScript 实现。参数支持 TypedArray，导出 esm/cjs。

## 特性

- ⚡ 基于 [`noble-curves` Abstract API](https://github.com/paulmillr/noble-curves#abstract-api) 重构 SM2，性能提升近4倍。详见 [noble-curves 文档](https://paulmillr.com/posts/noble-secp256k1-fast-ecc/) 
- 📘 使用 TypeScript 实现，提供全面的类型支持
- 🔄 移除原有 `jsbn` 依赖，改用原生 BigInt
- ✔️ 通过全部历史单元测试，包括 SM2、SM3 和 SM4
- 🎲 自动选择最优的安全随机数实现，避免使用 `Math.random` 和 `Date.now` 进行模拟
- 📚 同时导出 ES Module 和 CommonJS 两种格式，可按需使用
- 🔑 新增密钥交换 API（实验性）

## 安装

```bash
npm install --save sm-crypto-v2
```

## sm2

### 获取密钥对

```js
import { sm2 } from 'sm-crypto-v2'

let keypair = sm2.generateKeyPairHex()

publicKey = keypair.publicKey // 公钥
privateKey = keypair.privateKey // 私钥

// 默认生成公钥 130 位太长，可以压缩公钥到 66 位
const compressedPublicKey = sm2.compressPublicKeyHex(publicKey) // compressedPublicKey 和 publicKey 等价
sm2.comparePublicKeyHex(publicKey, compressedPublicKey) // 判断公钥是否等价

// 自定义随机数，参数会直接透传给 BigInt 构造器
// 注意：开发者使用自定义随机数，需要自行确保传入的随机数符合密码学安全
let keypair2 = sm2.generateKeyPairHex('123123123123123')

// 初始化随机数池，在某些场景下可能会用到
await sm2.initRNGPool()

let verifyResult = sm2.verifyPublicKey(publicKey) // 验证公钥
verifyResult = sm2.verifyPublicKey(compressedPublicKey) // 验证公钥
```

### 加密解密

```js
import { sm2 } from 'sm-crypto-v2'
const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1

let encryptData = sm2.doEncrypt(msgString, publicKey, cipherMode) // 加密结果
let decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode) // 解密结果

encryptData = sm2.doEncrypt(msgArray, publicKey, cipherMode) // 加密结果，输入数组
decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode, {output: 'array'}) // 解密结果，输出数组
```

### 签名验签

> ps：理论上来说，只做纯签名是最快的。

```js
import { sm2 } from 'sm-crypto-v2'
// 纯签名 + 生成椭圆曲线点
let sigValueHex = sm2.doSignature(msg, privateKey) // 签名
let verifyResult = sm2.doVerifySignature(msg, sigValueHex, publicKey) // 验签结果

// 纯签名
let sigValueHex2 = sm2.doSignature(msg, privateKey, {
    pointPool: [sm2.getPoint(), sm2.getPoint(), sm2.getPoint(), sm2.getPoint()], // 传入事先已生成好的椭圆曲线点，可加快签名速度
}) // 签名
let verifyResult2 = sm2.doVerifySignature(msg, sigValueHex2, publicKey) // 验签结果

// 纯签名 + 生成椭圆曲线点 + der编解码
let sigValueHex3 = sm2.doSignature(msg, privateKey, {
    der: true,
}) // 签名
let verifyResult3 = sm2.doVerifySignature(msg, sigValueHex3, publicKey, {
    der: true,
}) // 验签结果

// 纯签名 + 生成椭圆曲线点 + sm3杂凑
let sigValueHex4 = sm2.doSignature(msg, privateKey, {
    hash: true,
}) // 签名
let verifyResult4 = sm2.doVerifySignature(msg, sigValueHex4, publicKey, {
    hash: true,
}) // 验签结果

// 纯签名 + 生成椭圆曲线点 + sm3杂凑（不做公钥推导）
let sigValueHex5 = sm2.doSignature(msg, privateKey, {
    hash: true,
    publicKey, // 传入公钥的话，可以去掉sm3杂凑中推导公钥的过程，速度会比纯签名 + 生成椭圆曲线点 + sm3杂凑快
})
let verifyResult5 = sm2.doVerifySignature(msg, sigValueHex5, publicKey, {
    hash: true,
    publicKey,
})

// 纯签名 + 生成椭圆曲线点 + sm3杂凑 + 不做公钥推 + 添加 userId（长度小于 8192）
// 默认 userId 值为 1234567812345678
let sigValueHex6 = sm2.doSignature(msgString, privateKey, {
    hash: true,
    publicKey,
    userId: 'testUserId',
})
let verifyResult6 = sm2.doVerifySignature(msgString, sigValueHex6, publicKey, {
    hash: true,
    userId: 'testUserId',
})
```

### 获取椭圆曲线点

```js
import { sm2 } from 'sm-crypto-v2'
let point = sm2.getPoint() // 获取一个椭圆曲线点，可在sm2签名时传入
```

## sm3

```js
import { sm3 } from 'sm-crypto-v2'
let hashData = sm3('abc') // 杂凑

// hmac
hashData = sm3('abc', {
    key: 'daac25c1512fe50f79b0e4526b93f5c0e1460cef40b6dd44af13caec62e8c60e0d885f3c6d6fb51e530889e6fd4ac743a6d332e68a0f2a3923f42585dceb93e9', // 要求为 16 进制串或字节数组
})
```

## sm4

### 加密

```js
import { sm4 } from 'sm-crypto-v2'
const msg = 'hello world! 我是 juneandgreen.' // 可以为 utf8 串或字节数组
const key = '0123456789abcdeffedcba9876543210' // 可以为 16 进制串或字节数组，要求为 128 比特

let encryptData = sm4.encrypt(msg, key) // 加密，默认输出 16 进制字符串，默认使用 pkcs#7 填充（传 pkcs#5 也会走 pkcs#7 填充）
let encryptData = sm4.encrypt(msg, key, {padding: 'none'}) // 加密，不使用 padding
let encryptData = sm4.encrypt(msg, key, {padding: 'none', output: 'array'}) // 加密，不使用 padding，输出为字节数组
let encryptData = sm4.encrypt(msg, key, {mode: 'cbc', iv: 'fedcba98765432100123456789abcdef'}) // 加密，cbc 模式
```

### 解密

```js
import { sm4 } from 'sm-crypto-v2'
const encryptData = '0e395deb10f6e8a17e17823e1fd9bd98a1bff1df508b5b8a1efb79ec633d1bb129432ac1b74972dbe97bab04f024e89c' // 可以为 16 进制串或字节数组
const key = '0123456789abcdeffedcba9876543210' // 可以为 16 进制串或字节数组，要求为 128 比特

let decryptData = sm4.decrypt(encryptData, key) // 解密，默认输出 utf8 字符串，默认使用 pkcs#7 填充（传 pkcs#5 也会走 pkcs#7 填充）
let decryptData = sm4.decrypt(encryptData, key, {padding: 'none'}) // 解密，不使用 padding
let decryptData = sm4.decrypt(encryptData, key, {padding: 'none', output: 'array'}) // 解密，不使用 padding，输出为字节数组
let decryptData = sm4.decrypt(encryptData, key, {mode: 'cbc', iv: 'fedcba98765432100123456789abcdef'}) // 解密，cbc 模式
```

### 密钥交换(实验性)

```js
import { sm2 } from 'sm-crypto-v2'

const keyPairA = sm2.generateKeyPairHex() // A 的秘钥对
const keyPairB = sm2.generateKeyPairHex() // B 的秘钥对
const ephemeralKeypairA = sm2.generateKeyPairHex() // A 的临时秘钥对
const ephemeralKeypairB = sm2.generateKeyPairHex() // B 的临时秘钥对

// A 所需参数：A 的秘钥对，A 的临时秘钥对，B 的公钥，B 的临时秘钥公钥，AB 的身份ID，长度
const sharedKeyFromA = sm2.calculateSharedKey(keyPairA, ephemeralKeypairA, keyPairB.publicKey, ephemeralKeypairB.publicKey, 'alice@yahoo.com', 'bob@yahoo.com', 233)
// B 所需参数：B 的秘钥对，B 的临时秘钥对，A 的公钥，A 的临时秘钥公钥，AB 的身份ID，长度
const sharedKeyFromB = sm2.calculateSharedKey(keyPairB, ephemeralKeypairB, keyPairA.publicKey, ephemeralKeypairA.publicKey, 'alice@yahoo.com', 'bob@yahoo.com', 233)

// expect(sharedKeyFromA).toEqual(sharedKeyFromB) => true
```

## 其他实现

* 原 js 版本：[https://github.com/JuneAndGreen/sm-crypto](https://github.com/JuneAndGreen/sm-crypto)
* 小程序移植版：[https://github.com/wechat-miniprogram/sm-crypto](https://github.com/wechat-miniprogram/sm-crypto)
* java 实现（感谢 @antherd 提供）：[https://github.com/antherd/sm-crypto](https://github.com/antherd/sm-crypto)
* dart 实现（感谢 @luckykellan 提供）：[https://github.com/luckykellan/dart_sm](https://github.com/luckykellan/dart_sm)

## 性能

CPU: Apple M1 Pro

| 操作          | sm-crypto            | sm-crypto-v2         | 性能差距         |
|:-------------------|:---------------------|:---------------------|:---------------------|
| **RAM (before)**   | rss=58.6mb, used=10.5mb | rss=57.7mb, used=10.5mb | N/A                  |
| **sm2**            |                      |                      |                      |
| generateKeyPair    | 150 ops/sec, 6ms/op  | 3,371 ops/sec, 296μs/op | 22.47x               |
| encrypt            | 76 ops/sec, 13ms/op  | 293 ops/sec, 3ms/op   | 3.85x                |
| sign               | 146 ops/sec, 6ms/op  | 3,737 ops/sec, 267μs/op | 25.6x                |
| verify             | 77 ops/sec, 12ms/op  | 301 ops/sec, 3ms/op   | 3.91x                |
| **sm3**            |                      |                      |                      |
| hash               | 320 ops/sec, 3ms/op  | 518 ops/sec, 1ms/op   | 1.62x                |
| hmac               | 238 ops/sec, 4ms/op  | 517 ops/sec, 1ms/op   | 2.17x                |
| **RAM (after)**    | rss=147.7mb, used=59.5mb | rss=110.5mb, used=26.2mb | N/A                  |

## 协议

MIT
