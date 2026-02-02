import { useState, useRef } from 'react'
import { Layers, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AITechStackRecommender() {
    const [projectType, setProjectType] = useState('')
    const [requirements, setRequirements] = useState('')
    const [scale, setScale] = useState('small')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const scales = [
        { value: 'small', label: 'Small (Side project, MVP)' },
        { value: 'medium', label: 'Medium (Startup, Small team)' },
        { value: 'large', label: 'Large (Enterprise, High traffic)' }
    ]

    const handleGenerate = async () => {
        if (!projectType.trim()) {
            setError('Please describe your project')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are a senior architect. Recommend the best tech stack for projects.

Consider:
- Project scale: ${scale}
- Learning curve
- Community support
- Long-term maintainability
- Cost (hosting, licenses)
- Performance requirements

Provide:
1. Frontend recommendations
2. Backend recommendations
3. Database recommendations
4. DevOps/Infrastructure
5. Additional tools (testing, monitoring)
6. Reasoning for each choice`

        const prompt = `Recommend a tech stack for:

Project: ${projectType}
Scale: ${scale}
${requirements ? `Requirements: ${requirements}` : ''}

Provide a complete, well-reasoned technology stack recommendation.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 1536 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate recommendations. Please try again.')
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
        setProjectType('')
        setRequirements('')
        setScale('small')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Tech Stack Recommender"
            description="Get personalized technology stack recommendations"
            category="AI Tools"
            categoryPath="/ai"
            icon={Layers}
            result={result ? 'Stack Ready' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Project Type Input */}
            <div className="input-group">
                <label className="input-label">What are you building? *</label>
                <textarea
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="e.g., A social media platform with real-time messaging, An e-commerce marketplace with payments, A SaaS dashboard with analytics..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '80px'
                    }}
                />
            </div>

            {/* Requirements */}
            <div className="input-group">
                <label className="input-label">Special requirements (optional)</label>
                <input
                    type="text"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g., Must be mobile-first, Need real-time updates, SEO important..."
                    className="input-field"
                />
            </div>

            {/* Scale */}
            <div className="input-group">
                <label className="input-label">Project Scale</label>
                <select value={scale} onChange={(e) => setScale(e.target.value)}>
                    {scales.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
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
                disabled={loading || !projectType.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !projectType.trim() ? '#333' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !projectType.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    minHeight: '52px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Analyzing...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Recommendations
                    </>
                ) : (
                    <>
                        <Layers size={20} />
                        Get Tech Stack
                    </>
                )}
            </button>

            {/* Result */}
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
                        <span style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Layers size={12} /> Tech Stack Recommendation
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
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                minHeight: '36px'
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '14px',
                        lineHeight: '1.7'
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
                    🏗️ Describe your project and get the perfect tech stack
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

export default AITechStackRecommender
