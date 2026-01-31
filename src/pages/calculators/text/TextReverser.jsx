import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TextReverser() {
    const [text, setText] = useState('Hello, World!')
    const [mode, setMode] = useState('characters')

    const result = useMemo(() => {
        if (!text) return ''

        if (mode === 'characters') {
            return text.split('').reverse().join('')
        } else if (mode === 'words') {
            return text.split(' ').reverse().join(' ')
        } else if (mode === 'lines') {
            return text.split('\n').reverse().join('\n')
        } else if (mode === 'sentences') {
            return text.split(/(?<=[.!?])\s+/).reverse().join(' ')
        }
        return text
    }, [text, mode])

    const copyResult = () => {
        navigator.clipboard.writeText(result)
    }

    return (
        <CalculatorLayout
            title="Text Reverser"
            description="Reverse text in different ways"
            category="Text"
            categoryPath="/calculators?category=Text"
            icon={ArrowUpDown}
            result={result.length > 20 ? result.slice(0, 20) + '...' : result}
            resultLabel="Reversed"
        >
            <div className="input-group">
                <label className="input-label">Reverse Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="characters">Characters</option>
                    <option value="words">Words</option>
                    <option value="lines">Lines</option>
                    <option value="sentences">Sentences</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">Original Text</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="Enter text to reverse..."
                />
            </div>
            <div className="input-group">
                <label className="input-label">Reversed Text</label>
                <textarea
                    value={result}
                    readOnly
                    rows={4}
                    style={{ background: '#1a1a2e' }}
                />
            </div>
            <button
                onClick={copyResult}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: '#a78bfa',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}
            >
                Copy Result
            </button>
        </CalculatorLayout>
    )
}

export default TextReverser
