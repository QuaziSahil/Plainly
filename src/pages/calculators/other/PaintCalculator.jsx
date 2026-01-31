import { useState, useMemo } from 'react'
import { PaintBucket } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PaintCalculator() {
    const [length, setLength] = useState(20)
    const [width, setWidth] = useState(15)
    const [height, setHeight] = useState(9)
    const [doors, setDoors] = useState(2)
    const [windows, setWindows] = useState(3)
    const [coats, setCoats] = useState(2)

    const results = useMemo(() => {
        const wallArea = 2 * (length + width) * height
        const doorArea = doors * 21 // avg door 3x7 ft
        const windowArea = windows * 15 // avg window 3x5 ft
        const paintableArea = wallArea - doorArea - windowArea

        const totalArea = paintableArea * coats
        const sqftPerGallon = 350 // typical coverage
        const gallonsNeeded = totalArea / sqftPerGallon

        return {
            wallArea,
            paintableArea,
            totalArea,
            gallonsNeeded: Math.ceil(gallonsNeeded * 10) / 10,
            quartsNeeded: Math.ceil(gallonsNeeded * 4)
        }
    }, [length, width, height, doors, windows, coats])

    return (
        <CalculatorLayout
            title="Paint Calculator"
            description="Calculate how much paint you need"
            category="Other"
            categoryPath="/other"
            icon={PaintBucket}
            result={`${results.gallonsNeeded} gal`}
            resultLabel="Paint Needed"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Room Length (ft)</label>
                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Room Width (ft)</label>
                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Ceiling Height (ft)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Number of Coats</label>
                    <input type="number" value={coats} onChange={(e) => setCoats(Number(e.target.value))} min={1} max={4} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Doors</label>
                    <input type="number" value={doors} onChange={(e) => setDoors(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Windows</label>
                    <input type="number" value={windows} onChange={(e) => setWindows(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Wall Area</span>
                    <span className="result-detail-value">{results.wallArea.toLocaleString()} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Paintable Area</span>
                    <span className="result-detail-value">{results.paintableArea.toLocaleString()} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Gallons Needed</span>
                    <span className="result-detail-value">{results.gallonsNeeded} gallons</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Or in Quarts</span>
                    <span className="result-detail-value">{results.quartsNeeded} quarts</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PaintCalculator
