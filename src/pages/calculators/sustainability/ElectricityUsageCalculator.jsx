import { useState, useMemo } from 'react'
import { Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ElectricityUsageCalculator() {
    const [deviceWatts, setDeviceWatts] = useState(100)
    const [hoursPerDay, setHoursPerDay] = useState(8)
    const [daysPerMonth, setDaysPerMonth] = useState(30)
    const [costPerKwh, setCostPerKwh] = useState(0.12)

    const results = useMemo(() => {
        const dailyKwh = (deviceWatts * hoursPerDay) / 1000
        const monthlyKwh = dailyKwh * daysPerMonth
        const yearlyKwh = dailyKwh * 365
        const monthlyCost = monthlyKwh * costPerKwh
        const yearlyCost = yearlyKwh * costPerKwh

        // CO2 calculation (US average: 0.92 lbs CO2 per kWh)
        const yearlyC02 = yearlyKwh * 0.92

        return { dailyKwh, monthlyKwh, yearlyKwh, monthlyCost, yearlyCost, yearlyC02 }
    }, [deviceWatts, hoursPerDay, daysPerMonth, costPerKwh])

    return (
        <CalculatorLayout
            title="Electricity Usage Calculator"
            description="Calculate device electricity cost"
            category="Sustainability"
            categoryPath="/calculators?category=Sustainability"
            icon={Zap}
            result={`$${results.monthlyCost.toFixed(2)}`}
            resultLabel="Monthly Cost"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Device Wattage (W)</label>
                    <input type="number" value={deviceWatts} onChange={(e) => setDeviceWatts(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Hours per Day</label>
                    <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} min={0} max={24} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Days per Month</label>
                    <input type="number" value={daysPerMonth} onChange={(e) => setDaysPerMonth(Number(e.target.value))} min={1} max={31} />
                </div>
                <div className="input-group">
                    <label className="input-label">Cost per kWh ($)</label>
                    <input type="number" value={costPerKwh} onChange={(e) => setCostPerKwh(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Daily Usage</span>
                    <span className="result-detail-value">{results.dailyKwh.toFixed(2)} kWh</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Usage</span>
                    <span className="result-detail-value">{results.monthlyKwh.toFixed(1)} kWh</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Cost</span>
                    <span className="result-detail-value">${results.monthlyCost.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Yearly Cost</span>
                    <span className="result-detail-value">${results.yearlyCost.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Yearly CO₂</span>
                    <span className="result-detail-value">{results.yearlyC02.toFixed(1)} lbs</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ElectricityUsageCalculator
