import { useState, useMemo } from 'react'
import { GraduationCap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function GradeCalculator() {
    const [pointsEarned, setPointsEarned] = useState(85)
    const [totalPoints, setTotalPoints] = useState(100)
    const [currentGrade, setCurrentGrade] = useState(88)
    const [weight, setWeight] = useState(20)

    const results = useMemo(() => {
        // Percentage calculation
        const percentage = totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0

        // Letter grade
        let letterGrade = 'F'
        if (percentage >= 97) letterGrade = 'A+'
        else if (percentage >= 93) letterGrade = 'A'
        else if (percentage >= 90) letterGrade = 'A-'
        else if (percentage >= 87) letterGrade = 'B+'
        else if (percentage >= 83) letterGrade = 'B'
        else if (percentage >= 80) letterGrade = 'B-'
        else if (percentage >= 77) letterGrade = 'C+'
        else if (percentage >= 73) letterGrade = 'C'
        else if (percentage >= 70) letterGrade = 'C-'
        else if (percentage >= 67) letterGrade = 'D+'
        else if (percentage >= 63) letterGrade = 'D'
        else if (percentage >= 60) letterGrade = 'D-'

        // GPA (4.0 scale)
        let gpa = 0
        if (percentage >= 97) gpa = 4.0
        else if (percentage >= 93) gpa = 4.0
        else if (percentage >= 90) gpa = 3.7
        else if (percentage >= 87) gpa = 3.3
        else if (percentage >= 83) gpa = 3.0
        else if (percentage >= 80) gpa = 2.7
        else if (percentage >= 77) gpa = 2.3
        else if (percentage >= 73) gpa = 2.0
        else if (percentage >= 70) gpa = 1.7
        else if (percentage >= 67) gpa = 1.3
        else if (percentage >= 63) gpa = 1.0
        else if (percentage >= 60) gpa = 0.7

        // Weighted impact on overall grade
        const weightedContribution = (percentage * weight) / 100
        const remainingWeight = 100 - weight
        const newOverallGrade = (currentGrade * remainingWeight / 100) + weightedContribution

        return {
            percentage,
            letterGrade,
            gpa,
            weightedContribution,
            newOverallGrade
        }
    }, [pointsEarned, totalPoints, currentGrade, weight])

    return (
        <CalculatorLayout
            title="Grade Calculator"
            description="Calculate grades, percentages, and weighted averages"
            category="Other"
            categoryPath="/other"
            icon={GraduationCap}
            result={`${results.percentage.toFixed(1)}%`}
            resultLabel="Grade"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Points Earned</label>
                    <input
                        type="number"
                        value={pointsEarned}
                        onChange={(e) => setPointsEarned(Number(e.target.value))}
                        min={0}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Total Points</label>
                    <input
                        type="number"
                        value={totalPoints}
                        onChange={(e) => setTotalPoints(Number(e.target.value))}
                        min={1}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Overall Grade</label>
                    <input
                        type="number"
                        value={currentGrade}
                        onChange={(e) => setCurrentGrade(Number(e.target.value))}
                        min={0}
                        max={100}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Assignment Weight (%)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        min={0}
                        max={100}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Percentage</span>
                    <span className="result-detail-value">{results.percentage.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Letter Grade</span>
                    <span className="result-detail-value">{results.letterGrade}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">GPA (4.0 Scale)</span>
                    <span className="result-detail-value">{results.gpa.toFixed(1)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weighted Contribution</span>
                    <span className="result-detail-value">{results.weightedContribution.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">New Overall Grade</span>
                    <span className="result-detail-value">{results.newOverallGrade.toFixed(2)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default GradeCalculator
