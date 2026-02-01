import { useState, useMemo } from 'react'
import { Calculator, DollarSign, Hash, TrendingDown, Check } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CostPerUseCalculator() {
    const [purchasePrice, setPurchasePrice] = useState(200)
    const [expectedUses, setExpectedUses] = useState(50)
    const [maintenanceCost, setMaintenanceCost] = useState(20)
    const [lifespan, setLifespan] = useState(24)
    const [resaleValue, setResaleValue] = useState(0)
    const [alternativeCost, setAlternativeCost] = useState(5)

    const results = useMemo(() => {
        // Total cost of ownership
        const totalCost = purchasePrice + maintenanceCost - resaleValue

        // Cost per use
        const costPerUse = expectedUses > 0 ? totalCost / expectedUses : 0

        // Cost per month
        const costPerMonth = lifespan > 0 ? totalCost / lifespan : 0

        // Break-even uses (compared to renting/alternative)
        const breakEvenUses = alternativeCost > 0 ? Math.ceil(purchasePrice / alternativeCost) : 0

        // Is it worth buying?
        const alternativeTotalCost = alternativeCost * expectedUses
        const savings = alternativeTotalCost - totalCost
        const worthBuying = savings > 0

        // Uses per month needed
        const usesPerMonth = expectedUses / lifespan

        return {
            totalCost,
            costPerUse,
            costPerMonth,
            breakEvenUses,
            alternativeTotalCost,
            savings,
            worthBuying,
            usesPerMonth,
            percentSavings: alternativeTotalCost > 0 ? (savings / alternativeTotalCost) * 100 : 0
        }
    }, [purchasePrice, expectedUses, maintenanceCost, lifespan, resaleValue, alternativeCost])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setPurchasePrice(200)
        setExpectedUses(50)
        setMaintenanceCost(20)
        setLifespan(24)
        setResaleValue(0)
        setAlternativeCost(5)
    }

    return (
        <CalculatorLayout
            title="Cost Per Use Calculator"
            description="Find the true value of your purchases"
            category="Finance"
            categoryPath="/finance"
            icon={Calculator}
            result={formatCurrency(results.costPerUse)}
            resultLabel="Cost Per Use"
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
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Cost Per Use</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(results.costPerUse)}</div>
                </div>

                <div style={{
                    background: results.worthBuying
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                        {results.worthBuying ? '✅ Worth Buying!' : '⚠️ Not Worth It'}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>
                        {results.worthBuying ? `Save ${formatCurrency(results.savings)}` : `Lose ${formatCurrency(Math.abs(results.savings))}`}
                    </div>
                </div>
            </div>

            {/* Break-even Info */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #333',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>Break-even Point</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#8b5cf6' }}>
                    {results.breakEvenUses} uses
                </div>
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                    You need to use it at least this many times to beat renting/buying each time
                </div>
            </div>

            {/* Inputs */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Purchase Price
                </label>
                <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    min="0"
                    step="10"
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
                    <Hash size={14} style={{ marginRight: '6px' }} />
                    Expected Number of Uses
                </label>
                <input
                    type="number"
                    value={expectedUses}
                    onChange={(e) => setExpectedUses(Number(e.target.value))}
                    min="1"
                    step="5"
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
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Total Maintenance/Accessory Cost
                </label>
                <input
                    type="number"
                    value={maintenanceCost}
                    onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                    min="0"
                    step="5"
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
                    Expected Lifespan: {lifespan} months
                </label>
                <input
                    type="range"
                    value={lifespan}
                    onChange={(e) => setLifespan(Number(e.target.value))}
                    min="1"
                    max="120"
                    style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">
                    <TrendingDown size={14} style={{ marginRight: '6px' }} />
                    Expected Resale Value
                </label>
                <input
                    type="number"
                    value={resaleValue}
                    onChange={(e) => setResaleValue(Number(e.target.value))}
                    min="0"
                    step="10"
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
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Alternative Cost (per use if renting/buying)
                </label>
                <input
                    type="number"
                    value={alternativeCost}
                    onChange={(e) => setAlternativeCost(Number(e.target.value))}
                    min="0"
                    step="0.5"
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

            {/* Summary */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Summary</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Total Cost of Ownership</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.totalCost)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Alternative Total Cost</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.alternativeTotalCost)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Uses Per Month</span>
                        <span style={{ fontWeight: '600' }}>{results.usesPerMonth.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CostPerUseCalculator
