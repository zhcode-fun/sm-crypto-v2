import { ECCurveFp, ECFieldElementFp, ECPointFp } from "@/sm2/ec"
import { BigInteger } from "jsbn"
import { describe, it, expect } from "vitest"


describe('equals', () => {
    it('should return true if two ECFieldElementFp objects are equal', () => {
        const q = new BigInteger('23')
        const x = new BigInteger('5')
        const element1 = new ECFieldElementFp(q, x)
        const element2 = new ECFieldElementFp(q, x)
        expect(element1.equals(element2)).toBe(true)
    })

    it('should return false if two ECFieldElementFp objects are not equal', () => {
        const q = new BigInteger('23')
        const x1 = new BigInteger('5')
        const x2 = new BigInteger('6')
        const element1 = new ECFieldElementFp(q, x1)
        const element2 = new ECFieldElementFp(q, x2)
        expect(element1.equals(element2)).toBe(false)
    })

    it('should return true if comparing an object to itself', () => {
        const q = new BigInteger('23')
        const x = new BigInteger('5')
        const element = new ECFieldElementFp(q, x)
        expect(element.equals(element)).toBe(true)
    })
})

describe('subtract', () => {
    it('should subtract two ECFieldElementFp objects', () => {
        const q = new BigInteger('23')
        const x1 = new BigInteger('5')
        const x2 = new BigInteger('6')
        const element1 = new ECFieldElementFp(q, x1)
        const element2 = new ECFieldElementFp(q, x2)
        const expectedOutput = new ECFieldElementFp(q, x1.subtract(x2).mod(q))
        expect(element1.subtract(element2)).toEqual(expectedOutput)
    })

    it('should handle negative results', () => {
        const q = new BigInteger('23')
        const x1 = new BigInteger('5')
        const x2 = new BigInteger('10')
        const element1 = new ECFieldElementFp(q, x1)
        const element2 = new ECFieldElementFp(q, x2)
        const expectedOutput = new ECFieldElementFp(q, x1.subtract(x2).add(q).mod(q))
        expect(element1.subtract(element2)).toEqual(expectedOutput)
    })

    it('should handle zero', () => {
        const q = new BigInteger('23')
        const x = new BigInteger('5')
        const element1 = new ECFieldElementFp(q, x)
        const element2 = new ECFieldElementFp(q, x)
        const expectedOutput = new ECFieldElementFp(q, new BigInteger('0').mod(q))
        expect(element1.subtract(element2)).toEqual(expectedOutput)
    })
})

describe('divide', () => {
    it('should divide two ECFieldElementFp objects', () => {
        const q = new BigInteger('23')
        const x1 = new BigInteger('5')
        const x2 = new BigInteger('6')
        const element1 = new ECFieldElementFp(q, x1)
        const element2 = new ECFieldElementFp(q, x2)
        const expectedOutput = new ECFieldElementFp(q, x1.multiply(x2.modInverse(q)).mod(q))
        expect(element1.divide(element2)).toEqual(expectedOutput)
    })
})

describe('getY', () => {
    it('should calculate the y-coordinate when zinv is null', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const x = new ECFieldElementFp(curve.q, new BigInteger('5'))
        const y = new ECFieldElementFp(curve.q, new BigInteger('7'))
        const point = new ECPointFp(curve, x, y)
        point.zinv = null
        const element = new ECFieldElementFp(curve.q, new BigInteger('7'))
        const expectedOutput = new ECPointFp(curve, x, element)
        expect(point.getY()).toEqual(expectedOutput.getY())
    })
})

describe('equals', () => {
    it('should return true when comparing the same object', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const x = new ECFieldElementFp(curve.q, new BigInteger('5'))
        const y = new ECFieldElementFp(curve.q, new BigInteger('7'))
        const point = new ECPointFp(curve, x, y)
        expect(point.equals(point)).toBe(true)
    })

    it('should return true when comparing two equal objects', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const x = new ECFieldElementFp(curve.q, new BigInteger('5'))
        const y = new ECFieldElementFp(curve.q, new BigInteger('7'))
        const point1 = new ECPointFp(curve, x, y)
        const point2 = new ECPointFp(curve, x, y)
        expect(point1.equals(point2)).toBe(true)
    })

    it('should return false when comparing two different objects', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const x1 = new ECFieldElementFp(curve.q, new BigInteger('5'))
        const y1 = new ECFieldElementFp(curve.q, new BigInteger('7'))
        const x2 = new ECFieldElementFp(curve.q, new BigInteger('6'))
        const y2 = new ECFieldElementFp(curve.q, new BigInteger('8'))
        const point1 = new ECPointFp(curve, x1, y1)
        const point2 = new ECPointFp(curve, x2, y2)
        expect(point1.equals(point2)).toBe(false)
    })

    it('should return true when comparing infinity to infinity', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const point1 = new ECPointFp(curve, null, null)
        const point2 = new ECPointFp(curve, null, null)
        expect(point1.equals(point2)).toBe(true)
    })

    it('should return false when comparing infinity to a non-infinity point', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const x = new ECFieldElementFp(curve.q, new BigInteger('5'))
        const y = new ECFieldElementFp(curve.q, new BigInteger('7'))
        const point1 = new ECPointFp(curve, x, y)
        const point2 = new ECPointFp(curve, null, null)
        expect(point1.equals(point2)).toBe(false)
    })
})

describe('isInfinity', () => {
    it('should return true when x and y are null', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const point = new ECPointFp(curve, null, null)
        expect(point.isInfinity()).toBe(true)
    })

    it('should return true when z is zero and y is non-zero', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const x = new ECFieldElementFp(curve.q, new BigInteger('5'))
        const y = new ECFieldElementFp(curve.q, new BigInteger('7'))
        const point = new ECPointFp(curve, x, y, BigInteger.ZERO)
        expect(point.isInfinity()).toBe(true)
    })

    it('should return false when z is non-zero and y is zero', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const x = new ECFieldElementFp(curve.q, new BigInteger('5'))
        const y = new ECFieldElementFp(curve.q, BigInteger.ZERO)
        const point = new ECPointFp(curve, x, y, new BigInteger('2'))
        expect(point.isInfinity()).toBe(false)
    })

    it('should return false when z is zero and y is zero', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const point = new ECPointFp(curve, null, new ECFieldElementFp(curve.q, BigInteger.ZERO), BigInteger.ZERO)
        expect(point.isInfinity()).toBe(false)
    })

    it('should return false when z is zero and y is zero', () => {
        const curve = new ECCurveFp(new BigInteger('23'), new BigInteger('1'), new BigInteger('1'))
        const point = new ECPointFp(curve, null, new ECFieldElementFp(curve.q, BigInteger.ZERO), BigInteger.ZERO)
        expect(point.isInfinity()).toBe(false)
    })
})