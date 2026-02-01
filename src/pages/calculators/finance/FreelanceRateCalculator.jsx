import { useState, useMemo } from 'react'
import { Briefcase, DollarSign, Clock, Target, Calculator, TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FreelanceRateCalculator() {
    const [targetAnnualIncome, setTargetAnnualIncome] = useState(100000)
    const [weeksOff, setWeeksOff] = useState(4)
    const [hoursPerWeek, setHoursPerWeek] = useState(40)
    const [billablePercent, setBillablePercent] = useState(60)
    const [expenses, setExpenses] = useState(15000)
    const [taxRate, setTaxRate] = useState(30)

    const results = useMemo(() => {
        // Account for taxes to get gross needed
        const grossNeeded = (targetAnnualIncome + expenses) / (1 - taxRate / 100)

        // Working weeks
        const workingWeeks = 52 - weeksOff

        // Billable hours
        const totalHours = workingWeeks * hoursPerWeek
        const billableHours = totalHours * (billablePercent / 100)

        // Hourly rate needed
        const hourlyRate = grossNeeded / billableHours

        // Daily rate (8-hour day)
        const dailyRate = hourlyRate * 8

        // Weekly rate
        const weeklyRate = hourlyRate * hoursPerWeek * (billablePercent / 100)

        // Monthly rate
        const monthlyRate = grossNeeded / 12

        // Project-based rates
        const projectRates = {
            small: hourlyRate * 10,    // ~10 hours
            medium: hourlyRate * 40,   // ~40 hours
            large: hourlyRate * 160    // ~160 hours
        }

        return {
            hourlyRate,
            dailyRate,
            weeklyRate,
            monthlyRate,
            grossNeeded,
            billableHours,
            workingWeeks,
            projectRates,
            effectiveHourlyAfterTax: targetAnnualIncome / billableHours
        }
    }, [targetAnnualIncome, weeksOff, hoursPerWeek, billablePercent, expenses, taxRate])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setTargetAnnualIncome(100000)
        setWeeksOff(4)
        setHoursPerWeek(40)
        setBillablePercent(60)
        setExpenses(15000)
        setTaxRate(30)
    }

    return (
        <CalculatorLayout
            title="Freelance Rate Calculator"
            description="Calculate your ideal hourly, daily, and project rates"
            category="Finance"
            categoryPath="/finance"
            icon={Briefcase}
            result={formatCurrency(results.hourlyRate) + "/hr"}
            resultLabel="Hourly Rate"
            onReset={handleReset}
        >
            {/* Rate Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>⏰ Hourly Rate</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(results.hourlyRate)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📅 Daily Rate</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(results.dailyRate)}</div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Weekly Rate</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{formatCurrency(results.weeklyRate)}</div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Monthly Retainer</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{formatCurrency(results.monthlyRate)}</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <Target size={14} style={{ marginRight: '6px' }} />
                    Target Take-Home Income (Annual)
                </label>
                <input
                    type="number"
                    value={targetAnnualIncome}
                    onChange={(e) => setTargetAnnualIncome(Number(e.target.value))}
                    min="0"
                    step="5000"
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                    }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Annual Business Expenses
                </label>
                <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    min="0"
                    step="1000"
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                    }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Clock size={14} style={{ marginRight: '6px' }} />
                    Hours Per Week: {hoursPerWeek}
                </label>
                <input
                    type="range"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    min="10"
                    max="60"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Calculator size={14} style={{ marginRight: '6px' }} />
                    Billable Hours Percentage: {billablePercent}%
                </label>
                <input
                    type="range"
                    value={billablePercent}
                    onChange={(e) => setBillablePercent(Number(e.target.value))}
                    min="30"
                    max="90"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
                <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
                    (Account for admin, marketing, breaks)
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    Weeks Off Per Year: {weeksOff}
                </label>
                <input
                    type="range"
                    value={weeksOff}
                    onChange={(e) => setWeeksOff(Number(e.target.value))}
                    min="0"
                    max="12"
                    style={{ width: '100%', accentColor: '#f97316' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    Estimated Tax Rate: {taxRate}%
                </label>
                <input
                    type="range"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    min="10"
                    max="50"
                    style={{ width: '100%', accentColor: '#ef4444' }}
                />
            </div>

            {/* Project Rates */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📁 Project-Based Pricing</h4>
                <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Small Project (~10 hrs)</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.projectRates.small)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Medium Project (~1 week)</span>
                        <span style={{ fontWeight: '600', color: '#8b5cf6' }}>{formatCurrency(results.projectRates.medium)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Large Project (~1 month)</span>
                        <span style={{ fontWeight: '600', color: '#f97316' }}>{formatCurrency(results.projectRates.large)}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>📊 Breakdown</h4>
                <div style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.8 }}>
                    <div>Working Weeks: {results.workingWeeks}/year</div>
                    <div>Billable Hours: {Math.round(results.billableHours)}/year</div>
                    <div>Gross Revenue Needed: {formatCurrency(results.grossNeeded)}</div>
                    <div>Effective Rate After Tax: {formatCurrency(results.effectiveHourlyAfterTax)}/hr</div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FreelanceRateCalculator
