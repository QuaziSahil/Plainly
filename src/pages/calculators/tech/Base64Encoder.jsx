import { useState, useMemo } from 'react'
import { Code } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function Base64Encoder() {
    const [mode, setMode] = useState('encode')
    const [input, setInput] = useState('Hello, World!')

    const result = useMemo(() => {
        try {
            if (mode === 'encode') {
                return btoa(unescape(encodeURIComponent(input)))
            } else {
                return decodeURIComponent(escape(atob(input)))
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
            title="Base64 Encoder/Decoder"
            description="Encode or decode Base64 strings"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={Code}
            result={result.length > 20 ? result.slice(0, 20) + '...' : result}
            resultLabel={mode === 'encode' ? 'Encoded' : 'Decoded'}
        >
            <div className="input-group">
                <label className="input-label">Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="encode">Encode to Base64</option>
                    <option value="decode">Decode from Base64</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">Input</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Output</label>
                <textarea
                    value={result}
                    readOnly
                    rows={4}
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

export default Base64Encoder
