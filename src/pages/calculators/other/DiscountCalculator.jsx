import { useState, useMemo } from 'react'
import { BadgePercent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DiscountCalculator() {
    const [originalPrice, setOriginalPrice] = useState(100)
    const [discountPercent, setDiscountPercent] = useState(20)
    const [additionalDiscount, setAdditionalDiscount] = useState(0)

    const results = useMemo(() => {
        const firstDiscount = originalPrice * (discountPercent / 100)
        const priceAfterFirst = originalPrice - firstDiscount

        const secondDiscount = priceAfterFirst * (additionalDiscount / 100)
        const finalPrice = priceAfterFirst - secondDiscount

        const totalSavings = originalPrice - finalPrice
        const totalDiscountPercent = (totalSavings / originalPrice) * 100

        return {
            firstDiscount,
            priceAfterFirst,
            secondDiscount,
            finalPrice,
            totalSavings,
            totalDiscountPercent
        }
    }, [originalPrice, discountPercent, additionalDiscount])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Discount Calculator"
            subtitle="Calculate sale prices and savings"
            category="Other"
            categoryPath="/converter"
            icon={BadgePercent}
            result={formatCurrency(results.finalPrice)}
            resultLabel="Final Price"
        >
            <div className="input-group">
                <label className="input-label">Original Price</label>
                <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    min={0}
                    step={0.01}
                />
            </div>

            <div className="input-group">
                <div className="slider-group">
                    <div className="slider-header">
                        <label className="input-label">Discount (%)</label>
                        <span className="slider-value">{discountPercent}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="slider-group">
                    <div className="slider-header">
                        <label className="input-label">Additional Discount (%)</label>
                        <span className="slider-value">{additionalDiscount}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={additionalDiscount}
                        onChange={(e) => setAdditionalDiscount(Number(e.target.value))}
                    />
                </div>
                <span className="input-hint">Stack multiple discounts (e.g., sale + coupon)</span>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">First Discount Savings</span>
                    <span className="result-detail-value">{formatCurrency(results.firstDiscount)}</span>
                </div>
                {additionalDiscount > 0 && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Price After First Discount</span>
                            <span className="result-detail-value">{formatCurrency(results.priceAfterFirst)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Additional Savings</span>
                            <span className="result-detail-value">{formatCurrency(results.secondDiscount)}</span>
                        </div>
                    </>
                )}
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Savings</span>
                    <span className="result-detail-value" style={{ color: 'var(--success)' }}>
                        {formatCurrency(results.totalSavings)} ({results.totalDiscountPercent.toFixed(1)}% off)
                    </span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default DiscountCalculator
