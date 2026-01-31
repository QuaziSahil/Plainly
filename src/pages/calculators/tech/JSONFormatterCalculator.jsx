import { useState, useMemo } from 'react'
import { FileCode } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function JSONFormatterCalculator() {
    const [input, setInput] = useState('{"name":"John","age":30,"city":"New York","hobbies":["coding","gaming"]}')
    const [indentSpaces, setIndentSpaces] = useState(2)

    const results = useMemo(() => {
        try {
            const parsed = JSON.parse(input)
            const formatted = JSON.stringify(parsed, null, indentSpaces)
            const minified = JSON.stringify(parsed)

            const keyCount = countKeys(parsed)
            const depth = getDepth(parsed)
            const size = new Blob([JSON.stringify(parsed)]).size

            return {
                valid: true,
                formatted,
                minified,
                keyCount,
                depth,
                size,
                type: Array.isArray(parsed) ? 'Array' : typeof parsed
            }
        } catch (e) {
            return {
                valid: false,
                error: e.message
            }
        }
    }, [input, indentSpaces])

    function countKeys(obj) {
        if (typeof obj !== 'object' || obj === null) return 0
        let count = 0
        if (Array.isArray(obj)) {
            obj.forEach(item => count += countKeys(item))
        } else {
            count = Object.keys(obj).length
            Object.values(obj).forEach(val => count += countKeys(val))
        }
        return count
    }

    function getDepth(obj, currentDepth = 0) {
        if (typeof obj !== 'object' || obj === null) return currentDepth
        const children = Array.isArray(obj) ? obj : Object.values(obj)
        if (children.length === 0) return currentDepth
        return Math.max(...children.map(child => getDepth(child, currentDepth + 1)))
    }

    const copyFormatted = () => {
        if (results.valid) {
            navigator.clipboard.writeText(results.formatted)
        }
    }

    const copyMinified = () => {
        if (results.valid) {
            navigator.clipboard.writeText(results.minified)
        }
    }

    return (
        <CalculatorLayout
            title="JSON Formatter"
            description="Format and validate JSON"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={FileCode}
            result={results.valid ? 'Valid JSON ✓' : 'Invalid JSON ✗'}
            resultLabel="Status"
        >
            <div className="input-group">
                <label className="input-label">Input JSON</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={5}
                    placeholder='{"key": "value"}'
                    style={{ fontFamily: 'monospace', fontSize: '13px' }}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Indent Spaces</label>
                <select value={indentSpaces} onChange={(e) => setIndentSpaces(Number(e.target.value))}>
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>Tab (8 spaces)</option>
                </select>
            </div>
            {results.valid ? (
                <>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#a78bfa' }}>{results.keyCount}</div>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>Keys</div>
                        </div>
                        <div style={{ flex: 1, background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e' }}>{results.depth}</div>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>Depth</div>
                        </div>
                        <div style={{ flex: 1, background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700 }}>{results.size} B</div>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>Size</div>
                        </div>
                        <div style={{ flex: 1, background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700 }}>{results.type}</div>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>Type</div>
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Formatted Output</label>
                        <pre style={{
                            background: '#1a1a2e',
                            padding: '12px',
                            borderRadius: '8px',
                            overflow: 'auto',
                            maxHeight: '200px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            margin: 0
                        }}>
                            {results.formatted}
                        </pre>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={copyFormatted}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: '#a78bfa',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#000',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            📋 Copy Formatted
                        </button>
                        <button
                            onClick={copyMinified}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: '#333',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            📦 Copy Minified
                        </button>
                    </div>
                </>
            ) : (
                <div style={{
                    background: '#ef444420',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ef444440'
                }}>
                    <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: '8px' }}>❌ Invalid JSON</div>
                    <div style={{ fontSize: '13px', fontFamily: 'monospace', opacity: 0.8 }}>{results.error}</div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default JSONFormatterCalculator
