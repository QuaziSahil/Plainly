import { useState, useMemo } from 'react'
import { Leaf } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PlasticFootprintCalculator() {
    const [waterBottles, setWaterBottles] = useState(5)
    const [groceryBags, setGroceryBags] = useState(10)
    const [takeoutContainers, setTakeoutContainers] = useState(3)
    const [straws, setStraws] = useState(7)
    const [coffeCups, setCoffeeCups] = useState(5)

    const results = useMemo(() => {
        // Weekly plastic usage in grams
        const weeklyUsage = {
            bottles: waterBottles * 12.7, // ~12.7g per bottle
            bags: groceryBags * 5.5, // ~5.5g per bag
            takeout: takeoutContainers * 35, // ~35g per container
            straws: straws * 0.4, // ~0.4g per straw
            cups: coffeCups * 11.5 // ~11.5g per cup with lid
        }

        const weeklyTotal = Object.values(weeklyUsage).reduce((a, b) => a + b, 0)
        const monthlyTotal = weeklyTotal * 4.33
        const yearlyTotal = weeklyTotal * 52

        // Environmental impact
        const yearlyKg = yearlyTotal / 1000
        const co2Impact = yearlyKg * 6 // ~6 kg CO2 per kg plastic
        const oceanWastePercent = yearlyKg * 0.02 // ~2% ends up in ocean

        // Alternatives impact
        const potentialSavings = {
            reusableBottle: waterBottles * 52 * 12.7 / 1000,
            reusableBags: groceryBags * 52 * 5.5 / 1000,
            ownContainer: takeoutContainers * 52 * 35 / 1000
        }

        // How many years to decompose various items
        const decompose = {
            'Plastic Bag': '20 years',
            'Water Bottle': '450 years',
            'Straw': '200 years',
            'Coffee Cup': '30 years'
        }

        return {
            weeklyUsage,
            weeklyTotal,
            monthlyTotal,
            yearlyTotal,
            yearlyKg,
            co2Impact,
            oceanWastePercent,
            potentialSavings,
            decompose
        }
    }, [waterBottles, groceryBags, takeoutContainers, straws, coffeCups])

    return (
        <CalculatorLayout
            title="Plastic Footprint Calculator"
            description="Track your weekly plastic usage"
            category="Sustainability"
            categoryPath="/calculators?category=Sustainability"
            icon={Leaf}
            result={`${results.yearlyKg.toFixed(1)} kg/year`}
            resultLabel="Annual Plastic"
        >
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '12px' }}>
                How many do you use per WEEK?
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">💧 Water Bottles</label>
                    <input type="number" value={waterBottles} onChange={(e) => setWaterBottles(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">🛒 Grocery Bags</label>
                    <input type="number" value={groceryBags} onChange={(e) => setGroceryBags(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">🥡 Takeout Containers</label>
                    <input type="number" value={takeoutContainers} onChange={(e) => setTakeoutContainers(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">🥤 Straws</label>
                    <input type="number" value={straws} onChange={(e) => setStraws(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">☕ Coffee Cups (disposable)</label>
                <input type="number" value={coffeCups} onChange={(e) => setCoffeeCups(Number(e.target.value))} min={0} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, background: '#ef444420', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>WEEKLY</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444' }}>
                        {Math.round(results.weeklyTotal)}g
                    </div>
                </div>
                <div style={{ flex: 1, background: '#f59e0b20', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>YEARLY</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>
                        {results.yearlyKg.toFixed(1)}kg
                    </div>
                </div>
                <div style={{ flex: 1, background: '#22c55e20', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>CO₂ IMPACT</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>
                        {results.co2Impact.toFixed(1)}kg
                    </div>
                </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>🌱 SWITCH TO REUSABLES & SAVE</div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Reusable Water Bottle</span>
                    <span className="result-detail-value" style={{ color: '#22c55e' }}>-{results.potentialSavings.reusableBottle.toFixed(1)} kg/year</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Reusable Shopping Bags</span>
                    <span className="result-detail-value" style={{ color: '#22c55e' }}>-{results.potentialSavings.reusableBags.toFixed(1)} kg/year</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Own Takeout Container</span>
                    <span className="result-detail-value" style={{ color: '#22c55e' }}>-{results.potentialSavings.ownContainer.toFixed(1)} kg/year</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PlasticFootprintCalculator
