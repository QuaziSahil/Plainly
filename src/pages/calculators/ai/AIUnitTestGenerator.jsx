import { useState, useRef } from 'react'
import { FlaskConical, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIUnitTestGenerator() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [framework, setFramework] = useState('jest')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const languageFrameworks = {
        javascript: [
            { value: 'jest', label: 'Jest' },
            { value: 'mocha', label: 'Mocha + Chai' },
            { value: 'vitest', label: 'Vitest' }
        ],
        typescript: [
            { value: 'jest', label: 'Jest' },
            { value: 'vitest', label: 'Vitest' }
        ],
        python: [
            { value: 'pytest', label: 'Pytest' },
            { value: 'unittest', label: 'Unittest' }
        ],
        java: [
            { value: 'junit5', label: 'JUnit 5' },
            { value: 'junit4', label: 'JUnit 4' }
        ],
        csharp: [
            { value: 'xunit', label: 'xUnit' },
            { value: 'nunit', label: 'NUnit' }
        ],
        go: [
            { value: 'testing', label: 'Testing (stdlib)' }
        ],
        php: [
            { value: 'phpunit', label: 'PHPUnit' }
        ]
    }

    const handleGenerate = async () => {
        if (!code.trim()) {
            setError('Please paste code to generate tests for')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are a testing expert. Generate comprehensive unit tests.

Language: ${language}
Framework: ${framework}

Rules:
- Cover all edge cases
- Test both success and failure scenarios
- Use descriptive test names
- Include setup/teardown if needed
- Mock dependencies where appropriate
- Aim for high code coverage`

        const prompt = `Generate unit tests for this ${language} code using ${framework}:

\`\`\`${language}
${code}
\`\`\`

Provide complete, runnable tests with explanations.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate tests. Please try again.')
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

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang)
        setFramework(languageFrameworks[newLang]?.[0]?.value || 'jest')
    }

    const handleReset = () => {
        setCode('')
        setLanguage('javascript')
        setFramework('jest')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Unit Test Generator"
            description="Generate comprehensive unit tests for your code"
            category="AI Tools"
            categoryPath="/ai"
            icon={FlaskConical}
            result={result ? 'Tests Ready' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">Code to test *</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste the function or class you want to generate tests for..."
                    rows={8}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: '#10b981',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                        minHeight: '180px'
                    }}
                />
            </div>

            {/* Language & Framework */}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Language</label>
                    <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
                        {Object.keys(languageFrameworks).map(lang => (
                            <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Test Framework</label>
                    <select value={framework} onChange={(e) => setFramework(e.target.value)}>
                        {languageFrameworks[language]?.map(fw => (
                            <option key={fw.value} value={fw.value}>{fw.label}</option>
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
                disabled={loading || !code.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !code.trim() ? '#333' : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
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
                        Generating Tests...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <FlaskConical size={20} />
                        Generate Unit Tests
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
                            <FlaskConical size={12} /> Unit Tests
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
                        lineHeight: '1.6',
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
                    🧪 Paste your code and get comprehensive unit tests
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

export default AIUnitTestGenerator
