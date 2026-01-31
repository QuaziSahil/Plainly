import { useState, useMemo } from 'react'
import { Home } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WallpaperCalculator() {
    const [wallHeight, setWallHeight] = useState(8)
    const [totalWallLength, setTotalWallLength] = useState(40)
    const [rollWidth, setRollWidth] = useState(21) // inches
    const [rollLength, setRollLength] = useState(33) // feet
    const [patternRepeat, setPatternRepeat] = useState(0)
    const [pricePerRoll, setPricePerRoll] = useState(40)

    const results = useMemo(() => {
        const wallArea = wallHeight * totalWallLength
        const rollWidthFt = rollWidth / 12
        const usableLength = rollLength - (patternRepeat / 12)
        const rollCoverage = rollWidthFt * usableLength
        const rollsNeeded = Math.ceil(wallArea / rollCoverage)
        const rollsWithExtra = rollsNeeded + 1 // Always get 1 extra
        const totalCost = rollsWithExtra * pricePerRoll

        return { wallArea, rollCoverage, rollsNeeded, rollsWithExtra, totalCost }
    }, [wallHeight, totalWallLength, rollWidth, rollLength, patternRepeat, pricePerRoll])

    return (
        <CalculatorLayout
            title="Wallpaper Calculator"
            description="Calculate wallpaper rolls needed"
            category="Real Estate"
            categoryPath="/calculators?category=Real%20Estate"
            icon={Home}
            result={results.rollsWithExtra.toString()}
            resultLabel="Rolls Needed"
        >
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>WALL DIMENSIONS</div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Wall Height (ft)</label>
                    <input type="number" value={wallHeight} onChange={(e) => setWallHeight(Number(e.target.value))} min={0} step={0.5} />
                </div>
                <div className="input-group">
                    <label className="input-label">Total Wall Length (ft)</label>
                    <input type="number" value={totalWallLength} onChange={(e) => setTotalWallLength(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, margin: '16px 0 8px' }}>ROLL SPECIFICATIONS</div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Roll Width (inches)</label>
                    <input type="number" value={rollWidth} onChange={(e) => setRollWidth(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Roll Length (ft)</label>
                    <input type="number" value={rollLength} onChange={(e) => setRollLength(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Pattern Repeat (inches)</label>
                    <input type="number" value={patternRepeat} onChange={(e) => setPatternRepeat(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Price per Roll ($)</label>
                    <input type="number" value={pricePerRoll} onChange={(e) => setPricePerRoll(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Wall Area</span>
                    <span className="result-detail-value">{results.wallArea.toFixed(1)} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Roll Coverage</span>
                    <span className="result-detail-value">{results.rollCoverage.toFixed(1)} sq ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Rolls Needed (+1 extra)</span>
                    <span className="result-detail-value">{results.rollsWithExtra}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Cost</span>
                    <span className="result-detail-value">${results.totalCost.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default WallpaperCalculator
