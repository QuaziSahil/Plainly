import { useState, useMemo } from 'react'
import { Receipt } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function GSTCalculator() {
    const [amount, setAmount] = useState(1000)
    const [gstRate, setGstRate] = useState(18)
    const [mode, setMode] = useState('exclusive')

    const results = useMemo(() => {
        const rate = gstRate / 100

        if (mode === 'exclusive') {
            const gstAmount = amount * rate
            const totalAmount = amount + gstAmount
            return { originalAmount: amount, gstAmount, totalAmount }
        } else {
            const originalAmount = amount / (1 + rate)
            const gstAmount = amount - originalAmount
            return { originalAmount, gstAmount, totalAmount: amount }
        }
    }, [amount, gstRate, mode])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(val)

    return (
        <CalculatorLayout
            title="GST Calculator"
            description="Calculate Goods and Services Tax"
            category="Finance"
            categoryPath="/finance"
            icon={Receipt}
            result={formatCurrency(results.gstAmount)}
            resultLabel="GST Amount"
        >
            <div className="input-group">
                <label className="input-label">Calculation Type</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="exclusive">Add GST to Amount</option>
                    <option value="inclusive">Extract GST from Total</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">{mode === 'exclusive' ? 'Amount (Before GST)' : 'Amount (Including GST)'}</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} step={0.01} />
            </div>
            <div className="input-group">
                <label className="input-label">GST Rate (%)</label>
                <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))}>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Original Amount</span>
                    <span className="result-detail-value">{formatCurrency(results.originalAmount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">GST ({gstRate}%)</span>
                    <span className="result-detail-value">{formatCurrency(results.gstAmount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Amount</span>
                    <span className="result-detail-value">{formatCurrency(results.totalAmount)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default GSTCalculator
