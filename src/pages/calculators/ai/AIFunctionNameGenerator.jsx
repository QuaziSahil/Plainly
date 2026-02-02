import { useState, useRef } from 'react'
import { FunctionSquare, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIFunctionNameGenerator() {
    const [description, setDescription] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        { value: 'javascript', label: 'JavaScript (camelCase)' },
        { value: 'python', label: 'Python (snake_case)' },
        { value: 'java', label: 'Java (camelCase)' },
        { value: 'csharp', label: 'C# (PascalCase)' },
        { value: 'go', label: 'Go (CamelCase)' },
        { value: 'ruby', label: 'Ruby (snake_case)' },
        { value: 'php', label: 'PHP (camelCase)' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe what the function does')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const conventions = {
            javascript: 'camelCase (e.g., calculateTotal, getUserById)',
            python: 'snake_case (e.g., calculate_total, get_user_by_id)',
            java: 'camelCase (e.g., calculateTotal, getUserById)',
            csharp: 'PascalCase (e.g., CalculateTotal, GetUserById)',
            go: 'CamelCase, exported with PascalCase (e.g., CalculateTotal, getUserById)',
            ruby: 'snake_case with ? for booleans (e.g., calculate_total, user_valid?)',
            php: 'camelCase (e.g., calculateTotal, getUserById)'
        }

        const systemPrompt = `You are a naming expert. Generate clear, descriptive function names.

Language: ${language}
Convention: ${conventions[language]}

Rules:
- Start with a verb (get, set, calculate, validate, process, etc.)
- Be descriptive but concise
- Follow ${language} naming conventions exactly
- Consider common patterns (is/has for booleans, handle for events)
- Provide 5 options from most concise to most descriptive`

        const prompt = `Generate function names for:

"${description}"

Language: ${language}

Provide 5 naming suggestions following ${language} conventions.`

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
        setLanguage('javascript')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Function Name Generator"
            description="Get perfect function names for your code"
            category="AI Tools"
            categoryPath="/ai"
            icon={FunctionSquare}
            result={result ? 'Names Ready' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What does the function do? *</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Validates if an email address is properly formatted, Calculates the total price with tax and discounts..."
                    className="input-field"
                />
            </div>

            {/* Language */}
            <div className="input-group">
                <label className="input-label">Programming Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
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
                disabled={loading || !description.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                        <FunctionSquare size={20} />
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
                            <FunctionSquare size={12} /> Function Names
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
                    🔤 Describe what your function does and get perfect names
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

export default AIFunctionNameGenerator
