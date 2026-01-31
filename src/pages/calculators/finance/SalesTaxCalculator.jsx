import { useState, useMemo } from 'react'
import { ShoppingCart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SalesTaxCalculator() {
    const [amount, setAmount] = useState(100)
    const [taxRate, setTaxRate] = useState(8.25)
    const [mode, setMode] = useState('add') // 'add' or 'reverse'

    const results = useMemo(() => {
        const rate = taxRate / 100

        if (mode === 'add') {
            // Calculate tax and total from pre-tax amount
            const taxAmount = amount * rate
            const total = amount + taxAmount
            return {
                preTax: amount,
                taxAmount,
                total,
                effectiveRate: taxRate
            }
        } else {
            // Reverse calculate: extract tax from total  
            const preTax = amount / (1 + rate)
            const taxAmount = amount - preTax
            return {
                preTax,
                taxAmount,
                total: amount,
                effectiveRate: taxRate
            }
        }
    }, [amount, taxRate, mode])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Sales Tax Calculator"
            description="Calculate sales tax or reverse calculate from total"
            category="Finance"
            categoryPath="/finance"
            icon={ShoppingCart}
            result={formatCurrency(results.total)}
            resultLabel="Total"
        >
            <div className="input-group">
                <label className="input-label">Calculation Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="add">Add Tax to Price</option>
                    <option value="reverse">Extract Tax from Total</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    {mode === 'add' ? 'Price (Before Tax)' : 'Total (Including Tax)'}
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={0}
                    step={0.01}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Tax Rate (%)</label>
                <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.01}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Pre-Tax Amount</span>
                    <span className="result-detail-value">{formatCurrency(results.preTax)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Tax Amount</span>
                    <span className="result-detail-value">{formatCurrency(results.taxAmount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total</span>
                    <span className="result-detail-value">{formatCurrency(results.total)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Tax Rate</span>
                    <span className="result-detail-value">{results.effectiveRate.toFixed(2)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SalesTaxCalculator
