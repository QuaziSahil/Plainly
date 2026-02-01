import { useState, useMemo } from 'react'
import { Gift, DollarSign, Users, Calendar, Heart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function GiftTaxCalculator() {
    const [giftAmount, setGiftAmount] = useState(50000)
    const [numberOfRecipients, setNumberOfRecipients] = useState(1)
    const [giftFromCouple, setGiftFromCouple] = useState(false)
    const [year, setYear] = useState('2024')
    const [previousGifts, setPreviousGifts] = useState(0)

    // Annual exclusion amounts by year
    const annualExclusions = {
        '2024': 18000,
        '2025': 19000
    }

    // Lifetime exemption
    const lifetimeExemptions = {
        '2024': 13610000,
        '2025': 13990000
    }

    const results = useMemo(() => {
        const annualExclusion = annualExclusions[year]
        const lifetimeExemption = lifetimeExemptions[year]

        // If married and gift-splitting
        const effectiveExclusion = giftFromCouple ? annualExclusion * 2 : annualExclusion
        const effectiveLifetimeExemption = giftFromCouple ? lifetimeExemption * 2 : lifetimeExemption

        // Amount per recipient
        const perRecipient = giftAmount / numberOfRecipients

        // Taxable portion per recipient
        const taxablePerRecipient = Math.max(perRecipient - effectiveExclusion, 0)
        const totalTaxableGift = taxablePerRecipient * numberOfRecipients

        // Cumulative taxable gifts
        const cumulativeTaxable = previousGifts + totalTaxableGift

        // Is tax due? (only if lifetime exemption exceeded)
        const taxDue = cumulativeTaxable > effectiveLifetimeExemption

        // Gift tax (40% top rate - simplified)
        const taxableOverExemption = Math.max(cumulativeTaxable - effectiveLifetimeExemption, 0)
        let giftTax = 0
        if (taxableOverExemption > 0) {
            giftTax = taxableOverExemption * 0.40 // Simplified top rate
        }

        // Remaining lifetime exemption
        const remainingExemption = Math.max(effectiveLifetimeExemption - cumulativeTaxable, 0)

        // Amount within exclusion
        const excludedAmount = Math.min(giftAmount, effectiveExclusion * numberOfRecipients)

        return {
            annualExclusion,
            effectiveExclusion,
            effectiveLifetimeExemption,
            perRecipient,
            taxablePerRecipient,
            totalTaxableGift,
            cumulativeTaxable,
            giftTax,
            taxDue,
            remainingExemption,
            excludedAmount,
            requiresForm709: totalTaxableGift > 0
        }
    }, [giftAmount, numberOfRecipients, giftFromCouple, year, previousGifts])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setGiftAmount(50000)
        setNumberOfRecipients(1)
        setGiftFromCouple(false)
        setYear('2024')
        setPreviousGifts(0)
    }

    return (
        <CalculatorLayout
            title="Gift Tax Calculator"
            description="Calculate gift tax and lifetime exemption usage"
            category="Finance"
            categoryPath="/finance"
            icon={Gift}
            result={formatCurrency(results.giftTax)}
            resultLabel="Gift Tax Due"
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
                    background: results.taxDue
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                        {results.taxDue ? '💸 Tax Due' : '✅ No Tax'}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.giftTax)}</div>
                </div>

                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #333'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Taxable Gift</div>
                    <div style={{ fontSize: '22px', fontWeight: '600' }}>{formatCurrency(results.totalTaxableGift)}</div>
                </div>
            </div>

            {/* Remaining Exemption */}
            <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
                    💎 Remaining Lifetime Exemption
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {formatCurrency(results.remainingExemption)}
                </div>
            </div>

            {/* Form 709 Notice */}
            {results.requiresForm709 && (
                <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '20px',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>📋</span>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>Form 709 Required</span>
                    </div>
                    <p style={{ fontSize: '12px', opacity: 0.8, margin: '8px 0 0 0' }}>
                        Gifts exceeding the annual exclusion must be reported on IRS Form 709.
                    </p>
                </div>
            )}

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
                    <option value="2024">2024 (Annual: $18K, Lifetime: $13.61M)</option>
                    <option value="2025">2025 (Annual: $19K, Lifetime: $13.99M)</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Gift size={14} style={{ marginRight: '6px' }} />
                    Total Gift Amount
                </label>
                <input
                    type="number"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(Number(e.target.value))}
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

            <div className="input-group">
                <label className="input-label">
                    <Users size={14} style={{ marginRight: '6px' }} />
                    Number of Recipients
                </label>
                <input
                    type="number"
                    value={numberOfRecipients}
                    onChange={(e) => setNumberOfRecipients(Math.max(1, Number(e.target.value)))}
                    min="1"
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
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    background: '#1a1a2e',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    cursor: 'pointer'
                }}>
                    <input
                        type="checkbox"
                        checked={giftFromCouple}
                        onChange={(e) => setGiftFromCouple(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                    />
                    <div>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Gift Splitting (Married)</span>
                        <p style={{ fontSize: '11px', opacity: 0.6, margin: '4px 0 0 0' }}>
                            Doubles annual exclusion to {formatCurrency(results.annualExclusion * 2)}
                        </p>
                    </div>
                </label>
            </div>

            <div className="input-group">
                <label className="input-label">
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    Previous Taxable Lifetime Gifts
                </label>
                <input
                    type="number"
                    value={previousGifts}
                    onChange={(e) => setPreviousGifts(Number(e.target.value))}
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

            {/* Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Gift Breakdown</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Per Recipient</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.perRecipient)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Annual Exclusion (per recipient)</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.effectiveExclusion)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Within Exclusion</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.excludedAmount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span>How Much Taxable</span>
                        <span style={{ fontWeight: '600', color: results.totalTaxableGift > 0 ? '#ef4444' : 'white' }}>
                            {formatCurrency(results.totalTaxableGift)}
                        </span>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default GiftTaxCalculator
