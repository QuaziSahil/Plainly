import { useState, useCallback } from 'react'
import { Shuffle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RandomNumberGenerator() {
    const [min, setMin] = useState(1)
    const [max, setMax] = useState(100)
    const [quantity, setQuantity] = useState(1)
    const [allowDuplicates, setAllowDuplicates] = useState(true)
    const [result, setResult] = useState([42])

    const generate = useCallback(() => {
        const numbers = []
        const range = max - min + 1

        if (!allowDuplicates && quantity > range) {
            // Can't generate more unique numbers than available range
            const allNumbers = []
            for (let i = min; i <= max; i++) {
                allNumbers.push(i)
            }
            // Shuffle
            for (let i = allNumbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]]
            }
            setResult(allNumbers)
            return
        }

        if (allowDuplicates) {
            for (let i = 0; i < quantity; i++) {
                numbers.push(Math.floor(Math.random() * range) + min)
            }
        } else {
            const used = new Set()
            while (numbers.length < quantity) {
                const num = Math.floor(Math.random() * range) + min
                if (!used.has(num)) {
                    used.add(num)
                    numbers.push(num)
                }
            }
        }

        setResult(numbers)
    }, [min, max, quantity, allowDuplicates])

    const displayResult = result.length === 1 ? result[0].toString() : result.join(', ')

    return (
        <CalculatorLayout
            title="Random Number Generator"
            description="Generate random numbers within a specified range"
            category="Math"
            categoryPath="/math"
            icon={Shuffle}
            result={result.length === 1 ? result[0].toString() : `${result.length} numbers`}
            resultLabel="Random Number"
            onReset={generate}
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Minimum</label>
                    <input
                        type="number"
                        value={min}
                        onChange={(e) => setMin(Number(e.target.value))}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Maximum</label>
                    <input
                        type="number"
                        value={max}
                        onChange={(e) => setMax(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        min={1}
                        max={100}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Allow Duplicates</label>
                    <select
                        value={allowDuplicates ? 'yes' : 'no'}
                        onChange={(e) => setAllowDuplicates(e.target.value === 'yes')}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={generate}
                style={{
                    width: '100%',
                    padding: 'var(--space-4)',
                    marginTop: 'var(--space-4)',
                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '44px'
                }}
            >
                Generate
            </button>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Generated Numbers</span>
                    <span className="result-detail-value" style={{ wordBreak: 'break-all' }}>
                        {displayResult}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Range</span>
                    <span className="result-detail-value">{min} - {max}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Count</span>
                    <span className="result-detail-value">{result.length}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RandomNumberGenerator
