import { useState, useMemo } from 'react'
import { Receipt, DollarSign, Clock, Percent, Building, Calendar } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PaycheckCalculator() {
    const [hourlyRate, setHourlyRate] = useState(25)
    const [hoursWorked, setHoursWorked] = useState(80)
    const [overtimeHours, setOvertimeHours] = useState(0)
    const [overtimeRate, setOvertimeRate] = useState(1.5)
    const [payPeriod, setPayPeriod] = useState('biweekly')
    const [federalWithholding, setFederalWithholding] = useState(12)
    const [stateWithholding, setStateWithholding] = useState(5)
    const [preTaxDeductions, setPreTaxDeductions] = useState(100)
    const [postTaxDeductions, setPostTaxDeductions] = useState(0)

    const results = useMemo(() => {
        // Gross pay calculation
        const regularPay = hourlyRate * hoursWorked
        const overtimePay = hourlyRate * overtimeRate * overtimeHours
        const grossPay = regularPay + overtimePay

        // Pre-tax deductions (401k, health insurance, HSA, etc.)
        const afterPreTax = grossPay - preTaxDeductions

        // Tax calculations
        const federalTax = afterPreTax * (federalWithholding / 100)
        const stateTax = afterPreTax * (stateWithholding / 100)

        // FICA taxes
        const socialSecurity = afterPreTax * 0.062
        const medicare = afterPreTax * 0.0145
        const ficaTax = socialSecurity + medicare

        const totalTaxes = federalTax + stateTax + ficaTax

        // Net pay
        const netPay = afterPreTax - totalTaxes - postTaxDeductions

        // Pay periods per year
        const periodsPerYear = {
            'weekly': 52,
            'biweekly': 26,
            'semimonthly': 24,
            'monthly': 12
        }

        // Annualized amounts
        const annualGross = grossPay * periodsPerYear[payPeriod]
        const annualNet = netPay * periodsPerYear[payPeriod]

        // Hourly equivalent of net pay
        const totalHours = hoursWorked + overtimeHours
        const effectiveHourlyNet = totalHours > 0 ? netPay / totalHours : 0

        return {
            regularPay,
            overtimePay,
            grossPay,
            federalTax,
            stateTax,
            ficaTax,
            totalTaxes,
            preTaxDeductions,
            postTaxDeductions,
            netPay,
            annualGross,
            annualNet,
            effectiveHourlyNet,
            totalHours
        }
    }, [hourlyRate, hoursWorked, overtimeHours, overtimeRate, payPeriod, federalWithholding, stateWithholding, preTaxDeductions, postTaxDeductions])

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
        setHoursWorked(80)
        setOvertimeHours(0)
        setOvertimeRate(1.5)
        setPayPeriod('biweekly')
        setFederalWithholding(12)
        setStateWithholding(5)
        setPreTaxDeductions(100)
        setPostTaxDeductions(0)
    }

    return (
        <CalculatorLayout
            title="Paycheck Calculator"
            description="Calculate your net paycheck"
            category="Finance"
            categoryPath="/finance"
            icon={Receipt}
            result={formatCurrency(results.netPay)}
            resultLabel="Net Pay"
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
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💵 Net Pay</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(results.netPay)}</div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Gross Pay</div>
                    <div style={{ fontSize: '24px', fontWeight: '600' }}>{formatCurrency(results.grossPay)}</div>
                </div>
            </div>

            {/* Hourly Breakdown */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px'
            }}>
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '10px',
                    padding: '14px',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Total Hours</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{results.totalHours}hrs</div>
                </div>
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '10px',
                    padding: '14px',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Effective Net/Hour</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.effectiveHourlyNet)}</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Hourly Rate
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">
                        <Clock size={14} style={{ marginRight: '6px' }} />
                        Regular Hours
                    </label>
                    <input
                        type="number"
                        value={hoursWorked}
                        onChange={(e) => setHoursWorked(Number(e.target.value))}
                        min="0"
                        step="1"
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
                        Overtime Hours
                    </label>
                    <input
                        type="number"
                        value={overtimeHours}
                        onChange={(e) => setOvertimeHours(Number(e.target.value))}
                        min="0"
                        step="1"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">Pay Period</label>
                    <select
                        value={payPeriod}
                        onChange={(e) => setPayPeriod(e.target.value)}
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
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="semimonthly">Semi-monthly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">OT Multiplier</label>
                    <select
                        value={overtimeRate}
                        onChange={(e) => setOvertimeRate(Number(e.target.value))}
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
                        <option value="1.5">1.5x (Time and Half)</option>
                        <option value="2">2x (Double Time)</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">
                        <Percent size={14} style={{ marginRight: '6px' }} />
                        Federal Tax: {federalWithholding}%
                    </label>
                    <input
                        type="range"
                        value={federalWithholding}
                        onChange={(e) => setFederalWithholding(Number(e.target.value))}
                        min="0"
                        max="35"
                        style={{ width: '100%', accentColor: '#ef4444' }}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">
                        <Building size={14} style={{ marginRight: '6px' }} />
                        State Tax: {stateWithholding}%
                    </label>
                    <input
                        type="range"
                        value={stateWithholding}
                        onChange={(e) => setStateWithholding(Number(e.target.value))}
                        min="0"
                        max="15"
                        style={{ width: '100%', accentColor: '#f97316' }}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Pre-Tax Deductions (401k, HSA, etc.)</label>
                <input
                    type="number"
                    value={preTaxDeductions}
                    onChange={(e) => setPreTaxDeductions(Number(e.target.value))}
                    min="0"
                    step="25"
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

            {/* Paycheck Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Paycheck Breakdown</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Regular Pay ({hoursWorked}hrs)</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.regularPay)}</span>
                    </div>
                    {overtimeHours > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ opacity: 0.7 }}>Overtime Pay ({overtimeHours}hrs @ {overtimeRate}x)</span>
                            <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.overtimePay)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span>Gross Pay</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.grossPay)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Federal Tax</span>
                        <span style={{ color: '#ef4444' }}>-{formatCurrency(results.federalTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>State Tax</span>
                        <span style={{ color: '#ef4444' }}>-{formatCurrency(results.stateTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>FICA</span>
                        <span style={{ color: '#ef4444' }}>-{formatCurrency(results.ficaTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Pre-Tax Deductions</span>
                        <span style={{ color: '#8b5cf6' }}>-{formatCurrency(results.preTaxDeductions)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span style={{ fontWeight: '700' }}>Net Pay</span>
                        <span style={{ fontWeight: '700', color: '#10b981', fontSize: '16px' }}>{formatCurrency(results.netPay)}</span>
                    </div>
                </div>
            </div>

            {/* Annual Projection */}
            <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                marginTop: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>📅 Annual Projection</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Gross: {formatCurrency(results.annualGross)}</span>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>Net: {formatCurrency(results.annualNet)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PaycheckCalculator
