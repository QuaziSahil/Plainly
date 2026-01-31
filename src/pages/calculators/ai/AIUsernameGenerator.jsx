import { useState, useRef, useEffect } from 'react'
import { AtSign, Loader2, Wand2, Copy, Check, RefreshCw, UserCheck } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCreativeContent } from '../../../services/groqAI'

function AIUsernameGenerator() {
    const [base, setBase] = useState('')
    const [style, setStyle] = useState('cool')
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
            const names = await generateCreativeContent('quote', `${style} usernames based on "${base || 'random terms'}"`, 'Return only a clean list of usernames', 'creative')
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
        setBase('')
        setStyle('cool')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Username Generator"
            description="Find unique, catchy usernames for gaming, social media, and more"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={AtSign}
            result={result ? 'Usernames Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Keywords or Base Name (optional)</label>
                <input
                    type="text"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    placeholder="e.g., gamer, ghost, sky, rehan..."
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Username Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="cool">Cool & Modern</option>
                    <option value="aesthetic">Aesthetic / Minimalist</option>
                    <option value="gamer">Gaming Style (Xx_Pro_xX)</option>
                    <option value="funny">Humorous</option>
                    <option value="professional">Professional / Clean</option>
                    <option value="fantasy">Fantasy / RPG</option>
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
                    background: loading ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
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
                        Checking Availability...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Generate More
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Usernames
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
                            <UserCheck size={12} /> The Handle List
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
                        fontSize: '16px',
                        lineHeight: '2.0',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace'
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

export default AIUsernameGenerator
