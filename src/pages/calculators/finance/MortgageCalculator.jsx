import { useState, useMemo } from 'react'
import { Home } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import Button from '../../../components/UI/Button'

function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [downPayment, setDownPayment] = useState(60000)

  const results = useMemo(() => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / numberOfPayments,
        totalPayment: principal,
        totalInterest: 0
      }
    }

    const monthlyPayment = principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      principal
    }
  }, [loanAmount, interestRate, loanTerm, downPayment])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatCurrencyFull = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const handleReset = () => {
    setLoanAmount(300000)
    setInterestRate(6.5)
    setLoanTerm(30)
    setDownPayment(60000)
  }

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      subtitle="Calculate your monthly mortgage payments"
      category="Finance"
      categoryPath="/finance"
      icon={Home}
      result={formatCurrencyFull(results.monthlyPayment)}
      resultLabel="Monthly Payment"
      showResult={false}
      onReset={handleReset}
    >
      {/* Custom Result Panel */}
      <div className="mortgage-result-panel">
        <div className="mortgage-primary-result">
          <span className="result-label">Monthly Payment</span>
          <span className="result-amount display-number">
            {formatCurrencyFull(results.monthlyPayment)}
          </span>
        </div>

        <div className="mortgage-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Principal & Interest</span>
            <span className="breakdown-value">{formatCurrencyFull(results.monthlyPayment)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Total Principal</span>
            <span className="breakdown-value">{formatCurrency(results.principal)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Total Interest</span>
            <span className="breakdown-value">{formatCurrency(results.totalInterest)}</span>
          </div>
          <div className="breakdown-item breakdown-total">
            <span className="breakdown-label">Total Cost</span>
            <span className="breakdown-value">{formatCurrency(results.totalPayment)}</span>
          </div>
        </div>

        {/* Visual breakdown bar */}
        <div className="payment-breakdown-bar">
          <div
            className="breakdown-bar-principal"
            style={{ width: `${(results.principal / results.totalPayment) * 100}%` }}
          />
          <div
            className="breakdown-bar-interest"
            style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
          />
        </div>
        <div className="breakdown-bar-legend">
          <span className="legend-principal">● Principal</span>
          <span className="legend-interest">● Interest</span>
        </div>
      </div>

      {/* Input Section in parent */}
      <div className="input-group">
        <label className="input-label">Home Price</label>
        <div className="input-with-prefix">
          <span className="input-prefix">$</span>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            min={0}
          />
        </div>
        <input
          type="range"
          min={50000}
          max={2000000}
          step={10000}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          style={{ marginTop: 'var(--space-2)' }}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Down Payment</label>
        <div className="input-with-prefix">
          <span className="input-prefix">$</span>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            min={0}
            max={loanAmount}
          />
        </div>
        <span className="input-hint">
          {((downPayment / loanAmount) * 100).toFixed(1)}% of home price
        </span>
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
          <label className="input-label">Loan Term (Years)</label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
          >
            <option value={10}>10 Years</option>
            <option value={15}>15 Years</option>
            <option value={20}>20 Years</option>
            <option value={25}>25 Years</option>
            <option value={30}>30 Years</option>
          </select>
        </div>
      </div>

      <style jsx>{`
        .mortgage-result-panel {
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          margin-bottom: var(--space-8);
        }

        .mortgage-primary-result {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .result-label {
          display: block;
          font-size: var(--font-size-caption);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wider);
          margin-bottom: var(--space-2);
        }

        .result-amount {
          font-size: clamp(36px, 8vw, 56px);
        }

        .mortgage-breakdown {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border-primary);
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .breakdown-label {
          font-size: var(--font-size-body-sm);
          color: var(--text-tertiary);
        }

        .breakdown-value {
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          font-family: var(--font-family-mono);
        }

        .breakdown-total {
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-primary);
        }

        .breakdown-total .breakdown-value {
          color: var(--accent-primary);
        }

        .payment-breakdown-bar {
          display: flex;
          height: 8px;
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-top: var(--space-6);
        }

        .breakdown-bar-principal {
          background: var(--accent-primary);
        }

        .breakdown-bar-interest {
          background: var(--text-muted);
        }

        .breakdown-bar-legend {
          display: flex;
          gap: var(--space-4);
          margin-top: var(--space-3);
          font-size: var(--font-size-caption);
        }

        .legend-principal {
          color: var(--accent-primary);
        }

        .legend-interest {
          color: var(--text-muted);
        }

        .input-with-prefix {
          position: relative;
        }

        .input-with-prefix .input-prefix {
          position: absolute;
          left: var(--space-4);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-weight: var(--font-weight-medium);
        }

        .input-with-prefix input {
          padding-left: var(--space-8);
          width: 100%;
        }
      `}</style>
    </CalculatorLayout>
  )
}

export default MortgageCalculator
