import { useState, useMemo } from 'react'
import { Sun } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SolarPanelCalculator() {
    const [monthlyBill, setMonthlyBill] = useState(150)
    const [electricityRate, setElectricityRate] = useState(0.12)
    const [sunHours, setSunHours] = useState(5)
    const [panelWattage, setPanelWattage] = useState(400)

    const results = useMemo(() => {
        const monthlyKwh = monthlyBill / electricityRate
        const dailyKwh = monthlyKwh / 30
        const systemSizeKw = dailyKwh / sunHours
        const panelsNeeded = Math.ceil((systemSizeKw * 1000) / panelWattage)

        const systemCost = systemSizeKw * 2800 // avg $2.80/watt
        const yearlyProduction = systemSizeKw * sunHours * 365
        const yearlySavings = yearlyProduction * electricityRate
        const paybackYears = systemCost / yearlySavings
        const co2Saved = yearlyProduction * 0.42 // kg CO2 per kWh

        return {
            monthlyKwh,
            systemSizeKw,
            panelsNeeded,
            systemCost,
            yearlySavings,
            paybackYears,
            co2Saved,
            yearlyProduction
        }
    }, [monthlyBill, electricityRate, sunHours, panelWattage])

    const formatCurrency = (val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

    return (
        <CalculatorLayout
            title="Solar Panel Calculator"
            description="Calculate solar system size and savings"
            category="Sustainability"
            categoryPath="/sustainability"
            icon={Sun}
            result={`${results.systemSizeKw.toFixed(1)} kW`}
            resultLabel="System Size Needed"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Monthly Bill ($)</label>
                    <input type="number" value={monthlyBill} onChange={(e) => setMonthlyBill(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Rate ($/kWh)</label>
                    <input type="number" value={electricityRate} onChange={(e) => setElectricityRate(Number(e.target.value))} min={0.01} step={0.01} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Sun Hours/Day</label>
                    <input type="number" value={sunHours} onChange={(e) => setSunHours(Number(e.target.value))} min={1} max={12} step={0.5} />
                </div>
                <div className="input-group">
                    <label className="input-label">Panel Wattage</label>
                    <select value={panelWattage} onChange={(e) => setPanelWattage(Number(e.target.value))}>
                        <option value={300}>300W (Standard)</option>
                        <option value={400}>400W (Efficient)</option>
                        <option value={500}>500W (Premium)</option>
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Panels Needed</span>
                    <span className="result-detail-value">{results.panelsNeeded} panels</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Est. System Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.systemCost)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Yearly Savings</span>
                    <span className="result-detail-value">{formatCurrency(results.yearlySavings)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Payback Period</span>
                    <span className="result-detail-value">{results.paybackYears.toFixed(1)} years</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">CO2 Saved/Year</span>
                    <span className="result-detail-value">{(results.co2Saved / 1000).toFixed(1)} tons</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SolarPanelCalculator
