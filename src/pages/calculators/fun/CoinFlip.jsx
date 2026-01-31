import { useState, useMemo } from 'react'
import { Coins } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CoinFlip() {
    const [result, setResult] = useState('')
    const [history, setHistory] = useState([])
    const [isFlipping, setIsFlipping] = useState(false)

    const flip = () => {
        setIsFlipping(true)

        // Animate
        let count = 0
        const interval = setInterval(() => {
            setResult(Math.random() > 0.5 ? 'Heads' : 'Tails')
            count++
            if (count > 10) {
                clearInterval(interval)
                const finalResult = Math.random() > 0.5 ? 'Heads' : 'Tails'
                setResult(finalResult)
                setHistory(prev => [finalResult, ...prev.slice(0, 19)])
                setIsFlipping(false)
            }
        }, 80)
    }

    const stats = useMemo(() => {
        const heads = history.filter(h => h === 'Heads').length
        const tails = history.length - heads
        return { heads, tails, total: history.length }
    }, [history])

    const resetHistory = () => setHistory([])

    return (
        <CalculatorLayout
            title="Coin Flip"
            description="Flip a virtual coin"
            category="Fun"
            categoryPath="/fun"
            icon={Coins}
            result={result || '?'}
            resultLabel="Result"
        >
            <button onClick={flip} disabled={isFlipping} style={{
                width: '100%',
                padding: '20px',
                background: isFlipping ? '#666' : '#333',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: isFlipping ? 'wait' : 'pointer',
                fontSize: '18px',
                marginBottom: '16px'
            }}>
                {isFlipping ? '🪙 Flipping...' : '🪙 Flip Coin'}
            </button>

            {result && (
                <div style={{
                    background: result === 'Heads' ? '#fbbf24' : '#94a3b8',
                    borderRadius: '50%',
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#000',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    {result}
                </div>
            )}

            {stats.total > 0 && (
                <div className="result-details">
                    <div className="result-detail-row">
                        <span className="result-detail-label">Total Flips</span>
                        <span className="result-detail-value">{stats.total}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Heads</span>
                        <span className="result-detail-value">{stats.heads} ({stats.total > 0 ? (stats.heads / stats.total * 100).toFixed(1) : 0}%)</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Tails</span>
                        <span className="result-detail-value">{stats.tails} ({stats.total > 0 ? (stats.tails / stats.total * 100).toFixed(1) : 0}%)</span>
                    </div>
                    <button onClick={resetHistory} style={{
                        width: '100%', padding: '8px', background: '#222', border: 'none',
                        borderRadius: '6px', color: '#888', cursor: 'pointer', marginTop: '8px', fontSize: '12px'
                    }}>Reset History</button>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default CoinFlip
