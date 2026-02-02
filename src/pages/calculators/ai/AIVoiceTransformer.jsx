import { useState, useRef } from 'react'
import { Volume2, Loader2, Wand2, Copy, Check, RefreshCw, Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { transformVoice } from '../../../services/groqAI'

function AIVoiceTransformer() {
    const [text, setText] = useState('')
    const [targetVoice, setTargetVoice] = useState('active')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleTransform = async () => {
        if (!text.trim()) {
            setError('Please enter some text to transform')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const transformed = await transformVoice(text, targetVoice)
            setResult(transformed)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to transform. Please try again.')
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
        setText('')
        setTargetVoice('active')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Passive to Active Voice Converter"
            description="Transform passive sentences into active ones for clearer, more direct writing"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Volume2}
            result={result ? 'Analysis Complete' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-group" style={{ marginBottom: '24px' }}>
                <label className="input-label">Text to Transform *</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., The ball was thrown by the boy. -> The boy threw the ball."
                    rows={6}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        resize: 'vertical'
                    }}
                />
            </div>

            <div className="input-group" style={{ marginBottom: '24px' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#888' }}>Target Voice Style</label>
                <select
                    value={targetVoice}
                    onChange={(e) => setTargetVoice(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '10px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        color: 'white',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="active">Active Voice (Clear & Direct)</option>
                    <option value="passive">Passive Voice (Formal & Distant)</option>
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
                onClick={handleTransform}
                disabled={loading || !text.trim()}
                style={{
                    width: '100%',
                    padding: '18px',
                    background: loading || !text.trim() ? '#333' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '14px',
                    color: 'white',
                    cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '32px',
                    transition: 'all 0.3s ease',
                    boxShadow: !loading && text.trim() ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Analyzing with Plainly AI...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Transform Again
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        {targetVoice === 'active' ? 'Convert to Active Voice' : 'Convert to Passive Voice'}
                    </>
                )}
            </button>

            {result && (
                <div ref={resultRef} style={{
                    background: '#1a1a2e',
                    borderRadius: '16px',
                    border: '1px solid #333',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 20px',
                        borderBottom: '1px solid #333',
                        background: '#0a0a0a'
                    }}>
                        <span style={{ fontSize: '13px', opacity: 0.9, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa' }}>
                            <Zap size={16} /> Comparative Voice Analysis
                        </span>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                background: copied ? '#10b981' : '#333',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy Comparison'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap',
                        color: '#e6edf3'
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

export default AIVoiceTransformer
