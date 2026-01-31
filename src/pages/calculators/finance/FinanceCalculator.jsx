import { useState, useMemo } from 'react'
import { Calculator } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FinanceCalculator() {
    const [calculationType, setCalculationType] = useState('loan')
    const [presentValue, setPresentValue] = useState(10000)
    const [futureValue, setFutureValue] = useState(0)
    const [payment, setPayment] = useState(200)
    const [rate, setRate] = useState(5)
    const [periods, setPeriods] = useState(60)

    const results = useMemo(() => {
        const monthlyRate = rate / 100 / 12
        const n = periods

        let result = {}

        if (calculationType === 'loan') {
            // Calculate monthly payment for a loan
            if (monthlyRate === 0) {
                result.payment = presentValue / n
            } else {
                result.payment = presentValue *
                    (monthlyRate * Math.pow(1 + monthlyRate, n)) /
                    (Math.pow(1 + monthlyRate, n) - 1)
            }
            result.totalPayment = result.payment * n
            result.totalInterest = result.totalPayment - presentValue
        } else if (calculationType === 'savings') {
            // Calculate future value of regular savings
            if (monthlyRate === 0) {
                result.futureValue = payment * n
            } else {
                result.futureValue = payment *
                    ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)
            }
            result.totalContributed = payment * n
            result.interestEarned = result.futureValue - result.totalContributed
        } else if (calculationType === 'present') {
            // Calculate present value
            if (monthlyRate === 0) {
                result.presentValue = futureValue
            } else {
                result.presentValue = futureValue / Math.pow(1 + monthlyRate, n)
            }
            result.discount = futureValue - result.presentValue
        }

        return result
    }, [calculationType, presentValue, futureValue, payment, rate, periods])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value || 0)
    }

    return (
        <CalculatorLayout
            title="Finance Calculator"
            description="General purpose financial calculations"
            category="Finance"
            categoryPath="/finance"
            icon={Calculator}
            result={calculationType === 'loan' ? formatCurrency(results.payment) :
                calculationType === 'savings' ? formatCurrency(results.futureValue) :
                    formatCurrency(results.presentValue)}
            resultLabel={calculationType === 'loan' ? 'Monthly Payment' :
                calculationType === 'savings' ? 'Future Value' : 'Present Value'}
        >
            <div className="input-group">
                <label className="input-label">Calculation Type</label>
                <select value={calculationType} onChange={(e) => setCalculationType(e.target.value)}>
                    <option value="loan">Loan Payment</option>
                    <option value="savings">Future Value (Savings)</option>
                    <option value="present">Present Value</option>
                </select>
            </div>

            {calculationType === 'loan' && (
                <div className="input-group">
                    <label className="input-label">Loan Amount</label>
                    <input
                        type="number"
                        value={presentValue}
                        onChange={(e) => setPresentValue(Number(e.target.value))}
                        min={0}
                    />
                </div>
            )}

            {calculationType === 'savings' && (
                <div className="input-group">
                    <label className="input-label">Monthly Contribution</label>
                    <input
                        type="number"
                        value={payment}
                        onChange={(e) => setPayment(Number(e.target.value))}
                        min={0}
                    />
                </div>
            )}

            {calculationType === 'present' && (
                <div className="input-group">
                    <label className="input-label">Future Value</label>
                    <input
                        type="number"
                        value={futureValue}
                        onChange={(e) => setFutureValue(Number(e.target.value))}
                        min={0}
                    />
                </div>
            )}

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Interest Rate (%/year)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        min={0}
                        max={100}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Periods (months)</label>
                    <input
                        type="number"
                        value={periods}
                        onChange={(e) => setPeriods(Number(e.target.value))}
                        min={1}
                        max={600}
                    />
                </div>
            </div>

            <div className="result-details">
                {calculationType === 'loan' && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Monthly Payment</span>
                            <span className="result-detail-value">{formatCurrency(results.payment)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Payment</span>
                            <span className="result-detail-value">{formatCurrency(results.totalPayment)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Interest</span>
                            <span className="result-detail-value">{formatCurrency(results.totalInterest)}</span>
                        </div>
                    </>
                )}
                {calculationType === 'savings' && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Future Value</span>
                            <span className="result-detail-value">{formatCurrency(results.futureValue)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Contributed</span>
                            <span className="result-detail-value">{formatCurrency(results.totalContributed)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Interest Earned</span>
                            <span className="result-detail-value">{formatCurrency(results.interestEarned)}</span>
                        </div>
                    </>
                )}
                {calculationType === 'present' && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Present Value</span>
                            <span className="result-detail-value">{formatCurrency(results.presentValue)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Time Value Discount</span>
                            <span className="result-detail-value">{formatCurrency(results.discount)}</span>
                        </div>
                    </>
                )}
            </div>
        </CalculatorLayout>
    )
}

export default FinanceCalculator
