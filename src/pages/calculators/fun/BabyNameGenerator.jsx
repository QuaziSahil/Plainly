import { useState, useMemo } from 'react'
import { Baby } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BabyNameGenerator() {
    const [gender, setGender] = useState('any')
    const [startsWith, setStartsWith] = useState('')
    const [style, setStyle] = useState('modern')
    const [names, setNames] = useState([])

    const nameData = {
        modern: {
            male: ['Liam', 'Noah', 'Oliver', 'Elijah', 'Lucas', 'Mason', 'Ethan', 'Aiden', 'Logan', 'Jackson', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore'],
            female: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Luna', 'Harper', 'Evelyn', 'Aria', 'Ella', 'Chloe', 'Penelope']
        },
        classic: {
            male: ['James', 'William', 'Henry', 'Alexander', 'Benjamin', 'Charles', 'Edward', 'George', 'Thomas', 'Robert', 'John', 'Arthur', 'Frederick', 'Richard', 'David'],
            female: ['Elizabeth', 'Catherine', 'Margaret', 'Victoria', 'Eleanor', 'Grace', 'Rose', 'Caroline', 'Beatrice', 'Josephine', 'Helena', 'Adelaide', 'Louisa', 'Florence', 'Harriet']
        },
        unique: {
            male: ['Jasper', 'Felix', 'Atlas', 'Kai', 'Finn', 'Oscar', 'Hugo', 'Axel', 'Rowan', 'Silas', 'Ezra', 'Milo', 'Bodhi', 'Orion', 'Zane'],
            female: ['Aurora', 'Iris', 'Ivy', 'Willow', 'Violet', 'Hazel', 'Sage', 'Nova', 'Wren', 'Freya', 'Juniper', 'Lilith', 'Opal', 'Dahlia', 'Meadow']
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

        // Shuffle and take 5
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
            <button onClick={generateNames} style={{
                width: '100%',
                padding: '14px',
                background: '#333',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '16px'
            }}>
                ✨ Generate Names
            </button>
            {names.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {names.map((name, i) => (
                        <div key={i} style={{
                            background: i === 0 ? '#333' : '#222',
                            padding: '12px 20px',
                            borderRadius: '20px',
                            fontSize: i === 0 ? '18px' : '14px',
                            fontWeight: i === 0 ? 'bold' : 'normal'
                        }}>
                            {name}
                        </div>
                    ))}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default BabyNameGenerator
