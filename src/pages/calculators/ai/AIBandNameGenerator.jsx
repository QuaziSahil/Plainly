import { useState, useRef } from 'react'
import { Disc, Loader2, Wand2, Copy, Check, RefreshCw, Music2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCreativeContent } from '../../../services/groqAI'

function AIBandNameGenerator() {
    const [topic, setTopic] = useState('')
    const [genre, setGenre] = useState('Indie Rock')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        setLoading(true)
        setError('')
        setResult('')

        try {
            const names = await generateCreativeContent('bandName', `${genre} ${topic ? `about ${topic}` : ''}`, '', 'creative')
            setResult(names)
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
        setTopic('')
        setGenre('Indie Rock')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Band Name Generator"
            description="Find the perfect name for your band, solo project, or DJ persona"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Disc}
            result={result ? 'Names Ready' : 'Ready'}
            resultLabel="Generated"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Genre</label>
                <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="Indie Rock">Indie Rock</option>
                    <option value="Heavy Metal">Heavy Metal</option>
                    <option value="Synthpop">Synthpop / Retro</option>
                    <option value="Jazz Fusion">Jazz Fusion</option>
                    <option value="Techno">Techno / EDM</option>
                    <option value="Lo-fi">Lo-fi / Ambient</option>
                    <option value="Punk">Punk</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Keywords / Themes (optional)</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., neon, space, oceans, geometry..."
                    className="input-field"
                />
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
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? '#333' : 'linear-gradient(135deg, #374151 0%, #111827 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    border: '1px solid #4b5563'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Naming the Act...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Names
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Band Names
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
                        <Music2 size={12} /> The Shortlist
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
                        {copied ? 'Copied!' : 'Copy Names'}
                    </button>
                </div>
                <div style={{
                    padding: '24px',
                    fontSize: '18px',
                    lineHeight: '2.0',
                    fontWeight: '700',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
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

export default AIBandNameGenerator
