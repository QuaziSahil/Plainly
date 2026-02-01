import { useState, useMemo } from 'react'
import { CreditCard, Plus, Trash2, DollarSign, Calendar, AlertTriangle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SubscriptionCostCalculator() {
    const [subscriptions, setSubscriptions] = useState([
        { name: 'Netflix', cost: 15.99, frequency: 'monthly' },
        { name: 'Spotify', cost: 10.99, frequency: 'monthly' },
        { name: 'Amazon Prime', cost: 139, frequency: 'yearly' },
        { name: 'Disney+', cost: 7.99, frequency: 'monthly' },
        { name: 'iCloud', cost: 2.99, frequency: 'monthly' }
    ])

    const addSubscription = () => {
        setSubscriptions([...subscriptions, { name: '', cost: 0, frequency: 'monthly' }])
    }

    const updateSubscription = (index, field, value) => {
        const updated = [...subscriptions]
        updated[index][field] = field === 'cost' ? Number(value) : value
        setSubscriptions(updated)
    }

    const removeSubscription = (index) => {
        setSubscriptions(subscriptions.filter((_, i) => i !== index))
    }

    const results = useMemo(() => {
        let monthlyTotal = 0

        const subsWithMonthly = subscriptions.map(sub => {
            let monthly = 0
            switch (sub.frequency) {
                case 'weekly': monthly = sub.cost * 4.33; break
                case 'monthly': monthly = sub.cost; break
                case 'quarterly': monthly = sub.cost / 3; break
                case 'yearly': monthly = sub.cost / 12; break
                default: monthly = sub.cost
            }
            monthlyTotal += monthly
            return { ...sub, monthly }
        })

        // Sort by monthly cost descending
        const sorted = [...subsWithMonthly].sort((a, b) => b.monthly - a.monthly)

        return {
            subscriptions: subsWithMonthly,
            sorted,
            monthlyTotal,
            yearlyTotal: monthlyTotal * 12,
            dailyCost: monthlyTotal / 30,
            weeklyTotal: monthlyTotal / 4.33,
            fiveYearCost: monthlyTotal * 12 * 5,
            tenYearCost: monthlyTotal * 12 * 10
        }
    }, [subscriptions])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setSubscriptions([
            { name: 'Netflix', cost: 15.99, frequency: 'monthly' },
            { name: 'Spotify', cost: 10.99, frequency: 'monthly' },
            { name: 'Amazon Prime', cost: 139, frequency: 'yearly' },
            { name: 'Disney+', cost: 7.99, frequency: 'monthly' },
            { name: 'iCloud', cost: 2.99, frequency: 'monthly' }
        ])
    }

    return (
        <CalculatorLayout
            title="Subscription Cost Calculator"
            description="Track all your subscriptions and see the true cost"
            category="Finance"
            categoryPath="/finance"
            icon={CreditCard}
            result={formatCurrency(results.monthlyTotal) + "/mo"}
            resultLabel="Monthly Total"
            onReset={handleReset}
        >
            {/* Summary Cards */}
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
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💸 Monthly</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.monthlyTotal)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📅 Yearly</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.yearlyTotal)}</div>
                </div>
            </div>

            {/* Subscriptions List */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                        Your Subscriptions ({subscriptions.length})
                    </h3>
                    <button
                        onClick={addSubscription}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 16px',
                            background: '#8b5cf6',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>

                {subscriptions.map((sub, index) => (
                    <div key={index} style={{
                        background: '#1a1a2e',
                        borderRadius: '10px',
                        padding: '12px',
                        marginBottom: '8px',
                        border: '1px solid #333',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => updateSubscription(index, 'name', e.target.value)}
                            placeholder="Service name"
                            style={{
                                flex: '1',
                                minWidth: '100px',
                                padding: '10px',
                                background: '#0a0a0a',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ opacity: 0.5 }}>$</span>
                            <input
                                type="number"
                                value={sub.cost}
                                onChange={(e) => updateSubscription(index, 'cost', e.target.value)}
                                step="0.01"
                                min="0"
                                style={{
                                    width: '70px',
                                    padding: '10px',
                                    background: '#0a0a0a',
                                    border: '1px solid #333',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        <select
                            value={sub.frequency}
                            onChange={(e) => updateSubscription(index, 'frequency', e.target.value)}
                            style={{
                                padding: '10px',
                                background: '#0a0a0a',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '13px'
                            }}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <button
                            onClick={() => removeSubscription(index)}
                            style={{
                                padding: '8px',
                                background: '#ef444420',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#ef4444',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Cost Breakdown */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Cost Breakdown</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Daily Cost</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.dailyCost)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Weekly Cost</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.weeklyTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span style={{ opacity: 0.7 }}>5-Year Total</span>
                        <span style={{ fontWeight: '600', color: '#f97316' }}>{formatCurrency(results.fiveYearCost)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>10-Year Total</span>
                        <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatCurrency(results.tenYearCost)}</span>
                    </div>
                </div>
            </div>

            {/* Top Expenses */}
            {results.sorted.length > 0 && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: '16px',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                        <AlertTriangle size={14} style={{ marginRight: '6px' }} />
                        Biggest Expenses
                    </h4>
                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                        {results.sorted.slice(0, 3).map((sub, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{sub.name || 'Unnamed'}</span>
                                <span style={{ color: '#ef4444', fontWeight: '600' }}>
                                    {formatCurrency(sub.monthly)}/mo
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default SubscriptionCostCalculator
