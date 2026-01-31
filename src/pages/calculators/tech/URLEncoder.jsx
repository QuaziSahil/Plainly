import { useState, useMemo } from 'react'
import { Link2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function URLEncoder() {
    const [mode, setMode] = useState('encode')
    const [input, setInput] = useState('Hello World! How are you?')

    const result = useMemo(() => {
        try {
            if (mode === 'encode') {
                return encodeURIComponent(input)
            } else {
                return decodeURIComponent(input)
            }
        } catch (e) {
            return 'Invalid input'
        }
    }, [mode, input])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result)
    }

    return (
        <CalculatorLayout
            title="URL Encoder/Decoder"
            description="Encode or decode URL strings"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={Link2}
            result={result.length > 20 ? result.slice(0, 20) + '...' : result}
            resultLabel={mode === 'encode' ? 'Encoded' : 'Decoded'}
        >
            <div className="input-group">
                <label className="input-label">Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="encode">Encode URL</option>
                    <option value="decode">Decode URL</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">Input</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={3}
                    placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL to decode...'}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Output</label>
                <textarea
                    value={result}
                    readOnly
                    rows={3}
                    style={{ background: '#1a1a2e' }}
                />
            </div>
            <button
                onClick={copyToClipboard}
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

export default URLEncoder
