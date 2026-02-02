import { useState, useRef } from 'react'
import { Regex, Loader2, RefreshCw, Copy, Check, Download } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { askGroq } from '../../../services/groqAI'

function AIRegexGenerator() {
    const [description, setDescription] = useState('')
    const [flavor, setFlavor] = useState('javascript')
    const [testStrings, setTestStrings] = useState('')
    const [result, setResult] = useState('')
    const [regexPattern, setRegexPattern] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const flavors = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'go', label: 'Go' },
        { value: 'csharp', label: 'C#/.NET' },
        { value: 'pcre', label: 'PCRE (Perl)' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe what pattern you need to match')
            return
        }

        setLoading(true)
        setError('')
        setResult('')
        setRegexPattern('')

        const systemPrompt = `You are a regex expert. Create accurate regular expressions from natural language descriptions.

Rules:
- Use ${flavor} regex syntax
- Start with the REGEX PATTERN on its own line clearly marked
- Include flags if needed (g, i, m, etc.)
- Explain each part of the pattern
- Show example matches and non-matches
- Consider edge cases`

        const prompt = `Create a regex pattern for: ${description}

Language/Flavor: ${flavor}
${testStrings ? `Test strings to match: ${testStrings}` : ''}

Format your response with the regex pattern first, then explanation.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 1024 })
            setResult(response)

            // Extract regex pattern from response
            const regexMatch = response.match(/`{1,3}([^`]+)`{1,3}|\/([^\/]+)\/[gimsuvy]*/m)
            if (regexMatch) {
                setRegexPattern(regexMatch[1] || regexMatch[0])
            }

            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate regex. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        const textToCopy = regexPattern || result
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const content = `// Regex Pattern for: ${description}\n// Flavor: ${flavor}\n\n${result}`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'regex-pattern.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleReset = () => {
        setDescription('')
        setFlavor('javascript')
        setTestStrings('')
        setResult('')
        setRegexPattern('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Regex Generator"
            description="Create regex patterns from plain English"
            category="AI Tools"
            categoryPath="/ai"
            icon={Regex}
            result={result ? 'Pattern Ready' : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What do you want to match? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Email addresses, Phone numbers with country code, URLs starting with https, Dates in MM/DD/YYYY format..."
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

            {/* Regex Flavor */}
            <div className="input-group">
                <label className="input-label">Regex Flavor</label>
                <select value={flavor} onChange={(e) => setFlavor(e.target.value)}>
                    {flavors.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
            </div>

            {/* Test Strings */}
            <div className="input-group">
                <label className="input-label">Test strings (optional)</label>
                <input
                    type="text"
                    value={testStrings}
                    onChange={(e) => setTestStrings(e.target.value)}
                    placeholder="e.g., test@email.com, 555-1234, hello world"
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

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
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
                        Generating Pattern...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Regex size={20} />
                        Generate Regex
                    </>
                )}
            </button>

            {/* Result */}
            {result ? (
                <div ref={resultRef} style={{
                    background: '#0d1117',
                    borderRadius: '12px',
                    border: '1px solid #30363d',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #30363d',
                        background: '#161b22',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <span style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                            borderRadius: '6px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {flavor} regex
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleCopy}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    background: copied ? '#238636' : '#21262d',
                                    border: '1px solid #30363d',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    minHeight: '36px'
                                }}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                onClick={handleDownload}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    minHeight: '36px'
                                }}
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#c9d1d9'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
                    borderRadius: '12px',
                    border: '1px dashed #30363d',
                    color: '#8b949e',
                    textAlign: 'center'
                }}>
                    <Regex size={48} strokeWidth={1} style={{ color: '#ec4899', opacity: 0.6, marginBottom: '16px' }} />
                    <p style={{ fontSize: '16px', margin: '0 0 8px', color: '#c9d1d9' }}>Your regex pattern will appear here</p>
                    <span style={{ fontSize: '13px', opacity: 0.6 }}>Describe what to match and generate</span>
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

export default AIRegexGenerator
