import { useState, useRef } from 'react'
import { MessageSquareCode, Loader2, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import CodePreview from '../../../components/CodePreview/CodePreview'
import { askGroq } from '../../../services/groqAI'

function AICodeCommentGenerator() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [style, setStyle] = useState('inline')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'cpp', label: 'C++' },
        { value: 'go', label: 'Go' },
        { value: 'php', label: 'PHP' }
    ]

    const styles = [
        { value: 'inline', label: 'Inline Comments' },
        { value: 'jsdoc', label: 'JSDoc / Docstrings' },
        { value: 'detailed', label: 'Detailed (both)' }
    ]

    const handleGenerate = async () => {
        if (!code.trim()) {
            setError('Please paste code to comment')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const styleGuide = {
            inline: 'Add clear, concise inline comments explaining complex logic. Keep comments brief.',
            jsdoc: 'Add comprehensive documentation comments (JSDoc for JS, docstrings for Python, etc.) for functions and classes.',
            detailed: 'Add both inline comments for logic AND documentation comments for all functions/classes.'
        }

        const systemPrompt = `You are a documentation expert. Add helpful comments to code.

Language: ${language}
Style: ${styleGuide[style]}

Rules:
- Use proper comment syntax for the language
- Explain WHY, not just WHAT
- Keep inline comments concise
- Include parameter and return type documentation
- IMPORTANT: Return ONLY the commented code in a markdown code block. No extra explanations.`

        const prompt = `Add comments to this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Return ONLY the commented code in a markdown code block.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate comments. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setCode('')
        setLanguage('javascript')
        setStyle('inline')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Code Comment Generator"
            description="Add clear, helpful comments to your code"
            category="AI Tools"
            categoryPath="/ai"
            icon={MessageSquareCode}
            result={result ? 'Commented Code' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">Code to comment *</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here to add comments..."
                    rows={8}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: '#a78bfa',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                        minHeight: '180px'
                    }}
                />
            </div>

            {/* Options */}
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
                    <label className="input-label">Comment Style</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value)}>
                        {styles.map(s => (
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
                disabled={loading || !code.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !code.trim() ? '#333' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
                        Adding Comments...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <MessageSquareCode size={20} />
                        Add Comments
                    </>
                )}
            </button>

            {/* Code Preview */}
            <div ref={resultRef}>
                <CodePreview
                    code={result}
                    language={language}
                    filename={`commented-code`}
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

export default AICodeCommentGenerator
