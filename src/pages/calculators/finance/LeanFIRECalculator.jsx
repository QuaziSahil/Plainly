import { useState, useMemo } from 'react'
import { Leaf, DollarSign, Calendar, TrendingUp, Target, Download } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LeanFIRECalculator() {
    const [currentAge, setCurrentAge] = useState(30)
    const [annualIncome, setAnnualIncome] = useState(60000)
    const [currentSavings, setCurrentSavings] = useState(30000)
    const [savingsRate, setSavingsRate] = useState(50)
    const [investmentReturn, setInvestmentReturn] = useState(7)

    // Lean FIRE targets minimal expenses
    const [leanAnnualExpenses, setLeanAnnualExpenses] = useState(25000)

    const results = useMemo(() => {
        // Lean FIRE number (using 4% rule = 25x expenses)
        const leanFIRENumber = leanAnnualExpenses * 25

        // Compare to regular FIRE (at higher expense level)
        const regularExpenses = annualIncome * 0.6 // 60% of income
        const regularFIRENumber = regularExpenses * 25

        const annualSavings = annualIncome * (savingsRate / 100)
        const r = investmentReturn / 100

        // Calculate years to Lean FIRE
        let years = 0
        let balance = currentSavings
        while (balance < leanFIRENumber && years < 100) {
            balance = balance * (1 + r) + annualSavings
            years++
        }

        // Calculate years to regular FIRE for comparison
        let regularYears = 0
        let regularBalance = currentSavings
        while (regularBalance < regularFIRENumber && regularYears < 100) {
            regularBalance = regularBalance * (1 + r) + annualSavings
            regularYears++
        }

        const yearsSaved = regularYears - years
        const leanFIREAge = currentAge + years
        const monthlyPassiveIncome = leanFIRENumber * 0.04 / 12

        // Expenses breakdown
        const monthlyBudget = leanAnnualExpenses / 12

        return {
            leanFIRENumber,
            regularFIRENumber,
            yearsToLeanFIRE: years,
            yearsToRegularFIRE: regularYears,
            yearsSaved,
            leanFIREAge,
            monthlyPassiveIncome,
            monthlyBudget,
            annualSavings,
            finalBalance: balance
        }
    }, [currentAge, annualIncome, currentSavings, savingsRate, investmentReturn, leanAnnualExpenses])

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
        setAnnualIncome(60000)
        setCurrentSavings(30000)
        setSavingsRate(50)
        setInvestmentReturn(7)
        setLeanAnnualExpenses(25000)
    }

    return (
        <CalculatorLayout
            title="Lean FIRE Calculator"
            description="Retire early with a minimalist lifestyle"
            category="Finance"
            categoryPath="/finance"
            icon={Leaf}
            result={`${results.yearsToLeanFIRE} years`}
            resultLabel="Time to Lean FIRE"
            onReset={handleReset}
        >
            {/* Comparison Cards */}
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
                    <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>🌿 Lean FIRE</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.leanFIRENumber)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Retire in {results.yearsToLeanFIRE} years</div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>Regular FIRE</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', opacity: 0.8 }}>{formatCurrency(results.regularFIRENumber)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Would take {results.yearsToRegularFIRE} years</div>
                </div>
            </div>

            {/* Years Saved Banner */}
            {results.yearsSaved > 0 && (
                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '20px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    textAlign: 'center'
                }}>
                    <span style={{ fontSize: '24px' }}>🎉</span>
                    <span style={{ marginLeft: '8px', fontWeight: '600', color: '#10b981' }}>
                        Lean FIRE saves you {results.yearsSaved} years!
                    </span>
                </div>
            )}

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
                    Lean FIRE Annual Expenses (Target)
                </label>
                <input
                    type="number"
                    value={leanAnnualExpenses}
                    onChange={(e) => setLeanAnnualExpenses(Number(e.target.value))}
                    min="10000"
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
                <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
                    Lean FIRE typically = $20K-$40K/year
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Current Savings/Investments
                </label>
                <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
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
                    Savings Rate: {savingsRate}%
                </label>
                <input
                    type="range"
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(Number(e.target.value))}
                    min="10"
                    max="80"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
            </div>

            {/* Monthly Budget */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>🌿 Lean FIRE Monthly Budget</h4>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                    {formatCurrency(results.monthlyBudget)}/month
                </div>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>
                    This is {formatCurrency(results.monthlyPassiveIncome)}/month in passive income
                </p>
            </div>

            {/* Tips */}
            <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>💡 Lean FIRE Tips</h4>
                <ul style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.8, paddingLeft: '16px', margin: 0 }}>
                    <li>Consider geographic arbitrage (lower cost areas)</li>
                    <li>Focus on housing as the biggest expense</li>
                    <li>Build flexible skills for part-time work</li>
                    <li>Aim for 3%+ withdrawal rate for extra safety</li>
                </ul>
            </div>
        </CalculatorLayout>
    )
}

export default LeanFIRECalculator
