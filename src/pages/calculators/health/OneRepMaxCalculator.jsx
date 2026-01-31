import { useState, useMemo } from 'react'
import { Dumbbell } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function OneRepMaxCalculator() {
    const [weight, setWeight] = useState(100)
    const [reps, setReps] = useState(5)
    const [unit, setUnit] = useState('kg')

    const results = useMemo(() => {
        // Epley Formula: 1RM = weight × (1 + reps/30)
        const epley = weight * (1 + reps / 30)
        // Brzycki Formula: 1RM = weight × (36 / (37 - reps))
        const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : weight
        // Average of formulas
        const oneRepMax = (epley + brzycki) / 2

        const percentages = [
            { pct: 100, label: '1RM (Max)', weight: oneRepMax },
            { pct: 95, label: '95% (2 reps)', weight: oneRepMax * 0.95 },
            { pct: 90, label: '90% (3-4 reps)', weight: oneRepMax * 0.90 },
            { pct: 85, label: '85% (5-6 reps)', weight: oneRepMax * 0.85 },
            { pct: 80, label: '80% (7-8 reps)', weight: oneRepMax * 0.80 },
            { pct: 75, label: '75% (10 reps)', weight: oneRepMax * 0.75 },
        ]

        return { oneRepMax, percentages }
    }, [weight, reps])

    const formatWeight = (w) => `${Math.round(w)} ${unit}`

    return (
        <CalculatorLayout
            title="One Rep Max Calculator"
            description="Calculate your one-rep max for weightlifting"
            category="Health"
            categoryPath="/health"
            icon={Dumbbell}
            result={formatWeight(results.oneRepMax)}
            resultLabel="Estimated 1RM"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Weight Lifted</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={1} max={1000} />
                </div>
                <div className="input-group">
                    <label className="input-label">Reps Completed</label>
                    <input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} min={1} max={20} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lb">Pounds (lb)</option>
                </select>
            </div>
            <div className="result-details">
                {results.percentages.slice(0, 5).map((p, i) => (
                    <div className="result-detail-row" key={i}>
                        <span className="result-detail-label">{p.label}</span>
                        <span className="result-detail-value">{formatWeight(p.weight)}</span>
                    </div>
                ))}
            </div>
        </CalculatorLayout>
    )
}

export default OneRepMaxCalculator
