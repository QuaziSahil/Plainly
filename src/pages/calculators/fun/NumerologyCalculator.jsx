import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function NumerologyCalculator() {
    const [name, setName] = useState('')
    const [birthDate, setBirthDate] = useState('1990-05-15')

    const getNameNumber = (text) => {
        const letterValues = {
            a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
            j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
            s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
        }

        let sum = text.toLowerCase().split('').reduce((acc, char) => {
            return acc + (letterValues[char] || 0)
        }, 0)

        // Reduce to single digit (except master numbers 11, 22, 33)
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0)
        }
        return sum
    }

    const getLifePathNumber = (date) => {
        if (!date) return 0
        const nums = date.replace(/-/g, '').split('').map(Number)
        let sum = nums.reduce((a, b) => a + b, 0)
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0)
        }
        return sum
    }

    const meanings = {
        1: 'Leadership, independence, ambition',
        2: 'Partnership, harmony, sensitivity',
        3: 'Creativity, communication, joy',
        4: 'Stability, hard work, foundation',
        5: 'Freedom, adventure, change',
        6: 'Responsibility, nurturing, love',
        7: 'Wisdom, spirituality, introspection',
        8: 'Success, abundance, power',
        9: 'Compassion, humanitarianism, completion',
        11: 'Master Number - Intuition, inspiration',
        22: 'Master Number - Master builder, big dreams',
        33: 'Master Number - Master teacher, healing'
    }

    const nameNumber = name ? getNameNumber(name) : 0
    const lifePathNumber = getLifePathNumber(birthDate)

    return (
        <CalculatorLayout
            title="Numerology Calculator"
            description="Calculate life path and name numbers"
            category="Fun"
            categoryPath="/fun"
            icon={Sparkles}
            result={lifePathNumber || '—'}
            resultLabel="Life Path Number"
        >
            <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                />
            </div>
            <div className="input-group">
                <label className="input-label">Birth Date</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Life Path Number</span>
                    <span className="result-detail-value" style={{ fontSize: '24px' }}>{lifePathNumber}</span>
                </div>
                {lifePathNumber > 0 && (
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '12px' }}>
                        {meanings[lifePathNumber]}
                    </div>
                )}
                {name && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Name Number</span>
                            <span className="result-detail-value" style={{ fontSize: '24px' }}>{nameNumber}</span>
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                            {meanings[nameNumber]}
                        </div>
                    </>
                )}
            </div>
            <p style={{ fontSize: '11px', opacity: 0.4, textAlign: 'center', marginTop: '16px' }}>
                * For entertainment purposes only
            </p>
        </CalculatorLayout>
    )
}

export default NumerologyCalculator
