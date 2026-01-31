import { useState, useMemo } from 'react'
import { Building2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RentalYieldCalculator() {
    const [purchasePrice, setPurchasePrice] = useState(300000)
    const [monthlyRent, setMonthlyRent] = useState(2000)
    const [annualExpenses, setAnnualExpenses] = useState(5000)
    const [vacancyRate, setVacancyRate] = useState(5)

    const results = useMemo(() => {
        const annualRent = monthlyRent * 12
        const effectiveRent = annualRent * (1 - vacancyRate / 100)
        const netOperatingIncome = effectiveRent - annualExpenses

        const grossYield = (annualRent / purchasePrice) * 100
        const netYield = (netOperatingIncome / purchasePrice) * 100
        const capRate = netYield

        const cashOnCash = netOperatingIncome / purchasePrice * 100
        const monthsToBreakeven = purchasePrice / (netOperatingIncome / 12)

        return {
            annualRent,
            effectiveRent,
            netOperatingIncome,
            grossYield,
            netYield,
            capRate,
            cashOnCash,
            monthsToBreakeven
        }
    }, [purchasePrice, monthlyRent, annualExpenses, vacancyRate])

    const formatCurrency = (val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

    return (
        <CalculatorLayout
            title="Rental Yield Calculator"
            description="Calculate rental property returns"
            category="Real Estate"
            categoryPath="/real-estate"
            icon={Building2}
            result={`${results.netYield.toFixed(2)}%`}
            resultLabel="Net Rental Yield"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Purchase Price ($)</label>
                    <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} min={0} step={1000} />
                </div>
                <div className="input-group">
                    <label className="input-label">Monthly Rent ($)</label>
                    <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} min={0} step={100} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Annual Expenses ($)</label>
                    <input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} min={0} step={100} />
                </div>
                <div className="input-group">
                    <label className="input-label">Vacancy Rate (%)</label>
                    <input type="number" value={vacancyRate} onChange={(e) => setVacancyRate(Number(e.target.value))} min={0} max={50} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Annual Rent</span>
                    <span className="result-detail-value">{formatCurrency(results.annualRent)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Net Operating Income</span>
                    <span className="result-detail-value">{formatCurrency(results.netOperatingIncome)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Gross Yield</span>
                    <span className="result-detail-value">{results.grossYield.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Net Yield (Cap Rate)</span>
                    <span className="result-detail-value" style={{ color: results.netYield > 5 ? '#10b981' : '#f59e0b' }}>
                        {results.netYield.toFixed(2)}%
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Payback Period</span>
                    <span className="result-detail-value">{(results.monthsToBreakeven / 12).toFixed(1)} years</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RentalYieldCalculator
