import { useState, useMemo } from 'react'
import { Timer } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ScreenTimeCalculator() {
    const [phone, setPhone] = useState(4)
    const [computer, setComputer] = useState(6)
    const [tv, setTv] = useState(2)
    const [tablet, setTablet] = useState(1)
    const [gaming, setGaming] = useState(1)

    const results = useMemo(() => {
        const totalDaily = phone + computer + tv + tablet + gaming
        const totalWeekly = totalDaily * 7
        const totalMonthly = totalDaily * 30
        const totalYearly = totalDaily * 365

        // Health recommendations
        const recommended = 7 // hours max screen time
        const health = totalDaily <= recommended ? 'Good' : totalDaily <= 10 ? 'Moderate' : 'High'

        return {
            totalDaily,
            totalWeekly,
            totalMonthly,
            totalYearly,
            health,
            daysPerYear: Math.round(totalYearly / 24)
        }
    }, [phone, computer, tv, tablet, gaming])

    return (
        <CalculatorLayout
            title="Screen Time Calculator"
            description="Track and analyze your daily screen time"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Timer}
            result={`${results.totalDaily}h`}
            resultLabel="Daily Screen Time"
        >
            <div style={{ fontSize: '12px', opacity: 0.6, margin: '0 0 8px' }}>DAILY USAGE (HOURS)</div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">📱 Phone</label>
                    <input
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(Number(e.target.value))}
                        min={0}
                        max={24}
                        step={0.5}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">💻 Computer</label>
                    <input
                        type="number"
                        value={computer}
                        onChange={(e) => setComputer(Number(e.target.value))}
                        min={0}
                        max={24}
                        step={0.5}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">📺 TV</label>
                    <input
                        type="number"
                        value={tv}
                        onChange={(e) => setTv(Number(e.target.value))}
                        min={0}
                        max={24}
                        step={0.5}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">📋 Tablet</label>
                    <input
                        type="number"
                        value={tablet}
                        onChange={(e) => setTablet(Number(e.target.value))}
                        min={0}
                        max={24}
                        step={0.5}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">🎮 Gaming</label>
                <input
                    type="number"
                    value={gaming}
                    onChange={(e) => setGaming(Number(e.target.value))}
                    min={0}
                    max={24}
                    step={0.5}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Screen Time Today</span>
                    <span className="result-detail-value">{results.totalDaily} hours</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Per Week</span>
                    <span className="result-detail-value">{results.totalWeekly} hours</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Per Month</span>
                    <span className="result-detail-value">{results.totalMonthly} hours</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Per Year</span>
                    <span className="result-detail-value">{results.totalYearly} hours</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Days Per Year on Screens</span>
                    <span className="result-detail-value">{results.daysPerYear} days</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Health Impact</span>
                    <span className="result-detail-value" style={{
                        color: results.health === 'Good' ? '#10b981' :
                            results.health === 'Moderate' ? '#f59e0b' : '#ef4444'
                    }}>
                        {results.health}
                    </span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ScreenTimeCalculator
