import { useState, useMemo } from 'react'
import { GraduationCap } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WeightedGPACalculator() {
    const [courses, setCourses] = useState([
        { name: 'Math', grade: 'A', credits: 4, isAP: true },
        { name: 'English', grade: 'B+', credits: 4, isAP: false },
        { name: 'Science', grade: 'A-', credits: 3, isAP: true },
    ])

    const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    }

    const results = useMemo(() => {
        let totalPoints = 0
        let totalWeightedPoints = 0
        let totalCredits = 0

        courses.forEach(course => {
            const basePoints = gradePoints[course.grade] || 0
            const weightedPoints = course.isAP ? basePoints + 1 : basePoints
            totalPoints += basePoints * course.credits
            totalWeightedPoints += weightedPoints * course.credits
            totalCredits += course.credits
        })

        const unweightedGPA = totalCredits > 0 ? totalPoints / totalCredits : 0
        const weightedGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0

        return { unweightedGPA, weightedGPA, totalCredits }
    }, [courses])

    const addCourse = () => {
        setCourses([...courses, { name: '', grade: 'A', credits: 3, isAP: false }])
    }

    const updateCourse = (index, field, value) => {
        const newCourses = [...courses]
        newCourses[index][field] = value
        setCourses(newCourses)
    }

    const removeCourse = (index) => {
        setCourses(courses.filter((_, i) => i !== index))
    }

    return (
        <CalculatorLayout
            title="Weighted GPA Calculator"
            description="Calculate weighted and unweighted GPA"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={GraduationCap}
            result={results.weightedGPA.toFixed(2)}
            resultLabel="Weighted GPA"
        >
            {courses.map((course, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Course"
                        value={course.name}
                        onChange={(e) => updateCourse(index, 'name', e.target.value)}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    <select value={course.grade} onChange={(e) => updateCourse(index, 'grade', e.target.value)} style={{ width: '60px' }}>
                        {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <input
                        type="number"
                        value={course.credits}
                        onChange={(e) => updateCourse(index, 'credits', Number(e.target.value))}
                        min={1} max={6}
                        style={{ width: '50px' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <input
                            type="checkbox"
                            checked={course.isAP}
                            onChange={(e) => updateCourse(index, 'isAP', e.target.checked)}
                        />
                        AP
                    </label>
                    <button onClick={() => removeCourse(index)} style={{ padding: '4px 8px', background: '#ef4444', border: 'none', borderRadius: '4px', color: '#fff' }}>×</button>
                </div>
            ))}
            <button
                onClick={addCourse}
                style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: 'pointer', marginBottom: '16px' }}
            >
                + Add Course
            </button>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Unweighted GPA</span>
                    <span className="result-detail-value">{results.unweightedGPA.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weighted GPA</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.weightedGPA.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Credits</span>
                    <span className="result-detail-value">{results.totalCredits}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default WeightedGPACalculator
