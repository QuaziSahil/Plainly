import { useState } from 'react'
import { Volume2, Loader2, Wand2, Copy, Check, RefreshCw, Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { transformVoice } from '../../../services/groqAI'

function AIVoiceTransformer() {
    const [text, setText] = useState('')
    const [targetVoice, setTargetVoice] = useState('active')
    const [result, setResult] = useState('')
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
            result={result ? 'Transformed' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Text to Transform *</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., The ball was thrown by the boy. -> The boy threw the ball."
                    rows={6}
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

            <div className="input-group">
                <label className="input-label">Target Style</label>
                <select value={targetVoice} onChange={(e) => setTargetVoice(e.target.value)}>
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
                    padding: '16px',
                    background: loading || !text.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
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
                        Transforming Voice...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Transform Again
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Convert to Active Voice
                    </>
                )}
            </button>

            {result && (
                <div style={{
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
                            <Zap size={12} /> Transformed Result
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
                            {copied ? 'Copied!' : 'Copy Result'}
                        </button>
                    </div>
                    <div style={{
                        padding: '24px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {result}
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
