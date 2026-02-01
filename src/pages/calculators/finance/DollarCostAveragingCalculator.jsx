import { useState, useMemo } from 'react'
import { Repeat, TrendingUp, DollarSign, Calendar, BarChart3, Target } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DollarCostAveragingCalculator() {
    const [investmentAmount, setInvestmentAmount] = useState(500)
    const [frequency, setFrequency] = useState('monthly')
    const [duration, setDuration] = useState(5)
    const [expectedReturn, setExpectedReturn] = useState(10)
    const [startingBalance, setStartingBalance] = useState(0)

    const results = useMemo(() => {
        const periodsPerYear = frequency === 'weekly' ? 52 : frequency === 'biweekly' ? 26 : 12
        const totalPeriods = duration * periodsPerYear
        const periodReturn = expectedReturn / 100 / periodsPerYear

        let balance = startingBalance
        let totalContributions = startingBalance

        // Calculate future value with DCA
        for (let i = 0; i < totalPeriods; i++) {
            balance = (balance + investmentAmount) * (1 + periodReturn)
            totalContributions += investmentAmount
        }

        const totalGains = balance - totalContributions
        const returnPercent = totalContributions > 0 ? (totalGains / totalContributions) * 100 : 0

        // Compare to lump sum
        const lumpSumAmount = investmentAmount * totalPeriods + startingBalance
        const lumpSumFV = lumpSumAmount * Math.pow(1 + expectedReturn / 100, duration)

        return {
            finalBalance: balance,
            totalContributions,
            totalGains,
            returnPercent,
            avgCostBasis: totalContributions / (totalPeriods + (startingBalance > 0 ? 1 : 0)),
            investmentsPerYear: periodsPerYear,
            totalInvestments: totalPeriods,
            lumpSumComparison: lumpSumFV,
            annualContribution: investmentAmount * periodsPerYear
        }
    }, [investmentAmount, frequency, duration, expectedReturn, startingBalance])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setInvestmentAmount(500)
        setFrequency('monthly')
        setDuration(5)
        setExpectedReturn(10)
        setStartingBalance(0)
    }

    return (
        <CalculatorLayout
            title="Dollar Cost Averaging Calculator"
            description="See how regular investing builds wealth over time"
            category="Finance"
            categoryPath="/finance"
            icon={Repeat}
            result={formatCurrency(results.finalBalance)}
            resultLabel="Future Value"
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
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Final Balance</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.finalBalance)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📈 Total Gains</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {formatCurrency(results.totalGains)} (+{results.returnPercent.toFixed(1)}%)
                    </div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Total Invested</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{formatCurrency(results.totalContributions)}</div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Annual Investment</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{formatCurrency(results.annualContribution)}</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Investment Amount Per Period
                </label>
                <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
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
                    <Repeat size={14} style={{ marginRight: '6px' }} />
                    Investment Frequency
                </label>
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
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
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    Investment Duration: {duration} years
                </label>
                <input
                    type="range"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                    max="40"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.6 }}>
                    <span>1 year</span>
                    <span>40 years</span>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Expected Annual Return: {expectedReturn}%
                </label>
                <input
                    type="range"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    min="1"
                    max="20"
                    step="0.5"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Starting Balance (Optional)
                </label>
                <input
                    type="number"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(Number(e.target.value))}
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

            {/* Stats */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Investment Stats</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Total Investments Made</span>
                        <span style={{ fontWeight: '600' }}>{results.totalInvestments}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Investments Per Year</span>
                        <span style={{ fontWeight: '600' }}>{results.investmentsPerYear}</span>
                    </div>
                </div>
            </div>

            {/* DCA Benefits */}
            <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>💡 Why DCA Works</h4>
                <ul style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.8, paddingLeft: '16px', margin: 0 }}>
                    <li>Reduces impact of market volatility</li>
                    <li>Removes emotion from investing decisions</li>
                    <li>Enforces consistent investing discipline</li>
                    <li>Lowers average cost per share over time</li>
                </ul>
            </div>
        </CalculatorLayout>
    )
}

export default DollarCostAveragingCalculator
