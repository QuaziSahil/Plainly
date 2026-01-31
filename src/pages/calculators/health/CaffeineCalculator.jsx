import { useState, useMemo } from 'react'
import { Coffee } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CaffeineCalculator() {
    const [caffeineAmount, setCaffeineAmount] = useState(200)
    const [hoursElapsed, setHoursElapsed] = useState(0)
    const [beverage, setBeverage] = useState('coffee')

    const caffeineContent = {
        coffee: 95,
        espresso: 63,
        tea: 47,
        energy: 80,
        cola: 34,
        custom: caffeineAmount
    }

    const results = useMemo(() => {
        const halfLife = 5 // hours
        const initialAmount = beverage === 'custom' ? caffeineAmount : caffeineContent[beverage]
        const remaining = initialAmount * Math.pow(0.5, hoursElapsed / halfLife)
        const metabolized = initialAmount - remaining

        // Calculate when caffeine will be at different levels
        const timeTo50 = halfLife
        const timeTo25 = halfLife * 2
        const timeTo10 = halfLife * Math.log2(10)

        return { remaining, metabolized, initialAmount, timeTo50, timeTo25, timeTo10 }
    }, [caffeineAmount, hoursElapsed, beverage])

    return (
        <CalculatorLayout
            title="Caffeine Half-Life Calculator"
            description="Track caffeine in your system"
            category="Health"
            categoryPath="/health"
            icon={Coffee}
            result={`${Math.round(results.remaining)} mg`}
            resultLabel="Caffeine Remaining"
        >
            <div className="input-group">
                <label className="input-label">Beverage Type</label>
                <select value={beverage} onChange={(e) => setBeverage(e.target.value)}>
                    <option value="coffee">Coffee (95mg)</option>
                    <option value="espresso">Espresso (63mg)</option>
                    <option value="tea">Tea (47mg)</option>
                    <option value="energy">Energy Drink (80mg)</option>
                    <option value="cola">Cola (34mg)</option>
                    <option value="custom">Custom Amount</option>
                </select>
            </div>
            {beverage === 'custom' && (
                <div className="input-group">
                    <label className="input-label">Caffeine Amount (mg)</label>
                    <input type="number" value={caffeineAmount} onChange={(e) => setCaffeineAmount(Number(e.target.value))} min={0} />
                </div>
            )}
            <div className="input-group">
                <label className="input-label">Hours Since Consumption</label>
                <input type="number" value={hoursElapsed} onChange={(e) => setHoursElapsed(Number(e.target.value))} min={0} step={0.5} />
            </div>
            <div style={{ background: '#333', borderRadius: '8px', padding: '4px', marginBottom: '16px' }}>
                <div style={{
                    background: results.remaining > 50 ? '#ef4444' : results.remaining > 20 ? '#f59e0b' : '#10b981',
                    height: '8px',
                    borderRadius: '6px',
                    width: `${(results.remaining / results.initialAmount) * 100}%`,
                    transition: 'width 0.3s ease'
                }} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Initial Amount</span>
                    <span className="result-detail-value">{results.initialAmount} mg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Remaining</span>
                    <span className="result-detail-value">{Math.round(results.remaining)} mg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Metabolized</span>
                    <span className="result-detail-value">{Math.round(results.metabolized)} mg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Half-life</span>
                    <span className="result-detail-value">~5 hours</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CaffeineCalculator
