import { useState, useMemo } from 'react'
import { Dog } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PetAgeCalculator() {
    const [petAge, setPetAge] = useState(5)
    const [petType, setPetType] = useState('dog')
    const [size, setSize] = useState('medium')

    const results = useMemo(() => {
        let humanAge

        if (petType === 'dog') {
            // More accurate dog age calculation based on size
            const sizeFactors = {
                small: { first: 15, second: 9, thereafter: 4 },
                medium: { first: 15, second: 9, thereafter: 5 },
                large: { first: 15, second: 9, thereafter: 6 },
                giant: { first: 12, second: 9, thereafter: 7 }
            }
            const factors = sizeFactors[size]

            if (petAge <= 1) {
                humanAge = petAge * factors.first
            } else if (petAge <= 2) {
                humanAge = factors.first + (petAge - 1) * factors.second
            } else {
                humanAge = factors.first + factors.second + (petAge - 2) * factors.thereafter
            }
        } else {
            // Cat age calculation
            if (petAge <= 1) {
                humanAge = petAge * 15
            } else if (petAge <= 2) {
                humanAge = 15 + (petAge - 1) * 9
            } else {
                humanAge = 24 + (petAge - 2) * 4
            }
        }

        const lifeStage = humanAge < 15 ? 'Puppy/Kitten' :
            humanAge < 25 ? 'Young Adult' :
                humanAge < 50 ? 'Adult' :
                    humanAge < 70 ? 'Senior' : 'Geriatric'

        return { humanAge: Math.round(humanAge), lifeStage }
    }, [petAge, petType, size])

    return (
        <CalculatorLayout
            title="Pet Age Calculator"
            description="Convert pet years to human years"
            category="Other"
            categoryPath="/other"
            icon={Dog}
            result={`${results.humanAge} years`}
            resultLabel="Human Age Equivalent"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Pet Type</label>
                    <select value={petType} onChange={(e) => setPetType(e.target.value)}>
                        <option value="dog">Dog 🐕</option>
                        <option value="cat">Cat 🐈</option>
                    </select>
                </div>
                {petType === 'dog' && (
                    <div className="input-group">
                        <label className="input-label">Dog Size</label>
                        <select value={size} onChange={(e) => setSize(e.target.value)}>
                            <option value="small">Small (&lt;20 lbs)</option>
                            <option value="medium">Medium (20-50 lbs)</option>
                            <option value="large">Large (50-90 lbs)</option>
                            <option value="giant">Giant (&gt;90 lbs)</option>
                        </select>
                    </div>
                )}
            </div>
            <div className="input-group">
                <label className="input-label">Pet's Age (years)</label>
                <input type="number" value={petAge} onChange={(e) => setPetAge(Number(e.target.value))} min={0} max={30} step={0.5} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Human Age Equivalent</span>
                    <span className="result-detail-value">{results.humanAge} years</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Life Stage</span>
                    <span className="result-detail-value">{results.lifeStage}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PetAgeCalculator
