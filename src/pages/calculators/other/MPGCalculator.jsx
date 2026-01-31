import { useState, useMemo } from 'react'
import { Gauge } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function MPGCalculator() {
    const [mode, setMode] = useState('mpg')
    const [distance, setDistance] = useState(300)
    const [fuel, setFuel] = useState(12)
    const [fuelPrice, setFuelPrice] = useState(3.50)

    const results = useMemo(() => {
        const mpg = distance / fuel
        const costPerMile = fuelPrice / mpg
        const gallonsFor100Miles = 100 / mpg
        const lPer100km = (fuel / distance) * 160.934 // Convert to L/100km

        return { mpg, costPerMile, gallonsFor100Miles, lPer100km }
    }, [distance, fuel, fuelPrice])

    return (
        <CalculatorLayout
            title="MPG Calculator"
            description="Calculate fuel efficiency"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Gauge}
            result={`${results.mpg.toFixed(1)} MPG`}
            resultLabel="Fuel Economy"
        >
            <div className="input-group">
                <label className="input-label">Distance Traveled (miles)</label>
                <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} min={1} />
            </div>
            <div className="input-group">
                <label className="input-label">Fuel Used (gallons)</label>
                <input type="number" value={fuel} onChange={(e) => setFuel(Number(e.target.value))} min={0.1} step={0.1} />
            </div>
            <div className="input-group">
                <label className="input-label">Fuel Price ($/gallon)</label>
                <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))} min={0} step={0.01} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Miles per Gallon</span>
                    <span className="result-detail-value" style={{ color: results.mpg >= 30 ? '#10b981' : results.mpg >= 20 ? '#f59e0b' : '#ef4444' }}>
                        {results.mpg.toFixed(1)}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">L/100km</span>
                    <span className="result-detail-value">{results.lPer100km.toFixed(1)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Cost per Mile</span>
                    <span className="result-detail-value">${results.costPerMile.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Gallons per 100 mi</span>
                    <span className="result-detail-value">{results.gallonsFor100Miles.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default MPGCalculator
