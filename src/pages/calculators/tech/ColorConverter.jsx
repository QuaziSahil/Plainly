import { useState, useMemo } from 'react'
import { CircleDot } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ColorConverter() {
    const [hexColor, setHexColor] = useState('#a78bfa')
    const [inputType, setInputType] = useState('hex')
    const [rgbInput, setRgbInput] = useState({ r: 167, g: 139, b: 250 })

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    const rgbToHex = (r, g, b) => {
        return '#' + [r, g, b].map(x => {
            const hex = Math.max(0, Math.min(255, x)).toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
    }

    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2

        if (max === min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
                case g: h = ((b - r) / d + 2) / 6; break
                case b: h = ((r - g) / d + 4) / 6; break
                default: h = 0
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
    }

    const rgbToCmyk = (r, g, b) => {
        const rp = r / 255, gp = g / 255, bp = b / 255
        const k = 1 - Math.max(rp, gp, bp)
        if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
        return {
            c: Math.round(((1 - rp - k) / (1 - k)) * 100),
            m: Math.round(((1 - gp - k) / (1 - k)) * 100),
            y: Math.round(((1 - bp - k) / (1 - k)) * 100),
            k: Math.round(k * 100)
        }
    }

    const colors = useMemo(() => {
        let rgb
        if (inputType === 'hex') {
            rgb = hexToRgb(hexColor)
        } else {
            rgb = { r: rgbInput.r, g: rgbInput.g, b: rgbInput.b }
        }

        if (!rgb) return null

        const hex = inputType === 'hex' ? hexColor : rgbToHex(rgb.r, rgb.g, rgb.b)
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

        return { hex, rgb, hsl, cmyk }
    }, [hexColor, inputType, rgbInput])

    const copyValue = (value) => {
        navigator.clipboard.writeText(value)
    }

    return (
        <CalculatorLayout
            title="Color Converter"
            description="Convert between color formats"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={CircleDot}
            result={colors?.hex || '—'}
            resultLabel="Color"
        >
            <div className="input-group">
                <label className="input-label">Input Type</label>
                <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
                    <option value="hex">HEX</option>
                    <option value="rgb">RGB</option>
                </select>
            </div>
            {inputType === 'hex' ? (
                <div className="input-row">
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">HEX Color</label>
                        <input
                            type="text"
                            value={hexColor}
                            onChange={(e) => setHexColor(e.target.value)}
                            placeholder="#a78bfa"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Pick</label>
                        <input
                            type="color"
                            value={hexColor}
                            onChange={(e) => setHexColor(e.target.value)}
                            style={{ height: '40px', width: '60px', cursor: 'pointer' }}
                        />
                    </div>
                </div>
            ) : (
                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">R</label>
                        <input type="number" value={rgbInput.r} onChange={(e) => setRgbInput({ ...rgbInput, r: Number(e.target.value) })} min={0} max={255} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">G</label>
                        <input type="number" value={rgbInput.g} onChange={(e) => setRgbInput({ ...rgbInput, g: Number(e.target.value) })} min={0} max={255} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">B</label>
                        <input type="number" value={rgbInput.b} onChange={(e) => setRgbInput({ ...rgbInput, b: Number(e.target.value) })} min={0} max={255} />
                    </div>
                </div>
            )}
            {colors && (
                <>
                    <div style={{
                        height: '60px',
                        background: colors.hex,
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '1px solid #333'
                    }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div
                            onClick={() => copyValue(colors.hex)}
                            style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>HEX</div>
                            <div style={{ fontFamily: 'monospace' }}>{colors.hex}</div>
                        </div>
                        <div
                            onClick={() => copyValue(`rgb(${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b})`)}
                            style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>RGB</div>
                            <div style={{ fontFamily: 'monospace' }}>{colors.rgb.r}, {colors.rgb.g}, {colors.rgb.b}</div>
                        </div>
                        <div
                            onClick={() => copyValue(`hsl(${colors.hsl.h}, ${colors.hsl.s}%, ${colors.hsl.l}%)`)}
                            style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>HSL</div>
                            <div style={{ fontFamily: 'monospace' }}>{colors.hsl.h}°, {colors.hsl.s}%, {colors.hsl.l}%</div>
                        </div>
                        <div
                            onClick={() => copyValue(`cmyk(${colors.cmyk.c}%, ${colors.cmyk.m}%, ${colors.cmyk.y}%, ${colors.cmyk.k}%)`)}
                            style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>CMYK</div>
                            <div style={{ fontFamily: 'monospace' }}>{colors.cmyk.c}, {colors.cmyk.m}, {colors.cmyk.y}, {colors.cmyk.k}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>
                        Click any value to copy
                    </div>
                </>
            )}
        </CalculatorLayout>
    )
}

export default ColorConverter
