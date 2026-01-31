import { useState } from 'react'
import { Users } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TeamRandomizer() {
    const [participants, setParticipants] = useState('Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry')
    const [numTeams, setNumTeams] = useState(2)
    const [teams, setTeams] = useState([])

    const generateTeams = () => {
        const people = participants.split('\n').map(p => p.trim()).filter(p => p)
        const shuffled = [...people].sort(() => Math.random() - 0.5)

        const newTeams = Array.from({ length: numTeams }, () => [])
        shuffled.forEach((person, i) => {
            newTeams[i % numTeams].push(person)
        })

        setTeams(newTeams)
    }

    return (
        <CalculatorLayout
            title="Team Randomizer"
            description="Randomly split people into teams"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Users}
            result={teams.length > 0 ? `${teams.length} Teams` : '—'}
            resultLabel="Teams Created"
        >
            <div className="input-group">
                <label className="input-label">Participants (one per line)</label>
                <textarea
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    rows={6}
                    placeholder="Enter names, one per line"
                />
            </div>
            <div className="input-group">
                <label className="input-label">Number of Teams</label>
                <input type="number" value={numTeams} onChange={(e) => setNumTeams(Math.max(2, Number(e.target.value)))} min={2} max={20} />
            </div>
            <button
                onClick={generateTeams}
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
                Generate Teams
            </button>
            {teams.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                    {teams.map((team, i) => (
                        <div key={i} style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '8px', color: '#a78bfa' }}>Team {i + 1}</div>
                            {team.map((member, j) => (
                                <div key={j} style={{ fontSize: '14px', padding: '4px 0' }}>{member}</div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default TeamRandomizer
