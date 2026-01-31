import { useState } from 'react'
import { Baby, RefreshCw, Sparkles, Loader2, Wand2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateAIBabyNames } from '../../../services/groqAI'

function BabyNameGenerator() {
    const [gender, setGender] = useState('any')
    const [startsWith, setStartsWith] = useState('')
    const [style, setStyle] = useState('modern')
    const [names, setNames] = useState([])
    const [aiNames, setAiNames] = useState([])
    const [noResults, setNoResults] = useState(false)
    const [loading, setLoading] = useState(false)
    const [useAI, setUseAI] = useState(true)

    // Fallback static names
    const nameData = {
        modern: {
            male: ['Liam', 'Noah', 'Oliver', 'Elijah', 'Lucas', 'Mason', 'Ethan', 'Aiden', 'Logan', 'Jackson', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore', 'Leo', 'Jayden', 'Asher', 'Wyatt', 'Carter', 'Blake', 'Brooks', 'Bennett', 'Bryson', 'Brandon', 'Brian', 'Bryce', 'Bradley', 'Beau', 'Beckett'],
            female: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Luna', 'Harper', 'Evelyn', 'Aria', 'Ella', 'Chloe', 'Penelope', 'Riley', 'Layla', 'Zoey', 'Nora', 'Lily', 'Bella', 'Brooklyn', 'Brianna', 'Bailey', 'Brooke', 'Brielle', 'Bianca', 'Bethany', 'Blair', 'Brynn']
        },
        classic: {
            male: ['James', 'William', 'Henry', 'Alexander', 'Benjamin', 'Charles', 'Edward', 'George', 'Thomas', 'Robert', 'John', 'Arthur', 'Frederick', 'Richard', 'David', 'Michael', 'Joseph', 'Daniel', 'Matthew', 'Andrew', 'Bernard', 'Bartholomew', 'Benedict', 'Byron', 'Bradley'],
            female: ['Elizabeth', 'Catherine', 'Margaret', 'Victoria', 'Eleanor', 'Grace', 'Rose', 'Caroline', 'Beatrice', 'Josephine', 'Helena', 'Adelaide', 'Louisa', 'Florence', 'Harriet', 'Alice', 'Clara', 'Emily', 'Sarah', 'Anna', 'Barbara', 'Bernadette', 'Bridget', 'Beverly', 'Bertha']
        },
        unique: {
            male: ['Jasper', 'Felix', 'Atlas', 'Kai', 'Finn', 'Oscar', 'Hugo', 'Axel', 'Rowan', 'Silas', 'Ezra', 'Milo', 'Bodhi', 'Orion', 'Zane', 'Phoenix', 'River', 'Sage', 'Jett', 'Knox', 'Blaze', 'Braxton', 'Boden', 'Brighton', 'Brixton', 'Bear'],
            female: ['Aurora', 'Iris', 'Ivy', 'Willow', 'Violet', 'Hazel', 'Sage', 'Nova', 'Wren', 'Freya', 'Juniper', 'Lilith', 'Opal', 'Dahlia', 'Meadow', 'Luna', 'Ember', 'Coral', 'Jasmine', 'Stella', 'Blossom', 'Briar', 'Bliss', 'Bexley', 'Bristol', 'Bellamy']
        }
    }

    const generateNames = async () => {
        setNoResults(false)
        setLoading(true)
        setAiNames([])

        // Try AI generation first if enabled
        if (useAI) {
            try {
                const aiResult = await generateAIBabyNames(gender, style, startsWith, 6)
                if (aiResult && aiResult.length > 0) {
                    setAiNames(aiResult)
                    setNames([])
                    setLoading(false)
                    return
                }
            } catch (error) {
                console.log('AI generation failed, falling back to static names')
            }
        }

        // Fallback to static names
        let pool = []
        const styleNames = nameData[style]

        if (gender === 'male' || gender === 'any') {
            pool = [...pool, ...styleNames.male]
        }
        if (gender === 'female' || gender === 'any') {
            pool = [...pool, ...styleNames.female]
        }

        if (startsWith && startsWith.trim()) {
            pool = pool.filter(n => n.toLowerCase().startsWith(startsWith.toLowerCase().trim()))
        }

        if (pool.length === 0) {
            setNoResults(true)
            setNames([])
            setLoading(false)
            return
        }

        const shuffled = [...pool].sort(() => Math.random() - 0.5)
        setNames(shuffled.slice(0, Math.min(6, shuffled.length)))
        setLoading(false)
    }

    const handleReset = () => {
        setGender('any')
        setStartsWith('')
        setStyle('modern')
        setNames([])
        setAiNames([])
        setNoResults(false)
    }

    const displayNames = aiNames.length > 0 ? aiNames : names.map(n => ({ name: n }))

    return (
        <CalculatorLayout
            title="Baby Name Generator"
            description="AI-powered baby name suggestions"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Baby}
            result={displayNames.length > 0 ? displayNames[0].name : 'Generate!'}
            resultLabel="Top Pick"
            onReset={handleReset}
        >
            {/* AI Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: useAI ? 'linear-gradient(135deg, #6366f120 0%, #8b5cf620 100%)' : '#1a1a1a',
                borderRadius: '12px',
                marginBottom: '16px',
                border: useAI ? '1px solid #6366f140' : '1px solid #333'
            }}>
                <Wand2 size={20} color={useAI ? '#8b5cf6' : '#666'} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                        {useAI ? '✨ AI-Powered' : 'Standard Mode'}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>
                        {useAI ? 'Creative names with meanings & origins' : 'Random names from preset list'}
                    </div>
                </div>
                <button
                    onClick={() => setUseAI(!useAI)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: useAI ? '#8b5cf6' : '#333',
                        color: 'white',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    {useAI ? 'ON' : 'OFF'}
                </button>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="any">Any</option>
                        <option value="male">Boy</option>
                        <option value="female">Girl</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Style</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value)}>
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="unique">Unique</option>
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Starts With (optional)</label>
                <input
                    type="text"
                    value={startsWith}
                    onChange={(e) => setStartsWith(e.target.value)}
                    placeholder="e.g., A, B, Ch..."
                    maxLength={3}
                />
            </div>

            {/* Generate Button */}
            <button
                onClick={generateNames}
                type="button"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? '#333' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading ? 'wait' : 'pointer',
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
                        <Loader2 size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                        Generating...
                    </>
                ) : displayNames.length > 0 ? (
                    <>
                        <RefreshCw size={20} />
                        🔄 Regenerate Names
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        {useAI ? '✨ Generate with AI' : '✨ Generate Names'}
                    </>
                )}
            </button>

            {/* No Results Message */}
            {noResults && (
                <div style={{
                    background: '#f59e0b20',
                    border: '1px solid #f59e0b40',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '16px'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤔</div>
                    <div style={{ fontWeight: 600, color: '#f59e0b' }}>No names found!</div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                        Try a different letter or style
                    </div>
                </div>
            )}

            {/* AI Name Results */}
            {aiNames.length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #6366f140'
                }}>
                    <div style={{
                        fontSize: '12px',
                        opacity: 0.8,
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <Wand2 size={14} color="#8b5cf6" />
                        AI-Generated Names
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {aiNames.map((item, i) => (
                            <div key={`${item.name}-${i}`} style={{
                                background: i === 0 ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#2a2a3e',
                                padding: '16px',
                                borderRadius: '12px',
                                border: i === 0 ? '2px solid #8b5cf6' : '1px solid #444',
                                boxShadow: i === 0 ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
                            }}>
                                <div style={{
                                    fontSize: i === 0 ? '22px' : '18px',
                                    fontWeight: 700,
                                    marginBottom: '4px'
                                }}>
                                    {i === 0 && '⭐ '}{item.name}
                                </div>
                                {item.meaning && (
                                    <div style={{ fontSize: '13px', opacity: 0.8 }}>
                                        💡 {item.meaning}
                                    </div>
                                )}
                                {item.origin && (
                                    <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                                        🌍 Origin: {item.origin}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Static Name Results */}
            {names.length > 0 && aiNames.length === 0 && (
                <div style={{
                    background: '#1a1a2e',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #333'
                }}>
                    <div style={{
                        fontSize: '12px',
                        opacity: 0.6,
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        ✨ {names.length} Suggestions
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {names.map((name, i) => (
                            <div key={`${name}-${i}`} style={{
                                background: i === 0 ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#2a2a3e',
                                padding: i === 0 ? '14px 28px' : '10px 20px',
                                borderRadius: '24px',
                                fontSize: i === 0 ? '20px' : '15px',
                                fontWeight: i === 0 ? '700' : '500',
                                border: i === 0 ? '2px solid #8b5cf6' : '1px solid #444'
                            }}>
                                {i === 0 && '⭐ '}{name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {displayNames.length === 0 && !noResults && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    👆 Click "Generate" to get {useAI ? 'AI-powered' : ''} name suggestions!
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

export default BabyNameGenerator
