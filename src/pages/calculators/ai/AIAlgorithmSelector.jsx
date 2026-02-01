import { useState, useRef } from 'react'
import { Cpu, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIAlgorithmSelector() {
    const [problem, setProblem] = useState('')
    const [constraints, setConstraints] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!problem.trim()) {
            setError('Please describe your problem')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are an algorithms expert. Recommend the best algorithm for any problem.

Provide:
1. Recommended algorithm(s) with explanation
2. Time and space complexity (Big O)
3. Pseudocode or implementation approach
4. Trade-offs and alternatives
5. When NOT to use this algorithm`

        const prompt = `Recommend the best algorithm for:

Problem: ${problem}
${constraints ? `Constraints: ${constraints}` : ''}

Provide a detailed recommendation with complexity analysis and implementation guidance.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 1536 })
            setResult(response)
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
        setProblem('')
        setConstraints('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Algorithm Selector"
            description="Find the best algorithm for any problem"
            category="AI Tools"
            categoryPath="/ai"
            icon={Cpu}
            result={result ? 'Recommended' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Problem Input */}
            <div className="input-group">
                <label className="input-label">Describe your problem *</label>
                <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g., Find the shortest path between two nodes in a weighted graph, Sort a nearly sorted array efficiently, Find all common elements between two arrays..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '100px'
                    }}
                />
            </div>

            {/* Constraints */}
            <div className="input-group">
                <label className="input-label">Constraints (optional)</label>
                <input
                    type="text"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="e.g., Array size up to 10^6, Must be O(n log n), Memory limited to 256MB..."
                    className="input-field"
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

            {/* Analyze Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !problem.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !problem.trim() ? '#333' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !problem.trim() ? 'not-allowed' : 'pointer',
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
                        Re-analyze
                    </>
                ) : (
                    <>
                        <Cpu size={20} />
                        Find Best Algorithm
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
                            <Cpu size={12} /> Algorithm Recommendation
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
                    ⚡ Describe your problem and get the optimal algorithm
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

export default AIAlgorithmSelector
