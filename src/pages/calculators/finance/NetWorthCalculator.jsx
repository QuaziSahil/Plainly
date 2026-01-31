import { useState, useMemo } from 'react'
import { Wallet } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function NetWorthCalculator() {
    const [cash, setCash] = useState(10000)
    const [investments, setInvestments] = useState(50000)
    const [realEstate, setRealEstate] = useState(250000)
    const [vehicles, setVehicles] = useState(20000)
    const [otherAssets, setOtherAssets] = useState(5000)
    const [mortgage, setMortgage] = useState(180000)
    const [carLoans, setCarLoans] = useState(15000)
    const [creditCards, setCreditCards] = useState(5000)
    const [studentLoans, setStudentLoans] = useState(20000)
    const [otherDebts, setOtherDebts] = useState(0)

    const results = useMemo(() => {
        const totalAssets = cash + investments + realEstate + vehicles + otherAssets
        const totalLiabilities = mortgage + carLoans + creditCards + studentLoans + otherDebts
        const netWorth = totalAssets - totalLiabilities
        const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0

        return { totalAssets, totalLiabilities, netWorth, debtToAssetRatio }
    }, [cash, investments, realEstate, vehicles, otherAssets, mortgage, carLoans, creditCards, studentLoans, otherDebts])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(val)

    return (
        <CalculatorLayout
            title="Net Worth Calculator"
            description="Calculate your total net worth"
            category="Finance"
            categoryPath="/finance"
            icon={Wallet}
            result={formatCurrency(results.netWorth)}
            resultLabel="Net Worth"
        >
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', opacity: 0.7 }}>Assets</h3>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Cash & Savings</label>
                    <input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Investments</label>
                    <input type="number" value={investments} onChange={(e) => setInvestments(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Real Estate</label>
                    <input type="number" value={realEstate} onChange={(e) => setRealEstate(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Vehicles</label>
                    <input type="number" value={vehicles} onChange={(e) => setVehicles(Number(e.target.value))} min={0} />
                </div>
            </div>
            <h3 style={{ margin: '16px 0 12px', fontSize: '14px', opacity: 0.7 }}>Liabilities</h3>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Mortgage</label>
                    <input type="number" value={mortgage} onChange={(e) => setMortgage(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Car Loans</label>
                    <input type="number" value={carLoans} onChange={(e) => setCarLoans(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Credit Cards</label>
                    <input type="number" value={creditCards} onChange={(e) => setCreditCards(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Student Loans</label>
                    <input type="number" value={studentLoans} onChange={(e) => setStudentLoans(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Assets</span>
                    <span className="result-detail-value">{formatCurrency(results.totalAssets)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Liabilities</span>
                    <span className="result-detail-value">{formatCurrency(results.totalLiabilities)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Debt-to-Asset Ratio</span>
                    <span className="result-detail-value">{results.debtToAssetRatio.toFixed(1)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default NetWorthCalculator
