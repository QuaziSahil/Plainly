import { useState, useMemo } from 'react'
import { Percent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CGPACalculator() {
    const [cgpa, setCgpa] = useState(8.5)
    const [scale, setScale] = useState(10)
    const [system, setSystem] = useState('indian')

    const results = useMemo(() => {
        let percentage

        if (system === 'indian') {
            // Common Indian formula: Percentage = CGPA × 9.5
            percentage = cgpa * 9.5
        } else if (system === 'us') {
            // US 4.0 scale
            percentage = (cgpa / 4) * 100
        } else {
            // Generic conversion
            percentage = (cgpa / scale) * 100
        }

        // Grade equivalent
        let grade, gradePoint
        if (percentage >= 90) { grade = 'A+'; gradePoint = 4.0 }
        else if (percentage >= 85) { grade = 'A'; gradePoint = 3.9 }
        else if (percentage >= 80) { grade = 'A-'; gradePoint = 3.7 }
        else if (percentage >= 75) { grade = 'B+'; gradePoint = 3.3 }
        else if (percentage >= 70) { grade = 'B'; gradePoint = 3.0 }
        else if (percentage >= 65) { grade = 'B-'; gradePoint = 2.7 }
        else if (percentage >= 60) { grade = 'C+'; gradePoint = 2.3 }
        else if (percentage >= 55) { grade = 'C'; gradePoint = 2.0 }
        else if (percentage >= 50) { grade = 'C-'; gradePoint = 1.7 }
        else { grade = 'F'; gradePoint = 0.0 }

        return { percentage: Math.min(100, percentage), grade, gradePoint }
    }, [cgpa, scale, system])

    return (
        <CalculatorLayout
            title="CGPA to Percentage"
            description="Convert CGPA to percentage and grades"
            category="Other"
            categoryPath="/other"
            icon={Percent}
            result={`${results.percentage.toFixed(2)}%`}
            resultLabel="Percentage"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">CGPA/GPA</label>
                    <input type="number" value={cgpa} onChange={(e) => setCgpa(Number(e.target.value))} min={0} max={scale} step={0.01} />
                </div>
                <div className="input-group">
                    <label className="input-label">Scale</label>
                    <input type="number" value={scale} onChange={(e) => setScale(Number(e.target.value))} min={1} max={10} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Grading System</label>
                <select value={system} onChange={(e) => setSystem(e.target.value)}>
                    <option value="indian">Indian (CGPA × 9.5)</option>
                    <option value="us">US (4.0 Scale)</option>
                    <option value="generic">Generic (Proportional)</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Percentage</span>
                    <span className="result-detail-value">{results.percentage.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Letter Grade</span>
                    <span className="result-detail-value">{results.grade}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">4.0 Scale GPA</span>
                    <span className="result-detail-value">{results.gradePoint.toFixed(1)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CGPACalculator
