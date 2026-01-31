import { useState, useMemo } from 'react'
import { Square } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FlooringCalculator() {
    const [length, setLength] = useState(20)
    const [width, setWidth] = useState(15)
    const [flooringType, setFlooringType] = useState('hardwood')
    const [wastage, setWastage] = useState(10)

    const flooringPrices = {
        hardwood: { name: 'Hardwood', price: 8, labor: 4 },
        laminate: { name: 'Laminate', price: 3, labor: 2 },
        vinyl: { name: 'Vinyl', price: 4, labor: 2.5 },
        tile: { name: 'Tile', price: 5, labor: 6 },
        carpet: { name: 'Carpet', price: 4, labor: 1.5 },
        bamboo: { name: 'Bamboo', price: 6, labor: 4 }
    }

    const results = useMemo(() => {
        const area = length * width
        const areaWithWaste = area * (1 + wastage / 100)

        const flooring = flooringPrices[flooringType]
        const materialCost = areaWithWaste * flooring.price
        const laborCost = area * flooring.labor
        const totalCost = materialCost + laborCost

        const boxes = Math.ceil(areaWithWaste / 20) // Typical box covers 20 sq ft

        return {
            area,
            areaWithWaste,
            materialCost,
            laborCost,
            totalCost,
            boxes,
            pricePerSqft: totalCost / area
        }
    }, [length, width, flooringType, wastage])

    const formatCurrency = (val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

    return (
        <CalculatorLayout
            title="Flooring Calculator"
            description="Calculate flooring materials and costs"
            category="Real Estate"
            categoryPath="/real-estate"
            icon={Square}
            result={formatCurrency(results.totalCost)}
            resultLabel="Total Cost"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Length (ft)</label>
                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Width (ft)</label>
                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Flooring Type</label>
                    <select value={flooringType} onChange={(e) => setFlooringType(e.target.value)}>
                        {Object.entries(flooringPrices).map(([key, val]) => (
                            <option key={key} value={key}>{val.name} (${val.price}/sq ft)</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Wastage %</label>
                    <input type="number" value={wastage} onChange={(e) => setWastage(Number(e.target.value))} min={5} max={20} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Room Area</span>
                    <span className="result-detail-value">{results.area} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Material Needed</span>
                    <span className="result-detail-value">{Math.ceil(results.areaWithWaste)} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Est. Boxes</span>
                    <span className="result-detail-value">{results.boxes} boxes</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Material Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.materialCost)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Labor Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.laborCost)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total</span>
                    <span className="result-detail-value">{formatCurrency(results.totalCost)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FlooringCalculator
