import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function StockProfitCalculator() {
    const [buyPrice, setBuyPrice] = useState(100)
    const [sellPrice, setSellPrice] = useState(150)
    const [shares, setShares] = useState(10)
    const [buyCommission, setBuyCommission] = useState(0)
    const [sellCommission, setSellCommission] = useState(0)

    const results = useMemo(() => {
        const totalBuyCost = (buyPrice * shares) + buyCommission
        const totalSellValue = (sellPrice * shares) - sellCommission
        const profit = totalSellValue - totalBuyCost
        const percentReturn = ((profit / totalBuyCost) * 100)
        const priceChange = sellPrice - buyPrice
        const priceChangePercent = ((priceChange / buyPrice) * 100)

        return { totalBuyCost, totalSellValue, profit, percentReturn, priceChange, priceChangePercent }
    }, [buyPrice, sellPrice, shares, buyCommission, sellCommission])

    return (
        <CalculatorLayout
            title="Stock Profit Calculator"
            description="Calculate stock trading profit/loss"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={`$${results.profit.toFixed(2)}`}
            resultLabel={results.profit >= 0 ? 'Profit' : 'Loss'}
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Buy Price ($)</label>
                    <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} min={0} step={0.01} />
                </div>
                <div className="input-group">
                    <label className="input-label">Sell Price ($)</label>
                    <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Number of Shares</label>
                <input type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} min={1} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Buy Commission ($)</label>
                    <input type="number" value={buyCommission} onChange={(e) => setBuyCommission(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Sell Commission ($)</label>
                    <input type="number" value={sellCommission} onChange={(e) => setSellCommission(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Cost</span>
                    <span className="result-detail-value">${results.totalBuyCost.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Sale Value</span>
                    <span className="result-detail-value">${results.totalSellValue.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Profit/Loss</span>
                    <span className="result-detail-value" style={{ color: results.profit >= 0 ? '#10b981' : '#ef4444' }}>
                        ${results.profit.toFixed(2)} ({results.percentReturn.toFixed(2)}%)
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Price Change</span>
                    <span className="result-detail-value">${results.priceChange.toFixed(2)} ({results.priceChangePercent.toFixed(2)}%)</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default StockProfitCalculator
