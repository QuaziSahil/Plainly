import { useState, useMemo } from 'react'
import { Scale, RotateCcw } from 'lucide-react'
import Button from '../../../components/UI/Button'
import './BMICalculator.css'

function BMICalculator() {
    const [weight, setWeight] = useState(70)
    const [height, setHeight] = useState(170)
    const [unit, setUnit] = useState('metric') // metric or imperial

    const handleReset = () => {
        if (unit === 'metric') {
            setWeight(70)
            setHeight(170)
        } else {
            setWeight(154)
            setHeight(67)
        }
    }

    const bmi = useMemo(() => {
        if (unit === 'metric') {
            const heightM = height / 100
            return weight / (heightM * heightM)
        } else {
            // Imperial: BMI = (weight in lbs / height in inches²) × 703
            return (weight / (height * height)) * 703
        }
    }, [weight, height, unit])

    const category = useMemo(() => {
        if (bmi < 18.5) return { name: 'Underweight', color: '#3b82f6', message: 'Consider consulting a nutritionist for a balanced diet plan.' }
        if (bmi < 25) return { name: 'Normal', color: '#22c55e', message: 'Your current metrics suggest a balanced metabolic state.' }
        if (bmi < 30) return { name: 'Overweight', color: '#f59e0b', message: 'Consider increasing physical activity and adjusting diet.' }
        return { name: 'Obese', color: '#ef4444', message: 'Consulting a healthcare professional is recommended.' }
    }, [bmi])

    const gaugeAngle = useMemo(() => {
        // Map BMI 15-40 to 0-180 degrees
        const minBMI = 15
        const maxBMI = 40
        const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi))
        return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 180
    }, [bmi])

    return (
        <div className="bmi-calculator">
            {/* Luxe Header */}
            <div className="bmi-header">
                <div className="container">
                    <nav className="bmi-nav">
                        <span className="bmi-brand">Luxe BMI</span>
                        <div className="bmi-nav-links">
                            <button
                                onClick={handleReset}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <RotateCcw size={14} />
                                Reset
                            </button>
                            <a href="/health">Analytics</a>
                            <a href="/calculators">Collection</a>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="bmi-content">
                <div className="container">
                    <div className="bmi-grid">
                        {/* Result Panel */}
                        <div className="bmi-result-panel">
                            <div className="bmi-display">
                                <span className="bmi-value">{bmi.toFixed(1)}</span>
                                <span className="bmi-category" style={{ color: category.color }}>
                                    {category.name}
                                </span>
                            </div>

                            {/* Gauge */}
                            <div className="bmi-gauge">
                                <svg viewBox="0 0 200 120" className="gauge-svg">
                                    {/* Background arc */}
                                    <path
                                        d="M 20 100 A 80 80 0 0 1 180 100"
                                        fill="none"
                                        stroke="var(--border-primary)"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                    />
                                    {/* Colored segments */}
                                    <path
                                        d="M 20 100 A 80 80 0 0 1 65 35"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M 65 35 A 80 80 0 0 1 135 35"
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="12"
                                    />
                                    <path
                                        d="M 135 35 A 80 80 0 0 1 165 60"
                                        fill="none"
                                        stroke="#f59e0b"
                                        strokeWidth="12"
                                    />
                                    <path
                                        d="M 165 60 A 80 80 0 0 1 180 100"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                    />
                                    {/* Needle */}
                                    <g transform={`rotate(${gaugeAngle - 90}, 100, 100)`}>
                                        <line
                                            x1="100"
                                            y1="100"
                                            x2="100"
                                            y2="35"
                                            stroke="var(--text-primary)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <circle cx="100" cy="100" r="8" fill="var(--text-primary)" />
                                    </g>
                                </svg>
                            </div>

                            <p className="bmi-message">"{category.message}"</p>
                        </div>

                        {/* Input Panel */}
                        <div className="bmi-input-panel">
                            {/* Unit Toggle */}
                            <div className="unit-toggle">
                                <button
                                    className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
                                    onClick={() => {
                                        setUnit('metric')
                                        setWeight(70)
                                        setHeight(170)
                                    }}
                                >
                                    Metric
                                </button>
                                <button
                                    className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
                                    onClick={() => {
                                        setUnit('imperial')
                                        setWeight(154)
                                        setHeight(67)
                                    }}
                                >
                                    Imperial
                                </button>
                            </div>

                            {/* Weight Slider */}
                            <div className="bmi-input-group">
                                <div className="slider-header">
                                    <label className="input-label">
                                        Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                                    </label>
                                    <span className="slider-value">{weight}</span>
                                </div>
                                <input
                                    type="range"
                                    min={unit === 'metric' ? 30 : 66}
                                    max={unit === 'metric' ? 200 : 440}
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    className="bmi-slider"
                                />
                            </div>

                            {/* Height Slider */}
                            <div className="bmi-input-group">
                                <div className="slider-header">
                                    <label className="input-label">
                                        Height ({unit === 'metric' ? 'cm' : 'inches'})
                                    </label>
                                    <span className="slider-value">{height}</span>
                                </div>
                                <input
                                    type="range"
                                    min={unit === 'metric' ? 100 : 39}
                                    max={unit === 'metric' ? 220 : 87}
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="bmi-slider"
                                />
                            </div>

                            {/* BMI Categories Legend */}
                            <div className="bmi-legend">
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ background: '#3b82f6' }} />
                                    <span>Underweight &lt; 18.5</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ background: '#22c55e' }} />
                                    <span>Normal 18.5 - 24.9</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ background: '#f59e0b' }} />
                                    <span>Overweight 25 - 29.9</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ background: '#ef4444' }} />
                                    <span>Obese ≥ 30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bmi-footer">
                <div className="container">
                    <span>Architecture of Health © {new Date().getFullYear()}</span>
                </div>
            </div>
        </div>
    )
}

export default BMICalculator
