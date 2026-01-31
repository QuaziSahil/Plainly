import { useState, useMemo } from 'react'
import { Landmark } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BondYieldCalculator() {
    const [faceValue, setFaceValue] = useState(1000)
    const [couponRate, setCouponRate] = useState(5)
    const [currentPrice, setCurrentPrice] = useState(950)
    const [yearsToMaturity, setYearsToMaturity] = useState(10)

    const results = useMemo(() => {
        const annualCoupon = faceValue * (couponRate / 100)
        const currentYield = (annualCoupon / currentPrice) * 100

        // Approximate YTM using formula
        const ytm = ((annualCoupon + (faceValue - currentPrice) / yearsToMaturity) /
            ((faceValue + currentPrice) / 2)) * 100

        const totalInterest = annualCoupon * yearsToMaturity
        const totalReturn = totalInterest + (faceValue - currentPrice)
        const totalReturnPercent = (totalReturn / currentPrice) * 100

        return { annualCoupon, currentYield, ytm, totalInterest, totalReturn, totalReturnPercent }
    }, [faceValue, couponRate, currentPrice, yearsToMaturity])

    return (
        <CalculatorLayout
            title="Bond Yield Calculator"
            description="Calculate bond yields and returns"
            category="Finance"
            categoryPath="/finance"
            icon={Landmark}
            result={`${results.ytm.toFixed(2)}%`}
            resultLabel="Yield to Maturity"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Face Value ($)</label>
                    <input type="number" value={faceValue} onChange={(e) => setFaceValue(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Coupon Rate (%)</label>
                    <input type="number" value={couponRate} onChange={(e) => setCouponRate(Number(e.target.value))} min={0} step={0.1} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Price ($)</label>
                    <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Years to Maturity</label>
                    <input type="number" value={yearsToMaturity} onChange={(e) => setYearsToMaturity(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Annual Coupon</span>
                    <span className="result-detail-value">${results.annualCoupon.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Current Yield</span>
                    <span className="result-detail-value">{results.currentYield.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">YTM (Approx)</span>
                    <span className="result-detail-value">{results.ytm.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Return</span>
                    <span className="result-detail-value">${results.totalReturn.toFixed(2)} ({results.totalReturnPercent.toFixed(1)}%)</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default BondYieldCalculator
