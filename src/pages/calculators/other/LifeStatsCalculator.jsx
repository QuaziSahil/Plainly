import { useState, useMemo } from 'react'
import { Hourglass } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LifeStatsCalculator() {
    const [birthDate, setBirthDate] = useState('1990-01-01')
    const [lifeExpectancy, setLifeExpectancy] = useState(80)

    const results = useMemo(() => {
        const birth = new Date(birthDate)
        const now = new Date()
        const expected = new Date(birth)
        expected.setFullYear(expected.getFullYear() + lifeExpectancy)

        const ageMs = now - birth
        const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24))
        const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25)

        const lifeSpanMs = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000
        const percentLived = (ageMs / lifeSpanMs) * 100

        const daysRemaining = Math.max(0, Math.floor((expected - now) / (1000 * 60 * 60 * 24)))
        const weeksRemaining = Math.floor(daysRemaining / 7)
        const monthsRemaining = Math.floor(daysRemaining / 30.44)
        const yearsRemaining = Math.floor(daysRemaining / 365.25)

        // Fun facts
        const heartbeats = Math.floor(ageDays * 24 * 60 * 100) // ~100 BPM avg
        const breaths = Math.floor(ageDays * 24 * 60 * 16) // ~16 breaths/min
        const sleepHours = Math.floor(ageDays * 8) // ~8 hrs sleep
        const blinks = Math.floor(ageDays * 16 * 60 * 17) // ~17 blinks/min awake

        return {
            ageYears,
            ageDays,
            percentLived,
            daysRemaining,
            weeksRemaining,
            monthsRemaining,
            yearsRemaining,
            heartbeats,
            breaths,
            sleepHours,
            blinks
        }
    }, [birthDate, lifeExpectancy])

    return (
        <CalculatorLayout
            title="Life Stats Calculator"
            description="Fascinating statistics about your life"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Hourglass}
            result={`${results.ageYears.toFixed(1)} years`}
            resultLabel="Your Age"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Birth Date</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Life Expectancy</label>
                    <input
                        type="number"
                        value={lifeExpectancy}
                        onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                        min={1}
                        max={120}
                    />
                </div>
            </div>
            <div style={{
                background: '#1a1a2e',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>LIFE PROGRESS</div>
                <div style={{
                    background: '#333',
                    borderRadius: '6px',
                    height: '24px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        background: 'linear-gradient(90deg, #22c55e, #a78bfa)',
                        width: `${Math.min(100, results.percentLived)}%`,
                        height: '100%',
                        transition: 'width 0.3s ease'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '12px',
                        fontWeight: 600
                    }}>
                        {results.percentLived.toFixed(1)}%
                    </div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#a78bfa' }}>{results.ageDays.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Days Lived</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{results.daysRemaining.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Days Remaining</div>
                </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>✨ LIFE STATS</div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">❤️ Heartbeats</span>
                    <span className="result-detail-value">{(results.heartbeats / 1e9).toFixed(2)}B</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">💨 Breaths Taken</span>
                    <span className="result-detail-value">{(results.breaths / 1e6).toFixed(0)}M</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">😴 Hours Slept</span>
                    <span className="result-detail-value">{results.sleepHours.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">👁️ Blinks</span>
                    <span className="result-detail-value">{(results.blinks / 1e6).toFixed(0)}M</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">🗓️ Weeks Remaining</span>
                    <span className="result-detail-value">{results.weeksRemaining.toLocaleString()}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default LifeStatsCalculator
