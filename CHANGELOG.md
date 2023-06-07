# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.15](https://github.com/Cubelrti/sm-crypto-v2/compare/v0.3.13...v0.3.15) (2023-06-07)


### Features

* **ec:** add unit tests ([e513d51](https://github.com/Cubelrti/sm-crypto-v2/commit/e513d519fa82491bbb6c823cf862a7840bbc379e))

### [0.3.14](https://github.com/Cubelrti/sm-crypto-v2/compare/v0.3.13...v0.3.14) (2023-06-07)


### Features

* **ec:** add unit tests ([e513d51](https://github.com/Cubelrti/sm-crypto-v2/commit/e513d519fa82491bbb6c823cf862a7840bbc379e))

### 0.3.13 (2023-06-06)


### Features

* add asn1 test and coverage ([da9a6f7](https://github.com/Cubelrti/sm-crypto-v2/commit/da9a6f7e06f5e93b0849f80d0efc9131d151fdab))
* add dev deps ([5e2b3f3](https://github.com/Cubelrti/sm-crypto-v2/commit/5e2b3f33811d8d927da7954a3f4c0ecb87dec354))
* add test ([e97ce86](https://github.com/Cubelrti/sm-crypto-v2/commit/e97ce869f5f186cef3b02beeeb0607786823f612))
* sm2 support binary array ([db4c6c7](https://github.com/Cubelrti/sm-crypto-v2/commit/db4c6c7f5b2abd7926f9fc4118190cea3d527331))
* **sm2:** add shortcut for sm2 verify, better typing ([84f7f87](https://github.com/Cubelrti/sm-crypto-v2/commit/84f7f87672cb26fd5a5ec1b98be2765e07e2825b))


### Bug Fixes

* invalid padding check ([89189e3](https://github.com/Cubelrti/sm-crypto-v2/commit/89189e30f4f1083d973e7f57ae3e0e0f220f0efe))
* remove debug log ([b0f5f2a](https://github.com/Cubelrti/sm-crypto-v2/commit/b0f5f2a9808ff707d874e96c47556e55e26b4929))
* **sm2:** correct entl impl ([3d7d40d](https://github.com/Cubelrti/sm-crypto-v2/commit/3d7d40db162e76bc052771e7b9c26debdaa832a8))
* **test:** output reporter ([252ffdd](https://github.com/Cubelrti/sm-crypto-v2/commit/252ffdd289f6325d5e780e01de8137d8e3fe3453))
* **test:** summary ([73b83fa](https://github.com/Cubelrti/sm-crypto-v2/commit/73b83fa2b30db8311365841c603589f525c2d116))
* use pkcs[#7](https://github.com/Cubelrti/sm-crypto-v2/issues/7) instead of pkcs[#5](https://github.com/Cubelrti/sm-crypto-v2/issues/5) ([3f24a2a](https://github.com/Cubelrti/sm-crypto-v2/commit/3f24a2a45f09eaffc14271126b848115edf75fb7))
* use Uint8Array whenever possible ([d98cfcc](https://github.com/Cubelrti/sm-crypto-v2/commit/d98cfcc2d9b14040873b1efeda4e817ab12128d1))

## 0.3.12

* 优化 sm3 运行性能

## 0.3.11

* sm2 支持压缩公钥

## 0.3.10

* 支持 sm3 hmac 模式


## 0.3.9

* 补充 sm4 解密时的 padding 判断

## 0.3.8

* sm2 解密时兼容密文可能是大写的情况

## 0.3.7

* 默认填充改为 pkcs#7，如传入 pkcs#5 也转到 pkcs#7 逻辑

## 0.3.6

* sm2 加解密支持二进制数据

## 0.3.5

* sm2.generateKeyPairHex 支持完整的 BigInteger 入参

## 0.3.4

* sm2 支持验证公钥接口
* sm2 生成密钥时支持自定义随机数

## 0.3.3

* dist 输出改成 umd 模式

## 0.3.2

* 修复 sm2 在 userId 长度大于 31 时新旧版本验签不通过的问题
## 0.3.0

* sm2、sm3 重构
* sm4 支持 cbc 模式

## 0.2.7

* 优化 sm3 性能

## 0.2.5

* sm3 支持字节数组输入

## 0.2.4

* 修复 sm4 四字节字符输出编码

## 0.2.3

* sm3/sm4 支持输入四字节字符

## 0.2.2

* sm3 支持中文输入

## 0.2.1

* 修复 sm2 点 16 进制串可能不满 64 位的问题

## 0.2.0

* sm4 默认支持 pkcs#5 填充方式
* sm4 支持输入输出为字符串
