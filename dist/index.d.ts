import { BigInteger } from 'jsbn';

/**
 * 加密
 */
declare function doEncrypt(msg: string | Uint8Array, publicKey: string, cipherMode?: number): string;
/**
 * 解密
 */
declare function doDecrypt(encryptData: string, privateKey: string, cipherMode?: number, { output, }?: {
    output?: string | undefined;
}): string | Uint8Array | never[];
interface SignaturePoint {
    k: BigInteger;
    x1: BigInteger;
}
/**
 * 签名
 */
declare function doSignature(msg: Uint8Array, privateKey: string, options?: {
    pointPool?: SignaturePoint[];
    der?: boolean;
    hash?: boolean;
    publicKey?: string;
    userId?: string;
}): string;
/**
 * 验签
 */
declare function doVerifySignature(msg: string | Uint8Array, signHex: string, publicKey: string, options?: {
    der?: boolean;
    hash?: boolean;
    userId?: string;
}): boolean;
/**
 * sm3杂凑算法
 */
declare function getHash(hashHex: string, publicKey: string, userId?: string): string;
/**
 * 计算公钥
 */
declare function getPublicKeyFromPrivateKey(privateKey: string): string;
/**
 * 获取椭圆曲线点
 */
declare function getPoint(): {
    k: BigInteger;
    x1: BigInteger;
    /**
     * 解密
     */
    privateKey: string;
    publicKey: string;
};

/**
 * 补全16进制字符串
 */
/**
 * utf8 串转字节数组
 */
declare function utf8ToArray(str: string): Uint8Array;
declare function sm3(input: string | Uint8Array, options: {
    key: Uint8Array;
    mode?: 'hmac' | 'mac';
}): string;

declare function sm4(inArray: Uint8Array, key: Uint8Array, cryptFlag: 0 | 1, options?: {
    padding?: 'pkcs#7' | 'pkcs#5' | null;
    mode?: 'cbc' | 'ecb';
    iv?: Uint8Array;
    output?: 'string' | 'array';
}): string | Uint8Array;

export { SignaturePoint, doDecrypt, doEncrypt, doSignature, doVerifySignature, getHash, getPoint, getPublicKeyFromPrivateKey, sm3, sm4, utf8ToArray };
