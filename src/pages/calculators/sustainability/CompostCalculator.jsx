import { useState, useMemo } from 'react'
import { Leaf } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CompostCalculator() {
    const [greenMaterial, setGreenMaterial] = useState(10)
    const [brownMaterial, setBrownMaterial] = useState(30)
    const [binVolume, setBinVolume] = useState(100)

    const results = useMemo(() => {
        const ratio = brownMaterial / (greenMaterial || 1)
        const idealRatio = 3
        const ratioQuality = Math.abs(ratio - idealRatio) < 0.5 ? 'Excellent' :
            Math.abs(ratio - idealRatio) < 1 ? 'Good' :
                ratio < idealRatio ? 'Too much green' : 'Too much brown'

        // Estimate composting time (weeks)
        const baseTime = 8
        const ratioFactor = Math.abs(ratio - idealRatio) < 1 ? 1 : 1.5
        const volumeFactor = binVolume > 100 ? 0.8 : binVolume < 50 ? 1.3 : 1
        const estimatedWeeks = Math.round(baseTime * ratioFactor * volumeFactor)

        // CO2 savings (roughly 0.5 kg CO2 saved per kg of organic waste composted)
        const totalMaterial = greenMaterial + brownMaterial
        const co2Saved = totalMaterial * 0.5

        // Compost yield (roughly 50% of input)
        const compostYield = totalMaterial * 0.5

        return { ratio, ratioQuality, estimatedWeeks, co2Saved, compostYield, totalMaterial }
    }, [greenMaterial, brownMaterial, binVolume])

    return (
        <CalculatorLayout
            title="Compost Calculator"
            description="Optimize your composting ratio"
            category="Sustainability"
            categoryPath="/calculators?category=Sustainability"
            icon={Leaf}
            result={`${results.ratio.toFixed(1)}:1`}
            resultLabel="Brown:Green Ratio"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Green Material (kg)</label>
                    <input type="number" value={greenMaterial} onChange={(e) => setGreenMaterial(Number(e.target.value))} min={0} />
                    <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>Food scraps, grass, coffee grounds</div>
                </div>
                <div className="input-group">
                    <label className="input-label">Brown Material (kg)</label>
                    <input type="number" value={brownMaterial} onChange={(e) => setBrownMaterial(Number(e.target.value))} min={0} />
                    <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>Leaves, cardboard, straw</div>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Bin Volume (liters)</label>
                <input type="number" value={binVolume} onChange={(e) => setBinVolume(Number(e.target.value))} min={10} />
            </div>
            <div style={{
                background: results.ratioQuality === 'Excellent' ? '#10b98120' :
                    results.ratioQuality === 'Good' ? '#22c55e20' : '#f59e0b20',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                    {results.ratioQuality === 'Excellent' ? '🌿' :
                        results.ratioQuality === 'Good' ? '👍' : '⚠️'}
                </div>
                <div style={{ fontWeight: 600 }}>{results.ratioQuality}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    Ideal ratio is 3:1 (browns to greens)
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Current Ratio</span>
                    <span className="result-detail-value">{results.ratio.toFixed(1)}:1</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Estimated Completion</span>
                    <span className="result-detail-value">{results.estimatedWeeks} weeks</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Expected Compost Yield</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>{results.compostYield.toFixed(1)} kg</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">CO₂ Emissions Saved</span>
                    <span className="result-detail-value" style={{ color: '#22c55e' }}>{results.co2Saved.toFixed(1)} kg</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CompostCalculator
