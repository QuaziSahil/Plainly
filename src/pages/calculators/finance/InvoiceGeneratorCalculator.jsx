import { useState, useMemo } from 'react'
import { FileText, DollarSign, Plus, Trash2, Calendar, Percent, Building } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function InvoiceGeneratorCalculator() {
    const [items, setItems] = useState([
        { description: 'Web Development', quantity: 20, rate: 75 },
        { description: 'UI/UX Design', quantity: 10, rate: 85 },
        { description: 'Consultation', quantity: 5, rate: 100 }
    ])
    const [taxRate, setTaxRate] = useState(0)
    const [discountType, setDiscountType] = useState('percent')
    const [discountValue, setDiscountValue] = useState(0)
    const [currency, setCurrency] = useState('USD')

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, rate: 50 }])
    }

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index))
        }
    }

    const updateItem = (index, field, value) => {
        const updated = [...items]
        updated[index][field] = field === 'description' ? value : Number(value)
        setItems(updated)
    }

    const results = useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)

        // Calculate discount
        let discount = 0
        if (discountType === 'percent') {
            discount = subtotal * (discountValue / 100)
        } else {
            discount = discountValue
        }

        const afterDiscount = subtotal - discount
        const taxAmount = afterDiscount * (taxRate / 100)
        const total = afterDiscount + taxAmount

        const itemDetails = items.map(item => ({
            ...item,
            total: item.quantity * item.rate
        }))

        return {
            subtotal,
            discount,
            afterDiscount,
            taxAmount,
            total,
            itemDetails,
            itemCount: items.length,
            totalHours: items.reduce((sum, item) => sum + item.quantity, 0)
        }
    }, [items, taxRate, discountType, discountValue])

    const formatCurrency = (value) => {
        const symbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$' }
        return `${symbols[currency]}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const handleReset = () => {
        setItems([
            { description: 'Web Development', quantity: 20, rate: 75 },
            { description: 'UI/UX Design', quantity: 10, rate: 85 },
            { description: 'Consultation', quantity: 5, rate: 100 }
        ])
        setTaxRate(0)
        setDiscountType('percent')
        setDiscountValue(0)
    }

    return (
        <CalculatorLayout
            title="Invoice Generator"
            description="Create and calculate invoices"
            category="Finance"
            categoryPath="/finance"
            icon={FileText}
            result={formatCurrency(results.total)}
            resultLabel="Total Due"
            onReset={handleReset}
        >
            {/* Summary */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>💰 Invoice Total</div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>{formatCurrency(results.total)}</div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>
                    {items.length} items • {results.totalHours} hours
                </div>
            </div>

            {/* Currency Selector */}
            <div className="input-group">
                <label className="input-label">
                    <Building size={14} style={{ marginRight: '6px' }} />
                    Currency
                </label>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
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
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                </select>
            </div>

            {/* Line Items */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                        <FileText size={14} style={{ marginRight: '6px' }} />
                        Line Items
                    </h3>
                    <button
                        onClick={addItem}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 14px',
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={14} /> Add Item
                    </button>
                </div>

                {items.map((item, index) => (
                    <div key={index} style={{
                        background: '#1a1a2e',
                        borderRadius: '10px',
                        padding: '14px',
                        marginBottom: '10px',
                        border: '1px solid #333'
                    }}>
                        <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Description"
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#0a0a0a',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '14px',
                                marginBottom: '10px'
                            }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                            <div>
                                <label style={{ fontSize: '11px', opacity: 0.6 }}>Qty/Hours</label>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                    min="0"
                                    step="0.5"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: '#0a0a0a',
                                        border: '1px solid #333',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', opacity: 0.6 }}>Rate</label>
                                <input
                                    type="number"
                                    value={item.rate}
                                    onChange={(e) => updateItem(index, 'rate', e.target.value)}
                                    min="0"
                                    step="5"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: '#0a0a0a',
                                        border: '1px solid #333',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => removeItem(index)}
                                disabled={items.length <= 1}
                                style={{
                                    padding: '8px',
                                    background: items.length > 1 ? '#ef444420' : '#33333340',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: items.length > 1 ? '#ef4444' : '#666',
                                    cursor: items.length > 1 ? 'pointer' : 'not-allowed',
                                    marginTop: '16px'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div style={{
                            textAlign: 'right',
                            marginTop: '10px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#10b981'
                        }}>
                            = {formatCurrency(item.quantity * item.rate)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tax & Discount */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                    <label className="input-label">
                        <Percent size={14} style={{ marginRight: '6px' }} />
                        Tax Rate: {taxRate}%
                    </label>
                    <input
                        type="range"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        min="0"
                        max="30"
                        step="0.5"
                        style={{ width: '100%', accentColor: '#10b981' }}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Discount</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                            min="0"
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: '#1a1a2e',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                        <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                            style={{
                                padding: '10px',
                                background: '#1a1a2e',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        >
                            <option value="percent">%</option>
                            <option value="flat">$</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoice Summary */}
            <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid #333'
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📋 Invoice Summary</h4>
                <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Subtotal</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.subtotal)}</span>
                    </div>
                    {results.discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ opacity: 0.7 }}>Discount</span>
                            <span style={{ fontWeight: '600', color: '#10b981' }}>-{formatCurrency(results.discount)}</span>
                        </div>
                    )}
                    {taxRate > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ opacity: 0.7 }}>Tax ({taxRate}%)</span>
                            <span style={{ fontWeight: '600' }}>{formatCurrency(results.taxAmount)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '10px' }}>
                        <span style={{ fontWeight: '700' }}>Total Due</span>
                        <span style={{ fontWeight: '700', fontSize: '18px', color: '#10b981' }}>{formatCurrency(results.total)}</span>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default InvoiceGeneratorCalculator
