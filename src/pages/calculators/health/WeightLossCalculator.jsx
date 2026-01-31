import { useState, useMemo } from 'react'
import { TrendingDown } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WeightLossCalculator() {
    const [currentWeight, setCurrentWeight] = useState(180)
    const [goalWeight, setGoalWeight] = useState(160)
    const [unit, setUnit] = useState('lbs')
    const [weeklyLoss, setWeeklyLoss] = useState(1)

    const results = useMemo(() => {
        const weightToLose = currentWeight - goalWeight

        if (weightToLose <= 0) {
            return { valid: false, message: "Already at or below goal!" }
        }

        const weeksToGoal = Math.ceil(weightToLose / weeklyLoss)
        const daysToGoal = weeksToGoal * 7

        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() + daysToGoal)

        // Calorie calculations
        // 1 lb = ~3500 calories, 1 kg = ~7700 calories
        const calPerUnit = unit === 'lbs' ? 3500 : 7700
        const dailyDeficit = (weeklyLoss * calPerUnit) / 7

        // Milestones
        const milestones = []
        for (let pct of [25, 50, 75, 100]) {
            const milestone = currentWeight - (weightToLose * pct / 100)
            const daysToMilestone = Math.round(daysToGoal * pct / 100)
            const milestoneDate = new Date()
            milestoneDate.setDate(milestoneDate.getDate() + daysToMilestone)
            milestones.push({
                percent: pct,
                weight: milestone.toFixed(1),
                date: milestoneDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            })
        }

        return {
            valid: true,
            weightToLose,
            weeksToGoal,
            daysToGoal,
            targetDate: targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            dailyDeficit,
            milestones
        }
    }, [currentWeight, goalWeight, unit, weeklyLoss])

    return (
        <CalculatorLayout
            title="Weight Loss Calculator"
            description="Plan your weight loss journey"
            category="Health"
            categoryPath="/health"
            icon={TrendingDown}
            result={results.valid ? `${results.weeksToGoal} weeks` : 'N/A'}
            resultLabel="Time to Goal"
        >
            <div className="input-group">
                <label className="input-label">Units</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="lbs">Pounds (lbs)</option>
                    <option value="kg">Kilograms (kg)</option>
                </select>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Weight</label>
                    <input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Goal Weight</label>
                    <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Weekly Loss Rate ({unit}/week)</label>
                <select value={weeklyLoss} onChange={(e) => setWeeklyLoss(Number(e.target.value))}>
                    <option value={0.5}>{unit === 'lbs' ? '0.5' : '0.25'} - Slow & Steady</option>
                    <option value={1}>{unit === 'lbs' ? '1' : '0.5'} - Recommended</option>
                    <option value={1.5}>{unit === 'lbs' ? '1.5' : '0.75'} - Moderate</option>
                    <option value={2}>{unit === 'lbs' ? '2' : '1'} - Aggressive</option>
                </select>
            </div>
            {results.valid ? (
                <>
                    <div style={{
                        background: '#22c55e20',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        marginBottom: '16px'
                    }}>
                        <div style={{ fontSize: '14px', opacity: 0.6 }}>🎯 You'll reach your goal by</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e', marginTop: '8px' }}>
                            {results.targetDate}
                        </div>
                        <div style={{ fontSize: '13px', marginTop: '8px' }}>
                            {results.weightToLose.toFixed(1)} {unit} to lose • {results.weeksToGoal} weeks
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>📅 MILESTONES</div>
                        {results.milestones.map((m, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px',
                                background: m.percent === 100 ? '#22c55e20' : '#1a1a2e',
                                borderRadius: '8px',
                                marginBottom: '6px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: m.percent === 100 ? '#22c55e' : '#333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '12px'
                                }}>
                                    {m.percent}%
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{m.weight} {unit}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{m.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">Required Daily Deficit</span>
                            <span className="result-detail-value" style={{ color: '#f59e0b' }}>{Math.round(results.dailyDeficit)} cal</span>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{
                    background: '#22c55e20',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px' }}>🎉</div>
                    <div style={{ fontWeight: 600, color: '#22c55e' }}>{results.message}</div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default WeightLossCalculator
