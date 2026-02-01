import { useState, useMemo } from 'react'
import { Percent, DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CommissionCalculator() {
    const [commissionType, setCommissionType] = useState('percentage')
    const [saleAmount, setSaleAmount] = useState(10000)
    const [commissionRate, setCommissionRate] = useState(10)
    const [flatCommission, setFlatCommission] = useState(500)
    const [baseSalary, setBaseSalary] = useState(3000)
    const [salesGoal, setSalesGoal] = useState(50000)
    const [bonusRate, setBonusRate] = useState(2)

    const results = useMemo(() => {
        // Calculate commission based on type
        let commission = 0
        if (commissionType === 'percentage') {
            commission = saleAmount * (commissionRate / 100)
        } else if (commissionType === 'flat') {
            commission = flatCommission
        } else if (commissionType === 'tiered') {
            // Tiered: 5% up to $10K, 10% $10K-$25K, 15% above $25K
            if (saleAmount <= 10000) {
                commission = saleAmount * 0.05
            } else if (saleAmount <= 25000) {
                commission = 10000 * 0.05 + (saleAmount - 10000) * 0.10
            } else {
                commission = 10000 * 0.05 + 15000 * 0.10 + (saleAmount - 25000) * 0.15
            }
        }

        // Monthly calculations
        const totalMonthlyEarnings = baseSalary + commission
        const yearlyBase = baseSalary * 12
        const yearlyCommission = commission * 12
        const yearlyTotal = totalMonthlyEarnings * 12

        // Goal tracking
        const goalProgress = (saleAmount / salesGoal) * 100
        const overGoal = saleAmount > salesGoal
        const bonusEarned = overGoal ? (saleAmount - salesGoal) * (bonusRate / 100) : 0

        // Effective rate
        const effectiveRate = saleAmount > 0 ? (commission / saleAmount) * 100 : 0

        return {
            commission,
            totalMonthlyEarnings,
            yearlyBase,
            yearlyCommission,
            yearlyTotal,
            goalProgress: Math.min(goalProgress, 100),
            overGoal,
            bonusEarned,
            effectiveRate,
            totalWithBonus: commission + bonusEarned
        }
    }, [commissionType, saleAmount, commissionRate, flatCommission, baseSalary, salesGoal, bonusRate])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setCommissionType('percentage')
        setSaleAmount(10000)
        setCommissionRate(10)
        setFlatCommission(500)
        setBaseSalary(3000)
        setSalesGoal(50000)
        setBonusRate(2)
    }

    return (
        <CalculatorLayout
            title="Commission Calculator"
            description="Calculate sales commission with different structures"
            category="Finance"
            categoryPath="/finance"
            icon={Percent}
            result={formatCurrency(results.commission)}
            resultLabel="Commission Earned"
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
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Commission</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.commission)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📊 Total Monthly</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.totalMonthlyEarnings)}</div>
                </div>
            </div>

            {/* Goal Progress */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #333'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span>Sales Goal Progress</span>
                    <span style={{ color: results.overGoal ? '#10b981' : '#f97316' }}>
                        {results.goalProgress.toFixed(0)}%
                    </span>
                </div>
                <div style={{ height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${results.goalProgress}%`,
                        height: '100%',
                        background: results.overGoal
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : 'linear-gradient(90deg, #f97316, #fbbf24)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
                {results.overGoal && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981' }}>
                        🎉 Goal exceeded! Bonus earned: {formatCurrency(results.bonusEarned)}
                    </div>
                )}
            </div>

            {/* Commission Type */}
            <div className="input-group">
                <label className="input-label">Commission Structure</label>
                <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value)}
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
                    <option value="percentage">Percentage of Sale</option>
                    <option value="flat">Flat Rate per Sale</option>
                    <option value="tiered">Tiered (5%/10%/15%)</option>
                </select>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Sale Amount
                </label>
                <input
                    type="number"
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(Number(e.target.value))}
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

            {commissionType === 'percentage' && (
                <div className="input-group">
                    <label className="input-label">
                        <Percent size={14} style={{ marginRight: '6px' }} />
                        Commission Rate: {commissionRate}%
                    </label>
                    <input
                        type="range"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                        min="1"
                        max="50"
                        style={{ width: '100%', accentColor: '#10b981' }}
                    />
                </div>
            )}

            {commissionType === 'flat' && (
                <div className="input-group">
                    <label className="input-label">
                        <DollarSign size={14} style={{ marginRight: '6px' }} />
                        Flat Commission Per Sale
                    </label>
                    <input
                        type="number"
                        value={flatCommission}
                        onChange={(e) => setFlatCommission(Number(e.target.value))}
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
            )}

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Base Monthly Salary
                </label>
                <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
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
                    <Target size={14} style={{ marginRight: '6px' }} />
                    Monthly Sales Goal
                </label>
                <input
                    type="number"
                    value={salesGoal}
                    onChange={(e) => setSalesGoal(Number(e.target.value))}
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

            {/* Earnings Summary */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>💰 Annual Earnings</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Base Salary</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.yearlyBase)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Commission</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.yearlyCommission)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span style={{ fontWeight: '600' }}>Total Annual</span>
                        <span style={{ fontWeight: '700', color: '#8b5cf6' }}>{formatCurrency(results.yearlyTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Effective Rate */}
            <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginTop: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                fontSize: '12px'
            }}>
                📊 Effective commission rate: <strong>{results.effectiveRate.toFixed(1)}%</strong>
            </div>
        </CalculatorLayout>
    )
}

export default CommissionCalculator
