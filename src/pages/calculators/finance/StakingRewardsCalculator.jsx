import { useState, useMemo } from 'react'
import { Coins, DollarSign, Percent, Calendar, TrendingUp, Lock } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function StakingRewardsCalculator() {
    const [stakeAmount, setStakeAmount] = useState(1000)
    const [apy, setApy] = useState(12)
    const [stakingDuration, setStakingDuration] = useState(12)
    const [tokenPrice, setTokenPrice] = useState(1)
    const [compounding, setCompounding] = useState('monthly')
    const [lockupPeriod, setLockupPeriod] = useState(0)

    const results = useMemo(() => {
        const years = stakingDuration / 12
        const rate = apy / 100

        // Compounding periods per year
        const periods = {
            'none': 1,
            'daily': 365,
            'weekly': 52,
            'monthly': 12
        }

        const n = periods[compounding]

        let finalAmount
        if (compounding === 'none') {
            // Simple interest
            finalAmount = stakeAmount * (1 + rate * years)
        } else {
            // Compound interest
            finalAmount = stakeAmount * Math.pow(1 + rate / n, n * years)
        }

        const totalRewards = finalAmount - stakeAmount
        const effectiveApy = compounding !== 'none'
            ? (Math.pow(1 + rate / n, n) - 1) * 100
            : apy

        // Monthly and daily rewards
        const monthlyRewards = totalRewards / stakingDuration
        const dailyRewards = totalRewards / (stakingDuration * 30)

        // USD values
        const initialValueUSD = stakeAmount * tokenPrice
        const finalValueUSD = finalAmount * tokenPrice
        const rewardsUSD = totalRewards * tokenPrice

        return {
            finalAmount,
            totalRewards,
            effectiveApy,
            monthlyRewards,
            dailyRewards,
            initialValueUSD,
            finalValueUSD,
            rewardsUSD,
            tokensEarned: totalRewards
        }
    }, [stakeAmount, apy, stakingDuration, tokenPrice, compounding, lockupPeriod])

    const formatTokens = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    const formatUSD = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    const handleReset = () => {
        setStakeAmount(1000)
        setApy(12)
        setStakingDuration(12)
        setTokenPrice(1)
        setCompounding('monthly')
        setLockupPeriod(0)
    }

    return (
        <CalculatorLayout
            title="Staking Rewards Calculator"
            description="Calculate your crypto staking earnings"
            category="Finance"
            categoryPath="/finance"
            icon={Coins}
            result={formatTokens(results.totalRewards)}
            resultLabel="Tokens Earned"
            onReset={handleReset}
        >
            {/* Result Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>🪙 Tokens Earned</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatTokens(results.totalRewards)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>{formatUSD(results.rewardsUSD)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Final Balance</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatTokens(results.finalAmount)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>{formatUSD(results.finalValueUSD)}</div>
                </div>
            </div>

            {/* Periodic Earnings */}
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
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Monthly Rewards</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>
                        {formatTokens(results.monthlyRewards)}
                    </div>
                </div>
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '10px',
                    padding: '14px',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Daily Rewards</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                        {formatTokens(results.dailyRewards)}
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <Coins size={14} style={{ marginRight: '6px' }} />
                    Stake Amount (Tokens)
                </label>
                <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
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
                    Token Price (USD)
                </label>
                <input
                    type="number"
                    value={tokenPrice}
                    onChange={(e) => setTokenPrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
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
                    APY: {apy}%
                </label>
                <input
                    type="range"
                    value={apy}
                    onChange={(e) => setApy(Number(e.target.value))}
                    min="1"
                    max="100"
                    style={{ width: '100%', accentColor: '#f59e0b' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.5 }}>
                    <span>1%</span>
                    <span>100%</span>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    Staking Duration: {stakingDuration} months
                </label>
                <input
                    type="range"
                    value={stakingDuration}
                    onChange={(e) => setStakingDuration(Number(e.target.value))}
                    min="1"
                    max="60"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Compounding Frequency
                </label>
                <select
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value)}
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
                    <option value="none">No Compounding (Simple)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Lock size={14} style={{ marginRight: '6px' }} />
                    Lock-up Period: {lockupPeriod} days
                </label>
                <input
                    type="range"
                    value={lockupPeriod}
                    onChange={(e) => setLockupPeriod(Number(e.target.value))}
                    min="0"
                    max="365"
                    step="7"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
            </div>

            {/* APY Comparison */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Effective Returns</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Stated APY</span>
                        <span style={{ fontWeight: '600' }}>{apy}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Effective APY (with compounding)</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{results.effectiveApy.toFixed(2)}%</span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                marginTop: '16px',
                border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
                <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                    💡 Longer lock-up periods often offer higher APYs. Check your staking protocol for specific terms.
                </p>
            </div>
        </CalculatorLayout>
    )
}

export default StakingRewardsCalculator
