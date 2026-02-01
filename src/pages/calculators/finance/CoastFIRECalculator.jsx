import { useState, useMemo } from 'react'
import { Anchor, TrendingUp, Calendar, DollarSign, Target, Clock } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CoastFIRECalculator() {
    const [currentAge, setCurrentAge] = useState(30)
    const [targetRetirementAge, setTargetRetirementAge] = useState(65)
    const [currentSavings, setCurrentSavings] = useState(100000)
    const [annualExpenses, setAnnualExpenses] = useState(50000)
    const [investmentReturn, setInvestmentReturn] = useState(7)
    const [withdrawalRate, setWithdrawalRate] = useState(4)

    const results = useMemo(() => {
        const fireNumber = annualExpenses * (100 / withdrawalRate)
        const yearsToRetirement = targetRetirementAge - currentAge
        const r = investmentReturn / 100

        // Coast FIRE number = FIRE number / (1 + r)^years
        const coastFIRENumber = fireNumber / Math.pow(1 + r, yearsToRetirement)

        // Check if already at Coast FIRE
        const isCoastFIRE = currentSavings >= coastFIRENumber

        // If not at Coast FIRE, calculate how much more needed
        const amountNeeded = Math.max(coastFIRENumber - currentSavings, 0)

        // Project current savings to retirement
        const projectedAtRetirement = currentSavings * Math.pow(1 + r, yearsToRetirement)

        // Years until Coast FIRE (if saving extra)
        const monthlyToCoast = amountNeeded / 12

        return {
            fireNumber,
            coastFIRENumber,
            isCoastFIRE,
            amountNeeded,
            projectedAtRetirement,
            yearsToRetirement,
            monthlyToCoast,
            surplus: currentSavings - coastFIRENumber
        }
    }, [currentAge, targetRetirementAge, currentSavings, annualExpenses, investmentReturn, withdrawalRate])

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
        setTargetRetirementAge(65)
        setCurrentSavings(100000)
        setAnnualExpenses(50000)
        setInvestmentReturn(7)
        setWithdrawalRate(4)
    }

    return (
        <CalculatorLayout
            title="Coast FIRE Calculator"
            description="Find out if you can stop saving and still retire on time"
            category="Finance"
            categoryPath="/finance"
            icon={Anchor}
            result={results.isCoastFIRE ? "Achieved! 🎉" : formatCurrency(results.amountNeeded)}
            resultLabel={results.isCoastFIRE ? "Coast FIRE" : "Still Need"}
            onReset={handleReset}
        >
            {/* Status Banner */}
            <div style={{
                background: results.isCoastFIRE
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                    {results.isCoastFIRE ? '🏖️ You\'ve Reached Coast FIRE!' : '🚀 Keep Going!'}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700' }}>
                    {formatCurrency(results.coastFIRENumber)}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                    Coast FIRE Target
                </div>
            </div>

            {/* Result Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>FIRE Number</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#f97316' }}>
                        {formatCurrency(results.fireNumber)}
                    </div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Projected at {targetRetirementAge}</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                        {formatCurrency(results.projectedAtRetirement)}
                    </div>
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
                    <Target size={14} style={{ marginRight: '6px' }} />
                    Target Retirement Age
                </label>
                <input
                    type="number"
                    value={targetRetirementAge}
                    onChange={(e) => setTargetRetirementAge(Number(e.target.value))}
                    min={currentAge + 1}
                    max="100"
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
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Expected Annual Expenses in Retirement
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
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Expected Investment Return: {investmentReturn}%
                </label>
                <input
                    type="range"
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                    min="4"
                    max="12"
                    step="0.5"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
            </div>

            {/* Info Box */}
            <div style={{
                background: 'rgba(14, 165, 233, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(14, 165, 233, 0.2)'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>⚓ What is Coast FIRE?</h4>
                <p style={{ fontSize: '12px', lineHeight: '1.6', opacity: 0.8 }}>
                    Coast FIRE means you've saved enough that compound growth alone will get you to your FIRE number by retirement age.
                    You can stop actively saving and just "coast" - covering only your current expenses with work income.
                </p>
            </div>
        </CalculatorLayout>
    )
}

export default CoastFIRECalculator
