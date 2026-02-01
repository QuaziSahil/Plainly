import { useState, useRef } from 'react'
import { Code, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AICodeGenerator() {
    const [description, setDescription] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [framework, setFramework] = useState('none')
    const [complexity, setComplexity] = useState('intermediate')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'cpp', label: 'C++' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'swift', label: 'Swift' },
        { value: 'kotlin', label: 'Kotlin' }
    ]

    const frameworks = [
        { value: 'none', label: 'No Framework' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'angular', label: 'Angular' },
        { value: 'node', label: 'Node.js' },
        { value: 'express', label: 'Express.js' },
        { value: 'django', label: 'Django' },
        { value: 'flask', label: 'Flask' },
        { value: 'spring', label: 'Spring Boot' },
        { value: 'nextjs', label: 'Next.js' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe what you want to build')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are an expert programmer. Generate clean, well-documented code based on the user's description.
Rules:
- Use ${language} as the programming language
${framework !== 'none' ? `- Use ${framework} framework/library` : ''}
- Complexity level: ${complexity}
- Include helpful comments
- Follow best practices and conventions
- Make the code production-ready
- Include error handling where appropriate
- Format the code properly with correct indentation`

        const prompt = `Generate code for: ${description}

Language: ${language}
${framework !== 'none' ? `Framework: ${framework}` : ''}
Complexity: ${complexity}

Provide the complete, working code with explanations.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate code. Please try again.')
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
        setFramework('none')
        setComplexity('intermediate')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Code Generator"
            description="Generate code from natural language descriptions"
            category="AI Tools"
            categoryPath="/ai"
            icon={Code}
            result={result ? 'Code Ready' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What do you want to build? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., A function that validates email addresses, A REST API endpoint for user authentication, A React component for a todo list..."
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

            {/* Language & Framework */}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Framework</label>
                    <select value={framework} onChange={(e) => setFramework(e.target.value)}>
                        {frameworks.map(fw => (
                            <option key={fw.value} value={fw.value}>{fw.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Complexity */}
            <div className="input-group">
                <label className="input-label">Complexity Level</label>
                <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                    <option value="beginner">Beginner (Simple, well-commented)</option>
                    <option value="intermediate">Intermediate (Production-ready)</option>
                    <option value="advanced">Advanced (Optimized, scalable)</option>
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
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
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
                        Generating Code...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate Code
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Code
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
                            <Code size={12} /> Generated Code
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
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace'
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
                    💻 Describe what you want to build and get production-ready code
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

export default AICodeGenerator
