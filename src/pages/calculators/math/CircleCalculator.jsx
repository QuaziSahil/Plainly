import { useState, useMemo } from 'react'
import { Circle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CircleCalculator() {
    const [inputType, setInputType] = useState('radius')
    const [value, setValue] = useState(5)

    const results = useMemo(() => {
        let radius = value

        if (inputType === 'diameter') {
            radius = value / 2
        } else if (inputType === 'circumference') {
            radius = value / (2 * Math.PI)
        } else if (inputType === 'area') {
            radius = Math.sqrt(value / Math.PI)
        }

        const diameter = radius * 2
        const circumference = 2 * Math.PI * radius
        const area = Math.PI * radius ** 2

        return { radius, diameter, circumference, area }
    }, [inputType, value])

    return (
        <CalculatorLayout
            title="Circle Calculator"
            description="Calculate circle properties"
            category="Math"
            categoryPath="/math"
            icon={Circle}
            result={results.area.toFixed(4)}
            resultLabel="Area"
        >
            <div className="input-group">
                <label className="input-label">Input Type</label>
                <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
                    <option value="radius">Radius</option>
                    <option value="diameter">Diameter</option>
                    <option value="circumference">Circumference</option>
                    <option value="area">Area</option>
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
                    <span className="result-detail-label">Circumference</span>
                    <span className="result-detail-value">{results.circumference.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Area</span>
                    <span className="result-detail-value">{results.area.toFixed(4)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CircleCalculator
