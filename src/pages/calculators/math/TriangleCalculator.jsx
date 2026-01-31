import { useState, useMemo } from 'react'
import { Triangle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TriangleCalculator() {
    const [sideA, setSideA] = useState(3)
    const [sideB, setSideB] = useState(4)
    const [sideC, setSideC] = useState(5)

    const results = useMemo(() => {
        const a = sideA
        const b = sideB
        const c = sideC

        // Check if valid triangle
        if (a + b <= c || a + c <= b || b + c <= a) {
            return {
                valid: false,
                perimeter: 0,
                area: 0,
                type: 'Invalid',
                angleA: 0,
                angleB: 0,
                angleC: 0
            }
        }

        // Perimeter
        const perimeter = a + b + c

        // Area using Heron's formula
        const s = perimeter / 2
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))

        // Angles using law of cosines
        const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI)
        const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI)
        const angleC = 180 - angleA - angleB

        // Triangle type
        let type = 'Scalene'
        if (a === b && b === c) {
            type = 'Equilateral'
        } else if (a === b || b === c || a === c) {
            type = 'Isosceles'
        }

        // Check if right triangle
        const sides = [a, b, c].sort((x, y) => x - y)
        if (Math.abs(sides[0] * sides[0] + sides[1] * sides[1] - sides[2] * sides[2]) < 0.0001) {
            type = 'Right'
        }

        return {
            valid: true,
            perimeter,
            area,
            type,
            angleA,
            angleB,
            angleC
        }
    }, [sideA, sideB, sideC])

    return (
        <CalculatorLayout
            title="Triangle Calculator"
            description="Calculate area, perimeter, and angles of a triangle"
            category="Math"
            categoryPath="/math"
            icon={Triangle}
            result={results.valid ? results.area.toFixed(2) : 'Invalid'}
            resultLabel="Area"
        >
            <div className="input-group">
                <label className="input-label">Side A</label>
                <input
                    type="number"
                    value={sideA}
                    onChange={(e) => setSideA(Number(e.target.value))}
                    min={0.1}
                    step={0.1}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Side B</label>
                <input
                    type="number"
                    value={sideB}
                    onChange={(e) => setSideB(Number(e.target.value))}
                    min={0.1}
                    step={0.1}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Side C</label>
                <input
                    type="number"
                    value={sideC}
                    onChange={(e) => setSideC(Number(e.target.value))}
                    min={0.1}
                    step={0.1}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Triangle Type</span>
                    <span className="result-detail-value">{results.type}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Perimeter</span>
                    <span className="result-detail-value">{results.perimeter.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Area</span>
                    <span className="result-detail-value">{results.area.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Angle A</span>
                    <span className="result-detail-value">{results.angleA.toFixed(1)}°</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Angle B</span>
                    <span className="result-detail-value">{results.angleB.toFixed(1)}°</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Angle C</span>
                    <span className="result-detail-value">{results.angleC.toFixed(1)}°</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TriangleCalculator
