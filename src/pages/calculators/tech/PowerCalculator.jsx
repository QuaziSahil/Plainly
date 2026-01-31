import { useState, useMemo } from 'react'
import { Zap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PowerCalculator() {
    const [mode, setMode] = useState('power')
    const [voltage, setVoltage] = useState(120)
    const [current, setCurrent] = useState(10)
    const [resistance, setResistance] = useState(12)
    const [power, setPower] = useState(1200)

    const results = useMemo(() => {
        let P, V, I, R

        switch (mode) {
            case 'power': // Calculate Power from V and I
                V = voltage
                I = current
                P = V * I
                R = V / I
                break
            case 'voltage': // Calculate Voltage from P and I
                P = power
                I = current
                V = P / I
                R = V / I
                break
            case 'current': // Calculate Current from P and V
                P = power
                V = voltage
                I = P / V
                R = V / I
                break
            case 'resistance': // Calculate from V and R
                V = voltage
                R = resistance
                I = V / R
                P = V * I
                break
            default:
                break
        }

        // Additional calculations
        const energyPerHour = P / 1000 // kWh
        const costPerHour = energyPerHour * 0.12 // avg $0.12/kWh
        const costPerDay = costPerHour * 24
        const costPerMonth = costPerDay * 30

        // Heat dissipation
        const btuPerHour = P * 3.412

        return { P, V, I, R, energyPerHour, costPerHour, costPerDay, costPerMonth, btuPerHour }
    }, [mode, voltage, current, resistance, power])

    return (
        <CalculatorLayout
            title="Power Calculator"
            description="Electrical power calculations (P=VI)"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={Zap}
            result={`${results.P?.toFixed(2)} W`}
            resultLabel="Power"
        >
            <div className="input-group">
                <label className="input-label">Calculate</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="power">Power (from Voltage & Current)</option>
                    <option value="voltage">Voltage (from Power & Current)</option>
                    <option value="current">Current (from Power & Voltage)</option>
                    <option value="resistance">All (from Voltage & Resistance)</option>
                </select>
            </div>
            <div className="input-row">
                {(mode === 'power' || mode === 'current' || mode === 'resistance') && (
                    <div className="input-group">
                        <label className="input-label">Voltage (V)</label>
                        <input type="number" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} min={0} step="any" />
                    </div>
                )}
                {(mode === 'power' || mode === 'voltage') && (
                    <div className="input-group">
                        <label className="input-label">Current (A)</label>
                        <input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} min={0} step="any" />
                    </div>
                )}
                {(mode === 'voltage' || mode === 'current') && (
                    <div className="input-group">
                        <label className="input-label">Power (W)</label>
                        <input type="number" value={power} onChange={(e) => setPower(Number(e.target.value))} min={0} step="any" />
                    </div>
                )}
                {mode === 'resistance' && (
                    <div className="input-group">
                        <label className="input-label">Resistance (Ω)</label>
                        <input type="number" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} min={0.001} step="any" />
                    </div>
                )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div style={{ background: '#f59e0b20', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>POWER</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#f59e0b' }}>{results.P?.toFixed(2)} W</div>
                </div>
                <div style={{ background: '#3b82f620', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>VOLTAGE</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#3b82f6' }}>{results.V?.toFixed(2)} V</div>
                </div>
                <div style={{ background: '#22c55e20', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>CURRENT</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e' }}>{results.I?.toFixed(3)} A</div>
                </div>
                <div style={{ background: '#a78bfa20', padding: '14px 8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>RESISTANCE</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#a78bfa' }}>{results.R?.toFixed(2)} Ω</div>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">⚡ Energy per Hour</span>
                    <span className="result-detail-value">{results.energyPerHour?.toFixed(4)} kWh</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">💰 Cost per Hour</span>
                    <span className="result-detail-value">${results.costPerHour?.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">💰 Cost per Day</span>
                    <span className="result-detail-value">${results.costPerDay?.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">💰 Cost per Month</span>
                    <span className="result-detail-value" style={{ color: '#f59e0b' }}>${results.costPerMonth?.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">🔥 Heat Output</span>
                    <span className="result-detail-value">{results.btuPerHour?.toFixed(1)} BTU/hr</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PowerCalculator
