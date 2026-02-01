import { useState, useMemo } from 'react'
import { TrendingDown, DollarSign, Building, Calculator, Percent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WealthTaxCalculator() {
    const [totalWealth, setTotalWealth] = useState(5000000)
    const [exemption, setExemption] = useState(1000000)
    const [country, setCountry] = useState('custom')
    const [customRate, setCustomRate] = useState(1)

    // Different countries have different wealth tax systems
    const taxSystems = {
        'norway': {
            name: 'Norway',
            brackets: [
                { threshold: 0, rate: 1.1 }
            ],
            exemption: 1700000
        },
        'spain': {
            name: 'Spain',
            brackets: [
                { threshold: 167129, rate: 0.2 },
                { threshold: 334252, rate: 0.3 },
                { threshold: 668499, rate: 0.5 },
                { threshold: 1336999, rate: 0.9 },
                { threshold: 2673999, rate: 1.3 },
                { threshold: 5347999, rate: 1.7 },
                { threshold: 10695996, rate: 2.1 },
                { threshold: Infinity, rate: 3.5 }
            ],
            exemption: 700000
        },
        'switzerland': {
            name: 'Switzerland (varies by canton)',
            brackets: [
                { threshold: 0, rate: 0.5 }
            ],
            exemption: 200000
        },
        'custom': {
            name: 'Custom',
            brackets: [
                { threshold: 0, rate: customRate }
            ],
            exemption: exemption
        }
    }

    const results = useMemo(() => {
        const system = taxSystems[country]
        const effectiveExemption = country === 'custom' ? exemption : system.exemption
        const taxableWealth = Math.max(totalWealth - effectiveExemption, 0)

        let taxOwed = 0

        if (country === 'spain') {
            // Progressive tax calculation for Spain
            let remaining = taxableWealth
            let prevThreshold = 0

            for (const bracket of system.brackets) {
                if (remaining <= 0) break
                const bracketAmount = bracket.threshold === Infinity
                    ? remaining
                    : Math.min(remaining, bracket.threshold - prevThreshold)
                taxOwed += bracketAmount * (bracket.rate / 100)
                remaining -= bracketAmount
                prevThreshold = bracket.threshold
            }
        } else {
            // Flat rate calculation
            const rate = country === 'custom' ? customRate : system.brackets[0].rate
            taxOwed = taxableWealth * (rate / 100)
        }

        const effectiveRate = totalWealth > 0 ? (taxOwed / totalWealth) * 100 : 0
        const afterTaxWealth = totalWealth - taxOwed

        return {
            taxableWealth,
            taxOwed,
            effectiveRate,
            afterTaxWealth,
            effectiveExemption,
            monthlyTax: taxOwed / 12
        }
    }, [totalWealth, exemption, country, customRate])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setTotalWealth(5000000)
        setExemption(1000000)
        setCountry('custom')
        setCustomRate(1)
    }

    return (
        <CalculatorLayout
            title="Wealth Tax Calculator"
            description="Calculate wealth tax liability"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingDown}
            result={formatCurrency(results.taxOwed)}
            resultLabel="Annual Wealth Tax"
            onReset={handleReset}
        >
            {/* Result Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💸 Annual Tax</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.taxOwed)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>{formatCurrency(results.monthlyTax)}/mo</div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Effective Rate</div>
                    <div style={{ fontSize: '22px', fontWeight: '600' }}>{results.effectiveRate.toFixed(2)}%</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <Building size={14} style={{ marginRight: '6px' }} />
                    Tax System
                </label>
                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                    }}
                >
                    <option value="custom">Custom Rate</option>
                    <option value="norway">Norway</option>
                    <option value="spain">Spain (Progressive)</option>
                    <option value="switzerland">Switzerland (avg)</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Total Net Worth
                </label>
                <input
                    type="number"
                    value={totalWealth}
                    onChange={(e) => setTotalWealth(Number(e.target.value))}
                    min="0"
                    step="100000"
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#1a1a2e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                    }}
                />
            </div>

            {country === 'custom' && (
                <>
                    <div className="input-group">
                        <label className="input-label">
                            <DollarSign size={14} style={{ marginRight: '6px' }} />
                            Exemption Amount
                        </label>
                        <input
                            type="number"
                            value={exemption}
                            onChange={(e) => setExemption(Number(e.target.value))}
                            min="0"
                            step="50000"
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#1a1a2e',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Percent size={14} style={{ marginRight: '6px' }} />
                            Tax Rate: {customRate}%
                        </label>
                        <input
                            type="range"
                            value={customRate}
                            onChange={(e) => setCustomRate(Number(e.target.value))}
                            min="0.1"
                            max="5"
                            step="0.1"
                            style={{ width: '100%', accentColor: '#ef4444' }}
                        />
                    </div>
                </>
            )}

            {/* Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Breakdown</h4>
                <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Total Net Worth</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(totalWealth)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Exemption</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>-{formatCurrency(results.effectiveExemption)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px' }}>
                        <span style={{ opacity: 0.7 }}>Taxable Wealth</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.taxableWealth)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Wealth After Tax</span>
                        <span style={{ fontWeight: '600', color: '#8b5cf6' }}>{formatCurrency(results.afterTaxWealth)}</span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                marginTop: '16px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
                <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                    💡 Wealth taxes are currently imposed in Norway, Spain, Switzerland, and some other countries. The US does not have a federal wealth tax but some states have proposals.
                </p>
            </div>
        </CalculatorLayout>
    )
}

export default WealthTaxCalculator
