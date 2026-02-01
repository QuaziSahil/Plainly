import { useState, useRef } from 'react'
import { Building2, Loader2, Copy, Check, Sparkles, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateAIBusinessNames } from '../../../services/groqAI'

function BusinessNameGenerator() {
    const [industry, setIndustry] = useState('')
    const [keywords, setKeywords] = useState('')
    const [style, setStyle] = useState('modern')
    const [names, setNames] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!industry.trim()) {
            setError('Please enter an industry or business type')
            return
        }

        setLoading(true)
        setError('')
        setNames([])

        try {
            const result = await generateAIBusinessNames(industry, keywords, style, 6)
            if (result && result.length > 0) {
                setNames(result)
            } else {
                setError('Failed to generate names. Please try again.')
            }
        } catch (err) {
            setError('Failed to generate. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async (text) => {
        await navigator.clipboard.writeText(text)
    }

    const handleReset = () => {
        setIndustry('')
        setKeywords('')
        setStyle('modern')
        setNames([])
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Business Name Generator"
            description="Generate creative brand names for your business"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Building2}
            result={names.length > 0 ? names[0].name : 'Generate!'}
            resultLabel="Top Pick"
            onReset={handleReset}
        >
            {/* Industry Input */}
            <div className="input-group">
                <label className="input-label">Industry / Business Type *</label>
                <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Tech startup, Coffee shop, Fitness app..."
                />
            </div>

            {/* Keywords */}
            <div className="input-group">
                <label className="input-label">Keywords (optional)</label>
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., fast, eco, premium, AI..."
                />
            </div>

            {/* Style */}
            <div className="input-group">
                <label className="input-label">Brand Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="modern">Modern & Trendy</option>
                    <option value="professional">Professional & Corporate</option>
                    <option value="playful">Fun & Playful</option>
                    <option value="minimal">Minimal & Clean</option>
                    <option value="luxury">Luxury & Premium</option>
                    <option value="tech">Tech & Innovative</option>
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
                disabled={loading || !industry.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !industry.trim() ? '#333' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !industry.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Generating...
                    </>
                ) : names.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate Names
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Business Names
                    </>
                )}
            </button>

            {/* Results */}
            {names.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {names.map((item, i) => (
                        <div key={`${item.name}-${i}`} style={{
                            background: i === 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#1a1a2e',
                            padding: '16px',
                            borderRadius: '12px',
                            border: i === 0 ? '2px solid #f59e0b' : '1px solid #333',
                            position: 'relative'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: i === 0 ? '20px' : '16px',
                                        fontWeight: 700,
                                        marginBottom: '4px'
                                    }}>
                                        {i === 0 && '⭐ '}{item.name}
                                    </div>
                                    {item.tagline && (
                                        <div style={{
                                            fontSize: '13px',
                                            opacity: 0.8,
                                            fontStyle: 'italic'
                                        }}>
                                            "{item.tagline}"
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleCopy(item.name)}
                                    style={{
                                        padding: '6px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {names.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    🏢 Enter your industry to generate brand name ideas
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

export default BusinessNameGenerator
