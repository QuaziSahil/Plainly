import { useState, useMemo } from 'react'
import { Trees } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TreeCarbonCalculator() {
    const [treeType, setTreeType] = useState('deciduous')
    const [treeCount, setTreeCount] = useState(10)
    const [treeAge, setTreeAge] = useState(10)

    // Average CO2 absorption per tree per year (lbs)
    const treeAbsorption = {
        deciduous: 48, // oak, maple, etc.
        coniferous: 35, // pine, spruce
        tropical: 50,
        fruit: 30
    }

    const results = useMemo(() => {
        const annualAbsorption = treeAbsorption[treeType] * treeCount
        const totalAbsorption = annualAbsorption * treeAge

        // Convert to metric tons
        const annualTons = annualAbsorption / 2204.62
        const totalTons = totalAbsorption / 2204.62

        // Car equivalence (average car emits 4.6 tons CO2/year)
        const carEquivalent = annualTons / 4.6

        // Flight equivalence (one round trip NYC-LA = ~0.6 tons)
        const flightEquivalent = totalTons / 0.6

        return { annualAbsorption, totalAbsorption, annualTons, totalTons, carEquivalent, flightEquivalent }
    }, [treeType, treeCount, treeAge])

    return (
        <CalculatorLayout
            title="Tree Carbon Calculator"
            description="Calculate tree CO₂ absorption"
            category="Sustainability"
            categoryPath="/calculators?category=Sustainability"
            icon={Trees}
            result={`${results.totalAbsorption.toFixed(0)} lbs`}
            resultLabel="Total CO₂ Absorbed"
        >
            <div className="input-group">
                <label className="input-label">Tree Type</label>
                <select value={treeType} onChange={(e) => setTreeType(e.target.value)}>
                    <option value="deciduous">Deciduous (Oak, Maple)</option>
                    <option value="coniferous">Coniferous (Pine, Spruce)</option>
                    <option value="tropical">Tropical</option>
                    <option value="fruit">Fruit Trees</option>
                </select>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Number of Trees</label>
                    <input type="number" value={treeCount} onChange={(e) => setTreeCount(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Tree Age (years)</label>
                    <input type="number" value={treeAge} onChange={(e) => setTreeAge(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Annual Absorption</span>
                    <span className="result-detail-value">{results.annualAbsorption.toFixed(0)} lbs CO₂</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Absorbed</span>
                    <span className="result-detail-value">{results.totalAbsorption.toFixed(0)} lbs CO₂</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Per Year (metric tons)</span>
                    <span className="result-detail-value">{results.annualTons.toFixed(2)} t</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Car Offset Equivalent</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>{(results.carEquivalent * 100).toFixed(1)}% of 1 car</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TreeCarbonCalculator
