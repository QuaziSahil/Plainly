import { useState, useMemo } from 'react'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
}

function GPACalculator() {
    const [courses, setCourses] = useState([
        { name: 'Course 1', credits: 3, grade: 'A' },
        { name: 'Course 2', credits: 3, grade: 'B+' },
        { name: 'Course 3', credits: 4, grade: 'A-' },
    ])

    const addCourse = () => {
        setCourses([...courses, { name: `Course ${courses.length + 1}`, credits: 3, grade: 'A' }])
    }

    const removeCourse = (index) => {
        if (courses.length > 1) {
            setCourses(courses.filter((_, i) => i !== index))
        }
    }

    const updateCourse = (index, field, value) => {
        const updated = [...courses]
        updated[index][field] = value
        setCourses(updated)
    }

    const results = useMemo(() => {
        let totalCredits = 0
        let totalPoints = 0

        courses.forEach(course => {
            const points = gradePoints[course.grade] || 0
            totalCredits += course.credits
            totalPoints += course.credits * points
        })

        const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0

        return { gpa: gpa.toFixed(2), totalCredits, totalPoints: totalPoints.toFixed(2) }
    }, [courses])

    const getGPAStatus = (gpa) => {
        if (gpa >= 3.7) return { text: "Dean's List", color: 'var(--success)' }
        if (gpa >= 3.0) return { text: 'Good Standing', color: 'var(--accent-primary)' }
        if (gpa >= 2.0) return { text: 'Satisfactory', color: 'var(--warning)' }
        return { text: 'Academic Probation', color: 'var(--error)' }
    }

    const status = getGPAStatus(parseFloat(results.gpa))

    return (
        <CalculatorLayout
            title="GPA Calculator"
            subtitle="Calculate your Grade Point Average"
            category="Other"
            categoryPath="/converter"
            icon={GraduationCap}
            result={results.gpa}
            resultLabel="GPA"
        >
            <div style={{ marginBottom: 'var(--space-6)' }}>
                {courses.map((course, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr auto',
                            gap: 'var(--space-2)',
                            marginBottom: 'var(--space-3)',
                            alignItems: 'center'
                        }}
                    >
                        <input
                            type="text"
                            value={course.name}
                            onChange={(e) => updateCourse(index, 'name', e.target.value)}
                            placeholder="Course name"
                            style={{ minHeight: '44px' }}
                        />
                        <input
                            type="number"
                            value={course.credits}
                            onChange={(e) => updateCourse(index, 'credits', Number(e.target.value))}
                            min={1}
                            max={6}
                            style={{ minHeight: '44px' }}
                        />
                        <select
                            value={course.grade}
                            onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                            style={{ minHeight: '44px' }}
                        >
                            {Object.keys(gradePoints).map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => removeCourse(index)}
                            style={{
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-primary)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--error)',
                                cursor: 'pointer'
                            }}
                            disabled={courses.length <= 1}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addCourse}
                    style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-2)',
                        background: 'var(--bg-tertiary)',
                        border: '1px dashed var(--border-secondary)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-body-sm)'
                    }}
                >
                    <Plus size={18} />
                    Add Course
                </button>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Status</span>
                    <span className="result-detail-value" style={{ color: status.color }}>{status.text}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Credits</span>
                    <span className="result-detail-value">{results.totalCredits}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Points</span>
                    <span className="result-detail-value">{results.totalPoints}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default GPACalculator
