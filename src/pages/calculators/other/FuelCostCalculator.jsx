import { useState, useMemo } from 'react'
import { Fuel } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FuelCostCalculator() {
    const [distance, setDistance] = useState(300)
    const [fuelEfficiency, setFuelEfficiency] = useState(30)
    const [fuelPrice, setFuelPrice] = useState(3.50)
    const [unit, setUnit] = useState('mpg')

    const results = useMemo(() => {
        let gallonsNeeded, litersNeeded

        if (unit === 'mpg') {
            gallonsNeeded = distance / fuelEfficiency
            litersNeeded = gallonsNeeded * 3.78541
        } else {
            // km/l
            litersNeeded = distance / fuelEfficiency
            gallonsNeeded = litersNeeded / 3.78541
        }

        const totalCost = gallonsNeeded * fuelPrice
        const costPerMile = distance > 0 ? totalCost / distance : 0

        return {
            gallonsNeeded,
            litersNeeded,
            totalCost,
            costPerMile,
            costPer100km: (litersNeeded / distance * 100) * fuelPrice
        }
    }, [distance, fuelEfficiency, fuelPrice, unit])

    const formatCurrency = (val) => `$${val.toFixed(2)}`

    return (
        <CalculatorLayout
            title="Fuel Cost Calculator"
            description="Calculate fuel costs for your trip"
            category="Other"
            categoryPath="/other"
            icon={Fuel}
            result={formatCurrency(results.totalCost)}
            resultLabel="Total Fuel Cost"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Trip Distance</label>
                    <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="mpg">Miles / MPG</option>
                        <option value="kml">Kilometers / km/L</option>
                    </select>
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Fuel Efficiency ({unit === 'mpg' ? 'MPG' : 'km/L'})</label>
                    <input type="number" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(Number(e.target.value))} min={1} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Fuel Price ($/gal)</label>
                    <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Fuel Needed</span>
                    <span className="result-detail-value">{results.gallonsNeeded.toFixed(2)} gal / {results.litersNeeded.toFixed(2)} L</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.totalCost)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Cost Per Mile</span>
                    <span className="result-detail-value">{formatCurrency(results.costPerMile)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FuelCostCalculator
