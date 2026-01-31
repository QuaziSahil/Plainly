import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function HeartRateZoneCalculator() {
    const [age, setAge] = useState(30)
    const [restingHR, setRestingHR] = useState(60)
    const [method, setMethod] = useState('karvonen')

    const results = useMemo(() => {
        const maxHR = 220 - age

        const zones = [
            { name: 'Zone 1 (Recovery)', min: 50, max: 60 },
            { name: 'Zone 2 (Fat Burn)', min: 60, max: 70 },
            { name: 'Zone 3 (Aerobic)', min: 70, max: 80 },
            { name: 'Zone 4 (Threshold)', min: 80, max: 90 },
            { name: 'Zone 5 (Max)', min: 90, max: 100 },
        ]

        const calculateZone = (minPct, maxPct) => {
            if (method === 'karvonen') {
                const hrReserve = maxHR - restingHR
                return {
                    min: Math.round(restingHR + (hrReserve * minPct / 100)),
                    max: Math.round(restingHR + (hrReserve * maxPct / 100))
                }
            } else {
                return {
                    min: Math.round(maxHR * minPct / 100),
                    max: Math.round(maxHR * maxPct / 100)
                }
            }
        }

        return {
            maxHR,
            zones: zones.map(z => ({
                ...z,
                ...calculateZone(z.min, z.max)
            }))
        }
    }, [age, restingHR, method])

    return (
        <CalculatorLayout
            title="Heart Rate Zone Calculator"
            description="Calculate your training heart rate zones"
            category="Health"
            categoryPath="/health"
            icon={Heart}
            result={`${results.maxHR} bpm`}
            resultLabel="Max Heart Rate"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={15} max={100} />
                </div>
                <div className="input-group">
                    <label className="input-label">Resting HR (bpm)</label>
                    <input type="number" value={restingHR} onChange={(e) => setRestingHR(Number(e.target.value))} min={40} max={120} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="karvonen">Karvonen (HR Reserve)</option>
                    <option value="standard">Standard (% Max HR)</option>
                </select>
            </div>
            <div className="result-details">
                {results.zones.map((z, i) => (
                    <div className="result-detail-row" key={i}>
                        <span className="result-detail-label">{z.name}</span>
                        <span className="result-detail-value">{z.min}-{z.max} bpm</span>
                    </div>
                ))}
            </div>
        </CalculatorLayout>
    )
}

export default HeartRateZoneCalculator
