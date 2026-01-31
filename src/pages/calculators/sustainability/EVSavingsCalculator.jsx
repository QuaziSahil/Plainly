import { useState, useMemo } from 'react'
import { Car } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function EVSavingsCalculator() {
    const [milesPerYear, setMilesPerYear] = useState(12000)
    const [gasMpg, setGasMpg] = useState(28)
    const [gasPrice, setGasPrice] = useState(3.50)
    const [evEfficiency, setEvEfficiency] = useState(3.5) // miles per kWh
    const [electricityRate, setElectricityRate] = useState(0.12)

    const results = useMemo(() => {
        const gasGallonsPerYear = milesPerYear / gasMpg
        const gasCostPerYear = gasGallonsPerYear * gasPrice

        const evKwhPerYear = milesPerYear / evEfficiency
        const evCostPerYear = evKwhPerYear * electricityRate

        const yearlySavings = gasCostPerYear - evCostPerYear
        const fiveYearSavings = yearlySavings * 5

        const gasCO2PerYear = gasGallonsPerYear * 8.887 // kg CO2 per gallon
        const evCO2PerYear = evKwhPerYear * 0.42 // kg CO2 per kWh (US avg)
        const co2Savings = gasCO2PerYear - evCO2PerYear

        return {
            gasCostPerYear,
            evCostPerYear,
            yearlySavings,
            fiveYearSavings,
            gasCO2PerYear,
            evCO2PerYear,
            co2Savings
        }
    }, [milesPerYear, gasMpg, gasPrice, evEfficiency, electricityRate])

    const formatCurrency = (val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

    return (
        <CalculatorLayout
            title="EV Savings Calculator"
            description="Compare electric vs gas vehicle costs"
            category="Sustainability"
            categoryPath="/sustainability"
            icon={Car}
            result={formatCurrency(results.yearlySavings)}
            resultLabel="Yearly Savings"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Miles/Year</label>
                    <input type="number" value={milesPerYear} onChange={(e) => setMilesPerYear(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Gas Price ($/gal)</label>
                    <input type="number" value={gasPrice} onChange={(e) => setGasPrice(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Gas Car MPG</label>
                    <input type="number" value={gasMpg} onChange={(e) => setGasMpg(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Electricity ($/kWh)</label>
                    <input type="number" value={electricityRate} onChange={(e) => setElectricityRate(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">EV Efficiency (mi/kWh)</label>
                <select value={evEfficiency} onChange={(e) => setEvEfficiency(Number(e.target.value))}>
                    <option value={3}>3.0 mi/kWh (Large SUV)</option>
                    <option value={3.5}>3.5 mi/kWh (Sedan)</option>
                    <option value={4}>4.0 mi/kWh (Efficient)</option>
                    <option value={4.5}>4.5 mi/kWh (Very Efficient)</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Gas Cost/Year</span>
                    <span className="result-detail-value">{formatCurrency(results.gasCostPerYear)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">EV Cost/Year</span>
                    <span className="result-detail-value">{formatCurrency(results.evCostPerYear)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Yearly Savings</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>{formatCurrency(results.yearlySavings)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">5-Year Savings</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>{formatCurrency(results.fiveYearSavings)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">CO2 Saved/Year</span>
                    <span className="result-detail-value">{(results.co2Savings / 1000).toFixed(1)} tons</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default EVSavingsCalculator
