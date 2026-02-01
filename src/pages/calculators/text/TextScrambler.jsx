import { useState, useEffect, useCallback } from 'react'
import { Shuffle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TextScrambler() {
    const [text, setText] = useState('The quick brown fox jumps over the lazy dog')
    const [mode, setMode] = useState('words')
    const [displayedScramble, setDisplayedScramble] = useState('')

    const scrambleWord = useCallback((word) => {
        if (word.length <= 3) return word
        const first = word[0]
        const last = word[word.length - 1]
        const middle = word.slice(1, -1).split('')

        for (let i = middle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [middle[i], middle[j]] = [middle[j], middle[i]]
        }

        return first + middle.join('') + last
    }, [])

    const performScramble = useCallback(() => {
        if (!text) {
            setDisplayedScramble('')
            return
        }

        let result
        if (mode === 'words') {
            const words = text.split(' ')
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]]
            }
            result = words.join(' ')
        } else if (mode === 'letters') {
            result = text.split(' ').map(word => scrambleWord(word)).join(' ')
        } else if (mode === 'full') {
            const chars = text.split('')
            for (let i = chars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [chars[i], chars[j]] = [chars[j], chars[i]]
            }
            result = chars.join('')
        } else {
            result = text
        }
        setDisplayedScramble(result)
    }, [text, mode, scrambleWord])

    // Initial scramble and when text/mode changes
    useEffect(() => {
        performScramble()
    }, [performScramble])

    const copyResult = () => {
        navigator.clipboard.writeText(displayedScramble)
    }

    return (
        <CalculatorLayout
            title="Text Scrambler"
            description="Scramble words or letters"
            category="Text"
            categoryPath="/calculators?category=Text"
            icon={Shuffle}
            result={displayedScramble.length > 20 ? displayedScramble.substring(0, 20) + '...' : displayedScramble}
            resultLabel="Scrambled"
        >
            <div className="input-group">
                <label className="input-label">Scramble Mode</label>
                <select value={mode} onChange={(e) => { setMode(e.target.value) }}>
                    <option value="words">Shuffle Word Order</option>
                    <option value="letters">Scramble Letters (Cambridge style)</option>
                    <option value="full">Full Character Scramble</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">Original Text</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder="Enter text to scramble..."
                />
            </div>
            <button
                onClick={performScramble}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: '#a78bfa',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '16px',
                    fontSize: '15px'
                }}
            >
                🔀 Scramble Again
            </button>
            <div className="input-group">
                <label className="input-label">Scrambled Text</label>
                <textarea
                    value={displayedScramble}
                    readOnly
                    rows={3}
                    style={{ background: '#1a1a2e' }}
                />
            </div>
            <button
                onClick={copyResult}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: '#333',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer'
                }}
            >
                📋 Copy Scrambled Text
            </button>
            {mode === 'letters' && (
                <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#1a1a2e',
                    borderRadius: '8px',
                    fontSize: '12px',
                    opacity: 0.8
                }}>
                    💡 Cambridge-style scrambling keeps the first and last letters in place.
                    Raeding tihs is slitl pssoible!
                </div>
            )}
        </CalculatorLayout>
    )
}

export default TextScrambler
