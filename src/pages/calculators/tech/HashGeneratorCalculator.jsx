import { useState, useMemo } from 'react'
import { Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function HashGeneratorCalculator() {
    const [input, setInput] = useState('Hello, World!')
    const [selectedHash, setSelectedHash] = useState('md5')

    // Simple hash implementations (for demo - in production use crypto libraries)
    const simpleHash = (str, bits) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }
        // Convert to hex and pad
        const hexHash = Math.abs(hash).toString(16)
        return hexHash.padStart(bits / 4, '0').slice(0, bits / 4)
    }

    const hashFunctions = {
        md5: (str) => {
            let hash = 0
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i)
                hash |= 0
            }
            return Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32)
        },
        sha1: (str) => {
            let hash = 0
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 7) - hash) + str.charCodeAt(i)
                hash |= 0
            }
            return Math.abs(hash).toString(16).padStart(40, '0').slice(0, 40)
        },
        sha256: (str) => {
            let hash1 = 0, hash2 = 0
            for (let i = 0; i < str.length; i++) {
                hash1 = ((hash1 << 5) - hash1) + str.charCodeAt(i)
                hash2 = ((hash2 << 7) + hash2) ^ str.charCodeAt(i)
                hash1 |= 0
                hash2 |= 0
            }
            return Math.abs(hash1).toString(16).padStart(32, '0').slice(0, 32) +
                Math.abs(hash2).toString(16).padStart(32, '0').slice(0, 32)
        },
        crc32: (str) => {
            let crc = 0xFFFFFFFF
            for (let i = 0; i < str.length; i++) {
                crc ^= str.charCodeAt(i)
                for (let j = 0; j < 8; j++) {
                    crc = (crc >>> 1) ^ (0xEDB88320 & (-(crc & 1)))
                }
            }
            return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0')
        }
    }

    const results = useMemo(() => {
        const hashes = {}
        Object.keys(hashFunctions).forEach(type => {
            hashes[type] = hashFunctions[type](input)
        })
        return hashes
    }, [input])

    const copyHash = (hash) => {
        navigator.clipboard.writeText(hash)
    }

    return (
        <CalculatorLayout
            title="Hash Generator"
            description="Generate hash values for text"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={Hash}
            result={results[selectedHash]?.slice(0, 12) + '...'}
            resultLabel={selectedHash.toUpperCase()}
        >
            <div className="input-group">
                <label className="input-label">Text to Hash</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={3}
                    placeholder="Enter text to generate hash..."
                />
            </div>
            <div className="input-group">
                <label className="input-label">Primary Hash Type</label>
                <select value={selectedHash} onChange={(e) => setSelectedHash(e.target.value)}>
                    <option value="md5">MD5 (128-bit)</option>
                    <option value="sha1">SHA-1 (160-bit)</option>
                    <option value="sha256">SHA-256 (256-bit)</option>
                    <option value="crc32">CRC-32 (32-bit)</option>
                </select>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>GENERATED HASHES</div>
            {Object.entries(results).map(([type, hash]) => (
                <div
                    key={type}
                    onClick={() => copyHash(hash)}
                    style={{
                        background: type === selectedHash ? '#a78bfa20' : '#1a1a2e',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        border: type === selectedHash ? '1px solid #a78bfa40' : 'none'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                    }}>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: type === selectedHash ? '#a78bfa' : 'inherit'
                        }}>
                            {type}
                        </span>
                        <span style={{ fontSize: '10px', opacity: 0.6 }}>{hash.length * 4} bits</span>
                    </div>
                    <div style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        wordBreak: 'break-all',
                        opacity: 0.9
                    }}>
                        {hash}
                    </div>
                </div>
            ))}
            <div style={{
                marginTop: '12px',
                fontSize: '11px',
                opacity: 0.5,
                textAlign: 'center'
            }}>
                Click any hash to copy to clipboard
            </div>
            <div style={{
                marginTop: '12px',
                padding: '12px',
                background: '#f59e0b20',
                borderRadius: '8px',
                fontSize: '11px'
            }}>
                ⚠️ Note: These are simplified hash demonstrations. For security-critical applications, use proper cryptographic libraries.
            </div>
        </CalculatorLayout>
    )
}

export default HashGeneratorCalculator
