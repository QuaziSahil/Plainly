import { useState, useRef, useEffect } from 'react'
import { Mic, Loader2, Wand2, Copy, Check, RefreshCw, AudioLines } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCreativeContent } from '../../../services/groqAI'

function AIRapNameGenerator() {
    const [theme, setTheme] = useState('')
    const [vibe, setVibe] = useState('hardcore')
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
            const names = await generateCreativeContent('rapName', `${vibe} style ${theme ? `inspired by ${theme}` : ''}`, '', 'creative')
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
        setTheme('')
        setVibe('hardcore')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Rap Name Generator"
            description="Find your stage name with AI-powered suggestions tailored to your style"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Mic}
            result={result ? 'Names Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Keywords / Interests (optional)</label>
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., street, ocean, tech, fire..."
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Rap Vibe</label>
                <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
                    <option value="hardcore">Hardcore / Gritty</option>
                    <option value="melodic">Melodic / Smooth</option>
                    <option value="underground">Underground / Raw</option>
                    <option value="trap">Trap / Energy</option>
                    <option value="conscious">Conscious / Lyrical</option>
                    <option value="old-school">Old School / Boom Bap</option>
                </select>
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
                    background: loading ? '#333' : 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
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
                        Spitting Fire...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Names
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Get Rap Names
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
                        <AudioLines size={12} /> The Persona List
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
                        {copied ? 'Copied!' : 'Copy List'}
                    </button>
                </div>
                <div style={{
                    padding: '24px',
                    fontSize: '18px',
                    lineHeight: '2.0',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap',
                    fontWeight: '800'
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

export default AIRapNameGenerator
