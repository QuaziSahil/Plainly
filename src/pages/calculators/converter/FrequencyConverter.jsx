import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FrequencyConverter() {
    const [value, setValue] = useState(440)
    const [fromUnit, setFromUnit] = useState('hz')

    // All values relative to Hz
    const conversions = {
        mhz: 1e-6,
        khz: 1e-3,
        hz: 1,
        rpm: 1 / 60, // rotations per minute
        bpm: 1 / 60  // beats per minute
    }

    const labels = {
        mhz: 'Megahertz (MHz)',
        khz: 'Kilohertz (kHz)',
        hz: 'Hertz (Hz)',
        rpm: 'Rotations/min (RPM)',
        bpm: 'Beats/min (BPM)'
    }

    const results = useMemo(() => {
        const valueInHz = value / conversions[fromUnit]

        const converted = Object.keys(conversions).reduce((acc, unit) => {
            acc[unit] = valueInHz * conversions[unit]
            return acc
        }, {})

        // Calculate related values
        const period = valueInHz > 0 ? 1 / valueInHz : 0
        const wavelengthSound = valueInHz > 0 ? 343 / valueInHz : 0 // speed of sound
        const wavelengthLight = valueInHz > 0 ? 299792458 / valueInHz : 0

        // Musical note approximation (A4 = 440Hz)
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const semitones = 12 * Math.log2(valueInHz / 440) + 9
        const noteIndex = Math.round(semitones) % 12
        const octave = Math.floor((Math.round(semitones) + 3) / 12) + 4
        const closestNote = noteNames[(noteIndex + 12) % 12] + octave

        return { converted, period, wavelengthSound, wavelengthLight, closestNote }
    }, [value, fromUnit])

    const formatValue = (val, unit) => {
        if (val >= 1e9) return (val / 1e9).toFixed(3) + ' G'
        if (val >= 1e6) return (val / 1e6).toFixed(3) + ' M'
        if (val >= 1e3) return (val / 1e3).toFixed(3) + ' k'
        if (val < 0.001 && val !== 0) return val.toExponential(3)
        return val.toFixed(4)
    }

    return (
        <CalculatorLayout
            title="Frequency Converter"
            description="Convert between frequency units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={ArrowUpDown}
            result={`${formatValue(results.converted.hz, 'hz')} Hz`}
            resultLabel="Frequency"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step="any" min={0} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Unit</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        {Object.entries(labels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {Object.entries(conversions).map(([unit, _]) => (
                    <div
                        key={unit}
                        style={{
                            background: unit === fromUnit ? '#a78bfa20' : '#1a1a2e',
                            padding: '12px',
                            borderRadius: '8px',
                            border: unit === fromUnit ? '1px solid #a78bfa40' : 'none',
                            textAlign: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigator.clipboard.writeText(results.converted[unit].toString())}
                    >
                        <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>{unit.toUpperCase()}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>
                            {formatValue(results.converted[unit], unit)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Period (T)</span>
                    <span className="result-detail-value">{results.period.toExponential(4)} s</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Sound Wavelength</span>
                    <span className="result-detail-value">{results.wavelengthSound.toFixed(4)} m</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Light Wavelength</span>
                    <span className="result-detail-value">{results.wavelengthLight.toExponential(3)} m</span>
                </div>
                {value > 20 && value < 20000 && (
                    <div className="result-detail-row">
                        <span className="result-detail-label">♪ Closest Note</span>
                        <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.closestNote}</span>
                    </div>
                )}
            </div>
            <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>
                Click any value to copy • Human hearing: 20 Hz - 20 kHz
            </div>
        </CalculatorLayout>
    )
}

export default FrequencyConverter
