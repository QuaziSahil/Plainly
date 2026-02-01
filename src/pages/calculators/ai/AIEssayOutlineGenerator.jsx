import { useState, useRef } from 'react'
import { FileText, Loader2, Wand2, Copy, Check, RefreshCw, BookOpen } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateEssayOutline } from '../../../services/groqAI'

function AIEssayOutlineGenerator() {
    const [topic, setTopic] = useState('')
    const [type, setType] = useState('argumentative')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter an essay topic')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const outline = await generateEssayOutline(topic, type)
            setResult(outline)
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
        setType('argumentative')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Essay Outline Generator"
            description="Create logical, well-structured outlines for any type of essay"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={BookOpen}
            result={result ? 'Outline Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Essay Topic *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Impact of Social Media on Mental Health"
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Essay Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="argumentative">Argumentative (Persuasive)</option>
                    <option value="expository">Expository (Informative)</option>
                    <option value="narrative">Narrative (Story-based)</option>
                    <option value="descriptive">Descriptive</option>
                    <option value="compare-contrast">Compare & Contrast</option>
                    <option value="analytical">Analytical</option>
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
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                        Structuring Essay...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Outline
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Outline
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
                        <FileText size={12} /> Essay Structure
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
                        {copied ? 'Copied!' : 'Copy Outline'}
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

export default AIEssayOutlineGenerator
