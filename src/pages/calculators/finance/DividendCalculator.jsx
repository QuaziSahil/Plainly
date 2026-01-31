import { useState, useMemo } from 'react'
import { DollarSign } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DividendCalculator() {
    const [investmentAmount, setInvestmentAmount] = useState(10000)
    const [dividendYield, setDividendYield] = useState(4)
    const [dividendGrowth, setDividendGrowth] = useState(5)
    const [years, setYears] = useState(10)
    const [reinvest, setReinvest] = useState(true)

    const results = useMemo(() => {
        const yearlyData = []
        let principal = investmentAmount
        let totalDividends = 0
        let currentYield = dividendYield

        for (let y = 1; y <= years; y++) {
            const dividend = principal * (currentYield / 100)
            totalDividends += dividend
            if (reinvest) {
                principal += dividend
            }
            currentYield *= (1 + dividendGrowth / 100)
            yearlyData.push({ year: y, dividend, total: principal })
        }

        const finalValue = reinvest ? principal : investmentAmount
        const monthlyIncome = (investmentAmount * (dividendYield / 100)) / 12

        return { finalValue, totalDividends, monthlyIncome, yearlyData }
    }, [investmentAmount, dividendYield, dividendGrowth, years, reinvest])

    return (
        <CalculatorLayout
            title="Dividend Calculator"
            description="Calculate dividend income and growth"
            category="Finance"
            categoryPath="/finance"
            icon={DollarSign}
            result={`$${results.totalDividends.toFixed(0)}`}
            resultLabel="Total Dividends"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Investment ($)</label>
                    <input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Dividend Yield (%)</label>
                    <input type="number" value={dividendYield} onChange={(e) => setDividendYield(Number(e.target.value))} min={0} step={0.1} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Growth Rate (%)</label>
                    <input type="number" value={dividendGrowth} onChange={(e) => setDividendGrowth(Number(e.target.value))} min={0} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Years</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={50} />
                </div>
            </div>
            <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={reinvest} onChange={(e) => setReinvest(e.target.checked)} />
                    Reinvest Dividends (DRIP)
                </label>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Income (Year 1)</span>
                    <span className="result-detail-value">${results.monthlyIncome.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Dividends</span>
                    <span className="result-detail-value">${results.totalDividends.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Final Value</span>
                    <span className="result-detail-value">${results.finalValue.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default DividendCalculator
