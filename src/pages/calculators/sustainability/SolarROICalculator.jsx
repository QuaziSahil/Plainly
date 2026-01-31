import { useState, useMemo } from 'react'
import { Sun } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SolarROICalculator() {
    const [systemCost, setSystemCost] = useState(20000)
    const [federalTaxCredit, setFederalTaxCredit] = useState(30)
    const [annualProduction, setAnnualProduction] = useState(10000) // kWh
    const [electricityRate, setElectricityRate] = useState(0.15)
    const [annualRateIncrease, setAnnualRateIncrease] = useState(3)

    const results = useMemo(() => {
        const taxCreditAmount = systemCost * (federalTaxCredit / 100)
        const netCost = systemCost - taxCreditAmount

        let totalSavings = 0
        let paybackYear = 0
        const yearlyData = []

        for (let year = 1; year <= 25; year++) {
            const rate = electricityRate * Math.pow(1 + annualRateIncrease / 100, year - 1)
            const yearSavings = annualProduction * rate
            totalSavings += yearSavings

            if (totalSavings >= netCost && paybackYear === 0) {
                paybackYear = year
            }

            yearlyData.push({
                year,
                savings: yearSavings,
                cumulative: totalSavings,
                rate
            })
        }

        const roi = ((totalSavings - netCost) / netCost) * 100
        const avgAnnualReturn = roi / 25

        return {
            taxCreditAmount,
            netCost,
            totalSavings,
            paybackYear,
            roi,
            avgAnnualReturn,
            yearlyData
        }
    }, [systemCost, federalTaxCredit, annualProduction, electricityRate, annualRateIncrease])

    return (
        <CalculatorLayout
            title="Solar ROI Calculator"
            description="Calculate solar panel investment return"
            category="Sustainability"
            categoryPath="/calculators?category=Sustainability"
            icon={Sun}
            result={`${results.paybackYear} years`}
            resultLabel="Payback Period"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">System Cost ($)</label>
                    <input type="number" value={systemCost} onChange={(e) => setSystemCost(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Tax Credit (%)</label>
                    <input type="number" value={federalTaxCredit} onChange={(e) => setFederalTaxCredit(Number(e.target.value))} min={0} max={100} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Annual Production (kWh)</label>
                    <input type="number" value={annualProduction} onChange={(e) => setAnnualProduction(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Electricity Rate ($/kWh)</label>
                    <input type="number" value={electricityRate} onChange={(e) => setElectricityRate(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Annual Rate Increase (%)</label>
                <input type="number" value={annualRateIncrease} onChange={(e) => setAnnualRateIncrease(Number(e.target.value))} min={0} step={0.5} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Tax Credit</span>
                    <span className="result-detail-value" style={{ color: '#22c55e' }}>-${results.taxCreditAmount.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Net Cost After Incentives</span>
                    <span className="result-detail-value">${results.netCost.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Payback Period</span>
                    <span className="result-detail-value" style={{ color: '#f59e0b' }}>{results.paybackYear || 'N/A'} years</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">25-Year Savings</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>${Math.round(results.totalSavings).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total ROI</span>
                    <span className="result-detail-value">{results.roi.toFixed(0)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Avg Annual Return</span>
                    <span className="result-detail-value">{results.avgAnnualReturn.toFixed(1)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SolarROICalculator
