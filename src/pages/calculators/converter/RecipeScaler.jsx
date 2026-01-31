import { useState, useMemo } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RecipeScaler() {
    const [originalServings, setOriginalServings] = useState(4)
    const [desiredServings, setDesiredServings] = useState(8)
    const [ingredients, setIngredients] = useState(`2 cups flour
1 teaspoon salt
3/4 cup sugar
2 eggs
1.5 cups milk`)

    const results = useMemo(() => {
        const ratio = desiredServings / originalServings

        const lines = ingredients.split('\n').filter(line => line.trim())

        const scaled = lines.map(line => {
            // Parse ingredient line
            const match = line.match(/^([\d\.\s\/]+)\s*(.+)$/)
            if (!match) return { original: line, scaled: line, amount: null }

            let amount = match[1].trim()
            const ingredient = match[2].trim()

            // Handle fractions
            let numericAmount = 0
            if (amount.includes('/')) {
                const parts = amount.split(' ')
                parts.forEach(part => {
                    if (part.includes('/')) {
                        const [num, denom] = part.split('/')
                        numericAmount += parseInt(num) / parseInt(denom)
                    } else if (part) {
                        numericAmount += parseFloat(part)
                    }
                })
            } else {
                numericAmount = parseFloat(amount)
            }

            const scaledAmount = numericAmount * ratio

            // Format nicely
            let formattedAmount
            if (scaledAmount % 1 === 0) {
                formattedAmount = scaledAmount.toString()
            } else if (Math.abs(scaledAmount - Math.round(scaledAmount * 4) / 4) < 0.01) {
                // Close to quarter fraction
                const quarters = Math.round(scaledAmount * 4)
                const whole = Math.floor(quarters / 4)
                const frac = quarters % 4
                const fracMap = { 1: '¼', 2: '½', 3: '¾' }
                formattedAmount = whole > 0
                    ? `${whole}${frac ? ' ' + fracMap[frac] : ''}`
                    : fracMap[frac] || scaledAmount.toFixed(2)
            } else {
                formattedAmount = scaledAmount.toFixed(2)
            }

            return {
                original: `${amount} ${ingredient}`,
                scaled: `${formattedAmount} ${ingredient}`,
                amount: scaledAmount
            }
        })

        return { ratio, scaled }
    }, [originalServings, desiredServings, ingredients])

    const copyScaled = () => {
        const text = results.scaled.map(s => s.scaled).join('\n')
        navigator.clipboard.writeText(text)
    }

    return (
        <CalculatorLayout
            title="Recipe Scaler"
            description="Scale recipe ingredients up or down"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={UtensilsCrossed}
            result={`${results.ratio.toFixed(2)}x`}
            resultLabel="Scale Factor"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Original Servings</label>
                    <input type="number" value={originalServings} onChange={(e) => setOriginalServings(Number(e.target.value))} min={1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Desired Servings</label>
                    <input type="number" value={desiredServings} onChange={(e) => setDesiredServings(Number(e.target.value))} min={1} />
                </div>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
                padding: '12px',
                background: '#1a1a2e',
                borderRadius: '8px'
            }}>
                <span style={{ opacity: 0.6 }}>{originalServings} servings</span>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>→ {results.ratio.toFixed(2)}x →</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>{desiredServings} servings</span>
            </div>
            <div className="input-group">
                <label className="input-label">Original Ingredients (one per line)</label>
                <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    rows={5}
                    placeholder="2 cups flour&#10;1 teaspoon salt..."
                />
            </div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>🍳 SCALED INGREDIENTS</div>
            <div style={{
                background: '#1a1a2e',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px'
            }}>
                {results.scaled.map((item, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: i < results.scaled.length - 1 ? '1px solid #333' : 'none'
                    }}>
                        <span style={{ opacity: 0.5, textDecoration: 'line-through', fontSize: '13px' }}>
                            {item.original}
                        </span>
                        <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '13px' }}>
                            {item.scaled}
                        </span>
                    </div>
                ))}
            </div>
            <button
                onClick={copyScaled}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: '#a78bfa',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}
            >
                📋 Copy Scaled Ingredients
            </button>
        </CalculatorLayout>
    )
}

export default RecipeScaler
