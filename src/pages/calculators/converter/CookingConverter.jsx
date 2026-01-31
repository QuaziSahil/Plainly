import { useState, useMemo } from 'react'
import { ChefHat } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CookingConverter() {
    const [value, setValue] = useState(1)
    const [fromUnit, setFromUnit] = useState('cup')
    const [ingredient, setIngredient] = useState('water')

    const conversions = {
        cup: { ml: 236.588, tbsp: 16, tsp: 48, oz: 8, l: 0.236588 },
        tbsp: { ml: 14.787, cup: 0.0625, tsp: 3, oz: 0.5, l: 0.014787 },
        tsp: { ml: 4.929, cup: 0.0208, tbsp: 0.333, oz: 0.167, l: 0.004929 },
        ml: { cup: 0.00423, tbsp: 0.0676, tsp: 0.203, oz: 0.0338, l: 0.001 },
        oz: { ml: 29.574, cup: 0.125, tbsp: 2, tsp: 6, l: 0.0296 },
        l: { ml: 1000, cup: 4.227, tbsp: 67.628, tsp: 202.884, oz: 33.814 }
    }

    // Approximate weights for 1 cup of different ingredients
    const ingredientDensity = {
        water: 236,
        flour: 125,
        sugar: 200,
        butter: 227,
        milk: 245,
        oil: 218,
        honey: 340,
        oats: 90,
        rice: 185,
        salt: 273
    }

    const results = useMemo(() => {
        const base = conversions[fromUnit]
        const converted = {}

        Object.keys(base).forEach(unit => {
            converted[unit] = value * base[unit]
        })

        // Calculate weight based on ingredient
        const cupValue = fromUnit === 'cup' ? value : value * (1 / (conversions[fromUnit].cup || 1))
        const grams = cupValue * ingredientDensity[ingredient]

        return { ...converted, grams, oz_weight: grams / 28.35 }
    }, [value, fromUnit, ingredient])

    return (
        <CalculatorLayout
            title="Cooking Converter"
            description="Convert cooking measurements"
            category="Converter"
            categoryPath="/converter"
            icon={ChefHat}
            result={`${results.ml?.toFixed(1)} ml`}
            resultLabel="Milliliters"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Amount</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} min={0} step={0.25} />
                </div>
                <div className="input-group">
                    <label className="input-label">Unit</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        <option value="cup">Cups</option>
                        <option value="tbsp">Tablespoons</option>
                        <option value="tsp">Teaspoons</option>
                        <option value="ml">Milliliters</option>
                        <option value="oz">Fluid Ounces</option>
                        <option value="l">Liters</option>
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Ingredient (for weight)</label>
                <select value={ingredient} onChange={(e) => setIngredient(e.target.value)}>
                    <option value="water">Water</option>
                    <option value="flour">All-Purpose Flour</option>
                    <option value="sugar">Granulated Sugar</option>
                    <option value="butter">Butter</option>
                    <option value="milk">Milk</option>
                    <option value="oil">Vegetable Oil</option>
                    <option value="honey">Honey</option>
                    <option value="oats">Rolled Oats</option>
                    <option value="rice">Uncooked Rice</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Cups</span>
                    <span className="result-detail-value">{(results.cup || value).toFixed(3)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Tablespoons</span>
                    <span className="result-detail-value">{results.tbsp?.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Teaspoons</span>
                    <span className="result-detail-value">{results.tsp?.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Milliliters</span>
                    <span className="result-detail-value">{results.ml?.toFixed(1)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weight (grams)</span>
                    <span className="result-detail-value">{results.grams?.toFixed(0)}g</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CookingConverter
