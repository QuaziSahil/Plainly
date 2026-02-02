import { useState, useRef } from 'react'
import { Variable, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIVariableNameGenerator() {
    const [description, setDescription] = useState('')
    const [type, setType] = useState('variable')
    const [convention, setConvention] = useState('camelCase')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const types = [
        { value: 'variable', label: 'Variable' },
        { value: 'function', label: 'Function/Method' },
        { value: 'class', label: 'Class' },
        { value: 'constant', label: 'Constant' },
        { value: 'file', label: 'File Name' },
        { value: 'component', label: 'React Component' }
    ]

    const conventions = [
        { value: 'camelCase', label: 'camelCase (JavaScript, Java)' },
        { value: 'PascalCase', label: 'PascalCase (C#, Classes)' },
        { value: 'snake_case', label: 'snake_case (Python, Ruby)' },
        { value: 'SCREAMING_SNAKE', label: 'SCREAMING_SNAKE_CASE (Constants)' },
        { value: 'kebab-case', label: 'kebab-case (CSS, URLs)' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe what the variable represents')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are a naming expert. Generate clear, descriptive names that follow best practices.

Naming Convention: ${convention}
Type: ${type}

Rules:
- Be descriptive but concise
- Avoid abbreviations unless universally understood
- Follow the exact convention specified
- Provide 5 options from most concise to most descriptive
- Consider readability and clarity`

        const prompt = `Generate ${type} names in ${convention} format for:

"${description}"

Provide 5 naming suggestions with brief explanation of each.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 512 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate names. Please try again.')
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
        setType('variable')
        setConvention('camelCase')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Variable Name Generator"
            description="Get perfect variable and function names"
            category="AI Tools"
            categoryPath="/ai"
            icon={Variable}
            result={result ? 'Names Ready' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What does this represent? *</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., A list of user email addresses, The total price after discount, Whether the user is logged in..."
                    className="input-field"
                />
            </div>

            {/* Options */}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        {types.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Convention</label>
                    <select value={convention} onChange={(e) => setConvention(e.target.value)}>
                        {conventions.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
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
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
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
                        Generating Names...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Variable size={20} />
                        Generate Names
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
                            <Variable size={12} /> Name Suggestions
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
                    📝 Describe what it represents and get perfect names
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

export default AIVariableNameGenerator
