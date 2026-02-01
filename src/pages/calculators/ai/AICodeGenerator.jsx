import { useState, useRef } from 'react'
import { Code, Loader2, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import CodePreview from '../../../components/CodePreview/CodePreview'
import { askGroq } from '../../../services/groqAI'

function AICodeGenerator() {
    const [description, setDescription] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [framework, setFramework] = useState('none')
    const [complexity, setComplexity] = useState('intermediate')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'html', label: 'HTML (with CSS & JS)' },
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

        // Special prompt for HTML with embedded CSS/JS
        const isHTML = language === 'html'

        const systemPrompt = isHTML
            ? `You are an expert web developer. Generate COMPLETE, FULLY FUNCTIONAL HTML pages with embedded CSS and JavaScript.

CRITICAL REQUIREMENTS:
- Create a COMPLETE HTML5 document with <!DOCTYPE html>
- ALWAYS include embedded <style> in <head> for ALL CSS styling
- ALWAYS include embedded <script> at end of <body> for ALL JavaScript
- Make it VISUALLY BEAUTIFUL with modern CSS (gradients, shadows, animations, good colors)
- Make it FULLY FUNCTIONAL - all buttons, inputs, and interactions must work
- Include ALL necessary code - no external files, no placeholders, no TODOs
- The code must work immediately when opened in a browser
- Use modern CSS: flexbox, grid, CSS variables, smooth transitions
- Make it responsive for mobile
- Add hover effects and interactive feedback
- Use a professional color scheme (dark theme preferred)

Example structure:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title</title>
    <style>
        /* ALL CSS HERE - make it beautiful */
    </style>
</head>
<body>
    <!-- ALL HTML HERE -->
    <script>
        // ALL JAVASCRIPT HERE - make it functional
    </script>
</body>
</html>

Return ONLY the complete HTML code. No explanations.`
            : `You are an expert ${language} programmer. Generate COMPLETE, PRODUCTION-READY code.

CRITICAL REQUIREMENTS:
- Write COMPLETE code that works immediately - no placeholders, no TODOs, no "implement this"
- Include ALL necessary functions, classes, and logic
- Add proper error handling and edge cases
- Include helpful comments explaining complex parts
- Follow ${language} best practices and conventions
- Make the code clean, efficient, and maintainable
${framework !== 'none' ? `- Use ${framework} framework properly with all required imports/setup` : ''}
- Complexity level: ${complexity === 'beginner' ? 'Simple with detailed comments' : complexity === 'advanced' ? 'Optimized, scalable, with design patterns' : 'Production-ready with proper structure'}

Return ONLY the code in a markdown code block. No explanations outside the code block.`

        const prompt = isHTML
            ? `Create a COMPLETE, BEAUTIFUL, FULLY FUNCTIONAL HTML page for: ${description}

The page must:
1. Have a stunning visual design (modern CSS, shadows, gradients, animations)
2. Be 100% functional with all features working
3. Include ALL code embedded (CSS in <style>, JS in <script>)
4. Work immediately when opened in any browser

Return ONLY the complete HTML code.`
            : `Generate COMPLETE, WORKING ${language} code for: ${description}

Language: ${language}
${framework !== 'none' ? `Framework: ${framework}` : ''}
Complexity: ${complexity}

The code must be complete and work immediately - include all functions, classes, and logic needed.

Return ONLY the code in a markdown code block.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 4096 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate code. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
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
            result={result ? `${language.toUpperCase()} Code` : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What do you want to build? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Be specific! e.g., 'A fully functional calculator with buttons for +, -, ×, ÷, %, clear, and equals. Dark theme with orange accent color.'"
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

            {/* Tip for HTML */}
            {language === 'html' && (
                <div style={{
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #10b98120, #059669120)',
                    border: '1px solid #10b98140',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#10b981'
                }}>
                    💡 <strong>Tip:</strong> For HTML, we'll generate a complete page with embedded CSS & JavaScript that works immediately in any browser!
                </div>
            )}

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
                        Regenerate
                    </>
                ) : (
                    <>
                        <Code size={20} />
                        Generate Code
                    </>
                )}
            </button>

            {/* Code Preview */}
            <div ref={resultRef}>
                <CodePreview
                    code={result}
                    language={language}
                    filename={language === 'html' ? 'index' : 'code'}
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

export default AICodeGenerator
