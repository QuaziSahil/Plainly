import { useState, useMemo } from 'react'
import { Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ElectricityBillCalculator() {
    const [appliances, setAppliances] = useState([
        { name: 'Air Conditioner', watts: 1500, hours: 8 },
        { name: 'Refrigerator', watts: 150, hours: 24 },
        { name: 'TV', watts: 100, hours: 5 },
        { name: 'Lights', watts: 60, hours: 6 }
    ])
    const [rate, setRate] = useState(0.12)
    const [days, setDays] = useState(30)

    const results = useMemo(() => {
        const totalKwh = appliances.reduce((sum, app) => {
            return sum + (app.watts * app.hours * days) / 1000
        }, 0)

        const totalCost = totalKwh * rate
        const costPerDay = totalCost / days

        return { totalKwh, totalCost, costPerDay }
    }, [appliances, rate, days])

    const updateAppliance = (index, field, value) => {
        const updated = [...appliances]
        updated[index][field] = field === 'name' ? value : Number(value)
        setAppliances(updated)
    }

    const formatCurrency = (val) => `$${val.toFixed(2)}`

    return (
        <CalculatorLayout
            title="Electricity Bill Calculator"
            description="Estimate your electricity costs"
            category="Other"
            categoryPath="/other"
            icon={Zap}
            result={formatCurrency(results.totalCost)}
            resultLabel="Monthly Cost"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Rate ($/kWh)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} min={0} step={0.01} />
                </div>
                <div className="input-group">
                    <label className="input-label">Days</label>
                    <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} min={1} max={365} />
                </div>
            </div>
            <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>Appliances (Watts × Hours/day)</div>
            {appliances.map((app, i) => (
                <div className="input-row" key={i} style={{ marginBottom: '8px' }}>
                    <div className="input-group" style={{ flex: 2 }}>
                        <input type="text" value={app.name} onChange={(e) => updateAppliance(i, 'name', e.target.value)} placeholder="Name" />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <input type="number" value={app.watts} onChange={(e) => updateAppliance(i, 'watts', e.target.value)} min={0} placeholder="W" />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <input type="number" value={app.hours} onChange={(e) => updateAppliance(i, 'hours', e.target.value)} min={0} max={24} placeholder="hrs" />
                    </div>
                </div>
            ))}
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Usage</span>
                    <span className="result-detail-value">{results.totalKwh.toFixed(1)} kWh</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.totalCost)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Daily Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.costPerDay)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ElectricityBillCalculator
