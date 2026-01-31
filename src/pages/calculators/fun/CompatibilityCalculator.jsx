import { useState, useMemo } from 'react'
import { Stars } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CompatibilityCalculator() {
    const [name1, setName1] = useState('')
    const [name2, setName2] = useState('')

    const results = useMemo(() => {
        if (!name1.trim() || !name2.trim()) return null

        // Fun deterministic calculation based on names
        const combined = (name1 + name2).toLowerCase().replace(/[^a-z]/g, '')

        let hash = 0
        for (let i = 0; i < combined.length; i++) {
            hash = ((hash << 5) - hash) + combined.charCodeAt(i)
            hash |= 0
        }

        // Generate percentage between 50-100 (always optimistic!)
        const percentage = 50 + Math.abs(hash % 51)

        // Categories
        const categories = {
            romance: 50 + Math.abs((hash * 13) % 51),
            friendship: 50 + Math.abs((hash * 17) % 51),
            trust: 50 + Math.abs((hash * 23) % 51),
            passion: 50 + Math.abs((hash * 31) % 51),
            communication: 50 + Math.abs((hash * 37) % 51)
        }

        // Fun compatibility message
        const messages = [
            { min: 90, text: "A match made in heaven! 💕", color: '#ec4899' },
            { min: 80, text: "Strong connection! Great chemistry! 💖", color: '#f472b6' },
            { min: 70, text: "Good compatibility! Worth exploring! 💗", color: '#a78bfa' },
            { min: 60, text: "Potential is there! Give it time! 💜", color: '#8b5cf6' },
            { min: 0, text: "Opposites attract! 💙", color: '#3b82f6' }
        ]

        const message = messages.find(m => percentage >= m.min)

        return { percentage, categories, message }
    }, [name1, name2])

    return (
        <CalculatorLayout
            title="Compatibility Calculator"
            description="Calculate love compatibility (just for fun!)"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Stars}
            result={results ? `${results.percentage}%` : '—'}
            resultLabel="Love Match"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Your Name 💕</label>
                    <input
                        type="text"
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        placeholder="Enter your name..."
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Their Name 💕</label>
                    <input
                        type="text"
                        value={name2}
                        onChange={(e) => setName2(e.target.value)}
                        placeholder="Enter their name..."
                    />
                </div>
            </div>
            {results ? (
                <>
                    <div style={{
                        background: 'linear-gradient(135deg, #ec489920, #a78bfa20)',
                        padding: '24px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        marginBottom: '16px'
                    }}>
                        <div style={{ fontSize: '48px', fontWeight: 800, color: results.message.color }}>
                            {results.percentage}%
                        </div>
                        <div style={{ fontSize: '16px', marginTop: '8px' }}>
                            {results.message.text}
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>
                            {name1} ❤️ {name2}
                        </div>
                    </div>
                    {Object.entries(results.categories).map(([category, value]) => (
                        <div key={category} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{category}</span>
                                <span style={{ fontSize: '12px', color: '#a78bfa' }}>{value}%</span>
                            </div>
                            <div style={{
                                background: '#333',
                                borderRadius: '4px',
                                height: '8px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(90deg, #ec4899, #a78bfa)',
                                    width: `${value}%`,
                                    height: '100%'
                                }} />
                            </div>
                        </div>
                    ))}
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: '#1a1a2e',
                        borderRadius: '8px',
                        fontSize: '11px',
                        opacity: 0.7,
                        textAlign: 'center'
                    }}>
                        ✨ This is just for fun! Real compatibility takes time to discover. ✨
                    </div>
                </>
            ) : (
                <div style={{
                    background: '#1a1a2e',
                    padding: '40px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💝</div>
                    <div style={{ opacity: 0.6 }}>Enter two names to check compatibility!</div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default CompatibilityCalculator
