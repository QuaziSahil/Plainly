import { useState, useMemo } from 'react'
import { CircleDot } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SpinTheWheel() {
    const [options, setOptions] = useState('Pizza\nBurger\nTacos\nSushi\nPasta')
    const [spinning, setSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [result, setResult] = useState(null)

    const optionsList = useMemo(() => {
        return options.split('\n').map(o => o.trim()).filter(o => o.length > 0)
    }, [options])

    const spin = () => {
        if (optionsList.length < 2 || spinning) return

        setSpinning(true)
        setResult(null)

        const spins = 5 + Math.random() * 5
        const newRotation = rotation + spins * 360 + Math.random() * 360
        setRotation(newRotation)

        setTimeout(() => {
            const normalizedRotation = newRotation % 360
            const segmentAngle = 360 / optionsList.length
            const winningIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) % 360 / segmentAngle) % optionsList.length
            setResult(optionsList[winningIndex])
            setSpinning(false)
        }, 4000)
    }

    const colors = ['#a78bfa', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#f97316']

    return (
        <CalculatorLayout
            title="Spin the Wheel"
            description="Let fate decide for you"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={CircleDot}
            result={result || 'Spin to decide!'}
            resultLabel="Winner"
        >
            <div className="input-group">
                <label className="input-label">Options (one per line)</label>
                <textarea
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    rows={5}
                    placeholder="Enter options, one per line..."
                />
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderTop: '25px solid #a78bfa',
                    zIndex: 10
                }} />
                <div
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: optionsList.length > 0
                            ? `conic-gradient(${optionsList.map((_, i) =>
                                `${colors[i % colors.length]} ${i * 360 / optionsList.length}deg ${(i + 1) * 360 / optionsList.length}deg`
                            ).join(', ')})`
                            : '#333',
                        transform: `rotate(${rotation}deg)`,
                        transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
                    }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#1a1a2e',
                        border: '3px solid #fff'
                    }} />
                </div>
            </div>
            <button
                onClick={spin}
                disabled={spinning || optionsList.length < 2}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: spinning || optionsList.length < 2 ? '#444' : '#a78bfa',
                    border: 'none',
                    borderRadius: '8px',
                    color: spinning || optionsList.length < 2 ? '#888' : '#000',
                    fontWeight: 600,
                    cursor: spinning || optionsList.length < 2 ? 'not-allowed' : 'pointer',
                    fontSize: '15px'
                }}
            >
                {spinning ? '🎡 Spinning...' : '🎲 SPIN THE WHEEL'}
            </button>
            {result && (
                <div style={{
                    marginTop: '16px',
                    background: '#22c55e20',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '14px', opacity: 0.6 }}>THE WINNER IS</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>🎉 {result} 🎉</div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default SpinTheWheel
