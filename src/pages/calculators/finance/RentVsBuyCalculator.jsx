import { useState, useMemo } from 'react'
import { Home } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RentVsBuyCalculator() {
    const [homePrice, setHomePrice] = useState(300000)
    const [downPayment, setDownPayment] = useState(60000)
    const [mortgageRate, setMortgageRate] = useState(7)
    const [monthlyRent, setMonthlyRent] = useState(2000)
    const [years, setYears] = useState(5)

    const results = useMemo(() => {
        const loanAmount = homePrice - downPayment
        const monthlyRate = mortgageRate / 100 / 12
        const numPayments = 30 * 12

        const monthlyMortgage = loanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1)

        const propertyTax = homePrice * 0.012 / 12
        const insurance = homePrice * 0.005 / 12
        const maintenance = homePrice * 0.01 / 12
        const totalMonthlyCost = monthlyMortgage + propertyTax + insurance + maintenance

        const totalRentCost = monthlyRent * years * 12
        const totalBuyCost = totalMonthlyCost * years * 12 + downPayment
        const appreciation = homePrice * Math.pow(1.03, years) - homePrice
        const netBuyCost = totalBuyCost - appreciation

        return {
            monthlyMortgage,
            totalMonthlyCost,
            totalRentCost,
            totalBuyCost,
            netBuyCost,
            recommendation: netBuyCost < totalRentCost ? 'Buy' : 'Rent'
        }
    }, [homePrice, downPayment, mortgageRate, monthlyRent, years])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(val)

    return (
        <CalculatorLayout
            title="Rent vs Buy Calculator"
            description="Compare renting vs buying a home"
            category="Finance"
            categoryPath="/finance"
            icon={Home}
            result={results.recommendation}
            resultLabel="Recommendation"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Home Price</label>
                    <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Down Payment</label>
                    <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Mortgage Rate (%)</label>
                    <input type="number" value={mortgageRate} onChange={(e) => setMortgageRate(Number(e.target.value))} min={0} max={20} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Monthly Rent</label>
                    <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Time Horizon (years)</label>
                <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={30} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Ownership Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.totalMonthlyCost)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Rent ({years}yr)</span>
                    <span className="result-detail-value">{formatCurrency(results.totalRentCost)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Net Buy Cost ({years}yr)</span>
                    <span className="result-detail-value">{formatCurrency(results.netBuyCost)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RentVsBuyCalculator
