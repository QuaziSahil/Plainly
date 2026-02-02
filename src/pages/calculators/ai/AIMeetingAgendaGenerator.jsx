import { useState, useRef } from 'react'
import { Calendar, Loader2, Wand2, Copy, Check, RefreshCw, Target } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateMeetingAgenda } from '../../../services/groqAI'

function AIMeetingAgendaGenerator() {
    const [objective, setObjective] = useState('')
    const [participants, setParticipants] = useState('')
    const [duration, setDuration] = useState('30')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!objective.trim()) {
            setError('Please describe the meeting objective')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const agenda = await generateMeetingAgenda(objective, participants, duration)
            setResult(agenda)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setObjective('')
        setParticipants('')
        setDuration('30')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Meeting Agenda Generator"
            description="Plan high-impact, time-boxed meetings with AI-generated agendas"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Calendar}
            result={result ? 'Agenda Ready' : 'Ready'}
            resultLabel="Generated"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Meeting Objective *</label>
                <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g., Discussing quarterly roadmaps, new hire onboarding..."
                    className="input-field"
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Participants / Context</label>
                    <input
                        type="text"
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                        placeholder="e.g., Marketing team, stakeholders..."
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Duration (min)</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                    </select>
                </div>
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#ef444420',
                    border: '1px solid #ef444440',
                    borderRadius: '8px',
                    color: '#ef4444',
                    marginBottom: '16px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={loading || !objective.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !objective.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !objective.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Structuring Meeting...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Version
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Build Agenda
                    </>
                )}
            </button>

            {result && (<div ref={resultRef} style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                border: '1px solid #333',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid #333',
                    background: '#0a0a0a'
                }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Target size={12} /> Meeting Blueprint
                    </span>
                    <button
                        onClick={handleCopy}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: copied ? '#10b981' : '#333',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Agenda'}
                    </button>
                </div>
                <div style={{
                    padding: '24px',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap'
                }}>
                    <AIOutputFormatter content={result} />
                </div>
            </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default AIMeetingAgendaGenerator
