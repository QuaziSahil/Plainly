import { useState, useMemo } from 'react'
import { Receipt } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TipCalculator() {
    const [billAmount, setBillAmount] = useState(50)
    const [tipPercent, setTipPercent] = useState(18)
    const [numberOfPeople, setNumberOfPeople] = useState(2)

    const results = useMemo(() => {
        const tipAmount = billAmount * (tipPercent / 100)
        const totalAmount = billAmount + tipAmount
        const tipPerPerson = tipAmount / numberOfPeople
        const totalPerPerson = totalAmount / numberOfPeople

        return { tipAmount, totalAmount, tipPerPerson, totalPerPerson }
    }, [billAmount, tipPercent, numberOfPeople])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const quickTips = [10, 15, 18, 20, 25]

    return (
        <CalculatorLayout
            title="Tip Calculator"
            subtitle="Calculate tips and split bills easily"
            category="Finance"
            categoryPath="/finance"
            icon={Receipt}
            result={formatCurrency(results.totalPerPerson)}
            resultLabel="Per Person"
        >
            <div className="input-group">
                <label className="input-label">Bill Amount</label>
                <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(Number(e.target.value))}
                    min={0}
                    step={0.01}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Tip Percentage</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    {quickTips.map(tip => (
                        <button
                            key={tip}
                            onClick={() => setTipPercent(tip)}
                            style={{
                                padding: 'var(--space-2) var(--space-3)',
                                background: tipPercent === tip ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                border: '1px solid var(--border-primary)',
                                borderRadius: 'var(--radius-md)',
                                color: tipPercent === tip ? 'white' : 'var(--text-secondary)',
                                fontSize: 'var(--font-size-caption)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)'
                            }}
                        >
                            {tip}%
                        </button>
                    ))}
                </div>
                <input
                    type="range"
                    min={0}
                    max={50}
                    value={tipPercent}
                    onChange={(e) => setTipPercent(Number(e.target.value))}
                />
                <span className="input-hint">{tipPercent}% tip</span>
            </div>

            <div className="input-group">
                <label className="input-label">Number of People</label>
                <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Math.max(1, Number(e.target.value)))}
                    min={1}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Tip Amount</span>
                    <span className="result-detail-value">{formatCurrency(results.tipAmount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Bill</span>
                    <span className="result-detail-value">{formatCurrency(results.totalAmount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Tip per Person</span>
                    <span className="result-detail-value">{formatCurrency(results.tipPerPerson)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TipCalculator
