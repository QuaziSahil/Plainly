import { useState, useRef } from 'react'
import { Users, Loader2, Copy, Check, RefreshCw, Target, Heart, Brain, Briefcase, MapPin, DollarSign } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

function AICustomerPersonaGenerator() {
    const [business, setBusiness] = useState('')
    const [product, setProduct] = useState('')
    const [industry, setIndustry] = useState('general')
    const [personaCount, setPersonaCount] = useState(3)
    const [personas, setPersonas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(null)
    const [activePersona, setActivePersona] = useState(0)
    const resultRef = useRef(null)

    const industries = [
        { value: 'general', label: 'General / All' },
        { value: 'b2b', label: 'B2B / Enterprise' },
        { value: 'b2c', label: 'B2C / Consumer' },
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'saas', label: 'SaaS / Software' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance / Fintech' },
        { value: 'education', label: 'Education' },
        { value: 'realestate', label: 'Real Estate' },
        { value: 'agency', label: 'Marketing Agency' }
    ]

    const handleGenerate = async () => {
        if (!business.trim()) {
            setError('Please describe your business')
            return
        }

        setLoading(true)
        setError('')
        setPersonas([])

        const systemPrompt = `You are an expert marketing strategist and customer research specialist with deep experience creating detailed buyer personas.

Create realistic, detailed buyer personas with:
- Specific demographics (name, age, location, income)
- Psychographics (values, fears, goals, pain points)
- Behavioral patterns (shopping habits, media consumption)
- Marketing recommendations

CRITICAL: Return ONLY valid JSON. No explanations, no markdown.`

        const prompt = `Create ${personaCount} detailed customer personas for:

Business: ${business}
${product ? `Product/Service: ${product}` : ''}
Industry Type: ${industries.find(i => i.value === industry)?.label}

For each persona, provide:
{
  "name": "Persona Name (realistic full name)",
  "title": "Job Title or Role",
  "age": 35,
  "location": "City, Country",
  "income": "$75,000 - $100,000",
  "education": "Bachelor's Degree",
  "status": "Married with 2 kids",
  "bio": "2-3 sentence background story",
  "goals": ["Goal 1", "Goal 2", "Goal 3"],
  "painPoints": ["Pain 1", "Pain 2", "Pain 3"],
  "fears": ["Fear 1", "Fear 2"],
  "values": ["Value 1", "Value 2", "Value 3"],
  "brands": ["Brand they use 1", "Brand 2"],
  "socialMedia": ["Platform 1", "Platform 2"],
  "buyingMotivations": ["What drives purchase decisions"],
  "objections": ["Common objections to buying"],
  "quote": "A quote this persona might say",
  "marketingChannels": ["Best channels to reach them"],
  "messagingTips": ["How to communicate with them"]
}

Return JSON array of ${personaCount} personas. Make each unique with different demographics.`

        try {
            const response = await askGroq(prompt, systemPrompt, {
                temperature: 0.85,
                maxTokens: 3000
            })

            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                setPersonas(parsed)
                setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to generate personas. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopyPersona = async (persona, index) => {
        const text = `
# ${persona.name} - Customer Persona

## Demographics
- Age: ${persona.age}
- Location: ${persona.location}
- Income: ${persona.income}
- Education: ${persona.education}
- Status: ${persona.status}

## Bio
${persona.bio}

## Goals
${persona.goals?.map(g => `- ${g}`).join('\n')}

## Pain Points
${persona.painPoints?.map(p => `- ${p}`).join('\n')}

## Values
${persona.values?.map(v => `- ${v}`).join('\n')}

## Quote
"${persona.quote}"

## Marketing Recommendations
### Best Channels
${persona.marketingChannels?.map(c => `- ${c}`).join('\n')}

### Messaging Tips
${persona.messagingTips?.map(t => `- ${t}`).join('\n')}
        `.trim()

        await navigator.clipboard.writeText(text)
        setCopied(`persona-${index}`)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleReset = () => {
        setBusiness('')
        setProduct('')
        setIndustry('general')
        setPersonaCount(3)
        setPersonas([])
        setError('')
        setActivePersona(0)
    }

    const persona = personas[activePersona]

    return (
        <CalculatorLayout
            title="AI Customer Persona Generator"
            description="Create detailed buyer personas to understand your target audience"
            category="AI Tools"
            categoryPath="/ai"
            icon={Users}
            result={personas.length > 0 ? `${personas.length} Personas` : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            {/* Business Input */}
            <div className="input-group">
                <label className="input-label">Your Business / Company *</label>
                <input
                    type="text"
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    placeholder="e.g., Online fitness coaching platform, B2B SaaS company..."
                    className="input-field"
                />
            </div>

            {/* Product Input */}
            <div className="input-group">
                <label className="input-label">Product / Service (optional)</label>
                <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g., Premium subscription, Enterprise software..."
                    className="input-field"
                />
            </div>

            {/* Industry & Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Industry</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                        {industries.map(i => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Personas</label>
                    <select value={personaCount} onChange={(e) => setPersonaCount(Number(e.target.value))}>
                        <option value={1}>1 Persona</option>
                        <option value={2}>2 Personas</option>
                        <option value={3}>3 Personas</option>
                        <option value={4}>4 Personas</option>
                        <option value={5}>5 Personas</option>
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
                disabled={loading || !business.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !business.trim() ? '#333' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !business.trim() ? 'not-allowed' : 'pointer',
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
                        Creating Personas...
                    </>
                ) : personas.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Personas
                    </>
                ) : (
                    <>
                        <Users size={20} />
                        Generate Personas
                    </>
                )}
            </button>

            {/* Results */}
            {personas.length > 0 && persona && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
                    {/* Persona Tabs */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px',
                        overflowX: 'auto',
                        paddingBottom: '8px'
                    }}>
                        {personas.map((p, index) => (
                            <button
                                key={index}
                                onClick={() => setActivePersona(index)}
                                style={{
                                    padding: '10px 16px',
                                    background: activePersona === index ? '#a78bfa' : '#21262d',
                                    border: activePersona === index ? '1px solid #a78bfa' : '1px solid #30363d',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    minHeight: '44px'
                                }}
                            >
                                {p.name?.split(' ')[0] || `Persona ${index + 1}`}
                            </button>
                        ))}
                    </div>

                    {/* Persona Card */}
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '16px',
                        border: '1px solid #333',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '24px',
                            background: 'linear-gradient(135deg, #a78bfa20 0%, #8b5cf620 100%)',
                            borderBottom: '1px solid #333',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '16px'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#e6edf3' }}>
                                    {persona.name}
                                </h3>
                                <p style={{ margin: '4px 0 0', color: '#a78bfa', fontSize: '14px' }}>
                                    {persona.title}
                                </p>
                                {persona.quote && (
                                    <p style={{
                                        margin: '16px 0 0',
                                        fontStyle: 'italic',
                                        color: '#8b949e',
                                        fontSize: '14px',
                                        maxWidth: '400px'
                                    }}>
                                        "{persona.quote}"
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => handleCopyPersona(persona, activePersona)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    background: copied === `persona-${activePersona}` ? '#10b981' : '#21262d',
                                    border: '1px solid #30363d',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    minHeight: '44px'
                                }}
                            >
                                {copied === `persona-${activePersona}` ? <Check size={16} /> : <Copy size={16} />}
                                {copied === `persona-${activePersona}` ? 'Copied!' : 'Copy Persona'}
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '24px' }}>
                            {/* Demographics Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '16px',
                                marginBottom: '24px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Users size={16} style={{ color: '#8b949e' }} />
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#8b949e' }}>Age</div>
                                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{persona.age} years old</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={16} style={{ color: '#8b949e' }} />
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#8b949e' }}>Location</div>
                                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{persona.location}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <DollarSign size={16} style={{ color: '#8b949e' }} />
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#8b949e' }}>Income</div>
                                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{persona.income}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Briefcase size={16} style={{ color: '#8b949e' }} />
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#8b949e' }}>Education</div>
                                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{persona.education}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            {persona.bio && (
                                <div style={{
                                    padding: '16px',
                                    background: '#0d1117',
                                    borderRadius: '12px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px', fontWeight: '600' }}>
                                        BACKGROUND
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#e6edf3' }}>
                                        {persona.bio}
                                    </p>
                                </div>
                            )}

                            {/* Goals, Pain Points, Values */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px',
                                marginBottom: '20px'
                            }}>
                                {/* Goals */}
                                <div style={{
                                    padding: '16px',
                                    background: '#10b98110',
                                    border: '1px solid #10b98130',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Target size={16} style={{ color: '#10b981' }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>GOALS</span>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#e6edf3', lineHeight: '1.8' }}>
                                        {persona.goals?.map((g, i) => <li key={i}>{g}</li>)}
                                    </ul>
                                </div>

                                {/* Pain Points */}
                                <div style={{
                                    padding: '16px',
                                    background: '#ef444410',
                                    border: '1px solid #ef444430',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Brain size={16} style={{ color: '#ef4444' }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444' }}>PAIN POINTS</span>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#e6edf3', lineHeight: '1.8' }}>
                                        {persona.painPoints?.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>

                                {/* Values */}
                                <div style={{
                                    padding: '16px',
                                    background: '#a78bfa10',
                                    border: '1px solid #a78bfa30',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <Heart size={16} style={{ color: '#a78bfa' }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#a78bfa' }}>VALUES</span>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#e6edf3', lineHeight: '1.8' }}>
                                        {persona.values?.map((v, i) => <li key={i}>{v}</li>)}
                                    </ul>
                                </div>
                            </div>

                            {/* Marketing Recommendations */}
                            <div style={{
                                padding: '16px',
                                background: '#f59e0b10',
                                border: '1px solid #f59e0b30',
                                borderRadius: '12px'
                            }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b', marginBottom: '12px' }}>
                                    🎯 MARKETING RECOMMENDATIONS
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '6px' }}>Best Channels</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {persona.marketingChannels?.map((c, i) => (
                                                <span key={i} style={{
                                                    padding: '4px 10px',
                                                    background: '#21262d',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: '#e6edf3'
                                                }}>
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '6px' }}>Social Media</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {persona.socialMedia?.map((s, i) => (
                                                <span key={i} style={{
                                                    padding: '4px 10px',
                                                    background: '#21262d',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: '#e6edf3'
                                                }}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default AICustomerPersonaGenerator
