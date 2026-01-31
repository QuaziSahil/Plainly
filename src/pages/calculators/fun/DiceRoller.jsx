import { useState } from 'react'
import { Dice5 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DiceRoller() {
    const [numDice, setNumDice] = useState(2)
    const [diceType, setDiceType] = useState(6)
    const [results, setResults] = useState([])
    const [history, setHistory] = useState([])

    const rollDice = () => {
        const rolls = []
        for (let i = 0; i < numDice; i++) {
            rolls.push(Math.floor(Math.random() * diceType) + 1)
        }
        setResults(rolls)
        setHistory(prev => [{
            rolls,
            sum: rolls.reduce((a, b) => a + b, 0),
            time: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)])
    }

    const total = results.reduce((a, b) => a + b, 0)

    return (
        <CalculatorLayout
            title="Dice Roller"
            description="Roll virtual dice for games"
            category="Fun"
            categoryPath="/fun"
            icon={Dice5}
            result={results.length > 0 ? total : '—'}
            resultLabel="Total"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Number of Dice</label>
                    <input type="number" value={numDice} onChange={(e) => setNumDice(Number(e.target.value))} min={1} max={10} />
                </div>
                <div className="input-group">
                    <label className="input-label">Dice Type</label>
                    <select value={diceType} onChange={(e) => setDiceType(Number(e.target.value))}>
                        <option value={4}>D4 (4 sides)</option>
                        <option value={6}>D6 (6 sides)</option>
                        <option value={8}>D8 (8 sides)</option>
                        <option value={10}>D10 (10 sides)</option>
                        <option value={12}>D12 (12 sides)</option>
                        <option value={20}>D20 (20 sides)</option>
                        <option value={100}>D100 (100 sides)</option>
                    </select>
                </div>
            </div>
            <button onClick={rollDice} style={{
                width: '100%',
                padding: '16px',
                background: '#333',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '16px'
            }}>
                🎲 Roll {numDice}d{diceType}
            </button>
            {results.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    {results.map((r, i) => (
                        <div key={i} style={{
                            width: '48px',
                            height: '48px',
                            background: '#333',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>
                            {r}
                        </div>
                    ))}
                </div>
            )}
            {history.length > 0 && (
                <div className="result-details">
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>History:</div>
                    {history.slice(0, 5).map((h, i) => (
                        <div className="result-detail-row" key={i}>
                            <span style={{ fontSize: '12px' }}>{h.rolls.join(', ')}</span>
                            <span className="result-detail-value">= {h.sum}</span>
                        </div>
                    ))}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default DiceRoller
