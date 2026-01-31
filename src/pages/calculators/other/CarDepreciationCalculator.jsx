import { useState, useMemo } from 'react'
import { Car } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CarDepreciationCalculator() {
    const [purchasePrice, setPurchasePrice] = useState(35000)
    const [years, setYears] = useState(5)
    const [annualMiles, setAnnualMiles] = useState(12000)
    const [vehicleType, setVehicleType] = useState('sedan')

    const depreciationRates = {
        sedan: [0.20, 0.15, 0.12, 0.10, 0.08],
        suv: [0.22, 0.16, 0.13, 0.10, 0.08],
        truck: [0.15, 0.12, 0.10, 0.09, 0.07],
        luxury: [0.25, 0.18, 0.15, 0.12, 0.10],
        electric: [0.23, 0.17, 0.14, 0.11, 0.09]
    }

    const results = useMemo(() => {
        const rates = depreciationRates[vehicleType]
        let currentValue = purchasePrice
        const yearlyValues = [{ year: 0, value: purchasePrice }]

        for (let i = 0; i < years && i < 5; i++) {
            currentValue = currentValue * (1 - rates[i])
            yearlyValues.push({ year: i + 1, value: currentValue })
        }

        // For years beyond 5, use 5% depreciation
        for (let i = 5; i < years; i++) {
            currentValue = currentValue * 0.95
            yearlyValues.push({ year: i + 1, value: currentValue })
        }

        const totalDepreciation = purchasePrice - currentValue
        const depreciationPercent = (totalDepreciation / purchasePrice) * 100
        const costPerMile = totalDepreciation / (annualMiles * years)

        return { currentValue, totalDepreciation, depreciationPercent, costPerMile, yearlyValues }
    }, [purchasePrice, years, vehicleType, annualMiles])

    return (
        <CalculatorLayout
            title="Car Depreciation Calculator"
            description="Estimate vehicle value over time"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Car}
            result={`$${Math.round(results.currentValue).toLocaleString()}`}
            resultLabel={`Value after ${years} years`}
        >
            <div className="input-group">
                <label className="input-label">Purchase Price ($)</label>
                <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} min={1000} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Years</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={15} />
                </div>
                <div className="input-group">
                    <label className="input-label">Annual Miles</label>
                    <input type="number" value={annualMiles} onChange={(e) => setAnnualMiles(Number(e.target.value))} min={1000} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Vehicle Type</label>
                <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV/Crossover</option>
                    <option value="truck">Truck</option>
                    <option value="luxury">Luxury</option>
                    <option value="electric">Electric</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Current Value</span>
                    <span className="result-detail-value">${Math.round(results.currentValue).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Depreciation</span>
                    <span className="result-detail-value" style={{ color: '#ef4444' }}>-${Math.round(results.totalDepreciation).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Value Retained</span>
                    <span className="result-detail-value">{(100 - results.depreciationPercent).toFixed(1)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Cost per Mile</span>
                    <span className="result-detail-value">${results.costPerMile.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CarDepreciationCalculator
