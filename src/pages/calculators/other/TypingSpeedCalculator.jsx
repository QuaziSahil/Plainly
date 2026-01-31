import { useState, useMemo } from 'react'
import { Keyboard } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TypingSpeedCalculator() {
    const [mode, setMode] = useState('test')
    const [text, setText] = useState('')
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [targetText] = useState("The quick brown fox jumps over the lazy dog. This is a simple typing test to measure your words per minute and accuracy. Type as fast as you can while maintaining accuracy.")

    const results = useMemo(() => {
        if (!startTime || !text) return { wpm: 0, accuracy: 0, time: 0 }

        const currentTime = endTime || Date.now()
        const timeMinutes = (currentTime - startTime) / 60000
        const words = text.trim().split(/\s+/).filter(w => w).length
        const wpm = timeMinutes > 0 ? words / timeMinutes : 0

        // Calculate accuracy
        let correct = 0
        const typed = text.toLowerCase()
        const target = targetText.toLowerCase().slice(0, typed.length)
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === target[i]) correct++
        }
        const accuracy = typed.length > 0 ? (correct / typed.length) * 100 : 0

        return { wpm: Math.round(wpm), accuracy, time: Math.round(timeMinutes * 60) }
    }, [text, startTime, endTime, targetText])

    const handleTextChange = (e) => {
        const value = e.target.value
        if (!startTime && value) {
            setStartTime(Date.now())
        }
        setText(value)
        if (value.length >= targetText.length) {
            setEndTime(Date.now())
        }
    }

    const resetTest = () => {
        setText('')
        setStartTime(null)
        setEndTime(null)
    }

    return (
        <CalculatorLayout
            title="Typing Speed Test"
            description="Test your typing speed and accuracy"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Keyboard}
            result={`${results.wpm} WPM`}
            resultLabel="Typing Speed"
        >
            <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                {targetText.split('').map((char, i) => (
                    <span key={i} style={{
                        color: i < text.length
                            ? text[i] === char ? '#10b981' : '#ef4444'
                            : '#666'
                    }}>
                        {char}
                    </span>
                ))}
            </div>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Start typing the text above..."
                rows={4}
                disabled={endTime !== null}
                style={{ marginBottom: '16px' }}
            />
            <button
                onClick={resetTest}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: '#333',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    marginBottom: '16px'
                }}
            >
                Reset Test
            </button>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Words per Minute</span>
                    <span className="result-detail-value">{results.wpm}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Accuracy</span>
                    <span className="result-detail-value" style={{ color: results.accuracy >= 90 ? '#10b981' : results.accuracy >= 70 ? '#f59e0b' : '#ef4444' }}>
                        {results.accuracy.toFixed(1)}%
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Time</span>
                    <span className="result-detail-value">{results.time}s</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TypingSpeedCalculator
