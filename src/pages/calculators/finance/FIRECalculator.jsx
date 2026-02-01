import { useState, useMemo } from 'react'
import { Flame, TrendingUp, Calendar, DollarSign, Percent, Target, Clock, PiggyBank } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FIRECalculator() {
    const [currentAge, setCurrentAge] = useState(30)
    const [annualIncome, setAnnualIncome] = useState(75000)
    const [annualExpenses, setAnnualExpenses] = useState(45000)
    const [currentSavings, setCurrentSavings] = useState(50000)
    const [savingsRate, setSavingsRate] = useState(40)
    const [investmentReturn, setInvestmentReturn] = useState(7)
    const [withdrawalRate, setWithdrawalRate] = useState(4)

    const results = useMemo(() => {
        // Calculate FIRE number (25x annual expenses for 4% rule)
        const fireNumber = annualExpenses * (100 / withdrawalRate)

        // Annual savings
        const annualSavings = annualIncome * (savingsRate / 100)

        // Calculate years to FIRE using compound growth formula
        // FV = PV(1+r)^n + PMT[((1+r)^n - 1)/r]
        // We need to solve for n when FV = fireNumber

        const r = investmentReturn / 100 // Annual return rate
        let years = 0
        let balance = currentSavings

        while (balance < fireNumber && years < 100) {
            balance = balance * (1 + r) + annualSavings
            years++
        }

        const fireAge = currentAge + years
        const totalContributions = annualSavings * years
        const investmentGains = balance - currentSavings - totalContributions

        // Calculate coast FIRE (amount needed now to coast to retirement at 65)
        const yearsTo65 = Math.max(65 - currentAge, 0)
        const coastFIRENumber = fireNumber / Math.pow(1 + r, yearsTo65)

        // Monthly passive income at FIRE
        const monthlyPassiveIncome = fireNumber * (withdrawalRate / 100) / 12

        return {
            fireNumber,
            yearsToFIRE: years,
            fireAge,
            annualSavings,
            totalContributions,
            investmentGains,
            finalBalance: balance,
            coastFIRENumber,
            monthlyPassiveIncome,
            savingsNeededPerMonth: annualSavings / 12
        }
    }, [currentAge, annualIncome, annualExpenses, currentSavings, savingsRate, investmentReturn, withdrawalRate])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setCurrentAge(30)
        setAnnualIncome(75000)
        setAnnualExpenses(45000)
        setCurrentSavings(50000)
        setSavingsRate(40)
        setInvestmentReturn(7)
        setWithdrawalRate(4)
    }

    return (
        <CalculatorLayout
            title="FIRE Calculator"
            description="Calculate your path to Financial Independence & Retire Early"
            category="Finance"
            categoryPath="/finance"
            icon={Flame}
            result={`${results.yearsToFIRE} years`}
            resultLabel="Time to FIRE"
            onReset={handleReset}
        >
            {/* Result Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>🔥 FIRE Number</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.fireNumber)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>🎯 FIRE Age</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{results.fireAge} years old</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Monthly Passive</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.monthlyPassiveIncome)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>🏖️ Coast FIRE</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.coastFIRENumber)}</div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="input-group">
                <label className="input-label">
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    Current Age
                </label>
                <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    min="18"
                    max="80"
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
                    Annual Income
                </label>
                <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
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
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Annual Expenses
                </label>
                <input
                    type="number"
                    value={annualExpenses}
                    onChange={(e) => setAnnualExpenses(Number(e.target.value))}
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
                    <PiggyBank size={14} style={{ marginRight: '6px' }} />
                    Current Savings/Investments
                </label>
                <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
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
                    <Percent size={14} style={{ marginRight: '6px' }} />
                    Savings Rate: {savingsRate}%
                </label>
                <input
                    type="range"
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(Number(e.target.value))}
                    min="5"
                    max="80"
                    style={{ width: '100%', accentColor: '#f97316' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.6 }}>
                    <span>5%</span>
                    <span>80%</span>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Expected Return: {investmentReturn}%
                </label>
                <input
                    type="range"
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                    min="3"
                    max="12"
                    step="0.5"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.6 }}>
                    <span>3%</span>
                    <span>12%</span>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Target size={14} style={{ marginRight: '6px' }} />
                    Withdrawal Rate: {withdrawalRate}%
                </label>
                <input
                    type="range"
                    value={withdrawalRate}
                    onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                    min="2"
                    max="5"
                    step="0.25"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.6 }}>
                    <span>2% (Very Safe)</span>
                    <span>5% (Aggressive)</span>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '24px',
                border: '1px solid #333'
            }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', opacity: 0.8 }}>
                    📊 Your FIRE Journey Breakdown
                </h3>

                <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
                        <span style={{ opacity: 0.7 }}>Monthly Savings Needed</span>
                        <span style={{ fontWeight: '600', color: '#f97316' }}>{formatCurrency(results.savingsNeededPerMonth)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
                        <span style={{ opacity: 0.7 }}>Annual Savings</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.annualSavings)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
                        <span style={{ opacity: 0.7 }}>Total Contributions</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.totalContributions)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
                        <span style={{ opacity: 0.7 }}>Investment Gains</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.investmentGains)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ opacity: 0.7 }}>Final Portfolio Value</span>
                        <span style={{ fontWeight: '700', fontSize: '18px', color: '#f97316' }}>{formatCurrency(results.finalBalance)}</span>
                    </div>
                </div>
            </div>

            {/* FIRE Types Info */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(249, 115, 22, 0.2)'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>🔥 Types of FIRE</h4>
                <div style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.8 }}>
                    <div><strong>Lean FIRE:</strong> {formatCurrency(30000 * 25)} (Living on ~$30K/year)</div>
                    <div><strong>Regular FIRE:</strong> {formatCurrency(50000 * 25)} (Living on ~$50K/year)</div>
                    <div><strong>Fat FIRE:</strong> {formatCurrency(100000 * 25)} (Living on ~$100K/year)</div>
                    <div><strong>Coast FIRE:</strong> {formatCurrency(results.coastFIRENumber)} (Stop saving now, retire at 65)</div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FIRECalculator
