import { useState, useMemo } from 'react'
import { Waves } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WaveCalculator() {
    const [frequency, setFrequency] = useState(440)
    const [wavelength, setWavelength] = useState('')
    const [velocity, setVelocity] = useState(343)
    const [calcMode, setCalcMode] = useState('wavelength')

    const results = useMemo(() => {
        // v = f * λ
        let f = frequency
        let λ = wavelength ? Number(wavelength) : null
        let v = velocity

        if (calcMode === 'wavelength' && f && v) {
            λ = v / f
        } else if (calcMode === 'frequency' && λ && v) {
            f = v / λ
        } else if (calcMode === 'velocity' && f && λ) {
            v = f * λ
        }

        const period = 1 / f
        const angularFreq = 2 * Math.PI * f

        // Musical note (for sound waves)
        const musicalNotes = [
            { note: 'A4', freq: 440 },
            { note: 'B4', freq: 493.88 },
            { note: 'C5', freq: 523.25 },
            { note: 'D5', freq: 587.33 },
            { note: 'E5', freq: 659.25 },
            { note: 'F5', freq: 698.46 },
            { note: 'G5', freq: 783.99 }
        ]
        const closestNote = musicalNotes.reduce((prev, curr) =>
            Math.abs(curr.freq - f) < Math.abs(prev.freq - f) ? curr : prev
        )

        return { frequency: f, wavelength: λ, velocity: v, period, angularFreq, closestNote }
    }, [frequency, wavelength, velocity, calcMode])

    return (
        <CalculatorLayout
            title="Wave Calculator"
            description="Calculate wave properties"
            category="Math"
            categoryPath="/math"
            icon={Waves}
            result={calcMode === 'wavelength' ? `${results.wavelength?.toFixed(4)} m` :
                calcMode === 'frequency' ? `${results.frequency?.toFixed(2)} Hz` :
                    `${results.velocity?.toFixed(2)} m/s`}
            resultLabel={calcMode === 'wavelength' ? 'Wavelength' :
                calcMode === 'frequency' ? 'Frequency' : 'Velocity'}
        >
            <div className="input-group">
                <label className="input-label">Calculate</label>
                <select value={calcMode} onChange={(e) => setCalcMode(e.target.value)}>
                    <option value="wavelength">Wavelength (from frequency & velocity)</option>
                    <option value="frequency">Frequency (from wavelength & velocity)</option>
                    <option value="velocity">Velocity (from frequency & wavelength)</option>
                </select>
            </div>
            {calcMode !== 'frequency' && (
                <div className="input-group">
                    <label className="input-label">Frequency (Hz)</label>
                    <input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        min={0.01}
                        step="any"
                    />
                </div>
            )}
            {calcMode !== 'wavelength' && (
                <div className="input-group">
                    <label className="input-label">Wavelength (m)</label>
                    <input
                        type="number"
                        value={wavelength}
                        onChange={(e) => setWavelength(e.target.value)}
                        min={0}
                        step="any"
                    />
                </div>
            )}
            {calcMode !== 'velocity' && (
                <div className="input-group">
                    <label className="input-label">Velocity (m/s)</label>
                    <input
                        type="number"
                        value={velocity}
                        onChange={(e) => setVelocity(Number(e.target.value))}
                        min={0}
                        step="any"
                    />
                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                        <button
                            onClick={() => setVelocity(343)}
                            style={{ flex: 1, padding: '4px 8px', background: '#333', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
                        >
                            Sound (343 m/s)
                        </button>
                        <button
                            onClick={() => setVelocity(299792458)}
                            style={{ flex: 1, padding: '4px 8px', background: '#333', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
                        >
                            Light (c)
                        </button>
                    </div>
                </div>
            )}
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Frequency (f)</span>
                    <span className="result-detail-value">{results.frequency?.toFixed(4)} Hz</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Wavelength (λ)</span>
                    <span className="result-detail-value">{results.wavelength?.toExponential(4)} m</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Velocity (v)</span>
                    <span className="result-detail-value">{results.velocity?.toLocaleString()} m/s</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Period (T)</span>
                    <span className="result-detail-value">{results.period?.toExponential(4)} s</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Angular Frequency (ω)</span>
                    <span className="result-detail-value">{results.angularFreq?.toFixed(2)} rad/s</span>
                </div>
                {velocity === 343 && (
                    <div className="result-detail-row">
                        <span className="result-detail-label">Closest Note</span>
                        <span className="result-detail-value" style={{ color: '#a78bfa' }}>♪ {results.closestNote.note}</span>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    )
}

export default WaveCalculator
