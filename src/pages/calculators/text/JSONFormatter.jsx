import { useState, useMemo } from 'react'
import { Code } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function JSONFormatter() {
    const [input, setInput] = useState('{"name":"John","age":30,"city":"New York"}')
    const [indent, setIndent] = useState(2)
    const [copied, setCopied] = useState(false)

    const results = useMemo(() => {
        try {
            const parsed = JSON.parse(input)
            const formatted = JSON.stringify(parsed, null, indent)
            const minified = JSON.stringify(parsed)

            return {
                valid: true,
                formatted,
                minified,
                keys: Object.keys(parsed).length,
                size: new Blob([input]).size,
                formattedSize: new Blob([formatted]).size
            }
        } catch (e) {
            return { valid: false, error: e.message }
        }
    }, [input, indent])

    const handleCopy = () => {
        navigator.clipboard.writeText(results.formatted || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    const handleMinify = () => {
        if (results.valid) setInput(results.minified)
    }

    const handleFormat = () => {
        if (results.valid) setInput(results.formatted)
    }

    return (
        <CalculatorLayout
            title="JSON Formatter"
            description="Format, validate, and minify JSON"
            category="Text"
            categoryPath="/text"
            icon={Code}
            result={results.valid ? 'Valid ✓' : 'Invalid ✗'}
            resultLabel="JSON Status"
        >
            <div className="input-group">
                <label className="input-label">JSON Input</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={6}
                    style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }}
                    placeholder='{"key": "value"}'
                />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Indent Spaces</label>
                    <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                        <option value={0}>No indent (tab)</option>
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button onClick={handleFormat} style={{
                    flex: 1, padding: '10px', background: '#333', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer'
                }}>Beautify</button>
                <button onClick={handleMinify} style={{
                    flex: 1, padding: '10px', background: '#333', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer'
                }}>Minify</button>
                <button onClick={handleCopy} style={{
                    flex: 1, padding: '10px', background: copied ? '#10b981' : '#333', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer'
                }}>{copied ? '✓ Copied!' : 'Copy'}</button>
            </div>
            {results.valid ? (
                <div className="result-details">
                    <div className="result-detail-row">
                        <span className="result-detail-label">Status</span>
                        <span className="result-detail-value" style={{ color: '#10b981' }}>Valid JSON</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Original Size</span>
                        <span className="result-detail-value">{results.size} bytes</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Formatted Size</span>
                        <span className="result-detail-value">{results.formattedSize} bytes</span>
                    </div>
                </div>
            ) : (
                <div className="result-details">
                    <div className="result-detail-row">
                        <span className="result-detail-label">Error</span>
                        <span className="result-detail-value" style={{ color: '#ef4444' }}>{results.error}</span>
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default JSONFormatter
