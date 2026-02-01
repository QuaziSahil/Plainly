import { useState, useMemo } from 'react'
import { Layers, DollarSign, Percent, TrendingUp, Info, AlertTriangle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DeFiYieldCalculator() {
    const [investmentAmount, setInvestmentAmount] = useState(10000)
    const [apy, setApy] = useState(15)
    const [compoundFrequency, setCompoundFrequency] = useState('daily')
    const [duration, setDuration] = useState(12)
    const [tokenPrice, setTokenPrice] = useState(1)
    const [priceChange, setPriceChange] = useState(0)

    const results = useMemo(() => {
        // Convert APY to periodic rate based on compounding frequency
        const periodsPerYear = {
            'continuously': Infinity,
            'daily': 365,
            'weekly': 52,
            'monthly': 12
        }

        const periods = periodsPerYear[compoundFrequency]
        const years = duration / 12

        let finalValue
        if (compoundFrequency === 'continuously') {
            // Continuous compounding: A = P * e^(rt)
            finalValue = investmentAmount * Math.exp((apy / 100) * years)
        } else {
            // Discrete compounding: A = P * (1 + r/n)^(nt)
            const rate = apy / 100
            finalValue = investmentAmount * Math.pow(1 + rate / periods, periods * years)
        }

        // Account for token price change
        const priceMultiplier = 1 + (priceChange / 100)
        const adjustedValue = finalValue * priceMultiplier

        // Calculate yield metrics
        const totalYield = finalValue - investmentAmount
        const adjustedYield = adjustedValue - investmentAmount
        const effectiveApy = (Math.pow(finalValue / investmentAmount, 1 / years) - 1) * 100

        // Monthly earnings
        const monthlyYield = totalYield / duration

        // Impermanent loss warning (simplified)
        const ilRisk = Math.abs(priceChange) > 20 ? 'high' : Math.abs(priceChange) > 10 ? 'medium' : 'low'

        // Daily earnings
        const dailyEarnings = totalYield / (duration * 30)

        return {
            finalValue,
            adjustedValue,
            totalYield,
            adjustedYield,
            effectiveApy,
            monthlyYield,
            dailyEarnings,
            ilRisk,
            tokens: investmentAmount / tokenPrice,
            finalTokens: finalValue / tokenPrice
        }
    }, [investmentAmount, apy, compoundFrequency, duration, tokenPrice, priceChange])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setInvestmentAmount(10000)
        setApy(15)
        setCompoundFrequency('daily')
        setDuration(12)
        setTokenPrice(1)
        setPriceChange(0)
    }

    return (
        <CalculatorLayout
            title="DeFi Yield Calculator"
            description="Calculate yield farming & staking returns"
            category="Finance"
            categoryPath="/finance"
            icon={Layers}
            result={formatCurrency(results.adjustedValue)}
            resultLabel="Final Value"
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
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Final Value</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.adjustedValue)}</div>
                </div>

                <div style={{
                    background: results.adjustedYield >= 0
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                        {results.adjustedYield >= 0 ? '📈' : '📉'} Net Yield
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {results.adjustedYield >= 0 ? '+' : ''}{formatCurrency(results.adjustedYield)}
                    </div>
                </div>
            </div>

            {/* Earnings Breakdown */}
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
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Monthly Yield</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.monthlyYield)}</div>
                </div>
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '10px',
                    padding: '14px',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Daily Earnings</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#8b5cf6' }}>{formatCurrency(results.dailyEarnings)}</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Investment Amount (USD)
                </label>
                <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
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
                    <Percent size={14} style={{ marginRight: '6px' }} />
                    APY (Annual Percentage Yield): {apy}%
                </label>
                <input
                    type="range"
                    value={apy}
                    onChange={(e) => setApy(Number(e.target.value))}
                    min="1"
                    max="500"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.5 }}>
                    <span>1% (Conservative)</span>
                    <span>500% (High Risk)</span>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Compounding Frequency</label>
                <select
                    value={compoundFrequency}
                    onChange={(e) => setCompoundFrequency(e.target.value)}
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
                    <option value="continuously">Continuously (Auto-compound)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    Duration: {duration} months
                </label>
                <input
                    type="range"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                    max="36"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Expected Token Price Change: {priceChange > 0 ? '+' : ''}{priceChange}%
                </label>
                <input
                    type="range"
                    value={priceChange}
                    onChange={(e) => setPriceChange(Number(e.target.value))}
                    min="-80"
                    max="200"
                    style={{ width: '100%', accentColor: priceChange >= 0 ? '#10b981' : '#ef4444' }}
                />
            </div>

            {/* Risk Warning */}
            {apy > 100 && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    padding: '14px',
                    marginTop: '16px',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <AlertTriangle size={16} color="#ef4444" />
                        <span style={{ fontWeight: '600', fontSize: '13px', color: '#ef4444' }}>High APY Warning</span>
                    </div>
                    <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                        APYs over 100% are often unsustainable. Consider token inflation, rug pull risks, and impermanent loss.
                    </p>
                </div>
            )}

            {/* Info */}
            <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                marginTop: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Info size={16} color="#8b5cf6" />
                    <span style={{ fontWeight: '600', fontSize: '13px' }}>DeFi Yield Factors</span>
                </div>
                <ul style={{ fontSize: '12px', lineHeight: '1.6', opacity: 0.8, paddingLeft: '16px', margin: 0 }}>
                    <li>APY includes auto-compounding effects</li>
                    <li>Token price changes can wipe out yield gains</li>
                    <li>Gas fees reduce actual returns</li>
                    <li>Impermanent loss affects LP positions</li>
                </ul>
            </div>
        </CalculatorLayout>
    )
}

export default DeFiYieldCalculator
