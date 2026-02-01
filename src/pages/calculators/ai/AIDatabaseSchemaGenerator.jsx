import { useState, useRef } from 'react'
import { Database, Loader2, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import CodePreview from '../../../components/CodePreview/CodePreview'
import { askGroq } from '../../../services/groqAI'

function AIDatabaseSchemaGenerator() {
    const [description, setDescription] = useState('')
    const [dbType, setDbType] = useState('postgresql')
    const [includeIndexes, setIncludeIndexes] = useState(true)
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const dbTypes = [
        { value: 'postgresql', label: 'PostgreSQL' },
        { value: 'mysql', label: 'MySQL' },
        { value: 'sqlserver', label: 'SQL Server' },
        { value: 'sqlite', label: 'SQLite' },
        { value: 'mongodb', label: 'MongoDB (NoSQL)' }
    ]

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe your database requirements')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        const systemPrompt = `You are a database architect. Design efficient, normalized database schemas.

Database: ${dbType}

Rules:
- Use proper data types
- Apply normalization (3NF)
- Include primary and foreign keys
- ${includeIndexes ? 'Add index recommendations for performance' : 'Skip index recommendations'}
- Consider relationships (one-to-one, one-to-many, many-to-many)
- Add constraints (NOT NULL, UNIQUE, CHECK)
- IMPORTANT: Return ONLY the SQL schema code in a markdown code block. No extra explanations.`

        const prompt = `Design a ${dbType} database schema for:

${description}

Return ONLY the complete SQL schema in a markdown code block.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 2048 })
            setResult(response)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate schema. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setDescription('')
        setDbType('postgresql')
        setIncludeIndexes(true)
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Database Schema Generator"
            description="Design efficient database schemas"
            category="AI Tools"
            categoryPath="/ai"
            icon={Database}
            result={result ? `${dbType.toUpperCase()} Schema` : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Description Input */}
            <div className="input-group">
                <label className="input-label">What data do you need to store? *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., An e-commerce platform with users, products, orders, reviews, categories, and shopping cart..."
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

            {/* Database Type */}
            <div className="input-group">
                <label className="input-label">Database Type</label>
                <select value={dbType} onChange={(e) => setDbType(e.target.value)}>
                    {dbTypes.map(db => (
                        <option key={db.value} value={db.value}>{db.label}</option>
                    ))}
                </select>
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
                        checked={includeIndexes}
                        onChange={(e) => setIncludeIndexes(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                    />
                    Include Index Recommendations
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
                    background: loading || !description.trim() ? '#333' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
                        Designing Schema...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Database size={20} />
                        Generate Schema
                    </>
                )}
            </button>

            {/* Code Preview */}
            <div ref={resultRef}>
                <CodePreview
                    code={result}
                    language="sql"
                    filename={`schema`}
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

export default AIDatabaseSchemaGenerator
