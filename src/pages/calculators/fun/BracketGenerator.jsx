import { useState } from 'react'
import { Trophy } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BracketGenerator() {
    const [participants, setParticipants] = useState('Team A\nTeam B\nTeam C\nTeam D\nTeam E\nTeam F\nTeam G\nTeam H')
    const [bracket, setBracket] = useState([])
    const [shuffled, setShuffled] = useState(false)

    const generateBracket = () => {
        let teams = participants.split('\n').map(p => p.trim()).filter(p => p)

        if (shuffled) {
            teams = [...teams].sort(() => Math.random() - 0.5)
        }

        // Pad to nearest power of 2
        const size = Math.pow(2, Math.ceil(Math.log2(teams.length)))
        while (teams.length < size) {
            teams.push('BYE')
        }

        const rounds = []
        let currentRound = []

        for (let i = 0; i < teams.length; i += 2) {
            currentRound.push({ team1: teams[i], team2: teams[i + 1] })
        }
        rounds.push(currentRound)

        // Generate subsequent rounds
        let matchCount = currentRound.length / 2
        while (matchCount >= 1) {
            const nextRound = Array.from({ length: matchCount }, () => ({ team1: 'TBD', team2: 'TBD' }))
            rounds.push(nextRound)
            matchCount /= 2
        }

        setBracket(rounds)
    }

    return (
        <CalculatorLayout
            title="Bracket Generator"
            description="Create tournament brackets"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Trophy}
            result={bracket.length > 0 ? `${bracket[0].length * 2} Teams` : '—'}
            resultLabel="Tournament Size"
        >
            <div className="input-group">
                <label className="input-label">Teams/Participants (one per line)</label>
                <textarea
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    rows={6}
                    placeholder="Enter team names, one per line"
                />
            </div>
            <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={shuffled} onChange={(e) => setShuffled(e.target.checked)} />
                    Randomize seeding
                </label>
            </div>
            <button
                onClick={generateBracket}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: '#a78bfa',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '16px'
                }}
            >
                Generate Bracket
            </button>
            {bracket.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', gap: '16px', minWidth: 'max-content' }}>
                        {bracket.map((round, roundIndex) => (
                            <div key={roundIndex} style={{ minWidth: '120px' }}>
                                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px', textAlign: 'center' }}>
                                    Round {roundIndex + 1}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {round.map((match, matchIndex) => (
                                        <div key={matchIndex} style={{ background: '#1a1a2e', borderRadius: '8px', overflow: 'hidden' }}>
                                            <div style={{ padding: '8px', borderBottom: '1px solid #333', fontSize: '13px' }}>{match.team1}</div>
                                            <div style={{ padding: '8px', fontSize: '13px' }}>{match.team2}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default BracketGenerator
