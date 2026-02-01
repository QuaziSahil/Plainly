import { useState, useRef } from 'react'
import { Search, Loader2, TrendingUp, Copy, Check, RefreshCw, Target, BarChart3, Globe, Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

function AISEOKeywordResearch() {
    const [topic, setTopic] = useState('')
    const [industry, setIndustry] = useState('general')
    const [intent, setIntent] = useState('all')
    const [difficulty, setDifficulty] = useState('all')
    const [keywords, setKeywords] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(null)
    const resultRef = useRef(null)

    const industries = [
        { value: 'general', label: 'All Industries' },
        { value: 'ecommerce', label: 'E-commerce / Retail' },
        { value: 'saas', label: 'SaaS / Software' },
        { value: 'healthcare', label: 'Healthcare / Medical' },
        { value: 'finance', label: 'Finance / Banking' },
        { value: 'education', label: 'Education / Learning' },
        { value: 'travel', label: 'Travel / Hospitality' },
        { value: 'realestate', label: 'Real Estate' },
        { value: 'food', label: 'Food / Restaurant' },
        { value: 'fitness', label: 'Fitness / Wellness' },
        { value: 'tech', label: 'Technology / IT' },
        { value: 'marketing', label: 'Marketing / Advertising' }
    ]

    const intents = [
        { value: 'all', label: 'All Intent Types' },
        { value: 'informational', label: 'Informational (how to, what is...)' },
        { value: 'commercial', label: 'Commercial (best, review, compare...)' },
        { value: 'transactional', label: 'Transactional (buy, order, get...)' },
        { value: 'navigational', label: 'Navigational (brand, login, app...)' }
    ]

    const difficulties = [
        { value: 'all', label: 'All Difficulty Levels' },
        { value: 'easy', label: 'Easy (Low competition)' },
        { value: 'medium', label: 'Medium (Moderate competition)' },
        { value: 'hard', label: 'Hard (High competition)' }
    ]

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic or seed keyword')
            return
        }

        setLoading(true)
        setError('')
        setKeywords([])

        const systemPrompt = `You are an expert SEO specialist with deep knowledge of keyword research, search intent, and competition analysis.

Generate comprehensive keyword research data. For each keyword provide:
1. The keyword itself
2. Search intent (informational/commercial/transactional/navigational)
3. Difficulty score (1-100)
4. Estimated monthly search volume
5. CPC estimate in USD
6. Trend direction (up/down/stable)
7. Long-tail variations

CRITICAL: Return ONLY valid JSON array. No explanations, no markdown.`

        const prompt = `Generate 15 highly relevant SEO keywords for: "${topic}"
        
Industry: ${industry === 'general' ? 'Any industry' : industries.find(i => i.value === industry)?.label}
${intent !== 'all' ? `Filter by intent: ${intent}` : ''}
${difficulty !== 'all' ? `Filter by difficulty: ${difficulty}` : ''}

Return JSON array with this exact structure:
[
  {
    "keyword": "example keyword",
    "intent": "informational",
    "difficulty": 45,
    "volume": "2.4K",
    "cpc": "$1.20",
    "trend": "up",
    "longTail": ["example long tail 1", "example long tail 2"]
  }
]

Include:
- Primary keywords (2-3 words)
- Long-tail keywords (4+ words)
- Question-based keywords
- Commercial intent keywords
- Related semantic keywords

Return ONLY the JSON array.`

        try {
            const response = await askGroq(prompt, systemPrompt, {
                temperature: 0.7,
                maxTokens: 2000
            })

            // Parse JSON
            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                setKeywords(parsed)
                setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to generate keywords. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async (text, id) => {
        await navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleCopyAll = async () => {
        const text = keywords.map(k => k.keyword).join('\n')
        await navigator.clipboard.writeText(text)
        setCopied('all')
        setTimeout(() => setCopied(null), 2000)
    }

    const handleExportCSV = () => {
        const headers = ['Keyword', 'Intent', 'Difficulty', 'Volume', 'CPC', 'Trend', 'Long Tail']
        const rows = keywords.map(k => [
            k.keyword,
            k.intent,
            k.difficulty,
            k.volume,
            k.cpc,
            k.trend,
            k.longTail?.join('; ') || ''
        ])
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `seo-keywords-${topic.replace(/\s+/g, '-')}.csv`
        a.click()
    }

    const getDifficultyColor = (score) => {
        if (score < 30) return '#10b981'
        if (score < 60) return '#f59e0b'
        return '#ef4444'
    }

    const getTrendIcon = (trend) => {
        if (trend === 'up') return '📈'
        if (trend === 'down') return '📉'
        return '➡️'
    }

    const getIntentBadge = (intent) => {
        const colors = {
            informational: { bg: '#3b82f620', color: '#3b82f6' },
            commercial: { bg: '#f59e0b20', color: '#f59e0b' },
            transactional: { bg: '#10b98120', color: '#10b981' },
            navigational: { bg: '#8b5cf620', color: '#8b5cf6' }
        }
        return colors[intent] || colors.informational
    }

    const handleReset = () => {
        setTopic('')
        setIndustry('general')
        setIntent('all')
        setDifficulty('all')
        setKeywords([])
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI SEO Keyword Research"
            description="Find high-ranking keyword opportunities with AI-powered analysis"
            category="AI Tools"
            categoryPath="/ai"
            icon={Search}
            result={keywords.length > 0 ? `${keywords.length} Keywords` : 'Ready'}
            resultLabel="Found"
            onReset={handleReset}
        >
            {/* Topic Input */}
            <div className="input-group">
                <label className="input-label">Topic or Seed Keyword *</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., project management software, yoga for beginners..."
                    className="input-field"
                />
            </div>

            {/* Industry Filter */}
            <div className="input-group">
                <label className="input-label">Industry Focus</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    {industries.map(i => (
                        <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                </select>
            </div>

            {/* Two-column filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Search Intent</label>
                    <select value={intent} onChange={(e) => setIntent(e.target.value)}>
                        {intents.map(i => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        {difficulties.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
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
                    marginTop: '16px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px',
                    minHeight: '52px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Researching Keywords...
                    </>
                ) : keywords.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        Find More Keywords
                    </>
                ) : (
                    <>
                        <Search size={20} />
                        Research Keywords
                    </>
                )}
            </button>

            {/* Results */}
            {keywords.length > 0 && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
                    {/* Stats Bar */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '12px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            background: '#1a1a2e',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #333',
                            textAlign: 'center'
                        }}>
                            <Target size={20} style={{ color: '#10b981', marginBottom: '8px' }} />
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>{keywords.length}</div>
                            <div style={{ fontSize: '12px', color: '#8b949e' }}>Keywords</div>
                        </div>
                        <div style={{
                            background: '#1a1a2e',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #333',
                            textAlign: 'center'
                        }}>
                            <BarChart3 size={20} style={{ color: '#f59e0b', marginBottom: '8px' }} />
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>
                                {Math.round(keywords.reduce((a, k) => a + k.difficulty, 0) / keywords.length)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b949e' }}>Avg Difficulty</div>
                        </div>
                        <div style={{
                            background: '#1a1a2e',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #333',
                            textAlign: 'center'
                        }}>
                            <TrendingUp size={20} style={{ color: '#3b82f6', marginBottom: '8px' }} />
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>
                                {keywords.filter(k => k.trend === 'up').length}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b949e' }}>Trending Up</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={handleCopyAll}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 16px',
                                background: copied === 'all' ? '#10b981' : '#21262d',
                                border: '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '14px',
                                cursor: 'pointer',
                                minHeight: '44px'
                            }}
                        >
                            {copied === 'all' ? <Check size={16} /> : <Copy size={16} />}
                            {copied === 'all' ? 'Copied!' : 'Copy All'}
                        </button>
                        <button
                            onClick={handleExportCSV}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 16px',
                                background: '#21262d',
                                border: '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '14px',
                                cursor: 'pointer',
                                minHeight: '44px'
                            }}
                        >
                            <Globe size={16} />
                            Export CSV
                        </button>
                    </div>

                    {/* Keywords Table */}
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        overflow: 'hidden'
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 80px 80px 80px',
                            gap: '12px',
                            padding: '12px 16px',
                            background: '#0d1117',
                            borderBottom: '1px solid #333',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#8b949e'
                        }}>
                            <span>Keyword</span>
                            <span>Intent</span>
                            <span>Difficulty</span>
                            <span>Volume</span>
                            <span>CPC</span>
                        </div>

                        {/* Keywords List */}
                        {keywords.map((kw, index) => (
                            <div
                                key={index}
                                style={{
                                    borderBottom: index < keywords.length - 1 ? '1px solid #21262d' : 'none'
                                }}
                            >
                                {/* Main Row */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 80px 80px 80px',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    alignItems: 'center'
                                }}>
                                    {/* Keyword */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>{getTrendIcon(kw.trend)}</span>
                                        <button
                                            onClick={() => handleCopy(kw.keyword, index)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#e6edf3',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                textAlign: 'left',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            {kw.keyword}
                                            {copied === index && <Check size={12} style={{ color: '#10b981' }} />}
                                        </button>
                                    </div>

                                    {/* Intent Badge */}
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        background: getIntentBadge(kw.intent).bg,
                                        color: getIntentBadge(kw.intent).color,
                                        textTransform: 'capitalize',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {kw.intent}
                                    </span>

                                    {/* Difficulty */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '6px',
                                            background: '#333',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${kw.difficulty}%`,
                                                height: '100%',
                                                background: getDifficultyColor(kw.difficulty),
                                                borderRadius: '3px'
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '12px', color: getDifficultyColor(kw.difficulty) }}>
                                            {kw.difficulty}
                                        </span>
                                    </div>

                                    {/* Volume */}
                                    <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                        {kw.volume}
                                    </span>

                                    {/* CPC */}
                                    <span style={{ fontSize: '13px', color: '#10b981' }}>
                                        {kw.cpc}
                                    </span>
                                </div>

                                {/* Long Tail Keywords */}
                                {kw.longTail && kw.longTail.length > 0 && (
                                    <div style={{
                                        padding: '0 16px 14px 40px',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px'
                                    }}>
                                        {kw.longTail.map((lt, ltIndex) => (
                                            <button
                                                key={ltIndex}
                                                onClick={() => handleCopy(lt, `${index}-${ltIndex}`)}
                                                style={{
                                                    padding: '4px 10px',
                                                    background: '#21262d',
                                                    border: '1px solid #30363d',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: '#8b949e',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <Zap size={10} />
                                                {lt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pro Tips */}
                    <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        background: '#10b98110',
                        border: '1px solid #10b98130',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>
                            💡 SEO Tips
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#8b949e', lineHeight: '1.6' }}>
                            <li>Target keywords with difficulty under 40 for new sites</li>
                            <li>Commercial intent keywords convert better</li>
                            <li>Trending keywords offer growth opportunities</li>
                            <li>Use long-tail keywords for lower competition</li>
                        </ul>
                    </div>
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

export default AISEOKeywordResearch
