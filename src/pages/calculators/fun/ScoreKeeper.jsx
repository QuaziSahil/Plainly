import { useState } from 'react'
import { Award } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ScoreKeeper() {
    const [players, setPlayers] = useState([
        { name: 'Player 1', score: 0 },
        { name: 'Player 2', score: 0 }
    ])
    const [increment, setIncrement] = useState(1)

    const addPlayer = () => {
        setPlayers([...players, { name: `Player ${players.length + 1}`, score: 0 }])
    }

    const updateScore = (index, delta) => {
        const newPlayers = [...players]
        newPlayers[index].score += delta
        setPlayers(newPlayers)
    }

    const updateName = (index, name) => {
        const newPlayers = [...players]
        newPlayers[index].name = name
        setPlayers(newPlayers)
    }

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index))
    }

    const resetAll = () => {
        setPlayers(players.map(p => ({ ...p, score: 0 })))
    }

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

    return (
        <CalculatorLayout
            title="Score Keeper"
            description="Track scores for games"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Award}
            result={sortedPlayers[0]?.name || '—'}
            resultLabel="Leader"
        >
            <div className="input-row" style={{ marginBottom: '16px' }}>
                <div className="input-group">
                    <label className="input-label">Score Increment</label>
                    <input type="number" value={increment} onChange={(e) => setIncrement(Number(e.target.value))} min={1} />
                </div>
            </div>
            {players.map((player, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updateName(index, e.target.value)}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    <button
                        onClick={() => updateScore(index, -increment)}
                        style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                    >
                        −
                    </button>
                    <span style={{ minWidth: '50px', textAlign: 'center', fontSize: '18px', fontWeight: 600 }}>
                        {player.score}
                    </span>
                    <button
                        onClick={() => updateScore(index, increment)}
                        style={{ padding: '8px 16px', background: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                    >
                        +
                    </button>
                    <button
                        onClick={() => removePlayer(index)}
                        style={{ padding: '8px 12px', background: '#333', border: '1px solid #444', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                </div>
            ))}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={addPlayer}
                    style={{ flex: 1, padding: '10px', background: '#333', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                >
                    + Add Player
                </button>
                <button
                    onClick={resetAll}
                    style={{ flex: 1, padding: '10px', background: '#333', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                >
                    Reset Scores
                </button>
            </div>
        </CalculatorLayout>
    )
}

export default ScoreKeeper
