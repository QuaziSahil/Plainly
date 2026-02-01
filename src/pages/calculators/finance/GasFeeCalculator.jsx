import { useState, useMemo } from 'react'
import { Fuel, DollarSign, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function GasFeeCalculator() {
    const [gasPrice, setGasPrice] = useState(30)
    const [gasLimit, setGasLimit] = useState(21000)
    const [ethPrice, setEthPrice] = useState(2500)
    const [transactionType, setTransactionType] = useState('transfer')
    const [priorityFee, setPriorityFee] = useState(2)

    const gasLimits = {
        'transfer': 21000,
        'erc20Transfer': 65000,
        'nftMint': 150000,
        'nftTransfer': 85000,
        'swap': 200000,
        'addLiquidity': 180000,
        'stake': 120000,
        'custom': gasLimit
    }

    const results = useMemo(() => {
        const effectiveGasLimit = transactionType === 'custom' ? gasLimit : gasLimits[transactionType]

        // Total gas price = base fee + priority fee
        const totalGasPrice = gasPrice + priorityFee

        // Gas in Gwei to ETH
        const gasCostETH = (totalGasPrice * effectiveGasLimit) / 1e9
        const gasCostUSD = gasCostETH * ethPrice

        // Different speed estimates
        const speeds = {
            slow: { gasPrice: gasPrice * 0.8, time: '10+ min' },
            average: { gasPrice: gasPrice, time: '3-5 min' },
            fast: { gasPrice: gasPrice * 1.2, time: '1-2 min' },
            instant: { gasPrice: gasPrice * 1.5, time: '< 30 sec' }
        }

        const speedCosts = Object.entries(speeds).map(([speed, data]) => ({
            speed,
            time: data.time,
            costETH: ((data.gasPrice + priorityFee) * effectiveGasLimit) / 1e9,
            costUSD: (((data.gasPrice + priorityFee) * effectiveGasLimit) / 1e9) * ethPrice
        }))

        return {
            gasCostETH,
            gasCostUSD,
            effectiveGasLimit,
            totalGasPrice,
            speedCosts
        }
    }, [gasPrice, gasLimit, ethPrice, transactionType, priorityFee])

    const formatETH = (value) => `${value.toFixed(6)} ETH`
    const formatUSD = (value) => `$${value.toFixed(2)}`

    const handleReset = () => {
        setGasPrice(30)
        setGasLimit(21000)
        setEthPrice(2500)
        setTransactionType('transfer')
        setPriorityFee(2)
    }

    return (
        <CalculatorLayout
            title="Gas Fee Calculator"
            description="Estimate Ethereum transaction costs"
            category="Finance"
            categoryPath="/finance"
            icon={Fuel}
            result={formatUSD(results.gasCostUSD)}
            resultLabel="Estimated Fee"
            onReset={handleReset}
        >
            {/* Main Result */}
            <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>⛽ Estimated Gas Fee</div>
                <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatUSD(results.gasCostUSD)}</div>
                <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                    {formatETH(results.gasCostETH)}
                </div>
            </div>

            {/* Speed Options */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                marginBottom: '24px'
            }}>
                {results.speedCosts.map((speed, i) => (
                    <div key={i} style={{
                        background: '#1a1a2e',
                        borderRadius: '10px',
                        padding: '12px',
                        border: speed.speed === 'average' ? '2px solid #6366f1' : '1px solid #333'
                    }}>
                        <div style={{
                            fontSize: '11px',
                            textTransform: 'capitalize',
                            color: speed.speed === 'instant' ? '#10b981' : speed.speed === 'slow' ? '#f97316' : 'white',
                            fontWeight: '600',
                            marginBottom: '4px'
                        }}>
                            {speed.speed === 'instant' ? '🚀' : speed.speed === 'fast' ? '⚡' : speed.speed === 'average' ? '🎯' : '🐢'} {speed.speed}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '600' }}>{formatUSD(speed.costUSD)}</div>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>{speed.time}</div>
                    </div>
                ))}
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <Zap size={14} style={{ marginRight: '6px' }} />
                    Transaction Type
                </label>
                <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
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
                    <option value="transfer">ETH Transfer (~21K gas)</option>
                    <option value="erc20Transfer">ERC-20 Token Transfer (~65K gas)</option>
                    <option value="nftTransfer">NFT Transfer (~85K gas)</option>
                    <option value="nftMint">NFT Mint (~150K gas)</option>
                    <option value="stake">Staking (~120K gas)</option>
                    <option value="addLiquidity">Add Liquidity (~180K gas)</option>
                    <option value="swap">DEX Swap (~200K gas)</option>
                    <option value="custom">Custom Gas Limit</option>
                </select>
            </div>

            {transactionType === 'custom' && (
                <div className="input-group">
                    <label className="input-label">Custom Gas Limit</label>
                    <input
                        type="number"
                        value={gasLimit}
                        onChange={(e) => setGasLimit(Number(e.target.value))}
                        min="21000"
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
            )}

            <div className="input-group">
                <label className="input-label">
                    <Fuel size={14} style={{ marginRight: '6px' }} />
                    Base Gas Price: {gasPrice} Gwei
                </label>
                <input
                    type="range"
                    value={gasPrice}
                    onChange={(e) => setGasPrice(Number(e.target.value))}
                    min="5"
                    max="200"
                    style={{ width: '100%', accentColor: '#6366f1' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.5 }}>
                    <span>5 (Low)</span>
                    <span>200 (High)</span>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Priority Fee (Tip): {priorityFee} Gwei
                </label>
                <input
                    type="range"
                    value={priorityFee}
                    onChange={(e) => setPriorityFee(Number(e.target.value))}
                    min="0"
                    max="20"
                    step="0.5"
                    style={{ width: '100%', accentColor: '#10b981' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    ETH Price (USD)
                </label>
                <input
                    type="number"
                    value={ethPrice}
                    onChange={(e) => setEthPrice(Number(e.target.value))}
                    min="0"
                    step="10"
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

            {/* Technical Info */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Technical Details</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Gas Limit</span>
                        <span style={{ fontWeight: '600' }}>{results.effectiveGasLimit.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Total Gas Price</span>
                        <span style={{ fontWeight: '600' }}>{results.totalGasPrice} Gwei</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Max Fee</span>
                        <span style={{ fontWeight: '600' }}>{formatETH(results.gasCostETH)}</span>
                    </div>
                </div>
            </div>

            {/* Tip */}
            <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                marginTop: '16px',
                border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
                <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                    💡 Gas prices are lowest on weekends and during off-peak hours (UTC 2-6 AM). Use gas trackers for real-time prices.
                </p>
            </div>
        </CalculatorLayout>
    )
}

export default GasFeeCalculator
