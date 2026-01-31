import { useState, useMemo } from 'react'
import { CreditCard } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import Button from '../../../components/UI/Button'

function LoanCalculator() {
    const [loanAmount, setLoanAmount] = useState(20000)
    const [interestRate, setInterestRate] = useState(8)
    const [loanTerm, setLoanTerm] = useState(5)

    const results = useMemo(() => {
        const monthlyRate = interestRate / 100 / 12
        const numberOfPayments = loanTerm * 12

        if (monthlyRate === 0) {
            return {
                monthlyPayment: loanAmount / numberOfPayments,
                totalPayment: loanAmount,
                totalInterest: 0
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
            totalInterest
        }
    }, [loanAmount, interestRate, loanTerm])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setLoanAmount(20000)
        setInterestRate(8)
        setLoanTerm(5)
    }

    return (
        <CalculatorLayout
            title="Loan Calculator"
            subtitle="Calculate loan payments and interest"
            category="Finance"
            categoryPath="/finance"
            icon={CreditCard}
            result={formatCurrency(results.monthlyPayment)}
            resultLabel="Monthly Payment"
            onReset={handleReset}
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
                    <label className="input-label">Loan Term (Years)</label>
                    <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        min={1}
                        max={30}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Interest</span>
                    <span className="result-detail-value">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Payment</span>
                    <span className="result-detail-value">{formatCurrency(results.totalPayment)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default LoanCalculator
