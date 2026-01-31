import { useState, useMemo } from 'react'
import { Receipt } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TipCalculator() {
    const [billAmount, setBillAmount] = useState(85)
    const [tipPercent, setTipPercent] = useState(18)
    const [people, setPeople] = useState(4)

    const results = useMemo(() => {
        const tipAmount = billAmount * (tipPercent / 100)
        const totalAmount = billAmount + tipAmount
        const tipPerPerson = tipAmount / people
        const totalPerPerson = totalAmount / people

        return { tipAmount, totalAmount, tipPerPerson, totalPerPerson }
    }, [billAmount, tipPercent, people])

    const formatCurrency = (val) => `$${val.toFixed(2)}`

    const tipButtons = [15, 18, 20, 25]

    return (
        <CalculatorLayout
            title="Tip Calculator"
            description="Split bills and calculate tips"
            category="Other"
            categoryPath="/other"
            icon={Receipt}
            result={formatCurrency(results.totalPerPerson)}
            resultLabel="Per Person"
        >
            <div className="input-group">
                <label className="input-label">Bill Amount</label>
                <input type="number" value={billAmount} onChange={(e) => setBillAmount(Number(e.target.value))} min={0} step={0.01} />
            </div>
            <div className="input-group">
                <label className="input-label">Tip Percentage</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    {tipButtons.map(t => (
                        <button
                            key={t}
                            onClick={() => setTipPercent(t)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: tipPercent === t ? '#333' : '#1a1a1a',
                                border: tipPercent === t ? '2px solid #666' : '2px solid transparent',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            {t}%
                        </button>
                    ))}
                </div>
                <input type="number" value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} min={0} max={100} />
            </div>
            <div className="input-group">
                <label className="input-label">Split Between</label>
                <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} min={1} max={50} />
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
                    <span className="result-detail-label">Tip Per Person</span>
                    <span className="result-detail-value">{formatCurrency(results.tipPerPerson)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Per Person</span>
                    <span className="result-detail-value">{formatCurrency(results.totalPerPerson)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TipCalculator
