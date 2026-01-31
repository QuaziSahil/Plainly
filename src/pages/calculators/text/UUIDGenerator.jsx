import { useState } from 'react'
import { Key } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function UUIDGenerator() {
    const [uuids, setUuids] = useState([])
    const [quantity, setQuantity] = useState(5)
    const [version, setVersion] = useState('v4')
    const [copied, setCopied] = useState('')

    const generateV4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    const generateV1Like = () => {
        const now = Date.now()
        const timeHex = now.toString(16).padStart(12, '0')
        return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    const handleGenerate = () => {
        const newUuids = []
        for (let i = 0; i < quantity; i++) {
            newUuids.push(version === 'v4' ? generateV4() : generateV1Like())
        }
        setUuids(newUuids)
    }

    const handleCopy = (uuid) => {
        navigator.clipboard.writeText(uuid)
        setCopied(uuid)
        setTimeout(() => setCopied(''), 1500)
    }

    const handleCopyAll = () => {
        navigator.clipboard.writeText(uuids.join('\n'))
        setCopied('all')
        setTimeout(() => setCopied(''), 1500)
    }

    return (
        <CalculatorLayout
            title="UUID Generator"
            description="Generate unique identifiers (UUID/GUID)"
            category="Text"
            categoryPath="/text"
            icon={Key}
            result={uuids.length > 0 ? uuids[0].slice(0, 8) + '...' : 'Click Generate'}
            resultLabel="UUID"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Quantity</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} max={20} />
                </div>
                <div className="input-group">
                    <label className="input-label">Version</label>
                    <select value={version} onChange={(e) => setVersion(e.target.value)}>
                        <option value="v4">Version 4 (Random)</option>
                        <option value="v1">Version 1 (Time-based)</option>
                    </select>
                </div>
            </div>
            <button onClick={handleGenerate} style={{
                width: '100%',
                padding: '12px',
                background: '#333',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                marginBottom: '16px'
            }}>
                Generate UUIDs
            </button>
            {uuids.length > 0 && (
                <div className="result-details">
                    {uuids.map((uuid, i) => (
                        <div
                            key={i}
                            className="result-detail-row"
                            onClick={() => handleCopy(uuid)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{uuid}</span>
                            <span style={{ fontSize: '11px', opacity: 0.6 }}>{copied === uuid ? '✓' : 'Copy'}</span>
                        </div>
                    ))}
                    <button onClick={handleCopyAll} style={{
                        width: '100%',
                        padding: '10px',
                        background: copied === 'all' ? '#10b981' : '#222',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        marginTop: '8px',
                        fontSize: '13px'
                    }}>
                        {copied === 'all' ? '✓ Copied All!' : 'Copy All'}
                    </button>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default UUIDGenerator
