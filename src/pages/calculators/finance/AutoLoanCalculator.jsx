import { useState, useMemo } from 'react'
import { Car } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function AutoLoanCalculator() {
    const [vehiclePrice, setVehiclePrice] = useState(35000)
    const [downPayment, setDownPayment] = useState(5000)
    const [tradeInValue, setTradeInValue] = useState(0)
    const [interestRate, setInterestRate] = useState(6.5)
    const [loanTerm, setLoanTerm] = useState(60)
    const [salesTax, setSalesTax] = useState(7)

    const results = useMemo(() => {
        const taxAmount = (vehiclePrice - tradeInValue) * (salesTax / 100)
        const loanAmount = vehiclePrice + taxAmount - downPayment - tradeInValue
        const monthlyRate = interestRate / 100 / 12
        const numberOfPayments = loanTerm

        if (monthlyRate === 0 || loanAmount <= 0) {
            const payment = loanAmount > 0 ? loanAmount / numberOfPayments : 0
            return {
                monthlyPayment: payment,
                totalPayment: loanAmount,
                totalInterest: 0,
                loanAmount,
                taxAmount
            }
        }

        const monthlyPayment = loanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

        const totalPayment = monthlyPayment * numberOfPayments
        const totalInterest = totalPayment - loanAmount

        return {
            monthlyPayment,
            totalPayment,
            totalInterest,
            loanAmount,
            taxAmount
        }
    }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTerm, salesTax])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Auto Loan Calculator"
            description="Calculate your car loan payments and total cost"
            category="Finance"
            categoryPath="/finance"
            icon={Car}
            result={formatCurrency(results.monthlyPayment)}
            resultLabel="Monthly Payment"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Vehicle Price</label>
                    <input
                        type="number"
                        value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(Number(e.target.value))}
                        min={0}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Down Payment</label>
                    <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        min={0}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Trade-in Value</label>
                    <input
                        type="number"
                        value={tradeInValue}
                        onChange={(e) => setTradeInValue(Number(e.target.value))}
                        min={0}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Sales Tax (%)</label>
                    <input
                        type="number"
                        value={salesTax}
                        onChange={(e) => setSalesTax(Number(e.target.value))}
                        min={0}
                        max={20}
                        step={0.1}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Interest Rate (%)</label>
                    <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        min={0}
                        max={30}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Loan Term (Months)</label>
                    <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}>
                        <option value={24}>24 months</option>
                        <option value={36}>36 months</option>
                        <option value={48}>48 months</option>
                        <option value={60}>60 months</option>
                        <option value={72}>72 months</option>
                        <option value={84}>84 months</option>
                    </select>
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Loan Amount</span>
                    <span className="result-detail-value">{formatCurrency(results.loanAmount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Sales Tax</span>
                    <span className="result-detail-value">{formatCurrency(results.taxAmount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Interest</span>
                    <span className="result-detail-value">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Cost</span>
                    <span className="result-detail-value">{formatCurrency(results.totalPayment)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default AutoLoanCalculator
