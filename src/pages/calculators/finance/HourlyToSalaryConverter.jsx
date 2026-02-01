import { useState, useMemo } from 'react'
import { Clock, DollarSign, ArrowLeftRight, Calendar, Briefcase } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function HourlyToSalaryConverter() {
    const [mode, setMode] = useState('hourlyToSalary')
    const [hourlyRate, setHourlyRate] = useState(25)
    const [annualSalary, setAnnualSalary] = useState(52000)
    const [hoursPerWeek, setHoursPerWeek] = useState(40)
    const [weeksPerYear, setWeeksPerYear] = useState(52)

    const results = useMemo(() => {
        const totalHours = hoursPerWeek * weeksPerYear

        if (mode === 'hourlyToSalary') {
            const annual = hourlyRate * totalHours
            return {
                hourly: hourlyRate,
                daily: hourlyRate * (hoursPerWeek / 5),
                weekly: hourlyRate * hoursPerWeek,
                biweekly: hourlyRate * hoursPerWeek * 2,
                monthly: annual / 12,
                annual: annual,
                totalHours
            }
        } else {
            const hourly = annualSalary / totalHours
            return {
                hourly: hourly,
                daily: hourly * (hoursPerWeek / 5),
                weekly: hourly * hoursPerWeek,
                biweekly: hourly * hoursPerWeek * 2,
                monthly: annualSalary / 12,
                annual: annualSalary,
                totalHours
            }
        }
    }, [mode, hourlyRate, annualSalary, hoursPerWeek, weeksPerYear])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setMode('hourlyToSalary')
        setHourlyRate(25)
        setAnnualSalary(52000)
        setHoursPerWeek(40)
        setWeeksPerYear(52)
    }

    return (
        <CalculatorLayout
            title="Hourly to Salary Converter"
            description="Convert between hourly wages and annual salary"
            category="Finance"
            categoryPath="/finance"
            icon={ArrowLeftRight}
            result={mode === 'hourlyToSalary' ? formatCurrency(results.annual) : formatCurrency(results.hourly) + "/hr"}
            resultLabel={mode === 'hourlyToSalary' ? "Annual Salary" : "Hourly Rate"}
            onReset={handleReset}
        >
            {/* Mode Toggle */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '24px'
            }}>
                <button
                    onClick={() => setMode('hourlyToSalary')}
                    style={{
                        padding: '12px',
                        background: mode === 'hourlyToSalary' ? '#8b5cf6' : '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontWeight: mode === 'hourlyToSalary' ? '600' : '400'
                    }}
                >
                    Hourly → Salary
                </button>
                <button
                    onClick={() => setMode('salaryToHourly')}
                    style={{
                        padding: '12px',
                        background: mode === 'salaryToHourly' ? '#8b5cf6' : '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontWeight: mode === 'salaryToHourly' ? '600' : '400'
                    }}
                >
                    Salary → Hourly
                </button>
            </div>

            {/* Main Result */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                    {mode === 'hourlyToSalary' ? '💰 Annual Salary' : '⏰ Hourly Rate'}
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>
                    {mode === 'hourlyToSalary' ? formatCurrency(results.annual) : formatCurrency(results.hourly)}
                </div>
            </div>

            {/* Input */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    {mode === 'hourlyToSalary' ? 'Hourly Rate' : 'Annual Salary'}
                </label>
                <input
                    type="number"
                    value={mode === 'hourlyToSalary' ? hourlyRate : annualSalary}
                    onChange={(e) => mode === 'hourlyToSalary'
                        ? setHourlyRate(Number(e.target.value))
                        : setAnnualSalary(Number(e.target.value))
                    }
                    min="0"
                    step={mode === 'hourlyToSalary' ? '0.5' : '1000'}
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
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    Weeks Per Year: {weeksPerYear}
                </label>
                <input
                    type="range"
                    value={weeksPerYear}
                    onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                    min="40"
                    max="52"
                    style={{ width: '100%', accentColor: '#f97316' }}
                />
                <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
                    (52 = no vacation, 48 = 4 weeks off)
                </div>
            </div>

            {/* All Conversions */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 All Conversions</h4>
                <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Hourly</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.hourly)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Daily (8hr)</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.daily)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Weekly</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.weekly)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Bi-weekly</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.biweekly)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Monthly</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.monthly)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px' }}>
                        <span style={{ opacity: 0.7 }}>Annual</span>
                        <span style={{ fontWeight: '700', color: '#10b981' }}>{formatCurrency(results.annual)}</span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginTop: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                fontSize: '12px',
                opacity: 0.8
            }}>
                💡 Total hours per year: {results.totalHours.toLocaleString()}
            </div>
        </CalculatorLayout>
    )
}

export default HourlyToSalaryConverter
