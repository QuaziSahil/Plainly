import { useState, useRef } from 'react'
import { FileText, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateParagraph } from '../../../services/groqAI'

function ParagraphGenerator() {
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('professional')
    const [length, setLength] = useState('medium')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const paragraph = await generateParagraph(topic, tone, length)
            setResult(paragraph)
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
        setTone('professional')
        setLength('medium')
        setResult('')
        setError('')
    }

    const wordCount = result ? result.split(/\s+/).filter(w => w).length : 0

    return (
        <CalculatorLayout
            title="AI Paragraph Generator"
            description="Generate paragraphs instantly with AI"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={FileText}
            result={result ? `${wordCount} words` : 'Ready'}
            resultLabel="Generated"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Topic Input */}
            <div className="input-group">
                <label className="input-label">Topic / Subject *</label>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Benefits of morning exercise, How AI is changing healthcare..."
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
                        <option value="academic">Academic</option>
                        <option value="persuasive">Persuasive</option>
                        <option value="humorous">Humorous</option>
                        <option value="inspirational">Inspirational</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Length</label>
                    <select value={length} onChange={(e) => setLength(e.target.value)}>
                        <option value="short">Short (~75 words)</option>
                        <option value="medium">Medium (~150 words)</option>
                        <option value="long">Long (~300 words)</option>
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
                        Generating...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Paragraph
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
                    <span style={{ fontSize: '12px', opacity: 0.6 }}>
                        ✨ Generated • {wordCount} words
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

            {!result && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    ✍️ Enter a topic and generate AI-written content
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

export default ParagraphGenerator
