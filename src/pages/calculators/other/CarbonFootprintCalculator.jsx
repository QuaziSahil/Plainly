import { useState, useMemo } from 'react'
import { Leaf } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CarbonFootprintCalculator() {
    const [electricity, setElectricity] = useState(900)
    const [gas, setGas] = useState(50)
    const [carMiles, setCarMiles] = useState(12000)
    const [flights, setFlights] = useState(2)
    const [diet, setDiet] = useState('omnivore')

    const results = useMemo(() => {
        // CO2 emissions factors (kg CO2 per unit)
        const electricityCO2 = electricity * 12 * 0.42 // kWh per year
        const gasCO2 = gas * 12 * 2.0 // therms per year
        const carCO2 = carMiles * 0.404 // miles per year
        const flightsCO2 = flights * 1100 // round trips

        const dietCO2 = {
            vegan: 1500,
            vegetarian: 1700,
            pescatarian: 1900,
            omnivore: 2500,
            meatHeavy: 3300
        }

        const totalCO2 = electricityCO2 + gasCO2 + carCO2 + flightsCO2 + dietCO2[diet]
        const treesNeeded = Math.ceil(totalCO2 / 21) // avg tree absorbs 21kg CO2/year
        const usAverage = 16000 // kg CO2 per capita

        return {
            electricity: electricityCO2,
            gas: gasCO2,
            car: carCO2,
            flights: flightsCO2,
            diet: dietCO2[diet],
            total: totalCO2,
            treesNeeded,
            vsAverage: ((totalCO2 / usAverage) * 100).toFixed(0)
        }
    }, [electricity, gas, carMiles, flights, diet])

    const formatTons = (kg) => `${(kg / 1000).toFixed(1)} tons`

    return (
        <CalculatorLayout
            title="Carbon Footprint Calculator"
            description="Calculate your annual CO2 emissions"
            category="Other"
            categoryPath="/other"
            icon={Leaf}
            result={formatTons(results.total)}
            resultLabel="Annual CO2"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Electricity (kWh/mo)</label>
                    <input type="number" value={electricity} onChange={(e) => setElectricity(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Natural Gas (therms/mo)</label>
                    <input type="number" value={gas} onChange={(e) => setGas(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Car Miles/year</label>
                    <input type="number" value={carMiles} onChange={(e) => setCarMiles(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Flights/year</label>
                    <input type="number" value={flights} onChange={(e) => setFlights(Number(e.target.value))} min={0} max={50} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Diet</label>
                <select value={diet} onChange={(e) => setDiet(e.target.value)}>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="omnivore">Omnivore (Average)</option>
                    <option value="meatHeavy">Meat Heavy</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Footprint</span>
                    <span className="result-detail-value">{formatTons(results.total)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">vs US Average</span>
                    <span className="result-detail-value">{results.vsAverage}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Trees to Offset</span>
                    <span className="result-detail-value">{results.treesNeeded} trees</span>
                </div>
                <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px' }}>
                    Home: {formatTons(results.electricity + results.gas)} |
                    Transport: {formatTons(results.car + results.flights)} |
                    Food: {formatTons(results.diet)}
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CarbonFootprintCalculator
