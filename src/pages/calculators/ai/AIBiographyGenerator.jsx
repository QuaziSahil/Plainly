import { useState, useRef } from 'react'
import { User, Loader2, Wand2, Copy, Check, RefreshCw, UserCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateBiography } from '../../../services/groqAI'

function AIBiographyGenerator() {
    const [personName, setPersonName] = useState('')
    const [focus, setFocus] = useState('comprehensive')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!personName.trim()) {
            setError('Please enter a person\'s name')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const bio = await generateBiography(personName, focus)
            setResult(bio)
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
        setPersonName('')
        setFocus('comprehensive')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Biography Generator"
            description="Get comprehensive biographies of famous people and historical figures"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={User}
            result={result ? 'Biography Ready' : 'Ready'}
            resultLabel="Generated"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Person Name Input */}
            <div className="input-group">
                <label className="input-label">Who do you want to learn about? *</label>
                <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="e.g., Albert Einstein, Cleopatra, Elon Musk, Marie Curie..."
                    className="input-field"
                />
            </div>

            {/* Focus Selection */}
            <div className="input-group">
                <label className="input-label">Biography Focus</label>
                <select value={focus} onChange={(e) => setFocus(e.target.value)}>
                    <option value="comprehensive">Comprehensive Life Story</option>
                    <option value="achievements">Focus on Achievements</option>
                    <option value="early-life">Focus on Early Life</option>
                    <option value="legacy">Focus on Legacy & Impact</option>
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

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !personName.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !personName.trim() ? '#333' : 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !personName.trim() ? 'not-allowed' : 'pointer',
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
                        Researching...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Biography
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Biography
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
                        <UserCircle size={12} /> Biography
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
                    👤 Enter any person's name to get their comprehensive biography
                </div>
            )}

            {/* Refresh Tip */}
            <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)',
                border: '1px solid #3b82f640',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
            }}>
                <span style={{ fontSize: '16px' }}>💡</span>
                <span><strong>Tip:</strong> If the tool doesn't respond after generation, try refreshing the page and generating again.</span>
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

export default AIBiographyGenerator
