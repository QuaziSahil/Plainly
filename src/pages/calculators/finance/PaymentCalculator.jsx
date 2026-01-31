import { useState, useMemo } from 'react'
import { Receipt } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PaymentCalculator() {
    const [loanAmount, setLoanAmount] = useState(50000)
    const [interestRate, setInterestRate] = useState(7)
    const [loanTerm, setLoanTerm] = useState(60)
    const [paymentType, setPaymentType] = useState('monthly')

    const results = useMemo(() => {
        const periodsPerYear = paymentType === 'monthly' ? 12 :
            paymentType === 'bi-weekly' ? 26 : 52

        const periodicRate = interestRate / 100 / periodsPerYear
        const totalPayments = Math.ceil(loanTerm * periodsPerYear / 12)

        if (periodicRate === 0) {
            const payment = loanAmount / totalPayments
            return {
                payment,
                totalPayment: loanAmount,
                totalInterest: 0,
                totalPayments
            }
        }

        const payment = loanAmount *
            (periodicRate * Math.pow(1 + periodicRate, totalPayments)) /
            (Math.pow(1 + periodicRate, totalPayments) - 1)

        const totalPayment = payment * totalPayments
        const totalInterest = totalPayment - loanAmount

        return {
            payment,
            totalPayment,
            totalInterest,
            totalPayments
        }
    }, [loanAmount, interestRate, loanTerm, paymentType])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const getPaymentLabel = () => {
        switch (paymentType) {
            case 'bi-weekly': return 'Bi-Weekly Payment'
            case 'weekly': return 'Weekly Payment'
            default: return 'Monthly Payment'
        }
    }

    return (
        <CalculatorLayout
            title="Payment Calculator"
            description="Calculate loan payments with different payment frequencies"
            category="Finance"
            categoryPath="/finance"
            icon={Receipt}
            result={formatCurrency(results.payment)}
            resultLabel={getPaymentLabel()}
        >
            <div className="input-group">
                <label className="input-label">Loan Amount</label>
                <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min={0}
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Interest Rate (%)</label>
                    <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        min={0}
                        max={50}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Term (Months)</label>
                    <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        min={1}
                        max={360}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Payment Frequency</label>
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Payments</span>
                    <span className="result-detail-value">{results.totalPayments}</span>
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

export default PaymentCalculator
