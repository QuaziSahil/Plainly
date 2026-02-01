import { useState, useMemo } from 'react'
import { Rocket, DollarSign, Plus, Trash2, TrendingUp, PieChart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SideHustleCalculator() {
    const [sideHustles, setSideHustles] = useState([
        { name: 'Freelance Design', hourlyRate: 50, hoursPerWeek: 10 },
        { name: 'Content Writing', hourlyRate: 35, hoursPerWeek: 5 },
        { name: 'Online Tutoring', hourlyRate: 40, hoursPerWeek: 3 }
    ])
    const [primaryIncome, setPrimaryIncome] = useState(4500)
    const [taxRate, setTaxRate] = useState(25)

    const addHustle = () => {
        setSideHustles([...sideHustles, { name: '', hourlyRate: 25, hoursPerWeek: 5 }])
    }

    const updateHustle = (index, field, value) => {
        const updated = [...sideHustles]
        updated[index][field] = field === 'name' ? value : Number(value)
        setSideHustles(updated)
    }

    const removeHustle = (index) => {
        setSideHustles(sideHustles.filter((_, i) => i !== index))
    }

    const results = useMemo(() => {
        let totalWeeklyHours = 0
        let totalWeeklyIncome = 0

        const hustleDetails = sideHustles.map(h => {
            const weekly = h.hourlyRate * h.hoursPerWeek
            const monthly = weekly * 4.33
            const yearly = weekly * 52
            totalWeeklyHours += h.hoursPerWeek
            totalWeeklyIncome += weekly
            return { ...h, weekly, monthly, yearly }
        })

        const monthlyGross = totalWeeklyIncome * 4.33
        const yearlyGross = totalWeeklyIncome * 52
        const monthlyAfterTax = monthlyGross * (1 - taxRate / 100)
        const yearlyAfterTax = yearlyGross * (1 - taxRate / 100)

        // Total income with primary job
        const totalMonthly = primaryIncome + monthlyGross
        const totalYearly = (primaryIncome * 12) + yearlyGross

        // Increase percentage
        const incomeIncrease = primaryIncome > 0 ? (monthlyGross / primaryIncome) * 100 : 0

        // Effective hourly rate
        const effectiveHourly = totalWeeklyHours > 0 ? totalWeeklyIncome / totalWeeklyHours : 0

        return {
            hustles: hustleDetails,
            totalWeeklyHours,
            totalWeeklyIncome,
            monthlyGross,
            yearlyGross,
            monthlyAfterTax,
            yearlyAfterTax,
            totalMonthly,
            totalYearly,
            incomeIncrease,
            effectiveHourly
        }
    }, [sideHustles, primaryIncome, taxRate])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const handleReset = () => {
        setSideHustles([
            { name: 'Freelance Design', hourlyRate: 50, hoursPerWeek: 10 },
            { name: 'Content Writing', hourlyRate: 35, hoursPerWeek: 5 },
            { name: 'Online Tutoring', hourlyRate: 40, hoursPerWeek: 3 }
        ])
        setPrimaryIncome(4500)
        setTaxRate(25)
    }

    return (
        <CalculatorLayout
            title="Side Hustle Income Calculator"
            description="Track and maximize your side hustle earnings"
            category="Finance"
            categoryPath="/finance"
            icon={Rocket}
            result={formatCurrency(results.monthlyGross) + "/mo"}
            resultLabel="Side Income"
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
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>🚀 Side Hustle Income</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.monthlyGross)}/mo</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>+{results.incomeIncrease.toFixed(0)}% boost</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>💰 Total Monthly</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(results.totalMonthly)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Job + Side Hustles</div>
                </div>
            </div>

            {/* Primary Income */}
            <div className="input-group">
                <label className="input-label">
                    <DollarSign size={14} style={{ marginRight: '6px' }} />
                    Primary Job Monthly Income
                </label>
                <input
                    type="number"
                    value={primaryIncome}
                    onChange={(e) => setPrimaryIncome(Number(e.target.value))}
                    min="0"
                    step="100"
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

            {/* Side Hustles */}
            <div style={{ marginBottom: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                        Your Side Hustles ({sideHustles.length})
                    </h3>
                    <button
                        onClick={addHustle}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 16px',
                            background: '#f97316',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={14} /> Add Hustle
                    </button>
                </div>

                {sideHustles.map((hustle, index) => (
                    <div key={index} style={{
                        background: '#1a1a2e',
                        borderRadius: '10px',
                        padding: '14px',
                        marginBottom: '10px',
                        border: '1px solid #333'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <input
                                type="text"
                                value={hustle.name}
                                onChange={(e) => updateHustle(index, 'name', e.target.value)}
                                placeholder="Side hustle name"
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: '#0a0a0a',
                                    border: '1px solid #333',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '14px',
                                    marginRight: '8px'
                                }}
                            />
                            <button
                                onClick={() => removeHustle(index)}
                                style={{
                                    padding: '6px',
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label style={{ fontSize: '11px', opacity: 0.6 }}>$/hour</label>
                                <input
                                    type="number"
                                    value={hustle.hourlyRate}
                                    onChange={(e) => updateHustle(index, 'hourlyRate', e.target.value)}
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
                            <div>
                                <label style={{ fontSize: '11px', opacity: 0.6 }}>Hours/week</label>
                                <input
                                    type="number"
                                    value={hustle.hoursPerWeek}
                                    onChange={(e) => updateHustle(index, 'hoursPerWeek', e.target.value)}
                                    min="0"
                                    max="40"
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
                        </div>

                        <div style={{
                            marginTop: '10px',
                            fontSize: '12px',
                            color: '#f97316',
                            fontWeight: '600'
                        }}>
                            = {formatCurrency(hustle.hourlyRate * hustle.hoursPerWeek * 4.33)}/month
                        </div>
                    </div>
                ))}
            </div>

            {/* Tax Rate */}
            <div className="input-group">
                <label className="input-label">
                    Estimated Tax Rate: {taxRate}%
                </label>
                <input
                    type="range"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    min="10"
                    max="45"
                    style={{ width: '100%', accentColor: '#ef4444' }}
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
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>📊 Annual Summary</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>Side Hustle (Gross)</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(results.yearlyGross)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.7 }}>After Tax</span>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(results.yearlyAfterTax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <span>Total Hours/Week</span>
                        <span style={{ fontWeight: '600' }}>{results.totalWeeklyHours}hrs</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Effective Hourly</span>
                        <span style={{ fontWeight: '600', color: '#f97316' }}>{formatCurrency(results.effectiveHourly)}/hr</span>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SideHustleCalculator
