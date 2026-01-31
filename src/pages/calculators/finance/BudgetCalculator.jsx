import { useState, useMemo } from 'react'
import { Wallet } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BudgetCalculator() {
    const [income, setIncome] = useState(5000)
    const [housing, setHousing] = useState(1500)
    const [utilities, setUtilities] = useState(200)
    const [food, setFood] = useState(500)
    const [transportation, setTransportation] = useState(400)
    const [insurance, setInsurance] = useState(300)
    const [savings, setSavings] = useState(500)
    const [entertainment, setEntertainment] = useState(200)
    const [other, setOther] = useState(300)

    const results = useMemo(() => {
        const totalExpenses = housing + utilities + food + transportation + insurance + savings + entertainment + other
        const remaining = income - totalExpenses
        const savingsRate = (savings / income) * 100
        const housingPercent = (housing / income) * 100

        return { totalExpenses, remaining, savingsRate, housingPercent }
    }, [income, housing, utilities, food, transportation, insurance, savings, entertainment, other])

    return (
        <CalculatorLayout
            title="Budget Calculator"
            description="Plan your monthly budget"
            category="Finance"
            categoryPath="/finance"
            icon={Wallet}
            result={`$${results.remaining.toFixed(0)}`}
            resultLabel={results.remaining >= 0 ? 'Remaining' : 'Over Budget'}
        >
            <div className="input-group">
                <label className="input-label">Monthly Income ($)</label>
                <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} min={0} />
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, margin: '16px 0 8px' }}>EXPENSES</div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Housing ($)</label>
                    <input type="number" value={housing} onChange={(e) => setHousing(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Utilities ($)</label>
                    <input type="number" value={utilities} onChange={(e) => setUtilities(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Food ($)</label>
                    <input type="number" value={food} onChange={(e) => setFood(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Transport ($)</label>
                    <input type="number" value={transportation} onChange={(e) => setTransportation(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Insurance ($)</label>
                    <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Savings ($)</label>
                    <input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Entertainment ($)</label>
                    <input type="number" value={entertainment} onChange={(e) => setEntertainment(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Other ($)</label>
                    <input type="number" value={other} onChange={(e) => setOther(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Expenses</span>
                    <span className="result-detail-value">${results.totalExpenses.toFixed(0)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Remaining</span>
                    <span className="result-detail-value" style={{ color: results.remaining >= 0 ? '#10b981' : '#ef4444' }}>
                        ${results.remaining.toFixed(0)}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Savings Rate</span>
                    <span className="result-detail-value">{results.savingsRate.toFixed(1)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Housing %</span>
                    <span className="result-detail-value" style={{ color: results.housingPercent > 30 ? '#f59e0b' : 'inherit' }}>
                        {results.housingPercent.toFixed(1)}%
                    </span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default BudgetCalculator
