import { useState, useMemo } from 'react'
import { Link2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SlugGenerator() {
    const [text, setText] = useState('How to Create SEO-Friendly URLs for Your Website')
    const [separator, setSeparator] = useState('-')
    const [lowercase, setLowercase] = useState(true)
    const [maxLength, setMaxLength] = useState(60)

    const slug = useMemo(() => {
        let result = text
            // Convert to lowercase if enabled
            .replace(/./g, c => lowercase ? c.toLowerCase() : c)
            // Replace special characters
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ñ]/g, 'n')
            .replace(/[ç]/g, 'c')
            // Remove special characters except spaces
            .replace(/[^\w\s-]/g, '')
            // Replace spaces and multiple separators
            .replace(/[\s_]+/g, separator)
            // Remove leading/trailing separators
            .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')

        // Truncate to max length
        if (result.length > maxLength) {
            result = result.substring(0, maxLength)
            // Don't end with separator
            result = result.replace(new RegExp(`${separator}+$`), '')
        }

        return result
    }, [text, separator, lowercase, maxLength])

    const copySlug = () => {
        navigator.clipboard.writeText(slug)
    }

    return (
        <CalculatorLayout
            title="Slug Generator"
            description="Create URL-friendly slugs"
            category="Text"
            categoryPath="/calculators?category=Text"
            icon={Link2}
            result={slug.length > 25 ? slug.substring(0, 25) + '...' : slug}
            resultLabel="Slug"
        >
            <div className="input-group">
                <label className="input-label">Title or Text</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter title to convert to slug..."
                />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Separator</label>
                    <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                        <option value="-">Hyphen (-)</option>
                        <option value="_">Underscore (_)</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Max Length</label>
                    <input type="number" value={maxLength} onChange={(e) => setMaxLength(Number(e.target.value))} min={10} max={200} />
                </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
                <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
                Convert to lowercase
            </label>
            <div style={{
                background: '#1a1a2e',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>GENERATED SLUG</div>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    wordBreak: 'break-all',
                    color: '#a78bfa'
                }}>
                    {slug || '(empty)'}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: '#333', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{slug.length}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Characters</div>
                </div>
                <div style={{ flex: 1, background: '#333', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{slug.split(separator).filter(w => w).length}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Words</div>
                </div>
                <div style={{
                    flex: 1,
                    background: slug.length <= maxLength ? '#22c55e20' : '#ef444420',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{slug.length <= maxLength ? '✓' : '⚠'}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Length OK</div>
                </div>
            </div>
            <button
                onClick={copySlug}
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
                📋 Copy Slug
            </button>
        </CalculatorLayout>
    )
}

export default SlugGenerator
