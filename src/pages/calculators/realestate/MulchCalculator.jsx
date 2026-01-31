import { useState, useMemo } from 'react'
import { Layers } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function MulchCalculator() {
    const [length, setLength] = useState(20)
    const [width, setWidth] = useState(10)
    const [depth, setDepth] = useState(3) // inches
    const [pricePerYard, setPricePerYard] = useState(35)

    const results = useMemo(() => {
        const areaSqFt = length * width
        const depthFt = depth / 12
        const cubicFeet = areaSqFt * depthFt
        const cubicYards = cubicFeet / 27
        const bags2CuFt = Math.ceil(cubicFeet / 2)
        const totalCost = cubicYards * pricePerYard

        return { areaSqFt, cubicFeet, cubicYards, bags2CuFt, totalCost }
    }, [length, width, depth, pricePerYard])

    return (
        <CalculatorLayout
            title="Mulch Calculator"
            description="Calculate mulch needed for garden beds"
            category="Real Estate"
            categoryPath="/calculators?category=Real%20Estate"
            icon={Layers}
            result={results.cubicYards.toFixed(2)}
            resultLabel="Cubic Yards"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Length (ft)</label>
                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Width (ft)</label>
                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Depth (inches)</label>
                    <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} min={1} max={12} />
                </div>
                <div className="input-group">
                    <label className="input-label">Price per Cubic Yard ($)</label>
                    <input type="number" value={pricePerYard} onChange={(e) => setPricePerYard(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Area</span>
                    <span className="result-detail-value">{results.areaSqFt.toFixed(1)} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Cubic Feet</span>
                    <span className="result-detail-value">{results.cubicFeet.toFixed(1)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Cubic Yards</span>
                    <span className="result-detail-value">{results.cubicYards.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">2 cu ft Bags</span>
                    <span className="result-detail-value">{results.bags2CuFt}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Est. Cost (bulk)</span>
                    <span className="result-detail-value">${results.totalCost.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default MulchCalculator
