import { useState, useMemo } from 'react'
import { Clock, DollarSign, TrendingUp, Calendar, Briefcase } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function OvertimeCalculator() {
    const [hourlyRate, setHourlyRate] = useState(25)
    const [regularHours, setRegularHours] = useState(40)
    const [overtimeHours, setOvertimeHours] = useState(10)
    const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5)
    const [doubleTimeHours, setDoubleTimeHours] = useState(0)

    const results = useMemo(() => {
        const regularPay = hourlyRate * regularHours
        const overtimeRate = hourlyRate * overtimeMultiplier
        const overtimePay = overtimeRate * overtimeHours
        const doubleTimeRate = hourlyRate * 2
        const doubleTimePay = doubleTimeRate * doubleTimeHours

        const totalHours = regularHours + overtimeHours + doubleTimeHours
        const totalPay = regularPay + overtimePay + doubleTimePay
        const effectiveHourlyRate = totalPay / totalHours

        // Weekly/Monthly projections
        const weeklyPay = totalPay
        const monthlyPay = weeklyPay * 4.33
        const yearlyPay = weeklyPay * 52

        // Extra income from overtime
        const extraFromOT = overtimePay - (hourlyRate * overtimeHours)
        const extraFromDT = doubleTimePay - (hourlyRate * doubleTimeHours)

        return {
            regularPay,
            overtimePay,
            overtimeRate,
            doubleTimePay,
            doubleTimeRate,
            totalPay,
            totalHours,
            effectiveHourlyRate,
            weeklyPay,
            monthlyPay,
            yearlyPay,
            extraFromOT,
            extraFromDT,
            totalExtra: extraFromOT + extraFromDT
        }
    }, [hourlyRate, regularHours, overtimeHours, overtimeMultiplier, doubleTimeHours])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setHourlyRate(25)
        setRegularHours(40)
        setOvertimeHours(10)
        setOvertimeMultiplier(1.5)
        setDoubleTimeHours(0)
    }

    return (
        <CalculatorLayout
            title="Overtime Calculator"
            description="Calculate your pay with overtime and double time"
            category="Finance"
            categoryPath="/finance"
            icon={Clock}
            result={formatCurrency(results.totalPay)}
            resultLabel="Weekly Pay"
            onReset={handleReset}
        >
            {/* Summary Cards */}
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
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Weekly Pay</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.totalPay)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>⭐ Extra from OT</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>+{formatCurrency(results.totalExtra)}</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Base Hourly Rate
                </label>
                <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min="0"
                    step="0.5"
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
                    Regular Hours (per week)
                </label>
                <input
                    type="number"
                    value={regularHours}
                    onChange={(e) => setRegularHours(Number(e.target.value))}
                    min="0"
                    max="60"
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
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Overtime Hours
                </label>
                <input
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    min="0"
                    max="40"
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
                    Overtime Multiplier
                </label>
                <select
                    value={overtimeMultiplier}
                    onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                    }}
                >
                    <option value="1.25">1.25x (Time and a Quarter)</option>
                    <option value="1.5">1.5x (Time and a Half)</option>
                    <option value="1.75">1.75x</option>
                    <option value="2">2x (Double Time)</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    Double Time Hours (holidays, etc.)
                </label>
                <input
                    type="number"
                    value={doubleTimeHours}
                    onChange={(e) => setDoubleTimeHours(Number(e.target.value))}
                    min="0"
                    max="24"
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

            {/* Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Pay Breakdown</h4>
                <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Regular ({regularHours} hrs @ {formatCurrency(hourlyRate)})</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.regularPay)}</span>
                    </div>
                    {overtimeHours > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ opacity: 0.7 }}>OT ({overtimeHours} hrs @ {formatCurrency(results.overtimeRate)})</span>
                            <span style={{ fontWeight: '600', color: '#f97316' }}>{formatCurrency(results.overtimePay)}</span>
                        </div>
                    )}
                    {doubleTimeHours > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ opacity: 0.7 }}>2x ({doubleTimeHours} hrs @ {formatCurrency(results.doubleTimeRate)})</span>
                            <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatCurrency(results.doubleTimePay)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px' }}>
                        <span style={{ fontWeight: '600' }}>Total ({results.totalHours} hours)</span>
                        <span style={{ fontWeight: '700', color: '#10b981' }}>{formatCurrency(results.totalPay)}</span>
                    </div>
                </div>
            </div>

            {/* Projections */}
            <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>📅 Projections</h4>
                <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Monthly</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.monthlyPay)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Annual</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.yearlyPay)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Effective Hourly Rate</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.effectiveHourlyRate)}/hr</span>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default OvertimeCalculator
