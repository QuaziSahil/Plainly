import { useState, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RainwaterHarvestCalculator() {
    const [roofArea, setRoofArea] = useState(1500)
    const [annualRainfall, setAnnualRainfall] = useState(40)
    const [collectionEfficiency, setCollectionEfficiency] = useState(80)
    const [waterCostPerGallon, setWaterCostPerGallon] = useState(0.005)

    const results = useMemo(() => {
        // 1 inch of rain on 1 sq ft = 0.623 gallons
        const totalPotentialGallons = roofArea * annualRainfall * 0.623
        const collectedGallons = totalPotentialGallons * (collectionEfficiency / 100)
        const monthlyAverage = collectedGallons / 12
        const annualSavings = collectedGallons * waterCostPerGallon

        // Tank size recommendation (store 2 weeks of average rainfall)
        const recommendedTankSize = (collectedGallons / 26)

        return { totalPotentialGallons, collectedGallons, monthlyAverage, annualSavings, recommendedTankSize }
    }, [roofArea, annualRainfall, collectionEfficiency, waterCostPerGallon])

    return (
        <CalculatorLayout
            title="Rainwater Harvest Calculator"
            description="Calculate rainwater collection potential"
            category="Sustainability"
            categoryPath="/calculators?category=Sustainability"
            icon={Droplets}
            result={`${Math.round(results.collectedGallons).toLocaleString()}`}
            resultLabel="Gallons per Year"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Roof Area (sq ft)</label>
                    <input type="number" value={roofArea} onChange={(e) => setRoofArea(Number(e.target.value))} min={100} />
                </div>
                <div className="input-group">
                    <label className="input-label">Annual Rainfall (inches)</label>
                    <input type="number" value={annualRainfall} onChange={(e) => setAnnualRainfall(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Collection Efficiency (%)</label>
                    <input type="number" value={collectionEfficiency} onChange={(e) => setCollectionEfficiency(Number(e.target.value))} min={50} max={95} />
                </div>
                <div className="input-group">
                    <label className="input-label">Water Cost ($/gallon)</label>
                    <input type="number" value={waterCostPerGallon} onChange={(e) => setWaterCostPerGallon(Number(e.target.value))} min={0} step={0.001} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Potential Collection</span>
                    <span className="result-detail-value">{Math.round(results.totalPotentialGallons).toLocaleString()} gal</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Actual Collection</span>
                    <span className="result-detail-value">{Math.round(results.collectedGallons).toLocaleString()} gal</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Average</span>
                    <span className="result-detail-value">{Math.round(results.monthlyAverage).toLocaleString()} gal</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Annual Savings</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>${results.annualSavings.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Recommended Tank</span>
                    <span className="result-detail-value">{Math.round(results.recommendedTankSize).toLocaleString()} gal</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RainwaterHarvestCalculator
