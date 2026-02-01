import { useState, useMemo } from 'react'
import { Users, DollarSign, Plus, Trash2, Percent, Home } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function UtilityBillSplitter() {
    const [roommates, setRoommates] = useState([
        { name: 'Person 1', share: 50 },
        { name: 'Person 2', share: 50 }
    ])
    const [bills, setBills] = useState([
        { name: 'Electricity', amount: 120 },
        { name: 'Gas', amount: 45 },
        { name: 'Water', amount: 35 },
        { name: 'Internet', amount: 80 },
        { name: 'Trash', amount: 30 }
    ])
    const [splitMethod, setSplitMethod] = useState('equal')

    const addRoommate = () => {
        const newShare = 100 / (roommates.length + 1)
        const updated = roommates.map(r => ({ ...r, share: newShare }))
        setRoommates([...updated, { name: `Person ${roommates.length + 1}`, share: newShare }])
    }

    const removeRoommate = (index) => {
        if (roommates.length <= 2) return
        const updated = roommates.filter((_, i) => i !== index)
        const newShare = 100 / updated.length
        setRoommates(updated.map(r => ({ ...r, share: newShare })))
    }

    const updateRoommate = (index, field, value) => {
        const updated = [...roommates]
        updated[index][field] = field === 'share' ? Number(value) : value
        setRoommates(updated)
    }

    const addBill = () => {
        setBills([...bills, { name: '', amount: 0 }])
    }

    const removeBill = (index) => {
        setBills(bills.filter((_, i) => i !== index))
    }

    const updateBill = (index, field, value) => {
        const updated = [...bills]
        updated[index][field] = field === 'amount' ? Number(value) : value
        setBills(updated)
    }

    const results = useMemo(() => {
        const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0)

        let roommateShares
        if (splitMethod === 'equal') {
            const equalShare = totalBills / roommates.length
            roommateShares = roommates.map(r => ({
                ...r,
                amount: equalShare,
                percentage: 100 / roommates.length
            }))
        } else {
            // Custom percentage split
            roommateShares = roommates.map(r => ({
                ...r,
                amount: totalBills * (r.share / 100),
                percentage: r.share
            }))
        }

        const totalPercentage = roommates.reduce((sum, r) => sum + r.share, 0)
        const isValid = Math.abs(totalPercentage - 100) < 0.1

        return {
            totalBills,
            roommateShares,
            isValid,
            totalPercentage,
            perPersonEqual: totalBills / roommates.length
        }
    }, [bills, roommates, splitMethod])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const handleReset = () => {
        setRoommates([
            { name: 'Person 1', share: 50 },
            { name: 'Person 2', share: 50 }
        ])
        setBills([
            { name: 'Electricity', amount: 120 },
            { name: 'Gas', amount: 45 },
            { name: 'Water', amount: 35 },
            { name: 'Internet', amount: 80 },
            { name: 'Trash', amount: 30 }
        ])
        setSplitMethod('equal')
    }

    return (
        <CalculatorLayout
            title="Utility Bill Splitter"
            description="Split bills fairly among roommates"
            category="Finance"
            categoryPath="/finance"
            icon={Home}
            result={formatCurrency(results.totalBills)}
            resultLabel="Total Bills"
            onReset={handleReset}
        >
            {/* Total Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>💡 Total Monthly Bills</div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>{formatCurrency(results.totalBills)}</div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>
                    {formatCurrency(results.perPersonEqual)} per person (if split equally)
                </div>
            </div>

            {/* Split Method */}
            <div className="input-group">
                <label className="input-label">Split Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                        onClick={() => setSplitMethod('equal')}
                        style={{
                            padding: '12px',
                            background: splitMethod === 'equal' ? '#0ea5e9' : '#1a1a2e',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: splitMethod === 'equal' ? '600' : '400'
                        }}
                    >
                        Equal Split
                    </button>
                    <button
                        onClick={() => setSplitMethod('custom')}
                        style={{
                            padding: '12px',
                            background: splitMethod === 'custom' ? '#0ea5e9' : '#1a1a2e',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: splitMethod === 'custom' ? '600' : '400'
                        }}
                    >
                        Custom %
                    </button>
                </div>
            </div>

            {/* Roommates */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                        <Users size={14} style={{ marginRight: '6px' }} />
                        Roommates ({roommates.length})
                    </h3>
                    <button
                        onClick={addRoommate}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 14px',
                            background: '#0ea5e9',
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

                {results.roommateShares.map((roommate, index) => (
                    <div key={index} style={{
                        background: '#1a1a2e',
                        borderRadius: '10px',
                        padding: '12px',
                        marginBottom: '8px',
                        border: '1px solid #333'
                    }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={roommates[index].name}
                                onChange={(e) => updateRoommate(index, 'name', e.target.value)}
                                placeholder="Name"
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: '#0a0a0a',
                                    border: '1px solid #333',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                            {splitMethod === 'custom' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        type="number"
                                        value={roommates[index].share}
                                        onChange={(e) => updateRoommate(index, 'share', e.target.value)}
                                        min="0"
                                        max="100"
                                        style={{
                                            width: '60px',
                                            padding: '10px',
                                            background: '#0a0a0a',
                                            border: '1px solid #333',
                                            borderRadius: '6px',
                                            color: 'white',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <span style={{ opacity: 0.6 }}>%</span>
                                </div>
                            )}
                            {roommates.length > 2 && (
                                <button
                                    onClick={() => removeRoommate(index)}
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
                            )}
                        </div>
                        <div style={{
                            marginTop: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#0ea5e9'
                        }}>
                            Owes: {formatCurrency(roommate.amount)}
                        </div>
                    </div>
                ))}

                {splitMethod === 'custom' && !results.isValid && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '12px',
                        color: '#ef4444'
                    }}>
                        ⚠️ Percentages must add up to 100% (currently {results.totalPercentage.toFixed(1)}%)
                    </div>
                )}
            </div>

            {/* Bills */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                        <DollarSign size={14} style={{ marginRight: '6px' }} />
                        Bills ({bills.length})
                    </h3>
                    <button
                        onClick={addBill}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 14px',
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

                {bills.map((bill, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '8px'
                    }}>
                        <input
                            type="text"
                            value={bill.name}
                            onChange={(e) => updateBill(index, 'name', e.target.value)}
                            placeholder="Bill name"
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ opacity: 0.5 }}>$</span>
                            <input
                                type="number"
                                value={bill.amount}
                                onChange={(e) => updateBill(index, 'amount', e.target.value)}
                                min="0"
                                step="5"
                                style={{
                                    width: '80px',
                                    padding: '10px',
                                    background: '#1a1a2e',
                                    border: '1px solid #333',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        <button
                            onClick={() => removeBill(index)}
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
        </CalculatorLayout>
    )
}

export default UtilityBillSplitter
