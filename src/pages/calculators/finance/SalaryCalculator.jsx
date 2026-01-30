import { useState, useMemo } from 'react'
import { Wallet } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SalaryCalculator() {
    const [amount, setAmount] = useState(50000)
    const [type, setType] = useState('annual')
    const [hoursPerWeek, setHoursPerWeek] = useState(40)
    const [weeksPerYear, setWeeksPerYear] = useState(52)

    const results = useMemo(() => {
        let annual, monthly, biweekly, weekly, daily, hourly

        switch (type) {
            case 'hourly':
                hourly = amount
                weekly = hourly * hoursPerWeek
                biweekly = weekly * 2
                monthly = (weekly * weeksPerYear) / 12
                annual = weekly * weeksPerYear
                daily = weekly / 5
                break
            case 'weekly':
                weekly = amount
                hourly = weekly / hoursPerWeek
                biweekly = weekly * 2
                monthly = (weekly * weeksPerYear) / 12
                annual = weekly * weeksPerYear
                daily = weekly / 5
                break
            case 'monthly':
                monthly = amount
                annual = monthly * 12
                weekly = annual / weeksPerYear
                biweekly = weekly * 2
                hourly = weekly / hoursPerWeek
                daily = weekly / 5
                break
            case 'annual':
            default:
                annual = amount
                monthly = annual / 12
                weekly = annual / weeksPerYear
                biweekly = weekly * 2
                hourly = weekly / hoursPerWeek
                daily = weekly / 5
                break
        }

        return { annual, monthly, biweekly, weekly, daily, hourly }
    }, [amount, type, hoursPerWeek, weeksPerYear])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Salary Calculator"
            subtitle="Convert between hourly, weekly, monthly, and annual salary"
            category="Finance"
            categoryPath="/finance"
            icon={Wallet}
            result={formatCurrency(results.annual)}
            resultLabel="Annual Salary"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={0}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Pay Period</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="hourly">Hourly</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                    </select>
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Hours per Week</label>
                    <input
                        type="number"
                        value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                        min={1}
                        max={168}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Weeks per Year</label>
                    <input
                        type="number"
                        value={weeksPerYear}
                        onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                        min={1}
                        max={52}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Hourly</span>
                    <span className="result-detail-value">{formatCurrency(results.hourly)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Daily</span>
                    <span className="result-detail-value">{formatCurrency(results.daily)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weekly</span>
                    <span className="result-detail-value">{formatCurrency(results.weekly)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Bi-weekly</span>
                    <span className="result-detail-value">{formatCurrency(results.biweekly)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly</span>
                    <span className="result-detail-value">{formatCurrency(results.monthly)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SalaryCalculator
