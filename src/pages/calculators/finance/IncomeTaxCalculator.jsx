import { useState, useMemo } from 'react'
import { Receipt } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

// US Federal Tax Brackets 2024 (simplified)
const taxBrackets = {
    single: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 }
    ],
    married: [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 }
    ]
}

const standardDeductions = {
    single: 14600,
    married: 29200
}

function IncomeTaxCalculator() {
    const [income, setIncome] = useState(75000)
    const [filingStatus, setFilingStatus] = useState('single')
    const [deductions, setDeductions] = useState(0)
    const [useStandard, setUseStandard] = useState(true)

    const results = useMemo(() => {
        const brackets = taxBrackets[filingStatus]
        const standardDed = standardDeductions[filingStatus]

        // Calculate taxable income
        const actualDeduction = useStandard ? standardDed : deductions
        const taxableIncome = Math.max(0, income - actualDeduction)

        // Calculate tax
        let tax = 0
        let remaining = taxableIncome

        for (const bracket of brackets) {
            if (remaining <= 0) break

            const bracketSize = bracket.max - bracket.min
            const taxableInBracket = Math.min(remaining, bracketSize)
            tax += taxableInBracket * bracket.rate
            remaining -= taxableInBracket
        }

        // Effective tax rate
        const effectiveRate = income > 0 ? (tax / income) * 100 : 0

        // Marginal rate
        let marginalRate = 0.10
        for (const bracket of brackets) {
            if (taxableIncome > bracket.min) {
                marginalRate = bracket.rate
            }
        }

        // After-tax income
        const afterTax = income - tax

        return {
            taxableIncome,
            federalTax: tax,
            effectiveRate,
            marginalRate: marginalRate * 100,
            afterTax,
            deductionUsed: actualDeduction
        }
    }, [income, filingStatus, deductions, useStandard])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Income Tax Calculator"
            description="Estimate your federal income tax liability"
            category="Finance"
            categoryPath="/finance"
            icon={Receipt}
            result={formatCurrency(results.federalTax)}
            resultLabel="Federal Tax"
        >
            <div className="input-group">
                <label className="input-label">Annual Income</label>
                <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    min={0}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Filing Status</label>
                <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)}>
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Deduction Type</label>
                <select
                    value={useStandard ? 'standard' : 'itemized'}
                    onChange={(e) => setUseStandard(e.target.value === 'standard')}
                >
                    <option value="standard">Standard (${standardDeductions[filingStatus].toLocaleString()})</option>
                    <option value="itemized">Itemized</option>
                </select>
            </div>

            {!useStandard && (
                <div className="input-group">
                    <label className="input-label">Itemized Deductions</label>
                    <input
                        type="number"
                        value={deductions}
                        onChange={(e) => setDeductions(Number(e.target.value))}
                        min={0}
                    />
                </div>
            )}

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Taxable Income</span>
                    <span className="result-detail-value">{formatCurrency(results.taxableIncome)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Federal Tax</span>
                    <span className="result-detail-value">{formatCurrency(results.federalTax)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Effective Rate</span>
                    <span className="result-detail-value">{results.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Marginal Rate</span>
                    <span className="result-detail-value">{results.marginalRate.toFixed(0)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">After-Tax Income</span>
                    <span className="result-detail-value">{formatCurrency(results.afterTax)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default IncomeTaxCalculator
