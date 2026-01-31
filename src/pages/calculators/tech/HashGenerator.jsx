import { useState } from 'react'
import { Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function HashGenerator() {
    const [text, setText] = useState('Hello World')
    const [hashes, setHashes] = useState({})
    const [copied, setCopied] = useState('')

    const generateHashes = async () => {
        const encoder = new TextEncoder()
        const data = encoder.encode(text)

        const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
        const results = {}

        for (const algo of algorithms) {
            const hashBuffer = await crypto.subtle.digest(algo, data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
            results[algo] = hashHex
        }

        // Simple MD5-like hash (not cryptographic, for demo)
        let md5Like = 0
        for (let i = 0; i < text.length; i++) {
            md5Like = ((md5Like << 5) - md5Like) + text.charCodeAt(i)
            md5Like = md5Like & md5Like
        }
        results['Simple Hash'] = Math.abs(md5Like).toString(16).padStart(8, '0')

        setHashes(results)
    }

    const handleCopy = (hash) => {
        navigator.clipboard.writeText(hash)
        setCopied(hash)
        setTimeout(() => setCopied(''), 1500)
    }

    return (
        <CalculatorLayout
            title="Hash Generator"
            description="Generate SHA-1, SHA-256, SHA-512 hashes"
            category="Tech"
            categoryPath="/tech"
            icon={Hash}
            result={hashes['SHA-256']?.slice(0, 16) + '...' || 'Click Generate'}
            resultLabel="SHA-256"
        >
            <div className="input-group">
                <label className="input-label">Text to Hash</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder="Enter text to hash"
                />
            </div>
            <button onClick={generateHashes} style={{
                width: '100%',
                padding: '12px',
                background: '#333',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                marginBottom: '16px'
            }}>
                Generate Hashes
            </button>
            {Object.keys(hashes).length > 0 && (
                <div className="result-details">
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <div
                            key={algo}
                            className="result-detail-row"
                            onClick={() => handleCopy(hash)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="result-detail-label">{algo}</span>
                            <span className="result-detail-value" style={{
                                fontFamily: 'monospace',
                                fontSize: '10px',
                                wordBreak: 'break-all',
                                maxWidth: '200px'
                            }}>
                                {copied === hash ? '✓ Copied!' : hash.slice(0, 20) + '...'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default HashGenerator
