import { useState, useRef } from 'react'
import { Quote, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateCitation } from '../../../services/groqAI'

function AICitationGenerator() {
    const [sourceData, setSourceData] = useState('')
    const [style, setStyle] = useState('APA')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!sourceData.trim()) {
            setError('Please enter source details (Author, Title, Date, etc.)')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const citation = await generateCitation(sourceData, style)
            setResult(citation)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate citation. Please try again.')
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
        setSourceData('')
        setStyle('APA')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Citation Generator"
            description="Generate perfect academic citations in any style"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Quote}
            result={result ? "Citation Generated" : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Source Details *</label>
                <textarea
                    value={sourceData}
                    onChange={(e) => setSourceData(e.target.value)}
                    placeholder="e.g., Einstein, A. (1905). On the Electrodynamics of Moving Bodies. Annalen der Physik..."
                    rows={4}
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
                <label className="input-label">Citation Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="APA">APA (7th Edition)</option>
                    <option value="MLA">MLA (9th Edition)</option>
                    <option value="Chicago">Chicago / Turabian</option>
                    <option value="Harvard">Harvard</option>
                    <option value="Vancouver">Vancouver (Medical)</option>
                    <option value="IEEE">IEEE (Engineering)</option>
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
                disabled={loading || !sourceData.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !sourceData.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !sourceData.trim() ? 'not-allowed' : 'pointer',
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
                        Formatting...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        New Version
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Citation
                    </>
                )}
            </button>

            {result && (
                <div ref={resultRef} style={{
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
                        <span style={{ fontSize: '12px', opacity: 0.6 }}>
                            ✨ Formatted Citation
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
                        padding: '20px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
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

export default AICitationGenerator
