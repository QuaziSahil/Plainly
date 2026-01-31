import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LoveCalculator() {
    const [name1, setName1] = useState('')
    const [name2, setName2] = useState('')

    const results = useMemo(() => {
        if (!name1 || !name2) return { percentage: 0, message: 'Enter both names' }

        // Fun algorithm based on character codes
        const combined = (name1 + name2).toLowerCase().replace(/[^a-z]/g, '')
        let sum = 0
        for (let i = 0; i < combined.length; i++) {
            sum += combined.charCodeAt(i)
        }

        // Generate a "random" but consistent percentage
        const percentage = (sum * 7 + name1.length * name2.length * 13) % 101

        let message, emoji
        if (percentage >= 90) { message = 'Perfect Match! 💕'; emoji = '💕' }
        else if (percentage >= 75) { message = 'Great Compatibility!'; emoji = '💗' }
        else if (percentage >= 60) { message = 'Good Potential!'; emoji = '💖' }
        else if (percentage >= 45) { message = 'Worth Exploring!'; emoji = '💝' }
        else if (percentage >= 30) { message = 'Needs Work!'; emoji = '💔' }
        else { message = 'Opposite Attracts?'; emoji = '🤔' }

        return { percentage, message, emoji }
    }, [name1, name2])

    return (
        <CalculatorLayout
            title="Love Calculator"
            description="Calculate love compatibility (just for fun!)"
            category="Other"
            categoryPath="/other"
            icon={Heart}
            result={`${results.percentage}%`}
            resultLabel="Love Score"
        >
            <div className="input-group">
                <label className="input-label">Your Name</label>
                <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Enter your name"
                />
            </div>
            <div className="input-group">
                <label className="input-label">Partner's Name</label>
                <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Enter their name"
                />
            </div>
            {name1 && name2 && (
                <div className="result-details">
                    <div style={{
                        textAlign: 'center',
                        fontSize: '48px',
                        margin: '16px 0'
                    }}>
                        {results.emoji}
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Compatibility</span>
                        <span className="result-detail-value">{results.percentage}%</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Result</span>
                        <span className="result-detail-value">{results.message}</span>
                    </div>
                    <p style={{ fontSize: '11px', opacity: 0.5, textAlign: 'center', marginTop: '16px' }}>
                        * This is just for entertainment purposes!
                    </p>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default LoveCalculator
