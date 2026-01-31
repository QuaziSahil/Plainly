import { useState, useMemo } from 'react'
import { FileCode } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RegexTester() {
    const [pattern, setPattern] = useState('[a-zA-Z]+')
    const [flags, setFlags] = useState('g')
    const [testString, setTestString] = useState('Hello World 123 Regex Test 456')
    const [replaceWith, setReplaceWith] = useState('')

    const results = useMemo(() => {
        try {
            const regex = new RegExp(pattern, flags)
            const matches = [...testString.matchAll(regex)]
            const replaced = testString.replace(regex, replaceWith)
            const isMatch = regex.test(testString)

            return {
                matches: matches.map(m => m[0]),
                matchCount: matches.length,
                replaced,
                isMatch,
                error: null
            }
        } catch (e) {
            return { matches: [], matchCount: 0, replaced: '', isMatch: false, error: e.message }
        }
    }, [pattern, flags, testString, replaceWith])

    return (
        <CalculatorLayout
            title="Regex Tester"
            description="Test regular expressions"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={FileCode}
            result={results.error ? 'Error' : `${results.matchCount} matches`}
            resultLabel="Result"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 3 }}>
                    <label className="input-label">Pattern</label>
                    <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Flags</label>
                    <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="gi" />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Test String</label>
                <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    rows={3}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Replace With (optional)</label>
                <input type="text" value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)} placeholder="Replacement text" />
            </div>
            {results.error && (
                <div style={{ background: '#ef444420', padding: '12px', borderRadius: '8px', color: '#ef4444', marginBottom: '16px' }}>
                    {results.error}
                </div>
            )}
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Match Found</span>
                    <span className="result-detail-value" style={{ color: results.isMatch ? '#10b981' : '#ef4444' }}>
                        {results.isMatch ? 'Yes' : 'No'}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Match Count</span>
                    <span className="result-detail-value">{results.matchCount}</span>
                </div>
            </div>
            {results.matches.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>MATCHES</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {results.matches.slice(0, 20).map((match, i) => (
                            <span key={i} style={{ background: '#a78bfa20', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                                {match}
                            </span>
                        ))}
                        {results.matches.length > 20 && <span style={{ opacity: 0.6 }}>+{results.matches.length - 20} more</span>}
                    </div>
                </div>
            )}
            {replaceWith && (
                <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>REPLACED TEXT</div>
                    <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                        {results.replaced}
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default RegexTester
