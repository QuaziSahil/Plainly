import { useState, useMemo } from 'react'
import { Fence } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FenceCalculator() {
    const [totalLength, setTotalLength] = useState(100)
    const [fenceHeight, setFenceHeight] = useState(6)
    const [postSpacing, setPostSpacing] = useState(8)
    const [railsPerSection, setRailsPerSection] = useState(2)
    const [gateCount, setGateCount] = useState(1)
    const [postPrice, setPostPrice] = useState(20)
    const [picketPrice, setPicketPrice] = useState(2)

    const results = useMemo(() => {
        const sections = Math.ceil(totalLength / postSpacing)
        const posts = sections + 1 + gateCount
        const rails = sections * railsPerSection
        const picketsPerFoot = 2 // Standard spacing
        const pickets = Math.ceil(totalLength * picketsPerFoot)

        const postCost = posts * postPrice
        const picketCost = pickets * picketPrice
        const totalCost = postCost + picketCost + (rails * 10) + (gateCount * 100)

        return { sections, posts, rails, pickets, postCost, picketCost, totalCost }
    }, [totalLength, fenceHeight, postSpacing, railsPerSection, gateCount, postPrice, picketPrice])

    return (
        <CalculatorLayout
            title="Fence Calculator"
            description="Calculate fence materials needed"
            category="Real Estate"
            categoryPath="/calculators?category=Real%20Estate"
            icon={Fence}
            result={results.posts.toString()}
            resultLabel="Posts Needed"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Total Length (ft)</label>
                    <input type="number" value={totalLength} onChange={(e) => setTotalLength(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Fence Height (ft)</label>
                    <input type="number" value={fenceHeight} onChange={(e) => setFenceHeight(Number(e.target.value))} min={3} max={8} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Post Spacing (ft)</label>
                    <input type="number" value={postSpacing} onChange={(e) => setPostSpacing(Number(e.target.value))} min={4} max={10} />
                </div>
                <div className="input-group">
                    <label className="input-label">Rails per Section</label>
                    <input type="number" value={railsPerSection} onChange={(e) => setRailsPerSection(Number(e.target.value))} min={1} max={4} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Number of Gates</label>
                    <input type="number" value={gateCount} onChange={(e) => setGateCount(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Post Price ($)</label>
                    <input type="number" value={postPrice} onChange={(e) => setPostPrice(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Fence Sections</span>
                    <span className="result-detail-value">{results.sections}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Posts</span>
                    <span className="result-detail-value">{results.posts}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Rails</span>
                    <span className="result-detail-value">{results.rails}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Pickets</span>
                    <span className="result-detail-value">{results.pickets}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Estimated Cost</span>
                    <span className="result-detail-value">${results.totalCost.toFixed(0)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FenceCalculator
