import { useState, useRef } from 'react'
import { Component, Loader2, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import CodePreview from '../../../components/CodePreview/CodePreview'
import { askGroq } from '../../../services/groqAI'

function AIReactComponentGenerator() {
    const [description, setDescription] = useState('')
    const [type, setType] = useState('functional')
    const [styling, setStyling] = useState('css')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const types = [
        { value: 'functional', label: 'Functional Component' },
        { value: 'typescript', label: 'TypeScript Component' }
    ]

    const stylings = [
        { value: 'css', label: 'CSS Classes' },
        { value: 'tailwind', label: 'Tailwind CSS' },
        { value: 'styled', label: 'Styled Components' },
        { value: 'inline', label: 'Inline Styles' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe the component you want to create')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are a React expert. Generate clean, reusable React components.

Type: ${type === 'typescript' ? 'TypeScript functional component with proper types' : 'JavaScript functional component'}
Styling: ${styling}

Rules:
- Use modern React hooks (useState, useEffect, etc.)
- Include proper prop types ${type === 'typescript' ? '(TypeScript interfaces)' : '(PropTypes or JSDoc)'}
- Make the component reusable and customizable
- Follow React best practices
- Export as default
- IMPORTANT: Return ONLY the component code in a markdown code block. No extra explanations.`

        const prompt = `Create a React component for:

${description}

Return ONLY the component code in a markdown code block.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate component. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setDescription('')
        setType('functional')
        setStyling('css')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI React Component Generator"
            description="Generate React components from descriptions"
            category="AI Tools"
            categoryPath="/ai"
            icon={Component}
            result={result ? `React ${type === 'typescript' ? 'TSX' : 'JSX'}` : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What component do you need? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., A modal component with title, content, close button, and overlay click to dismiss. Include animations..."
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

            {/* Options */}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Component Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        {types.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Styling</label>
                    <select value={styling} onChange={(e) => setStyling(e.target.value)}>
                        {stylings.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
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
                disabled={loading || !description.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
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
                        Generating Component...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Component size={20} />
                        Generate Component
                    </>
                )}
            </button>

            {/* Code Preview */}
            <div ref={resultRef}>
                <CodePreview
                    code={result}
                    language={type === 'typescript' ? 'tsx' : 'jsx'}
                    filename={`Component`}
                />
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

export default AIReactComponentGenerator
