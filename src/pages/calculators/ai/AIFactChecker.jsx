import { useState, useRef } from 'react'
import { CheckCircle, Loader2, Wand2, Copy, Check, RefreshCw, Search } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { checkFact } from '../../../services/groqAI'

function AIFactChecker() {
    const [claim, setClaim] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!claim.trim()) {
            setError('Please enter a claim to verify')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const analysis = await checkFact(claim)
            setResult(analysis)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to analyze. Please try again.')
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
        setClaim('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Fact Checker"
            description="Verify claims and get accurate information with AI analysis"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={CheckCircle}
            result={result ? 'Analysis Ready' : 'Ready'}
            resultLabel="Verified"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Claim Input */}
            <div className="input-group">
                <label className="input-label">Enter a claim to fact-check *</label>
                <textarea
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    placeholder="e.g., The Great Wall of China is visible from space, Goldfish have a 3-second memory, Lightning never strikes the same place twice..."
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

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !claim.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !claim.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !claim.trim() ? 'not-allowed' : 'pointer',
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
                        Analyzing Claim...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Check Another Claim
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Verify This Claim
                    </>
                )}
            </button>

            {/* Result */}
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
                        <Search size={12} /> Fact Check Analysis
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
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div style={{
                    padding: '24px',
                    fontSize: '15px',
                    lineHeight: '1.8'
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
                    🔍 Enter any claim or statement to verify its accuracy
                </div>
            )}

            {/* Disclaimer */}
            <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #78350f10 0%, #f59e0b20 100%)',
                border: '1px solid #f59e0b40',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
            }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <span><strong>Note:</strong> AI fact-checking is for educational purposes. Always verify important claims with official sources.</span>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default AIFactChecker
