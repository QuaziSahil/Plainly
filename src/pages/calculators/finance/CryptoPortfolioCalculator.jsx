import { useState, useMemo } from 'react'
import { Bitcoin, TrendingUp, TrendingDown, PieChart, DollarSign, Percent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CryptoPortfolioCalculator() {
    const [holdings, setHoldings] = useState([
        { name: 'Bitcoin', symbol: 'BTC', amount: 0.5, buyPrice: 30000, currentPrice: 45000 },
        { name: 'Ethereum', symbol: 'ETH', amount: 5, buyPrice: 2000, currentPrice: 2500 },
        { name: 'Solana', symbol: 'SOL', amount: 50, buyPrice: 25, currentPrice: 100 }
    ])

    const addHolding = () => {
        setHoldings([...holdings, { name: '', symbol: '', amount: 0, buyPrice: 0, currentPrice: 0 }])
    }

    const updateHolding = (index, field, value) => {
        const updated = [...holdings]
        updated[index][field] = field === 'name' || field === 'symbol' ? value : Number(value)
        setHoldings(updated)
    }

    const removeHolding = (index) => {
        setHoldings(holdings.filter((_, i) => i !== index))
    }

    const results = useMemo(() => {
        let totalInvested = 0
        let totalValue = 0

        const holdingDetails = holdings.map(h => {
            const invested = h.amount * h.buyPrice
            const current = h.amount * h.currentPrice
            const profit = current - invested
            const profitPercent = invested > 0 ? (profit / invested) * 100 : 0

            totalInvested += invested
            totalValue += current

            return {
                ...h,
                invested,
                current,
                profit,
                profitPercent
            }
        })

        const totalProfit = totalValue - totalInvested
        const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

        // Calculate allocation percentages
        const allocations = holdingDetails.map(h => ({
            ...h,
            allocation: totalValue > 0 ? (h.current / totalValue) * 100 : 0
        }))

        return {
            holdings: allocations,
            totalInvested,
            totalValue,
            totalProfit,
            totalProfitPercent
        }
    }, [holdings])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setHoldings([
            { name: 'Bitcoin', symbol: 'BTC', amount: 0.5, buyPrice: 30000, currentPrice: 45000 },
            { name: 'Ethereum', symbol: 'ETH', amount: 5, buyPrice: 2000, currentPrice: 2500 },
            { name: 'Solana', symbol: 'SOL', amount: 50, buyPrice: 25, currentPrice: 100 }
        ])
    }

    return (
        <CalculatorLayout
            title="Crypto Portfolio Calculator"
            description="Track your crypto holdings, profits, and portfolio allocation"
            category="Finance"
            categoryPath="/finance"
            icon={Bitcoin}
            result={formatCurrency(results.totalValue)}
            resultLabel="Portfolio Value"
            onReset={handleReset}
        >
            {/* Portfolio Summary */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #f7931a 0%, #f59e0b 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Total Value</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(results.totalValue)}</div>
                </div>

                <div style={{
                    background: results.totalProfit >= 0
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                        {results.totalProfit >= 0 ? '📈' : '📉'} P/L
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {formatCurrency(results.totalProfit)} ({results.totalProfitPercent.toFixed(1)}%)
                    </div>
                </div>
            </div>

            {/* Holdings List */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Your Holdings</h3>
                    <button
                        onClick={addHolding}
                        style={{
                            padding: '8px 16px',
                            background: '#8b5cf6',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        + Add Coin
                    </button>
                </div>

                {results.holdings.map((holding, index) => (
                    <div key={index} style={{
                        background: '#1a1a2e',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '12px',
                        border: '1px solid #333'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={holding.name}
                                    onChange={(e) => updateHolding(index, 'name', e.target.value)}
                                    placeholder="Coin name"
                                    style={{
                                        padding: '8px',
                                        background: '#0a0a0a',
                                        border: '1px solid #333',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontSize: '14px',
                                        width: '100px'
                                    }}
                                />
                                <input
                                    type="text"
                                    value={holding.symbol}
                                    onChange={(e) => updateHolding(index, 'symbol', e.target.value)}
                                    placeholder="Symbol"
                                    style={{
                                        padding: '8px',
                                        background: '#0a0a0a',
                                        border: '1px solid #333',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontSize: '14px',
                                        width: '60px'
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => removeHolding(index)}
                                style={{
                                    padding: '6px 10px',
                                    background: '#ef444440',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#ef4444',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                            <div>
                                <label style={{ fontSize: '10px', opacity: 0.6 }}>Amount</label>
                                <input
                                    type="number"
                                    value={holding.amount}
                                    onChange={(e) => updateHolding(index, 'amount', e.target.value)}
                                    step="0.0001"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: '#0a0a0a',
                                        border: '1px solid #333',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', opacity: 0.6 }}>Buy Price ($)</label>
                                <input
                                    type="number"
                                    value={holding.buyPrice}
                                    onChange={(e) => updateHolding(index, 'buyPrice', e.target.value)}
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: '#0a0a0a',
                                        border: '1px solid #333',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', opacity: 0.6 }}>Current ($)</label>
                                <input
                                    type="number"
                                    value={holding.currentPrice}
                                    onChange={(e) => updateHolding(index, 'currentPrice', e.target.value)}
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: '#0a0a0a',
                                        border: '1px solid #333',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ opacity: 0.6 }}>Value: {formatCurrency(holding.current)}</span>
                            <span style={{
                                color: holding.profit >= 0 ? '#10b981' : '#ef4444',
                                fontWeight: '600'
                            }}>
                                {holding.profit >= 0 ? '+' : ''}{formatCurrency(holding.profit)} ({holding.profitPercent.toFixed(1)}%)
                            </span>
                            <span style={{ opacity: 0.6 }}>{holding.allocation.toFixed(1)}% of portfolio</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Portfolio Allocation */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                    <PieChart size={14} style={{ marginRight: '6px' }} />
                    Portfolio Allocation
                </h4>
                {results.holdings.map((h, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                            <span>{h.name || 'Unnamed'} ({h.symbol})</span>
                            <span>{h.allocation.toFixed(1)}%</span>
                        </div>
                        <div style={{
                            height: '6px',
                            background: '#333',
                            borderRadius: '3px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${h.allocation}%`,
                                height: '100%',
                                background: `hsl(${(i * 60) % 360}, 70%, 50%)`,
                                borderRadius: '3px'
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </CalculatorLayout>
    )
}

export default CryptoPortfolioCalculator
