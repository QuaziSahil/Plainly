import { useState, useRef } from 'react'
import { Database, Loader2, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import CodePreview from '../../../components/CodePreview/CodePreview'
import { askGroq } from '../../../services/groqAI'

function AISQLGenerator() {
    const [description, setDescription] = useState('')
    const [dbType, setDbType] = useState('mysql')
    const [tables, setTables] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const databases = [
        { value: 'mysql', label: 'MySQL' },
        { value: 'postgresql', label: 'PostgreSQL' },
        { value: 'sqlite', label: 'SQLite' },
        { value: 'sqlserver', label: 'SQL Server' },
        { value: 'oracle', label: 'Oracle' },
        { value: 'mongodb', label: 'MongoDB (NoSQL)' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe what data you want to query')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are an expert database engineer. Generate optimized SQL queries from natural language descriptions.

Rules:
- Use ${dbType} syntax
- Write clean, readable queries
- Include comments explaining the query
- Optimize for performance
${tables ? `- Use these table/column names: ${tables}` : '- Make reasonable assumptions about table structure'}
- IMPORTANT: Return ONLY the SQL query in a markdown code block. No extra explanations outside the code.`

        const prompt = `Generate a ${dbType} query for: ${description}

${tables ? `Table structure: ${tables}` : 'No table structure provided - make reasonable assumptions.'}

Return ONLY the SQL query in a markdown code block.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 1536 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate SQL. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setDescription('')
        setDbType('mysql')
        setTables('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI SQL Query Generator"
            description="Generate SQL queries from plain English"
            category="AI Tools"
            categoryPath="/ai"
            icon={Database}
            result={result ? `${dbType.toUpperCase()} Query` : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What data do you need? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Get all users who signed up in the last 30 days, Find top 10 products by sales, Count orders grouped by status..."
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

            {/* Database Type */}
            <div className="input-group">
                <label className="input-label">Database Type</label>
                <select value={dbType} onChange={(e) => setDbType(e.target.value)}>
                    {databases.map(db => (
                        <option key={db.value} value={db.value}>{db.label}</option>
                    ))}
                </select>
            </div>

            {/* Table Structure */}
            <div className="input-group">
                <label className="input-label">Table/Column names (optional)</label>
                <textarea
                    value={tables}
                    onChange={(e) => setTables(e.target.value)}
                    placeholder="e.g., users(id, name, email, created_at), orders(id, user_id, total, status)..."
                    rows={2}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: '#60a5fa',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                    }}
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
                        Generating Query...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Database size={20} />
                        Generate SQL
                    </>
                )}
            </button>

            {/* Code Preview */}
            <div ref={resultRef}>
                <CodePreview
                    code={result}
                    language="sql"
                    filename={`query`}
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

export default AISQLGenerator
