import { useState } from 'react'
import { Baby, RefreshCw, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BabyNameGenerator() {
    const [gender, setGender] = useState('any')
    const [startsWith, setStartsWith] = useState('')
    const [style, setStyle] = useState('modern')
    const [names, setNames] = useState([])

    const nameData = {
        modern: {
            male: ['Liam', 'Noah', 'Oliver', 'Elijah', 'Lucas', 'Mason', 'Ethan', 'Aiden', 'Logan', 'Jackson', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore', 'Leo', 'Jayden', 'Asher', 'Wyatt', 'Carter'],
            female: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Luna', 'Harper', 'Evelyn', 'Aria', 'Ella', 'Chloe', 'Penelope', 'Riley', 'Layla', 'Zoey', 'Nora', 'Lily']
        },
        classic: {
            male: ['James', 'William', 'Henry', 'Alexander', 'Benjamin', 'Charles', 'Edward', 'George', 'Thomas', 'Robert', 'John', 'Arthur', 'Frederick', 'Richard', 'David', 'Michael', 'Joseph', 'Daniel', 'Matthew', 'Andrew'],
            female: ['Elizabeth', 'Catherine', 'Margaret', 'Victoria', 'Eleanor', 'Grace', 'Rose', 'Caroline', 'Beatrice', 'Josephine', 'Helena', 'Adelaide', 'Louisa', 'Florence', 'Harriet', 'Alice', 'Clara', 'Emily', 'Sarah', 'Anna']
        },
        unique: {
            male: ['Jasper', 'Felix', 'Atlas', 'Kai', 'Finn', 'Oscar', 'Hugo', 'Axel', 'Rowan', 'Silas', 'Ezra', 'Milo', 'Bodhi', 'Orion', 'Zane', 'Phoenix', 'River', 'Sage', 'Jett', 'Knox'],
            female: ['Aurora', 'Iris', 'Ivy', 'Willow', 'Violet', 'Hazel', 'Sage', 'Nova', 'Wren', 'Freya', 'Juniper', 'Lilith', 'Opal', 'Dahlia', 'Meadow', 'Luna', 'Ember', 'Coral', 'Jasmine', 'Stella']
        }
    }

    const generateNames = () => {
        let pool = []
        const styleNames = nameData[style]

        if (gender === 'male' || gender === 'any') {
            pool = [...pool, ...styleNames.male]
        }
        if (gender === 'female' || gender === 'any') {
            pool = [...pool, ...styleNames.female]
        }

        if (startsWith) {
            pool = pool.filter(n => n.toLowerCase().startsWith(startsWith.toLowerCase()))
        }

        // Shuffle and take 6
        const shuffled = pool.sort(() => Math.random() - 0.5)
        setNames(shuffled.slice(0, 6))
    }

    return (
        <CalculatorLayout
            title="Baby Name Generator"
            description="Generate baby name suggestions"
            category="Fun"
            categoryPath="/fun"
            icon={Baby}
            result={names.length > 0 ? names[0] : 'Generate!'}
            resultLabel="Top Pick"
        >
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
                    placeholder="e.g., A"
                    maxLength={2}
                />
            </div>

            {/* Generate / Regenerate Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button onClick={generateNames} style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                    <Sparkles size={18} />
                    {names.length > 0 ? 'Generate New' : 'Generate Names'}
                </button>

                {names.length > 0 && (
                    <button onClick={generateNames} style={{
                        padding: '14px 18px',
                        background: '#333',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                    }} title="Regenerate">
                        <RefreshCw size={18} />
                    </button>
                )}
            </div>

            {/* Name Results */}
            {names.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                    <div style={{
                        fontSize: '12px',
                        opacity: 0.6,
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Suggestions
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {names.map((name, i) => (
                            <div key={i} style={{
                                background: i === 0 ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#222',
                                padding: i === 0 ? '14px 24px' : '10px 18px',
                                borderRadius: '24px',
                                fontSize: i === 0 ? '18px' : '14px',
                                fontWeight: i === 0 ? '600' : '400',
                                border: i === 0 ? 'none' : '1px solid #333',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, background 0.2s'
                            }}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {names.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '32px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    Click "Generate Names" to get started!
                </div>
            )}
        </CalculatorLayout>
    )
}

export default BabyNameGenerator

