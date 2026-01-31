import { useState } from 'react'
import { Baby, RefreshCw, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BabyNameGenerator() {
    const [gender, setGender] = useState('any')
    const [startsWith, setStartsWith] = useState('')
    const [style, setStyle] = useState('modern')
    const [names, setNames] = useState([])
    const [noResults, setNoResults] = useState(false)

    const nameData = {
        modern: {
            male: ['Liam', 'Noah', 'Oliver', 'Elijah', 'Lucas', 'Mason', 'Ethan', 'Aiden', 'Logan', 'Jackson', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore', 'Leo', 'Jayden', 'Asher', 'Wyatt', 'Carter', 'Blake', 'Brooks', 'Bennett', 'Bryson', 'Brandon', 'Brian', 'Bryce', 'Bradley', 'Beau', 'Beckett', 'Caleb', 'Connor', 'Daniel', 'Dylan', 'Finn', 'Grayson', 'Hudson', 'Isaiah', 'Jaxon', 'Kai', 'Lincoln', 'Miles', 'Nathan', 'Parker', 'Quinn', 'Ryan', 'Samuel', 'Tyler', 'Vincent', 'William', 'Xavier', 'Zachary'],
            female: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Luna', 'Harper', 'Evelyn', 'Aria', 'Ella', 'Chloe', 'Penelope', 'Riley', 'Layla', 'Zoey', 'Nora', 'Lily', 'Bella', 'Brooklyn', 'Brianna', 'Bailey', 'Brooke', 'Brielle', 'Bianca', 'Bethany', 'Blair', 'Brynn', 'Addison', 'Audrey', 'Claire', 'Elena', 'Gabriella', 'Hannah', 'Isla', 'Julia', 'Kennedy', 'Leah', 'Madison', 'Natalie', 'Paige', 'Ruby', 'Sadie', 'Taylor', 'Victoria', 'Willow', 'Zoe']
        },
        classic: {
            male: ['James', 'William', 'Henry', 'Alexander', 'Benjamin', 'Charles', 'Edward', 'George', 'Thomas', 'Robert', 'John', 'Arthur', 'Frederick', 'Richard', 'David', 'Michael', 'Joseph', 'Daniel', 'Matthew', 'Andrew', 'Bernard', 'Bartholomew', 'Benedict', 'Byron', 'Bradley', 'Albert', 'Christopher', 'Edmund', 'Francis', 'Gregory', 'Harold', 'Isaac', 'Jonathan', 'Kenneth', 'Lawrence', 'Nicholas', 'Oliver', 'Patrick', 'Quentin', 'Raymond', 'Stephen', 'Theodore', 'Vincent', 'Walter'],
            female: ['Elizabeth', 'Catherine', 'Margaret', 'Victoria', 'Eleanor', 'Grace', 'Rose', 'Caroline', 'Beatrice', 'Josephine', 'Helena', 'Adelaide', 'Louisa', 'Florence', 'Harriet', 'Alice', 'Clara', 'Emily', 'Sarah', 'Anna', 'Barbara', 'Bernadette', 'Bridget', 'Beverly', 'Bertha', 'Abigail', 'Charlotte', 'Diana', 'Edith', 'Frances', 'Gertrude', 'Henrietta', 'Irene', 'Jane', 'Katherine', 'Lillian', 'Martha', 'Nora', 'Ophelia', 'Prudence', 'Rebecca', 'Sylvia', 'Theresa', 'Ursula', 'Virginia', 'Winifred']
        },
        unique: {
            male: ['Jasper', 'Felix', 'Atlas', 'Kai', 'Finn', 'Oscar', 'Hugo', 'Axel', 'Rowan', 'Silas', 'Ezra', 'Milo', 'Bodhi', 'Orion', 'Zane', 'Phoenix', 'River', 'Sage', 'Jett', 'Knox', 'Blaze', 'Braxton', 'Boden', 'Brighton', 'Brixton', 'Bear', 'Arrow', 'Caspian', 'Dashiell', 'Everett', 'Fox', 'Griffin', 'Hendrix', 'Indigo', 'Jagger', 'Koda', 'Levi', 'Maddox', 'Neo', 'Onyx', 'Priest', 'Quest', 'Rogue', 'Storm', 'Titan', 'Uriel', 'Valor', 'Wolf', 'Xander', 'Zephyr'],
            female: ['Aurora', 'Iris', 'Ivy', 'Willow', 'Violet', 'Hazel', 'Sage', 'Nova', 'Wren', 'Freya', 'Juniper', 'Lilith', 'Opal', 'Dahlia', 'Meadow', 'Luna', 'Ember', 'Coral', 'Jasmine', 'Stella', 'Blossom', 'Briar', 'Bliss', 'Bexley', 'Bristol', 'Bellamy', 'Birdie', 'Azure', 'Celeste', 'Daphne', 'Echo', 'Fern', 'Gem', 'Haven', 'Indigo', 'Jade', 'Kira', 'Lyric', 'Maple', 'Nixie', 'Ocean', 'Pearl', 'Quinn', 'Raven', 'Serenity', 'Tempest', 'Unity', 'Velvet', 'Winter', 'Xena', 'Yara', 'Zara']
        }
    }

    const generateNames = () => {
        setNoResults(false)
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
            return
        }

        // Shuffle and take 6
        const shuffled = [...pool].sort(() => Math.random() - 0.5)
        setNames(shuffled.slice(0, Math.min(6, shuffled.length)))
    }

    const handleReset = () => {
        setGender('any')
        setStartsWith('')
        setStyle('modern')
        setNames([])
        setNoResults(false)
    }

    return (
        <CalculatorLayout
            title="Baby Name Generator"
            description="Generate baby name suggestions"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Baby}
            result={names.length > 0 ? names[0] : 'Generate!'}
            resultLabel="Top Pick"
            onReset={handleReset}
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
                    placeholder="e.g., A, B, Ch..."
                    maxLength={3}
                />
            </div>

            {/* Generate Button */}
            <button
                onClick={generateNames}
                type="button"
                style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}
            >
                {names.length > 0 ? <RefreshCw size={20} /> : <Sparkles size={20} />}
                {names.length > 0 ? '🔄 Regenerate Names' : '✨ Generate Names'}
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

            {/* Name Results */}
            {names.length > 0 && (
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
                                border: i === 0 ? '2px solid #8b5cf6' : '1px solid #444',
                                boxShadow: i === 0 ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, background 0.2s'
                            }}>
                                {i === 0 && '⭐ '}{name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {names.length === 0 && !noResults && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    👆 Click "Generate Names" to get started!
                </div>
            )}
        </CalculatorLayout>
    )
}

export default BabyNameGenerator


