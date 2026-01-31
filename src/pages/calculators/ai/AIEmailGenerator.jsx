import { useState } from 'react'
import { Mail, Loader2, Wand2, Copy, Check, RefreshCw, Send } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateEmail } from '../../../services/groqAI'

function AIEmailGenerator() {
    const [purpose, setPurpose] = useState('')
    const [context, setContext] = useState('')
    const [tone, setTone] = useState('professional')
    const [length, setLength] = useState('medium')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!purpose.trim()) {
            setError('Please enter the purpose of the email')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const email = await generateEmail(purpose, context, tone, length)
            setResult(email)
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
        setPurpose('')
        setContext('')
        setTone('professional')
        setLength('medium')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Email Generator"
            description="Draft professional or personal emails instantly with AI"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Mail}
            result={result ? 'Draft Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            {/* Purpose Input */}
            <div className="input-group">
                <label className="input-label">What is this email for? *</label>
                <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Job application follow-up, Requesting a refund, Resignation..."
                    className="input-field"
                />
            </div>

            {/* Context Input */}
            <div className="input-group">
                <label className="input-label">Key points or context (optional)</label>
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Mention I had an interview Tuesday, Reference order #12345..."
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

            {/* Options */}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="urgent">Urgent</option>
                        <option value="friendly">Friendly</option>
                        <option value="persuasive">Persuasive</option>
                        <option value="apologetic">Apologetic</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Length</label>
                    <select value={length} onChange={(e) => setLength(e.target.value)}>
                        <option value="short">Short (Direct)</option>
                        <option value="medium">Medium (Standard)</option>
                        <option value="long">Long (Detailed)</option>
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

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !purpose.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !purpose.trim() ? '#333' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !purpose.trim() ? 'not-allowed' : 'pointer',
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
                        Drafting Email...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Redraft Email
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate AI Email
                    </>
                )}
            </button>

            {/* Result */}
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
                            <Send size={12} /> Email Draft Ready
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
                            {copied ? 'Copied!' : 'Copy Email'}
                        </button>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
                </div>
            )}

            {!result && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    📧 Describe your email's purpose and get a perfectly written draft
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

export default AIEmailGenerator
