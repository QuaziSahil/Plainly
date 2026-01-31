import { useState, useMemo } from 'react'
import { Droplet } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RainwaterCalculator() {
    const [roofArea, setRoofArea] = useState(1500)
    const [annualRainfall, setAnnualRainfall] = useState(40)
    const [unit, setUnit] = useState('imperial')
    const [efficiency, setEfficiency] = useState(80)

    const results = useMemo(() => {
        let areaInSqFt = roofArea
        let rainfallInInches = annualRainfall

        if (unit === 'metric') {
            areaInSqFt = roofArea * 10.764 // m² to sq ft
            rainfallInInches = annualRainfall / 25.4 // mm to inches
        }

        // 1 inch of rain on 1 sq ft = 0.623 gallons
        const potentialGallons = areaInSqFt * rainfallInInches * 0.623
        const actualGallons = potentialGallons * (efficiency / 100)
        const actualLiters = actualGallons * 3.785

        // Uses
        const toiletFlushes = Math.floor(actualGallons / 1.6) // 1.6 gal per flush
        const laundryLoads = Math.floor(actualGallons / 30) // 30 gal per load
        const gardenDays = Math.floor(actualGallons / 50) // ~50 gal/day garden
        const carWashes = Math.floor(actualGallons / 40) // ~40 gal per wash

        // Savings
        const waterCostPerGallon = 0.005 // avg $5/1000 gal
        const annualSavings = actualGallons * waterCostPerGallon

        return {
            potentialGallons,
            actualGallons,
            actualLiters,
            toiletFlushes,
            laundryLoads,
            gardenDays,
            carWashes,
            annualSavings,
            monthlyGallons: actualGallons / 12
        }
    }, [roofArea, annualRainfall, unit, efficiency])

    return (
        <CalculatorLayout
            title="Rainwater Harvest Calculator"
            description="Calculate rainwater collection potential"
            category="Sustainability"
            categoryPath="/calculators?category=Sustainability"
            icon={Droplet}
            result={`${Math.round(results.actualGallons).toLocaleString()} gal`}
            resultLabel="Annual Collection"
        >
            <div className="input-group">
                <label className="input-label">Units</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="imperial">Imperial (sq ft, inches)</option>
                    <option value="metric">Metric (m², mm)</option>
                </select>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Roof Area ({unit === 'imperial' ? 'sq ft' : 'm²'})</label>
                    <input type="number" value={roofArea} onChange={(e) => setRoofArea(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Annual Rainfall ({unit === 'imperial' ? 'inches' : 'mm'})</label>
                    <input type="number" value={annualRainfall} onChange={(e) => setAnnualRainfall(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Collection Efficiency (%)</label>
                <input type="range" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} min={50} max={95} />
                <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 600 }}>{efficiency}%</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: '#3b82f620', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>ANNUAL</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>
                        {Math.round(results.actualGallons).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px' }}>gallons</div>
                </div>
                <div style={{ flex: 1, background: '#22c55e20', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>MONTHLY</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>
                        {Math.round(results.monthlyGallons).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px' }}>gallons</div>
                </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>💧 WHAT YOU COULD USE IT FOR</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div style={{ background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>🚽</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{results.toiletFlushes.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Toilet Flushes</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>👕</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{results.laundryLoads.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Laundry Loads</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>🌱</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{results.gardenDays.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Days of Garden</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>🚗</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{results.carWashes.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Car Washes</div>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">💰 Annual Savings</span>
                    <span className="result-detail-value" style={{ color: '#22c55e' }}>${results.annualSavings.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RainwaterCalculator
