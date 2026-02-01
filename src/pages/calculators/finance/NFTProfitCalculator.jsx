import { useState, useMemo } from 'react'
import { Image, DollarSign, TrendingUp, TrendingDown, Percent, Tag } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function NFTProfitCalculator() {
    const [buyPrice, setBuyPrice] = useState(0.5)
    const [sellPrice, setSellPrice] = useState(1.2)
    const [buyGasFee, setBuyGasFee] = useState(0.02)
    const [sellGasFee, setSellGasFee] = useState(0.03)
    const [platformFee, setPlatformFee] = useState(2.5)
    const [royaltyFee, setRoyaltyFee] = useState(5)
    const [ethPrice, setEthPrice] = useState(2500)
    const [currency, setCurrency] = useState('eth')

    const results = useMemo(() => {
        // All calculations in ETH first
        const totalBuyCost = buyPrice + buyGasFee
        const platformFeeAmount = sellPrice * (platformFee / 100)
        const royaltyFeeAmount = sellPrice * (royaltyFee / 100)
        const totalFees = buyGasFee + sellGasFee + platformFeeAmount + royaltyFeeAmount

        const netSellAmount = sellPrice - platformFeeAmount - royaltyFeeAmount - sellGasFee
        const grossProfit = sellPrice - buyPrice
        const netProfit = netSellAmount - totalBuyCost
        const profitPercent = totalBuyCost > 0 ? (netProfit / totalBuyCost) * 100 : 0

        // Convert to USD
        const toUSD = (eth) => eth * ethPrice

        // Break-even sell price
        const breakEvenSell = (totalBuyCost + sellGasFee) / (1 - platformFee / 100 - royaltyFee / 100)

        return {
            totalBuyCost,
            netSellAmount,
            grossProfit,
            netProfit,
            profitPercent,
            totalFees,
            breakEvenSell,
            usd: {
                buyPrice: toUSD(buyPrice),
                sellPrice: toUSD(sellPrice),
                netProfit: toUSD(netProfit),
                totalFees: toUSD(totalFees)
            }
        }
    }, [buyPrice, sellPrice, buyGasFee, sellGasFee, platformFee, royaltyFee, ethPrice])

    const formatETH = (value) => `${value.toFixed(4)} ETH`
    const formatUSD = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    const handleReset = () => {
        setBuyPrice(0.5)
        setSellPrice(1.2)
        setBuyGasFee(0.02)
        setSellGasFee(0.03)
        setPlatformFee(2.5)
        setRoyaltyFee(5)
        setEthPrice(2500)
    }

    const isProfitable = results.netProfit > 0

    return (
        <CalculatorLayout
            title="NFT Profit Calculator"
            description="Calculate your NFT trading profits with all fees"
            category="Finance"
            categoryPath="/finance"
            icon={Image}
            result={currency === 'eth' ? formatETH(results.netProfit) : formatUSD(results.usd.netProfit)}
            resultLabel="Net Profit"
            onReset={handleReset}
        >
            {/* Currency Toggle */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px'
            }}>
                <button
                    onClick={() => setCurrency('eth')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: currency === 'eth' ? '#8b5cf6' : '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: currency === 'eth' ? '600' : '400'
                    }}
                >
                    Ξ ETH
                </button>
                <button
                    onClick={() => setCurrency('usd')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: currency === 'usd' ? '#8b5cf6' : '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: currency === 'usd' ? '600' : '400'
                    }}
                >
                    $ USD
                </button>
            </div>

            {/* Result Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: isProfitable
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                        {isProfitable ? '📈 Net Profit' : '📉 Net Loss'}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {currency === 'eth' ? formatETH(results.netProfit) : formatUSD(results.usd.netProfit)}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                        {isProfitable ? '+' : ''}{results.profitPercent.toFixed(1)}% ROI
                    </div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>💸 Total Fees</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#ef4444' }}>
                        {currency === 'eth' ? formatETH(results.totalFees) : formatUSD(results.usd.totalFees)}
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Buy Price (ETH)
                </label>
                <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(Number(e.target.value))}
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
                    <TrendingUp size={14} style={{ marginRight: '6px' }} />
                    Sell Price (ETH)
                </label>
                <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">Buy Gas (ETH)</label>
                    <input
                        type="number"
                        value={buyGasFee}
                        onChange={(e) => setBuyGasFee(Number(e.target.value))}
                        min="0"
                        step="0.001"
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
                    <label className="input-label">Sell Gas (ETH)</label>
                    <input
                        type="number"
                        value={sellGasFee}
                        onChange={(e) => setSellGasFee(Number(e.target.value))}
                        min="0"
                        step="0.001"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">
                        <Tag size={14} style={{ marginRight: '6px' }} />
                        Platform Fee: {platformFee}%
                    </label>
                    <input
                        type="range"
                        value={platformFee}
                        onChange={(e) => setPlatformFee(Number(e.target.value))}
                        min="0"
                        max="10"
                        step="0.5"
                        style={{ width: '100%', accentColor: '#8b5cf6' }}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">
                        <Percent size={14} style={{ marginRight: '6px' }} />
                        Creator Royalty: {royaltyFee}%
                    </label>
                    <input
                        type="range"
                        value={royaltyFee}
                        onChange={(e) => setRoyaltyFee(Number(e.target.value))}
                        min="0"
                        max="15"
                        step="0.5"
                        style={{ width: '100%', accentColor: '#f97316' }}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">ETH Price (USD)</label>
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

            {/* Break-even */}
            <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    📊 Break-even Sell Price
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6' }}>
                    {formatETH(results.breakEvenSell)} ({formatUSD(results.breakEvenSell * ethPrice)})
                </div>
                <p style={{ fontSize: '11px', opacity: 0.7, margin: '8px 0 0 0' }}>
                    Minimum sell price to recover all costs with current fee structure
                </p>
            </div>
        </CalculatorLayout>
    )
}

export default NFTProfitCalculator
