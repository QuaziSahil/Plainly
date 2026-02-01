import { useState, useMemo } from 'react'
import { Crown, DollarSign, Calendar, TrendingUp, Sparkles, Home } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FatFIRECalculator() {
    const [currentAge, setCurrentAge] = useState(35)
    const [annualIncome, setAnnualIncome] = useState(200000)
    const [currentSavings, setCurrentSavings] = useState(250000)
    const [savingsRate, setSavingsRate] = useState(40)
    const [investmentReturn, setInvestmentReturn] = useState(7)
    const [fatAnnualExpenses, setFatAnnualExpenses] = useState(150000)

    const results = useMemo(() => {
        // Fat FIRE number (25x expenses for 4% rule)
        const fatFIRENumber = fatAnnualExpenses * 25

        // Compare to regular FIRE
        const regularExpenses = 50000
        const regularFIRENumber = regularExpenses * 25
        const leanExpenses = 30000
        const leanFIRENumber = leanExpenses * 25

        const annualSavings = annualIncome * (savingsRate / 100)
        const r = investmentReturn / 100

        // Calculate years to Fat FIRE
        let years = 0
        let balance = currentSavings
        while (balance < fatFIRENumber && years < 100) {
            balance = balance * (1 + r) + annualSavings
            years++
        }

        const fatFIREAge = currentAge + years
        const monthlyPassiveIncome = fatFIRENumber * 0.04 / 12
        const monthlyBudget = fatAnnualExpenses / 12

        // Lifestyle categories
        const lifestyleBudget = {
            housing: monthlyBudget * 0.25,
            travel: monthlyBudget * 0.15,
            dining: monthlyBudget * 0.10,
            entertainment: monthlyBudget * 0.08,
            healthcare: monthlyBudget * 0.08,
            savings: monthlyBudget * 0.15,
            other: monthlyBudget * 0.19
        }

        return {
            fatFIRENumber,
            regularFIRENumber,
            leanFIRENumber,
            yearsToFatFIRE: years,
            fatFIREAge,
            monthlyPassiveIncome,
            monthlyBudget,
            annualSavings,
            finalBalance: balance,
            lifestyleBudget
        }
    }, [currentAge, annualIncome, currentSavings, savingsRate, investmentReturn, fatAnnualExpenses])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setCurrentAge(35)
        setAnnualIncome(200000)
        setCurrentSavings(250000)
        setSavingsRate(40)
        setInvestmentReturn(7)
        setFatAnnualExpenses(150000)
    }

    return (
        <CalculatorLayout
            title="Fat FIRE Calculator"
            description="Retire with a luxurious lifestyle"
            category="Finance"
            categoryPath="/finance"
            icon={Crown}
            result={formatCurrency(results.fatFIRENumber)}
            resultLabel="Fat FIRE Target"
            onReset={handleReset}
        >
            {/* Main Result */}
            <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                    ✨ Your Fat FIRE Number
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>
                    {formatCurrency(results.fatFIRENumber)}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>
                    Retire at {results.fatFIREAge} ({results.yearsToFatFIRE} years)
                </div>
            </div>

            {/* FIRE Level Comparison */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Lean</div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{formatCurrency(results.leanFIRENumber)}</div>
                </div>
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Regular</div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{formatCurrency(results.regularFIRENumber)}</div>
                </div>
                <div style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    border: '1px solid rgba(245, 158, 11, 0.4)'
                }}>
                    <div style={{ fontSize: '10px', color: '#f59e0b' }}>Fat ✨</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#f59e0b' }}>{formatCurrency(results.fatFIRENumber)}</div>
                </div>
            </div>

            {/* Inputs */}
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
                    step="10000"
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
                    <Crown size={14} style={{ marginRight: '6px' }} />
                    Fat FIRE Annual Expenses (Target Lifestyle)
                </label>
                <input
                    type="number"
                    value={fatAnnualExpenses}
                    onChange={(e) => setFatAnnualExpenses(Number(e.target.value))}
                    min="50000"
                    step="10000"
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
                <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
                    Fat FIRE typically = $100K-$200K+/year
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Current Investments
                </label>
                <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    min="0"
                    step="10000"
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
                    Savings Rate: {savingsRate}%
                </label>
                <input
                    type="range"
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(Number(e.target.value))}
                    min="10"
                    max="70"
                    style={{ width: '100%', accentColor: '#f59e0b' }}
                />
            </div>

            {/* Lifestyle Budget */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>👑 Fat FIRE Monthly Lifestyle</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🏠 Housing</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.lifestyleBudget.housing)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>✈️ Travel</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.lifestyleBudget.travel)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🍽️ Dining</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.lifestyleBudget.dining)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🎭 Entertainment</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.lifestyleBudget.entertainment)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px', marginTop: '4px' }}>
                        <span style={{ fontWeight: '600' }}>Total Monthly</span>
                        <span style={{ fontWeight: '700', color: '#f59e0b' }}>{formatCurrency(results.monthlyBudget)}</span>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FatFIRECalculator
