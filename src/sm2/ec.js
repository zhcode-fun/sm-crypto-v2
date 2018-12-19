const { BigInteger } = require('jsbn');

/**
 * thanks for Tom Wu : http://www-cs-students.stanford.edu/~tjw/jsbn/
 *
 * Basic Javascript Elliptic Curve implementation
 * Ported loosely from BouncyCastle's Java EC code
 * Only Fp curves implemented for now
 */

const THREE = new BigInteger('3');

/**
 * 椭圆曲线域元素
 */
class ECFieldElementFp {
    constructor(q, x) {
        this.x = x;
        this.q = q;
        // TODO if(x.compareTo(q) >= 0) error
    }

    /**
     * 判断相等
     */
    equals(other) {
        if (other === this) return true;
        return (this.q.equals(other.q) && this.x.equals(other.x));
    }

    /**
     * 返回具体数值
     */
    toBigInteger() {
        return this.x;
    }

    /**
     * 取反
     */
    negate() {
        return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
    }

    /**
     * 相加
     */
    add(b) {
        return new ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q));
    }

    /**
     * 相减
     */
    subtract(b) {
        return new ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
    }

    /**
     * 相乘
     */
    multiply(b) {
        return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
    }

    /**
     * 相除
     */
    divide(b) {
        return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
    }

    /**
     * 平方
     */
    square() {
        return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
    }
}

class ECPointFp {
    constructor(curve, x, y, z) {
        this.curve = curve;
        this.x = x;
        this.y = y;
        // 标准射影坐标系：zinv == null 或 z * zinv == 1
        this.z = z == null ? BigInteger.ONE : z;
        this.zinv = null;
        //TODO: compression flag
    }

    getX() {
        if (this.zinv === null) this.zinv = this.z.modInverse(this.curve.q);

        return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    }

    getY() {
        if (this.zinv === null) this.zinv = this.z.modInverse(this.curve.q);

        return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    }

    /**
     * 判断相等
     */
    equals(other) {
        if (other === this) return true;
        if (this.isInfinity()) return other.isInfinity();
        if (other.isInfinity()) return this.isInfinity();

        // u = y2 * z1 - y1 * z2
        let u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);
        if (!u.equals(BigInteger.ZERO)) return false;

        // v = x2 * z1 - x1 * z2
        let v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);
        return v.equals(BigInteger.ZERO);
    }

    /**
     * 是否是无穷远点
     */
    isInfinity() {
        if ((this.x === null) && (this.y === null)) return true;
        return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
    }

    /**
     * 取反，x 轴对称点
     */
    negate() {
        return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
    }

    /**
     * 相加
     *
     * 标准射影坐标系：
     * 
     * λ1 = x1 * z2
     * λ2 = x2 * z1
     * λ3 = λ1 − λ2
     * λ4 = y1 * z2
     * λ5 = y2 * z1
     * λ6 = λ4 − λ5
     * λ7 = λ1 + λ2
     * λ8 = z1 * z2
     * λ9 = λ3^2
     * λ10 = λ3 * λ9
     * λ11 = λ8 * λ6^2 − λ7 * λ9
     * x3 = λ3 * λ11
     * y3 = λ6 * (λ9 * λ1 − λ11) − λ4 * λ10
     * z3 = λ10 * λ8
     */
    add(b) {
        if (this.isInfinity()) return b;
        if (b.isInfinity()) return this;

        let x1 = this.x.toBigInteger();
        let y1 = this.y.toBigInteger();
        let z1 = this.z;
        let x2 = b.x.toBigInteger();
        let y2 = b.y.toBigInteger();
        let z2 = b.z;
        let q = this.curve.q;
        
        let w1 = x1.multiply(z2).mod(q);
        let w2 = x2.multiply(z1).mod(q);
        let w3 = w1.subtract(w2);
        let w4 = y1.multiply(z2).mod(q);
        let w5 = y2.multiply(z1).mod(q);
        let w6 = w4.subtract(w5);

        if (BigInteger.ZERO.equals(w3)) {
            if (BigInteger.ZERO.equals(w6)) {
                return this.twice(); // this == b，计算自加
            }
            return this.curve.infinity; // this == -b，则返回无穷远点
        }

        let w7 = w1.add(w2);
        let w8 = z1.multiply(z2).mod(q);
        let w9 = w3.square().mod(q);
        let w10 = w3.multiply(w9).mod(q);
        let w11 = w8.multiply(w6.square()).subtract(w7.multiply(w9)).mod(q);

        let x3 = w3.multiply(w11).mod(q);
        let y3 = w6.multiply(w9.multiply(w1).subtract(w11)).subtract(w4.multiply(w10)).mod(q);
        let z3 = w10.multiply(w8).mod(q);

        return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
    }

    /**
     * 自加
     *
     * 标准射影坐标系：
     * 
     * λ1 = 3 * x1^2 + a * z1^2
     * λ2 = 2 * y1 * z1
     * λ3 = y1^2
     * λ4 = λ3 * x1 * z1
     * λ5 = λ2^2
     * λ6 = λ1^2 − 8 * λ4
     * x3 = λ2 * λ6
     * y3 = λ1 * (4 * λ4 − λ6) − 2 * λ5 * λ3
     * z3 = λ2 * λ5
     */
    twice() {
        if (this.isInfinity()) return this;
        if (this.y.toBigInteger().signum() == 0) return this.curve.infinity;

        let x1 = this.x.toBigInteger();
        let y1 = this.y.toBigInteger();
        let z1 = this.z;
        let q = this.curve.q;
        let a = this.curve.a.toBigInteger();

        let w1 = x1.square().multiply(THREE).add(a.multiply(z1.square())).mod(q);
        let w2 = y1.shiftLeft(1).multiply(z1).mod(q);
        let w3 = y1.square().mod(q);
        let w4 = w3.multiply(x1).multiply(z1).mod(q);
        let w5 = w2.square().mod(q);
        let w6 = w1.square().subtract(w4.shiftLeft(3)).mod(q);

        let x3 = w2.multiply(w6).mod(q);
        let y3 = w1.multiply(w4.shiftLeft(2).subtract(w6)).subtract(w5.shiftLeft(1).multiply(w3)).mod(q);
        let z3 = w2.multiply(w5).mod(q);

        return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
    }

    /**
     * 相乘
     */
    multiply(k) {
        if (this.isInfinity()) return this;
        if (k.signum() == 0) return this.curve.infinity;

        let e = k;
        let h = e.multiply(THREE);

        let neg = this.negate();
        let R = this;

        for (let i = h.bitLength() - 2; i > 0; i--) {
            R = R.twice();

            let hBit = h.testBit(i);
            let eBit = e.testBit(i);

            if (hBit != eBit) {
                R = R.add(hBit ? this : neg);
            }
        }

        return R;
    }
}

/**
 * 椭圆曲线 y^2 = x^3 + ax + b
 */
class ECCurveFp {
    constructor(q, a, b) {
        this.q = q;
        this.a = this.fromBigInteger(a);
        this.b = this.fromBigInteger(b);
        this.infinity = new ECPointFp(this, null, null); // 无穷远点
    }

    /**
     * 判断两个椭圆曲线是否相等
     */
    equals(other) {
        if (other === this) return true;
        return(this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b));
    }

    /**
     * 生成椭圆曲线域元素
     */
    fromBigInteger(x) {
        return new ECFieldElementFp(this.q, x);
    }

    /**
     * 解析 16 进制串为椭圆曲线点
     */
    decodePointHex(s) {
        switch (parseInt(s.substr(0, 2), 16)) {
            // 第一个字节
            case 0:
                return this.infinity;
            case 2:
            case 3:
                // 不支持的压缩方式
                return null;
            case 4:
            case 6:
            case 7:
                let len = (s.length - 2) / 2;
                let xHex = s.substr(2, len);
                let yHex = s.substr(len + 2, len);

                return new ECPointFp(this, this.fromBigInteger(new BigInteger(xHex, 16)), this.fromBigInteger(new BigInteger(yHex, 16)));
            default:
                // 不支持
                return null;
        }
    }
}

module.exports = {
    ECPointFp,
    ECCurveFp,
};
