import { useState, useRef, useEffect } from 'react'
import { Music, Loader2, Wand2, Copy, Check, RefreshCw, Mic2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCreativeContent } from '../../../services/groqAI'

function AISongLyricsGenerator() {
    const [topic, setTopic] = useState('')
    const [style, setStyle] = useState('Modern Pop')
    const [tone, setTone] = useState('creative')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('What is the song about?')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const lyrics = await generateCreativeContent('lyrics', topic, style, tone)
            setResult(lyrics)
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
        setStyle('Modern Pop')
        setTone('creative')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Song Lyrics Generator"
            description="Write catchy and meaningful song lyrics for any genre"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Music}
            result={result ? 'Lyrics Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">What is the song about? *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., heartbreak in the city, chasing dreams, a summer night..."
                    className="input-field"
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Music Style / Artist Vibe</label>
                    <input
                        type="text"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        placeholder="e.g., 80s Rock, Lo-fi Hip Hop, Taylor Swift style..."
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="creative">Creative</option>
                        <option value="emotional">Emotional / Deep</option>
                        <option value="upbeat">Upbeat / Party</option>
                        <option value="angry">Gritty / Raw</option>
                        <option value="melancholic">Melancholic</option>
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
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
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
                        Composing Lyrics...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Lyrics
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Lyrics
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
                            <Mic2 size={12} /> Song Draft
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
                            {copied ? 'Copied!' : 'Copy Lyrics'}
                        </button>
                    </div>
                    <div style={{
                        padding: '32px',
                        fontSize: '16px',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        textAlign: 'center',
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

export default AISongLyricsGenerator
