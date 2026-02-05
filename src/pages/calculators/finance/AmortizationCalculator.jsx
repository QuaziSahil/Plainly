import { useState, useMemo } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

// Currency definitions with locale mappings
const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
    { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
    { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
]

function AmortizationCalculator() {
    const [loanAmount, setLoanAmount] = useState(250000)
    const [interestRate, setInterestRate] = useState(6.5)
    const [loanTerm, setLoanTerm] = useState(30)
    const [extraPayment, setExtraPayment] = useState(0)
    const [currency, setCurrency] = useState('USD')

    // Get current currency configuration
    const currentCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]

    const results = useMemo(() => {
        const monthlyRate = interestRate / 100 / 12
        const numberOfPayments = loanTerm * 12

        if (monthlyRate === 0 || loanAmount <= 0) {
            const payment = loanAmount / numberOfPayments
            return {
                monthlyPayment: payment,
                totalPayment: loanAmount,
                totalInterest: 0,
                payoffMonths: numberOfPayments,
                interestSavings: 0
            }
        }

        // Standard monthly payment
        const monthlyPayment = loanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

        const totalPayment = monthlyPayment * numberOfPayments
        const totalInterest = totalPayment - loanAmount

        // Calculate with extra payments
        let balance = loanAmount
        let months = 0
        let totalWithExtra = 0

        while (balance > 0 && months < numberOfPayments) {
            const interestPayment = balance * monthlyRate
            let principalPayment = monthlyPayment - interestPayment + extraPayment

            if (principalPayment > balance) {
                principalPayment = balance
            }

            balance -= principalPayment
            totalWithExtra += monthlyPayment + (extraPayment > 0 ? Math.min(extraPayment, balance + principalPayment) : 0)
            months++

            if (balance <= 0) break
        }

        const interestWithExtra = totalWithExtra - loanAmount
        const interestSavings = totalInterest - (interestWithExtra > 0 ? interestWithExtra : 0)

        return {
            monthlyPayment,
            totalPayment,
            totalInterest,
            payoffMonths: months,
            payoffYears: (months / 12).toFixed(1),
            interestSavings: Math.max(0, interestSavings)
        }
    }, [loanAmount, interestRate, loanTerm, extraPayment])

    const formatCurrency = (value) => {
        // Handle JPY which doesn't use decimal places
        const fractionDigits = currentCurrency.code === 'JPY' ? 0 : 2
        return new Intl.NumberFormat(currentCurrency.locale, {
            style: 'currency',
            currency: currentCurrency.code,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Amortization Calculator"
            description="Calculate loan amortization and see how extra payments help"
            category="Finance"
            categoryPath="/finance"
            icon={FileSpreadsheet}
            result={formatCurrency(results.monthlyPayment)}
            resultLabel="Monthly Payment"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Loan Amount</label>
                    <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        min={0}
                    />
                </div>
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
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Loan Term (Years)</label>
                    <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        min={1}
                        max={50}
                        step={1}
                        placeholder="Enter years"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Extra Monthly Payment</label>
                    <input
                        type="number"
                        value={extraPayment}
                        onChange={(e) => setExtraPayment(Number(e.target.value))}
                        min={0}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Currency</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        {CURRENCIES.map(curr => (
                            <option key={curr.code} value={curr.code}>
                                {curr.code} ({curr.symbol}) - {curr.name}
                            </option>
                        ))}
                    </select>
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
                <div className="result-detail-row">
                    <span className="result-detail-label">Payoff Time</span>
                    <span className="result-detail-value">{results.payoffYears} years ({results.payoffMonths} months)</span>
                </div>
                {extraPayment > 0 && (
                    <div className="result-detail-row">
                        <span className="result-detail-label">Interest Savings</span>
                        <span className="result-detail-value">{formatCurrency(results.interestSavings)}</span>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    )
}

export default AmortizationCalculator
