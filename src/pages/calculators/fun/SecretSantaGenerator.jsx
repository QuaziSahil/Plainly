import { useState, useMemo } from 'react'
import { Gift } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SecretSantaGenerator() {
    const [participants, setParticipants] = useState('Alice\nBob\nCharlie\nDiana\nEve')
    const [assignments, setAssignments] = useState([])
    const [revealedIndex, setRevealedIndex] = useState(-1)

    const namesList = useMemo(() => {
        return participants.split('\n').map(n => n.trim()).filter(n => n.length > 0)
    }, [participants])

    const generateAssignments = () => {
        if (namesList.length < 2) return

        const shuffled = [...namesList]
        let valid = false

        while (!valid) {
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }
            valid = namesList.every((name, i) => shuffled[i] !== name)
        }

        const newAssignments = namesList.map((giver, i) => ({
            giver,
            receiver: shuffled[i]
        }))

        setAssignments(newAssignments)
        setRevealedIndex(-1)
    }

    const reveal = (index) => {
        setRevealedIndex(revealedIndex === index ? -1 : index)
    }

    return (
        <CalculatorLayout
            title="Secret Santa Generator"
            description="Randomly assign gift givers"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Gift}
            result={assignments.length > 0 ? `${assignments.length} pairs` : '—'}
            resultLabel="Assignments"
        >
            <div className="input-group">
                <label className="input-label">Participants (one per line)</label>
                <textarea
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    rows={5}
                    placeholder="Enter names, one per line..."
                />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                    flex: 1,
                    background: '#1a1a2e',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#a78bfa' }}>{namesList.length}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Participants</div>
                </div>
                <div style={{
                    flex: 1,
                    background: namesList.length >= 2 ? '#22c55e20' : '#ef444420',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px' }}>{namesList.length >= 2 ? '✓' : '✗'}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>{namesList.length >= 2 ? 'Ready' : 'Need 2+'}</div>
                </div>
            </div>
            <button
                onClick={generateAssignments}
                disabled={namesList.length < 2}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: namesList.length < 2 ? '#444' : '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    color: namesList.length < 2 ? '#888' : '#fff',
                    fontWeight: 600,
                    cursor: namesList.length < 2 ? 'not-allowed' : 'pointer',
                    fontSize: '15px'
                }}
            >
                🎅 Generate Secret Santa Pairs
            </button>
            {assignments.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>
                        CLICK TO REVEAL (show only to that person!)
                    </div>
                    {assignments.map((pair, i) => (
                        <div
                            key={i}
                            onClick={() => reveal(i)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: revealedIndex === i ? '#22c55e20' : '#1a1a2e',
                                borderRadius: '8px',
                                marginBottom: '6px',
                                cursor: 'pointer',
                                border: revealedIndex === i ? '1px solid #22c55e40' : 'none'
                            }}
                        >
                            <span style={{ fontWeight: 600 }}>{pair.giver}</span>
                            <span style={{ color: '#a78bfa' }}>
                                {revealedIndex === i ? (
                                    <>→ buys for <strong style={{ color: '#22c55e' }}>{pair.receiver}</strong> 🎁</>
                                ) : (
                                    '🔒 Click to reveal'
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default SecretSantaGenerator
