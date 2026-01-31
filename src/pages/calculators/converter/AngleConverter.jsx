import { useState, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function AngleConverter() {
    const [value, setValue] = useState(180)
    const [fromUnit, setFromUnit] = useState('degrees')

    const results = useMemo(() => {
        let degrees, radians, gradians, turns

        switch (fromUnit) {
            case 'degrees':
                degrees = value
                radians = value * Math.PI / 180
                gradians = value * 10 / 9
                turns = value / 360
                break
            case 'radians':
                radians = value
                degrees = value * 180 / Math.PI
                gradians = degrees * 10 / 9
                turns = degrees / 360
                break
            case 'gradians':
                gradians = value
                degrees = value * 9 / 10
                radians = degrees * Math.PI / 180
                turns = degrees / 360
                break
            case 'turns':
                turns = value
                degrees = value * 360
                radians = degrees * Math.PI / 180
                gradians = degrees * 10 / 9
                break
            default:
                degrees = radians = gradians = turns = value
        }

        return { degrees, radians, gradians, turns }
    }, [value, fromUnit])

    const formatValue = (val) => {
        if (Number.isInteger(val)) return val.toString()
        return val.toFixed(6)
    }

    return (
        <CalculatorLayout
            title="Angle Converter"
            description="Convert between angle units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={RotateCcw}
            result={`${formatValue(results.degrees)}°`}
            resultLabel="Degrees"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Unit</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        <option value="degrees">Degrees</option>
                        <option value="radians">Radians</option>
                        <option value="gradians">Gradians</option>
                        <option value="turns">Turns</option>
                    </select>
                </div>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '2px solid #333',
                    position: 'relative',
                    background: `conic-gradient(#a78bfa ${results.degrees % 360}deg, #1a1a2e 0)`
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${results.degrees}deg)`,
                        width: '2px',
                        height: '50px',
                        background: '#fff',
                        transformOrigin: 'center bottom'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#a78bfa'
                    }} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div
                    style={{
                        background: fromUnit === 'degrees' ? '#a78bfa20' : '#1a1a2e',
                        padding: '12px',
                        borderRadius: '8px',
                        border: fromUnit === 'degrees' ? '1px solid #a78bfa40' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigator.clipboard.writeText(results.degrees.toString())}
                >
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>DEGREES</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{formatValue(results.degrees)}°</div>
                </div>
                <div
                    style={{
                        background: fromUnit === 'radians' ? '#a78bfa20' : '#1a1a2e',
                        padding: '12px',
                        borderRadius: '8px',
                        border: fromUnit === 'radians' ? '1px solid #a78bfa40' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigator.clipboard.writeText(results.radians.toString())}
                >
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>RADIANS</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{formatValue(results.radians)} rad</div>
                </div>
                <div
                    style={{
                        background: fromUnit === 'gradians' ? '#a78bfa20' : '#1a1a2e',
                        padding: '12px',
                        borderRadius: '8px',
                        border: fromUnit === 'gradians' ? '1px solid #a78bfa40' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigator.clipboard.writeText(results.gradians.toString())}
                >
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>GRADIANS</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{formatValue(results.gradians)} gon</div>
                </div>
                <div
                    style={{
                        background: fromUnit === 'turns' ? '#a78bfa20' : '#1a1a2e',
                        padding: '12px',
                        borderRadius: '8px',
                        border: fromUnit === 'turns' ? '1px solid #a78bfa40' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigator.clipboard.writeText(results.turns.toString())}
                >
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>TURNS</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{formatValue(results.turns)}</div>
                </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>
                Click any value to copy • π rad = 180°
            </div>
        </CalculatorLayout>
    )
}

export default AngleConverter
