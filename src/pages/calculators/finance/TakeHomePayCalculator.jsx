import { useState, useMemo } from 'react'
import { Wallet, DollarSign, Percent, Building, Shield, Heart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TakeHomePayCalculator() {
    const [grossSalary, setGrossSalary] = useState(75000)
    const [payFrequency, setPayFrequency] = useState('biweekly')
    const [filingStatus, setFilingStatus] = useState('single')
    const [state, setState] = useState('NY')
    const [preTax401k, setPreTax401k] = useState(6)
    const [healthInsurance, setHealthInsurance] = useState(200)
    const [otherDeductions, setOtherDeductions] = useState(0)

    // State tax rates (simplified)
    const stateTaxRates = {
        'CA': 9.3, 'NY': 6.85, 'TX': 0, 'FL': 0, 'WA': 0, 'PA': 3.07,
        'IL': 4.95, 'OH': 3.5, 'GA': 5.75, 'NC': 5.25, 'NJ': 6.37,
        'VA': 5.75, 'MA': 5.0, 'AZ': 4.5, 'CO': 4.4, 'TN': 0, 'NV': 0
    }

    const results = useMemo(() => {
        // Pay periods per year
        const periods = {
            'weekly': 52,
            'biweekly': 26,
            'semimonthly': 24,
            'monthly': 12
        }
        const periodsPerYear = periods[payFrequency]

        // Pre-tax deductions
        const annual401k = grossSalary * (preTax401k / 100)
        const annualHealthInsurance = healthInsurance * 12
        const totalPreTax = annual401k + annualHealthInsurance + (otherDeductions * 12)

        // Taxable income
        const taxableIncome = grossSalary - totalPreTax

        // Federal tax (2024 brackets - simplified)
        let federalTax = 0
        const standardDeduction = filingStatus === 'single' ? 14600 : 29200
        const federalTaxableIncome = Math.max(taxableIncome - standardDeduction, 0)

        if (filingStatus === 'single') {
            if (federalTaxableIncome <= 11600) {
                federalTax = federalTaxableIncome * 0.10
            } else if (federalTaxableIncome <= 47150) {
                federalTax = 1160 + (federalTaxableIncome - 11600) * 0.12
            } else if (federalTaxableIncome <= 100525) {
                federalTax = 5426 + (federalTaxableIncome - 47150) * 0.22
            } else if (federalTaxableIncome <= 191950) {
                federalTax = 17168.50 + (federalTaxableIncome - 100525) * 0.24
            } else {
                federalTax = 39110.50 + (federalTaxableIncome - 191950) * 0.32
            }
        } else {
            // Married filing jointly
            if (federalTaxableIncome <= 23200) {
                federalTax = federalTaxableIncome * 0.10
            } else if (federalTaxableIncome <= 94300) {
                federalTax = 2320 + (federalTaxableIncome - 23200) * 0.12
            } else if (federalTaxableIncome <= 201050) {
                federalTax = 10852 + (federalTaxableIncome - 94300) * 0.22
            } else {
                federalTax = 34337 + (federalTaxableIncome - 201050) * 0.24
            }
        }

        // State tax
        const stateTaxRate = stateTaxRates[state] || 5
        const stateTax = taxableIncome * (stateTaxRate / 100)

        // FICA (Social Security: 6.2%, Medicare: 1.45%)
        const socialSecurity = Math.min(grossSalary, 168600) * 0.062
        const medicare = grossSalary * 0.0145
        const fica = socialSecurity + medicare

        // Total deductions
        const totalTaxes = federalTax + stateTax + fica
        const totalDeductions = totalTaxes + totalPreTax

        // Net pay
        const annualTakeHome = grossSalary - totalDeductions
        const perPaycheck = annualTakeHome / periodsPerYear
        const monthlyTakeHome = annualTakeHome / 12

        return {
            annualTakeHome,
            perPaycheck,
            monthlyTakeHome,
            federalTax,
            stateTax,
            fica,
            totalTaxes,
            totalDeductions,
            annual401k,
            effectiveTaxRate: (totalTaxes / grossSalary) * 100,
            periodsPerYear
        }
    }, [grossSalary, payFrequency, filingStatus, state, preTax401k, healthInsurance, otherDeductions])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setGrossSalary(75000)
        setPayFrequency('biweekly')
        setFilingStatus('single')
        setState('NY')
        setPreTax401k(6)
        setHealthInsurance(200)
        setOtherDeductions(0)
    }

    return (
        <CalculatorLayout
            title="Take Home Pay Calculator"
            description="Calculate your net pay after taxes"
            category="Finance"
            categoryPath="/finance"
            icon={Wallet}
            result={formatCurrency(results.perPaycheck)}
            resultLabel="Per Paycheck"
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
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💵 Per Paycheck</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.perPaycheck)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>{payFrequency}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📅 Monthly</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.monthlyTakeHome)}</div>
                </div>
            </div>

            {/* Annual Take Home */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #333',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>Annual Take Home Pay</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                    {formatCurrency(results.annualTakeHome)}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                    Effective tax rate: {results.effectiveTaxRate.toFixed(1)}%
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Annual Gross Salary
                </label>
                <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">Pay Frequency</label>
                    <select
                        value={payFrequency}
                        onChange={(e) => setPayFrequency(e.target.value)}
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
                        <option value="weekly">Weekly (52/yr)</option>
                        <option value="biweekly">Bi-weekly (26/yr)</option>
                        <option value="semimonthly">Semi-monthly (24/yr)</option>
                        <option value="monthly">Monthly (12/yr)</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Filing Status</label>
                    <select
                        value={filingStatus}
                        onChange={(e) => setFilingStatus(e.target.value)}
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
                        <option value="single">Single</option>
                        <option value="married">Married Filing Jointly</option>
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Building size={14} style={{ marginRight: '6px' }} />
                    State
                </label>
                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
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
                    {Object.entries(stateTaxRates).map(([st, rate]) => (
                        <option key={st} value={st}>{st} ({rate}%)</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Shield size={14} style={{ marginRight: '6px' }} />
                    401(k) Contribution: {preTax401k}%
                </label>
                <input
                    type="range"
                    value={preTax401k}
                    onChange={(e) => setPreTax401k(Number(e.target.value))}
                    min="0"
                    max="23"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Heart size={14} style={{ marginRight: '6px' }} />
                    Monthly Health Insurance Premium
                </label>
                <input
                    type="number"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(Number(e.target.value))}
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

            {/* Tax Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>💰 Annual Tax Breakdown</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Federal Tax</span>
                        <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatCurrency(results.federalTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>State Tax ({state})</span>
                        <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatCurrency(results.stateTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>FICA (SS + Medicare)</span>
                        <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatCurrency(results.fica)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span>Total Taxes</span>
                        <span style={{ fontWeight: '700', color: '#ef4444' }}>{formatCurrency(results.totalTaxes)}</span>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TakeHomePayCalculator
