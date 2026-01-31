import { useState, useMemo } from 'react'
import { Palette } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ColorPicker() {
    const [color, setColor] = useState('#3498db')
    const [copied, setCopied] = useState('')

    const results = useMemo(() => {
        // Parse hex to RGB
        const hex = color.replace('#', '')
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)

        // Convert to HSL
        const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255
        const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm)
        let h = 0, s = 0, l = (max + min) / 2

        if (max !== min) {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
                case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
                case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
            }
        }

        // Convert to CMYK
        const k = 1 - Math.max(rNorm, gNorm, bNorm)
        const c = k < 1 ? (1 - rNorm - k) / (1 - k) : 0
        const m = k < 1 ? (1 - gNorm - k) / (1 - k) : 0
        const y = k < 1 ? (1 - bNorm - k) / (1 - k) : 0

        return {
            hex: color.toUpperCase(),
            rgb: `rgb(${r}, ${g}, ${b})`,
            rgba: `rgba(${r}, ${g}, ${b}, 1)`,
            hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
            cmyk: `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`,
            r, g, b
        }
    }, [color])

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value)
        setCopied(value)
        setTimeout(() => setCopied(''), 1500)
    }

    return (
        <CalculatorLayout
            title="Color Picker & Converter"
            description="Pick colors and convert between formats"
            category="Text"
            categoryPath="/text"
            icon={Palette}
            result={results.hex}
            resultLabel="Color"
        >
            <div className="input-group">
                <label className="input-label">Pick Color</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ width: '60px', height: '50px', cursor: 'pointer', border: 'none', borderRadius: '8px' }}
                    />
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ flex: 1, fontFamily: 'monospace' }}
                        placeholder="#RRGGBB"
                    />
                </div>
            </div>
            <div style={{
                height: '80px',
                background: color,
                borderRadius: '12px',
                margin: '16px 0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }} />
            <div className="result-details">
                {[
                    { label: 'HEX', value: results.hex },
                    { label: 'RGB', value: results.rgb },
                    { label: 'RGBA', value: results.rgba },
                    { label: 'HSL', value: results.hsl },
                    { label: 'CMYK', value: results.cmyk }
                ].map(({ label, value }) => (
                    <div
                        key={label}
                        className="result-detail-row"
                        onClick={() => handleCopy(value)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="result-detail-label">{label}</span>
                        <span className="result-detail-value" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            {copied === value ? '✓ Copied!' : value}
                        </span>
                    </div>
                ))}
            </div>
        </CalculatorLayout>
    )
}

export default ColorPicker
