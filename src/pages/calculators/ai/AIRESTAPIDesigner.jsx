import { useState, useRef } from 'react'
import { Server, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIRESTAPIDesigner() {
    const [description, setDescription] = useState('')
    const [resourceName, setResourceName] = useState('')
    const [includeAuth, setIncludeAuth] = useState(true)
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe your API requirements')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are a REST API design expert. Design clean, RESTful APIs.

Rules:
- Follow REST best practices (proper HTTP methods, status codes)
- Use consistent naming conventions (kebab-case for URLs)
- Include request/response examples
- Document query parameters and pagination
- ${includeAuth ? 'Include authentication requirements (JWT, API keys)' : 'Skip authentication details'}
- Provide error response formats`

        const prompt = `Design a REST API for:

${description}
${resourceName ? `Primary resource: ${resourceName}` : ''}

Include:
1. All endpoints (GET, POST, PUT, PATCH, DELETE)
2. URL patterns
3. Request body examples
4. Response formats
5. Status codes
6. Error handling`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to design API. Please try again.')
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
        setDescription('')
        setResourceName('')
        setIncludeAuth(true)
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI REST API Designer"
            description="Design RESTful APIs with best practices"
            category="AI Tools"
            categoryPath="/ai"
            icon={Server}
            result={result ? 'API Designed' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What is your API for? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., A blog platform where users can create posts, add comments, and like posts. Users can follow each other..."
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

            {/* Resource Name */}
            <div className="input-group">
                <label className="input-label">Primary Resource Name (optional)</label>
                <input
                    type="text"
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                    placeholder="e.g., users, products, orders"
                    className="input-field"
                />
            </div>

            {/* Options */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    minHeight: '44px'
                }}>
                    <input
                        type="checkbox"
                        checked={includeAuth}
                        onChange={(e) => setIncludeAuth(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                    />
                    Include Authentication Endpoints
                </label>
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
                disabled={loading || !description.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !description.trim() ? 'not-allowed' : 'pointer',
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
                        Designing API...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Redesign
                    </>
                ) : (
                    <>
                        <Server size={20} />
                        Design API
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
                            <Server size={12} /> API Design
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
                        lineHeight: '1.6'
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
                    🚀 Describe your API and get a complete RESTful design
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

export default AIRESTAPIDesigner
