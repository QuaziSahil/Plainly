import { useState, useMemo } from 'react'
import { Landmark, DollarSign, Users, Percent, Heart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function EstateTaxCalculator() {
    const [grossEstate, setGrossEstate] = useState(15000000)
    const [debts, setDebts] = useState(200000)
    const [funeralExpenses, setFuneralExpenses] = useState(15000)
    const [charitableDeductions, setCharitableDeductions] = useState(100000)
    const [maritalDeduction, setMaritalDeduction] = useState(0)
    const [year, setYear] = useState('2024')

    // Federal exemption amounts by year
    const exemptions = {
        '2024': 13610000,
        '2025': 13990000,
        '2026': 7000000 // Expected to drop after TCJA expires
    }

    const results = useMemo(() => {
        const exemption = exemptions[year]

        // Adjusted gross estate
        const adjustedEstate = grossEstate - debts - funeralExpenses

        // Taxable estate
        const taxableEstate = adjustedEstate - charitableDeductions - maritalDeduction - exemption
        const actualTaxableEstate = Math.max(taxableEstate, 0)

        // Federal estate tax rate (top rate is 40%)
        // Simplified calculation using top marginal rate
        let estateTax = 0
        if (actualTaxableEstate > 0) {
            // Progressive rates from 18% to 40%
            const brackets = [
                { threshold: 10000, rate: 0.18 },
                { threshold: 20000, rate: 0.20 },
                { threshold: 40000, rate: 0.22 },
                { threshold: 60000, rate: 0.24 },
                { threshold: 80000, rate: 0.26 },
                { threshold: 100000, rate: 0.28 },
                { threshold: 150000, rate: 0.30 },
                { threshold: 250000, rate: 0.32 },
                { threshold: 500000, rate: 0.34 },
                { threshold: 750000, rate: 0.37 },
                { threshold: 1000000, rate: 0.39 },
                { threshold: Infinity, rate: 0.40 }
            ]

            let remaining = actualTaxableEstate
            let prevThreshold = 0

            for (const bracket of brackets) {
                if (remaining <= 0) break
                const taxableInBracket = Math.min(remaining, bracket.threshold - prevThreshold)
                estateTax += taxableInBracket * bracket.rate
                remaining -= taxableInBracket
                prevThreshold = bracket.threshold
            }
        }

        const effectiveRate = grossEstate > 0 ? (estateTax / grossEstate) * 100 : 0
        const afterTax = adjustedEstate - estateTax
        const toHeirs = afterTax - charitableDeductions

        return {
            adjustedEstate,
            actualTaxableEstate,
            estateTax,
            effectiveRate,
            afterTax,
            toHeirs,
            exemption,
            isTaxable: taxableEstate > 0
        }
    }, [grossEstate, debts, funeralExpenses, charitableDeductions, maritalDeduction, year])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setGrossEstate(15000000)
        setDebts(200000)
        setFuneralExpenses(15000)
        setCharitableDeductions(100000)
        setMaritalDeduction(0)
        setYear('2024')
    }

    return (
        <CalculatorLayout
            title="Estate Tax Calculator"
            description="Estimate federal estate tax liability"
            category="Finance"
            categoryPath="/finance"
            icon={Landmark}
            result={formatCurrency(results.estateTax)}
            resultLabel="Estimated Estate Tax"
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
                    background: results.isTaxable
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                        {results.isTaxable ? '💸 Estate Tax' : '✅ No Tax Due'}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.estateTax)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💝 To Heirs</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.toHeirs)}</div>
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">Tax Year</label>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
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
                    <option value="2024">2024 (Exemption: $13.61M)</option>
                    <option value="2025">2025 (Exemption: $13.99M)</option>
                    <option value="2026">2026 (Post-TCJA: ~$7M)</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Gross Estate Value
                </label>
                <input
                    type="number"
                    value={grossEstate}
                    onChange={(e) => setGrossEstate(Number(e.target.value))}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">Debts</label>
                    <input
                        type="number"
                        value={debts}
                        onChange={(e) => setDebts(Number(e.target.value))}
                        min="0"
                        step="10000"
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
                    <label className="input-label">Funeral Expenses</label>
                    <input
                        type="number"
                        value={funeralExpenses}
                        onChange={(e) => setFuneralExpenses(Number(e.target.value))}
                        min="0"
                        step="1000"
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
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Heart size={14} style={{ marginRight: '6px' }} />
                    Charitable Deductions
                </label>
                <input
                    type="number"
                    value={charitableDeductions}
                    onChange={(e) => setCharitableDeductions(Number(e.target.value))}
                    min="0"
                    step="10000"
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
                    <Users size={14} style={{ marginRight: '6px' }} />
                    Marital Deduction (to spouse)
                </label>
                <input
                    type="number"
                    value={maritalDeduction}
                    onChange={(e) => setMaritalDeduction(Number(e.target.value))}
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
                <span style={{ fontSize: '11px', opacity: 0.5 }}>Unlimited marital deduction for property left to a spouse</span>
            </div>

            {/* Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Estate Breakdown</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Gross Estate</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(grossEstate)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Less Deductions</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>-{formatCurrency(debts + funeralExpenses + charitableDeductions + maritalDeduction)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Exemption ({year})</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>-{formatCurrency(results.exemption)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span>Taxable Estate</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.actualTaxableEstate)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Effective Tax Rate</span>
                        <span style={{ fontWeight: '600', color: '#ef4444' }}>{results.effectiveRate.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            {/* Warning for 2026 */}
            {year === '2026' && (
                <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    padding: '14px',
                    marginTop: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                    <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                        ⚠️ In 2026, the TCJA exemption increase is set to expire, potentially reducing the exemption to approximately $7 million (adjusted for inflation).
                    </p>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default EstateTaxCalculator
