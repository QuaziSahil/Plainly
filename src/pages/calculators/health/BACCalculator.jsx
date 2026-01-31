import { useState, useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BACCalculator() {
    const [drinks, setDrinks] = useState(3)
    const [drinkType, setDrinkType] = useState('beer')
    const [weight, setWeight] = useState(160)
    const [gender, setGender] = useState('male')
    const [hours, setHours] = useState(2)

    const drinkTypes = {
        beer: { name: 'Beer (12 oz)', oz: 12, abv: 0.05 },
        wine: { name: 'Wine (5 oz)', oz: 5, abv: 0.12 },
        shot: { name: 'Shot (1.5 oz)', oz: 1.5, abv: 0.40 },
        cocktail: { name: 'Cocktail', oz: 4, abv: 0.15 }
    }

    const results = useMemo(() => {
        const drink = drinkTypes[drinkType]
        const totalAlcoholOz = drinks * drink.oz * drink.abv

        // Widmark formula
        const genderConstant = gender === 'male' ? 0.68 : 0.55
        const weightKg = weight * 0.453592
        const gramsAlcohol = totalAlcoholOz * 23.36 // oz to grams

        let bac = (gramsAlcohol / (weightKg * genderConstant * 1000)) * 100

        // Subtract metabolism (0.015% per hour)
        bac = Math.max(0, bac - (hours * 0.015))

        let status, statusColor
        if (bac === 0) { status = 'Sober'; statusColor = '#10b981' }
        else if (bac < 0.02) { status = 'Minimal Effects'; statusColor = '#10b981' }
        else if (bac < 0.05) { status = 'Mild Impairment'; statusColor = '#f59e0b' }
        else if (bac < 0.08) { status = 'Increased Impairment'; statusColor = '#f97316' }
        else if (bac < 0.15) { status = 'Legally Drunk'; statusColor = '#ef4444' }
        else { status = 'Severe Impairment'; statusColor = '#dc2626' }

        const hoursToSober = bac > 0 ? bac / 0.015 : 0

        return { bac, status, statusColor, hoursToSober }
    }, [drinks, drinkType, weight, gender, hours])

    return (
        <CalculatorLayout
            title="BAC Calculator"
            description="Estimate blood alcohol content"
            category="Health"
            categoryPath="/health"
            icon={AlertTriangle}
            result={`${results.bac.toFixed(3)}%`}
            resultLabel="Estimated BAC"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Number of Drinks</label>
                    <input type="number" value={drinks} onChange={(e) => setDrinks(Number(e.target.value))} min={0} max={20} />
                </div>
                <div className="input-group">
                    <label className="input-label">Drink Type</label>
                    <select value={drinkType} onChange={(e) => setDrinkType(e.target.value)}>
                        {Object.entries(drinkTypes).map(([key, val]) => (
                            <option key={key} value={key}>{val.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Weight (lbs)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={80} max={400} />
                </div>
                <div className="input-group">
                    <label className="input-label">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Hours Since First Drink</label>
                <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} min={0} max={24} step={0.5} />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Status</span>
                    <span className="result-detail-value" style={{ color: results.statusColor }}>{results.status}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Hours to Sober</span>
                    <span className="result-detail-value">{results.hoursToSober.toFixed(1)} hrs</span>
                </div>
                {results.bac >= 0.08 && (
                    <div style={{ background: '#ef444420', padding: '12px', borderRadius: '8px', marginTop: '8px' }}>
                        <span style={{ color: '#ef4444', fontSize: '13px' }}>⚠️ Do NOT drive. You are legally impaired.</span>
                    </div>
                )}
            </div>
            <p style={{ fontSize: '10px', opacity: 0.4, textAlign: 'center', marginTop: '12px' }}>
                * Estimates only. Many factors affect BAC. Never drink and drive.
            </p>
        </CalculatorLayout>
    )
}

export default BACCalculator
