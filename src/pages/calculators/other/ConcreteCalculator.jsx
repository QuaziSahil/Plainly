import { useState, useMemo } from 'react'
import { Cuboid } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ConcreteCalculator() {
    const [shapeType, setShapeType] = useState('slab')
    const [length, setLength] = useState(10)
    const [width, setWidth] = useState(10)
    const [depth, setDepth] = useState(4)
    const [diameter, setDiameter] = useState(12)
    const [height, setHeight] = useState(4)
    const [unit, setUnit] = useState('feet')

    const results = useMemo(() => {
        let volumeCubicFeet

        // Convert to feet if inches
        const conversionFactor = unit === 'inches' ? 1 / 12 : unit === 'meters' ? 3.28084 : 1
        const l = length * conversionFactor
        const w = width * conversionFactor
        const d = depth / 12 // Depth is always in inches, convert to feet
        const h = height * conversionFactor
        const r = (diameter / 2) / 12 // Diameter in inches, convert radius to feet

        if (shapeType === 'slab') {
            volumeCubicFeet = l * w * d
        } else if (shapeType === 'column') {
            volumeCubicFeet = Math.PI * r * r * h
        } else if (shapeType === 'footing') {
            volumeCubicFeet = l * w * d
        } else {
            // Stairs - simplified
            volumeCubicFeet = l * w * d
        }

        // Convert to other units
        const cubicYards = volumeCubicFeet / 27
        const cubicMeters = volumeCubicFeet * 0.0283168

        // Bags of concrete (60 lb bag covers ~0.45 cu ft, 80 lb covers ~0.6 cu ft)
        const bags60lb = Math.ceil(volumeCubicFeet / 0.45)
        const bags80lb = Math.ceil(volumeCubicFeet / 0.6)

        // Cost estimate ($100-150 per cubic yard for ready-mix)
        const costLow = cubicYards * 100
        const costHigh = cubicYards * 150

        return {
            cubicFeet: volumeCubicFeet,
            cubicYards,
            cubicMeters,
            bags60lb,
            bags80lb,
            costLow,
            costHigh
        }
    }, [shapeType, length, width, depth, diameter, height, unit])

    const formatNumber = (value, decimals = 2) => {
        return value.toFixed(decimals)
    }

    return (
        <CalculatorLayout
            title="Concrete Calculator"
            description="Calculate concrete volume needed for your project"
            category="Other"
            categoryPath="/other"
            icon={Cuboid}
            result={`${formatNumber(results.cubicYards)} yd³`}
            resultLabel="Concrete Needed"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Shape</label>
                    <select value={shapeType} onChange={(e) => setShapeType(e.target.value)}>
                        <option value="slab">Slab / Square Footing</option>
                        <option value="column">Column / Round</option>
                        <option value="footing">Wall Footing</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="feet">Feet</option>
                        <option value="inches">Inches</option>
                        <option value="meters">Meters</option>
                    </select>
                </div>
            </div>

            {shapeType === 'column' ? (
                <>
                    <div className="input-group">
                        <label className="input-label">Diameter (inches)</label>
                        <input
                            type="number"
                            value={diameter}
                            onChange={(e) => setDiameter(Number(e.target.value))}
                            min={1}
                            step={0.5}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Height ({unit})</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            min={0.1}
                            step={0.1}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="input-row">
                        <div className="input-group">
                            <label className="input-label">Length ({unit})</label>
                            <input
                                type="number"
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                min={0.1}
                                step={0.1}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Width ({unit})</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                min={0.1}
                                step={0.1}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Depth/Thickness (inches)</label>
                        <input
                            type="number"
                            value={depth}
                            onChange={(e) => setDepth(Number(e.target.value))}
                            min={1}
                            step={0.5}
                        />
                    </div>
                </>
            )}

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Cubic Yards</span>
                    <span className="result-detail-value">{formatNumber(results.cubicYards)} yd³</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Cubic Feet</span>
                    <span className="result-detail-value">{formatNumber(results.cubicFeet)} ft³</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Cubic Meters</span>
                    <span className="result-detail-value">{formatNumber(results.cubicMeters)} m³</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">60 lb Bags</span>
                    <span className="result-detail-value">{results.bags60lb} bags</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">80 lb Bags</span>
                    <span className="result-detail-value">{results.bags80lb} bags</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Est. Cost (Ready-Mix)</span>
                    <span className="result-detail-value">${formatNumber(results.costLow, 0)} - ${formatNumber(results.costHigh, 0)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ConcreteCalculator
