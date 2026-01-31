import { useState, useMemo } from 'react'
import { Repeat } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DuplicateRemover() {
    const [text, setText] = useState('apple\nbanana\napple\norange\nbanana\ngrape\ngrape')
    const [separator, setSeparator] = useState('newline')
    const [caseSensitive, setCaseSensitive] = useState(false)

    const results = useMemo(() => {
        const sep = separator === 'newline' ? '\n' : separator === 'comma' ? ',' : ' '
        const items = text.split(sep).map(item => item.trim()).filter(item => item)

        const seen = new Set()
        const unique = []
        const duplicates = []

        items.forEach(item => {
            const key = caseSensitive ? item : item.toLowerCase()
            if (seen.has(key)) {
                duplicates.push(item)
            } else {
                seen.add(key)
                unique.push(item)
            }
        })

        return {
            unique,
            duplicates,
            originalCount: items.length,
            uniqueCount: unique.length,
            duplicatesRemoved: items.length - unique.length
        }
    }, [text, separator, caseSensitive])

    const copyResult = () => {
        const sep = separator === 'newline' ? '\n' : separator === 'comma' ? ', ' : ' '
        navigator.clipboard.writeText(results.unique.join(sep))
    }

    return (
        <CalculatorLayout
            title="Duplicate Remover"
            description="Remove duplicate lines or items"
            category="Text"
            categoryPath="/calculators?category=Text"
            icon={Repeat}
            result={`${results.duplicatesRemoved} removed`}
            resultLabel="Duplicates"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Separator</label>
                    <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                        <option value="newline">New Line</option>
                        <option value="comma">Comma</option>
                        <option value="space">Space</option>
                    </select>
                </div>
                <div className="input-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '24px' }}>
                        <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
                        Case sensitive
                    </label>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Input Text</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    placeholder="Enter items..."
                />
            </div>
            <div className="result-details" style={{ marginBottom: '16px' }}>
                <div className="result-detail-row">
                    <span className="result-detail-label">Original Items</span>
                    <span className="result-detail-value">{results.originalCount}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Unique Items</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>{results.uniqueCount}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Duplicates Removed</span>
                    <span className="result-detail-value" style={{ color: '#ef4444' }}>{results.duplicatesRemoved}</span>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Unique Items</label>
                <textarea
                    value={results.unique.join(separator === 'newline' ? '\n' : separator === 'comma' ? ', ' : ' ')}
                    readOnly
                    rows={5}
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
                Copy Unique Items
            </button>
        </CalculatorLayout>
    )
}

export default DuplicateRemover
