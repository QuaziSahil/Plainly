import { useState, useMemo } from 'react'
import { Dog } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DogAgeCalculator() {
    const [dogYears, setDogYears] = useState(5)
    const [size, setSize] = useState('medium')

    const results = useMemo(() => {
        // More accurate dog age calculation based on size
        const sizeFactors = {
            small: { first: 15, second: 9, yearly: 4 },      // <20 lbs
            medium: { first: 15, second: 9, yearly: 5 },     // 21-50 lbs
            large: { first: 15, second: 9, yearly: 6 },      // 51-100 lbs
            giant: { first: 12, second: 9, yearly: 7 }       // >100 lbs
        }

        const factors = sizeFactors[size]
        let humanAge

        if (dogYears <= 1) {
            humanAge = dogYears * factors.first
        } else if (dogYears <= 2) {
            humanAge = factors.first + (dogYears - 1) * factors.second
        } else {
            humanAge = factors.first + factors.second + (dogYears - 2) * factors.yearly
        }

        // Life stage
        let stage, emoji
        if (humanAge < 16) { stage = 'Puppy'; emoji = '🐶' }
        else if (humanAge < 30) { stage = 'Young Adult'; emoji = '🐕' }
        else if (humanAge < 50) { stage = 'Adult'; emoji = '🦮' }
        else if (humanAge < 70) { stage = 'Senior'; emoji = '🐕‍🦺' }
        else { stage = 'Geriatric'; emoji = '👴🐕' }

        // Expected lifespan in dog years
        const lifespans = {
            small: 15,
            medium: 13,
            large: 11,
            giant: 9
        }

        const expectedLifespan = lifespans[size]
        const lifespanPercent = (dogYears / expectedLifespan) * 100

        return { humanAge, stage, emoji, expectedLifespan, lifespanPercent }
    }, [dogYears, size])

    return (
        <CalculatorLayout
            title="Dog Age Calculator"
            description="Convert dog years to human years"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Dog}
            result={`${Math.round(results.humanAge)} human years`}
            resultLabel="Dog's Age"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Dog's Age (years)</label>
                    <input type="number" value={dogYears} onChange={(e) => setDogYears(Number(e.target.value))} min={0} max={25} step={0.5} />
                </div>
                <div className="input-group">
                    <label className="input-label">Dog Size</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                        <option value="small">Small (&lt;20 lbs)</option>
                        <option value="medium">Medium (21-50 lbs)</option>
                        <option value="large">Large (51-100 lbs)</option>
                        <option value="giant">Giant (&gt;100 lbs)</option>
                    </select>
                </div>
            </div>
            <div style={{
                background: '#1a1a2e',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{results.emoji}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#a78bfa' }}>
                    {Math.round(results.humanAge)} Human Years
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                    Life Stage: <strong>{results.stage}</strong>
                </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6 }}>Life Progress</span>
                    <span style={{ fontSize: '12px' }}>{Math.min(100, results.lifespanPercent).toFixed(0)}%</span>
                </div>
                <div style={{
                    background: '#333',
                    borderRadius: '6px',
                    height: '12px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        background: results.lifespanPercent > 100 ? '#ef4444' :
                            results.lifespanPercent > 75 ? '#f59e0b' : '#22c55e',
                        width: `${Math.min(100, results.lifespanPercent)}%`,
                        height: '100%',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Dog Age</span>
                    <span className="result-detail-value">{dogYears} years</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Human Equivalent</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>{Math.round(results.humanAge)} years</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Expected Lifespan ({size})</span>
                    <span className="result-detail-value">{results.expectedLifespan} years</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default DogAgeCalculator
