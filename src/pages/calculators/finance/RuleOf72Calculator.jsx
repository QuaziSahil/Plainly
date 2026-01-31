import { useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RuleOf72Calculator() {
    const [interestRate, setInterestRate] = useState(7)
    const [targetYears, setTargetYears] = useState(10)
    const [mode, setMode] = useState('years')

    const results = useMemo(() => {
        if (mode === 'years') {
            // Calculate years to double
            const yearsToDouble = 72 / interestRate
            const yearsToTriple = 114 / interestRate
            const yearsToQuadruple = 144 / interestRate

            return { yearsToDouble, yearsToTriple, yearsToQuadruple, rateNeeded: null }
        } else {
            // Calculate rate needed to double in X years
            const rateNeeded = 72 / targetYears

            return { yearsToDouble: targetYears, yearsToTriple: null, yearsToQuadruple: null, rateNeeded }
        }
    }, [interestRate, targetYears, mode])

    return (
        <CalculatorLayout
            title="Rule of 72 Calculator"
            description="Calculate time to double your money"
            category="Finance"
            categoryPath="/finance"
            icon={Clock}
            result={mode === 'years' ? `${results.yearsToDouble.toFixed(1)} years` : `${results.rateNeeded.toFixed(2)}%`}
            resultLabel={mode === 'years' ? 'Time to Double' : 'Rate Needed'}
        >
            <div className="input-group">
                <label className="input-label">Calculation Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="years">Find years to double (given rate)</option>
                    <option value="rate">Find rate needed (given years)</option>
                </select>
            </div>
            {mode === 'years' ? (
                <div className="input-group">
                    <label className="input-label">Annual Interest Rate (%)</label>
                    <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} min={0.1} step={0.5} />
                </div>
            ) : (
                <div className="input-group">
                    <label className="input-label">Target Years to Double</label>
                    <input type="number" value={targetYears} onChange={(e) => setTargetYears(Number(e.target.value))} min={1} max={100} />
                </div>
            )}
            <div className="result-details">
                {mode === 'years' ? (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Years to Double (2x)</span>
                            <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.yearsToDouble.toFixed(1)} years</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Years to Triple (3x)</span>
                            <span className="result-detail-value">{results.yearsToTriple.toFixed(1)} years</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Years to Quadruple (4x)</span>
                            <span className="result-detail-value">{results.yearsToQuadruple.toFixed(1)} years</span>
                        </div>
                    </>
                ) : (
                    <div className="result-detail-row">
                        <span className="result-detail-label">Rate Needed to Double in {targetYears} Years</span>
                        <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.rateNeeded.toFixed(2)}%</span>
                    </div>
                )}
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: '#1a1a2e', borderRadius: '8px', fontSize: '13px', opacity: 0.8 }}>
                💡 The Rule of 72 is a quick way to estimate how long it takes an investment to double. Divide 72 by your interest rate to get the approximate number of years.
            </div>
        </CalculatorLayout>
    )
}

export default RuleOf72Calculator
