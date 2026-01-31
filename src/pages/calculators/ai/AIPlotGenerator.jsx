import { useState, useRef, useEffect } from 'react'
import { Ghost, Loader2, Wand2, Copy, Check, RefreshCw, Map } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCreativeContent } from '../../../services/groqAI'

function AIPlotGenerator() {
    const [genre, setGenre] = useState('Mystery')
    const [details, setDetails] = useState('')
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
            const plot = await generateCreativeContent('plot', genre, details)
            setResult(plot)
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
        setGenre('Mystery')
        setDetails('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Plot Generator"
            description="Generate complex and intriguing plot outlines for your next novel or script"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Map}
            result={result ? 'Plot Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Genre</label>
                <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="Mystery">Mystery / Thriller</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Science Fiction</option>
                    <option value="Drama">Drama</option>
                    <option value="Action">Action / Adventure</option>
                    <option value="Romance">Romance</option>
                    <option value="Noir">Crime Noir</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Key Elements (characters, setting, conflict)</label>
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="e.g., A detective who can see the future, a megacity on Mars, a missing artifact..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
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
                        Mapping Plot...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Plot
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Build Plot Outline
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
                            <Ghost size={12} /> Story Blueprint
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
                            {copied ? 'Copied!' : 'Copy Plot'}
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

export default AIPlotGenerator
