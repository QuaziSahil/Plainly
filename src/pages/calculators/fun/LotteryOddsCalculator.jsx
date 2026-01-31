import { useState, useMemo } from 'react'
import { Ticket } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LotteryOddsCalculator() {
    const [totalNumbers, setTotalNumbers] = useState(49)
    const [numbersToChoose, setNumbersToChoose] = useState(6)
    const [hasBonusBall, setHasBonusBall] = useState(false)
    const [bonusBallPool, setBonusBallPool] = useState(26)

    const factorial = (n) => {
        if (n <= 1) return 1
        let result = 1
        for (let i = 2; i <= n; i++) result *= i
        return result
    }

    const combinations = (n, r) => {
        if (r > n) return 0
        return Math.round(factorial(n) / (factorial(r) * factorial(n - r)))
    }

    const results = useMemo(() => {
        const mainOdds = combinations(totalNumbers, numbersToChoose)
        const totalOdds = hasBonusBall ? mainOdds * bonusBallPool : mainOdds

        const probability = 1 / totalOdds
        const percentage = probability * 100

        // Comparison odds
        const comparisons = [
            { event: 'Struck by lightning (year)', odds: 1000000 },
            { event: 'Shark attack', odds: 3748067 },
            { event: 'Get a royal flush', odds: 649740 },
            { event: 'Become a millionaire', odds: 8000 }
        ]

        return {
            mainOdds,
            totalOdds,
            probability,
            percentage,
            comparisons
        }
    }, [totalNumbers, numbersToChoose, hasBonusBall, bonusBallPool])

    return (
        <CalculatorLayout
            title="Lottery Odds Calculator"
            description="Calculate your chances of winning"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={Ticket}
            result={`1 in ${results.totalOdds.toLocaleString()}`}
            resultLabel="Jackpot Odds"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Numbers in Pool</label>
                    <input type="number" value={totalNumbers} onChange={(e) => setTotalNumbers(Number(e.target.value))} min={1} max={100} />
                </div>
                <div className="input-group">
                    <label className="input-label">Numbers to Choose</label>
                    <input type="number" value={numbersToChoose} onChange={(e) => setNumbersToChoose(Number(e.target.value))} min={1} max={totalNumbers} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '24px' }}>
                        <input type="checkbox" checked={hasBonusBall} onChange={(e) => setHasBonusBall(e.target.checked)} />
                        Has bonus/power ball
                    </label>
                </div>
                {hasBonusBall && (
                    <div className="input-group">
                        <label className="input-label">Bonus Ball Pool</label>
                        <input type="number" value={bonusBallPool} onChange={(e) => setBonusBallPool(Number(e.target.value))} min={1} max={100} />
                    </div>
                )}
            </div>
            <div style={{
                background: '#1a1a2e',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>YOUR CHANCES OF WINNING</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#a78bfa' }}>1 in {results.totalOdds.toLocaleString()}</div>
                <div style={{ fontSize: '14px', opacity: 0.6, marginTop: '8px' }}>
                    {results.percentage.toExponential(2)}%
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Main Number Combinations</span>
                    <span className="result-detail-value">{results.mainOdds.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Combinations</span>
                    <span className="result-detail-value">{results.totalOdds.toLocaleString()}</span>
                </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>COMPARISON</div>
                {results.comparisons.map((comp, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#1a1a2e',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        fontSize: '13px'
                    }}>
                        <span>{comp.event}</span>
                        <span style={{
                            color: comp.odds < results.totalOdds ? '#10b981' : '#ef4444',
                            fontFamily: 'monospace'
                        }}>
                            1 in {comp.odds.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </CalculatorLayout>
    )
}

export default LotteryOddsCalculator
