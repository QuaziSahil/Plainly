import { useState, useMemo } from 'react'
import { Home, DollarSign, Percent, AlertTriangle, CheckCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RentAffordabilityCalculator() {
    const [monthlyIncome, setMonthlyIncome] = useState(5000)
    const [otherDebts, setOtherDebts] = useState(400)
    const [savingsGoal, setSavingsGoal] = useState(15)
    const [utilities, setUtilities] = useState(150)
    const [renterInsurance, setRenterInsurance] = useState(25)

    const results = useMemo(() => {
        // Standard 30% rule
        const maxRent30 = monthlyIncome * 0.30

        // 50/30/20 rule (50% needs)
        const maxRent50 = (monthlyIncome * 0.50) - utilities - renterInsurance

        // Conservative (25% rule)
        const maxRent25 = monthlyIncome * 0.25

        // Custom based on debts and savings
        const afterSavings = monthlyIncome * (1 - savingsGoal / 100)
        const afterDebts = afterSavings - otherDebts - utilities - renterInsurance
        const recommendedRent = afterDebts * 0.50 // Half of remaining for rent

        // Calculate what's left after rent at each level
        const calculateAfterRent = (rent) => {
            return monthlyIncome - rent - otherDebts - utilities - renterInsurance - (monthlyIncome * savingsGoal / 100)
        }

        // Debt-to-income with various rent levels
        const dtiWith30 = ((maxRent30 + otherDebts) / monthlyIncome) * 100

        return {
            maxRent30,
            maxRent25,
            maxRent50,
            recommendedRent: Math.max(recommendedRent, 0),
            leftover30: calculateAfterRent(maxRent30),
            leftover25: calculateAfterRent(maxRent25),
            dtiWith30,
            annualIncome: monthlyIncome * 12,
            monthlyBudget: monthlyIncome - otherDebts - utilities - renterInsurance
        }
    }, [monthlyIncome, otherDebts, savingsGoal, utilities, renterInsurance])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setMonthlyIncome(5000)
        setOtherDebts(400)
        setSavingsGoal(15)
        setUtilities(150)
        setRenterInsurance(25)
    }

    return (
        <CalculatorLayout
            title="Rent Affordability Calculator"
            description="Find out how much rent you can comfortably afford"
            category="Finance"
            categoryPath="/finance"
            icon={Home}
            result={formatCurrency(results.maxRent30)}
            resultLabel="Max Rent (30% Rule)"
            onReset={handleReset}
        >
            {/* Recommendation Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>🏠 Recommended</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.recommendedRent)}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>Custom for your budget</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>📊 30% Rule</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.maxRent30)}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>Industry standard</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>💰 25% Rule</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.maxRent25)}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>Conservative</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Monthly Gross Income
                </label>
                <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    min="0"
                    step="100"
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
                    Other Monthly Debts (car, loans, etc.)
                </label>
                <input
                    type="number"
                    value={otherDebts}
                    onChange={(e) => setOtherDebts(Number(e.target.value))}
                    min="0"
                    step="50"
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
                    Expected Utilities (electric, gas, internet)
                </label>
                <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
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

            <div className="input-group">
                <label className="input-label">
                    <Percent size={14} style={{ marginRight: '6px' }} />
                    Savings Goal: {savingsGoal}% of income
                </label>
                <input
                    type="range"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(Number(e.target.value))}
                    min="0"
                    max="40"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
            </div>

            {/* Affordability Check */}
            <div style={{
                background: results.dtiWith30 <= 43 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: `1px solid ${results.dtiWith30 <= 43 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {results.dtiWith30 <= 43 ? (
                        <CheckCircle size={16} color="#10b981" />
                    ) : (
                        <AlertTriangle size={16} color="#ef4444" />
                    )}
                    <span style={{ fontWeight: '600', fontSize: '13px' }}>
                        Debt-to-Income: {results.dtiWith30.toFixed(1)}%
                    </span>
                </div>
                <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                    {results.dtiWith30 <= 43
                        ? "Good! Most landlords require DTI under 43%"
                        : "Warning: DTI over 43% may make it harder to qualify"}
                </p>
            </div>

            {/* Budget Summary */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>💡 Income Requirements</h4>
                <div style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.8 }}>
                    <div>Annual income: {formatCurrency(results.annualIncome)}</div>
                    <div>To afford {formatCurrency(results.maxRent30)}/mo rent:</div>
                    <div style={{ paddingLeft: '12px' }}>
                        • Landlords usually want 3x rent = {formatCurrency(results.maxRent30 * 3)}/mo income ✓
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RentAffordabilityCalculator
