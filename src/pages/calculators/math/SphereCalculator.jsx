import { useState, useMemo } from 'react'
import { Globe } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SphereCalculator() {
    const [inputType, setInputType] = useState('radius')
    const [value, setValue] = useState(5)

    const results = useMemo(() => {
        let radius = value

        if (inputType === 'diameter') {
            radius = value / 2
        } else if (inputType === 'surfaceArea') {
            radius = Math.sqrt(value / (4 * Math.PI))
        } else if (inputType === 'volume') {
            radius = Math.pow((3 * value) / (4 * Math.PI), 1 / 3)
        }

        const diameter = radius * 2
        const surfaceArea = 4 * Math.PI * radius ** 2
        const volume = (4 / 3) * Math.PI * radius ** 3

        return { radius, diameter, surfaceArea, volume }
    }, [inputType, value])

    return (
        <CalculatorLayout
            title="Sphere Calculator"
            description="Calculate sphere properties"
            category="Math"
            categoryPath="/math"
            icon={Globe}
            result={results.volume.toFixed(4)}
            resultLabel="Volume"
        >
            <div className="input-group">
                <label className="input-label">Input Type</label>
                <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
                    <option value="radius">Radius</option>
                    <option value="diameter">Diameter</option>
                    <option value="surfaceArea">Surface Area</option>
                    <option value="volume">Volume</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">{inputType.charAt(0).toUpperCase() + inputType.slice(1)}</label>
                <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} min={0} step={0.1} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Radius</span>
                    <span className="result-detail-value">{results.radius.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Diameter</span>
                    <span className="result-detail-value">{results.diameter.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Surface Area</span>
                    <span className="result-detail-value">{results.surfaceArea.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Volume</span>
                    <span className="result-detail-value">{results.volume.toFixed(4)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SphereCalculator
