import { useState, useMemo } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

const conversions = {
    length: {
        name: 'Length',
        units: {
            meter: { name: 'Meters', factor: 1 },
            kilometer: { name: 'Kilometers', factor: 1000 },
            centimeter: { name: 'Centimeters', factor: 0.01 },
            millimeter: { name: 'Millimeters', factor: 0.001 },
            mile: { name: 'Miles', factor: 1609.344 },
            yard: { name: 'Yards', factor: 0.9144 },
            foot: { name: 'Feet', factor: 0.3048 },
            inch: { name: 'Inches', factor: 0.0254 }
        }
    },
    weight: {
        name: 'Weight',
        units: {
            kilogram: { name: 'Kilograms', factor: 1 },
            gram: { name: 'Grams', factor: 0.001 },
            milligram: { name: 'Milligrams', factor: 0.000001 },
            pound: { name: 'Pounds', factor: 0.453592 },
            ounce: { name: 'Ounces', factor: 0.0283495 },
            ton: { name: 'Metric Tons', factor: 1000 }
        }
    },
    temperature: {
        name: 'Temperature',
        units: {
            celsius: { name: 'Celsius', factor: 1 },
            fahrenheit: { name: 'Fahrenheit', factor: 1 },
            kelvin: { name: 'Kelvin', factor: 1 }
        }
    },
    area: {
        name: 'Area',
        units: {
            sqmeter: { name: 'Square Meters', factor: 1 },
            sqkilometer: { name: 'Square Kilometers', factor: 1000000 },
            sqfoot: { name: 'Square Feet', factor: 0.092903 },
            sqyard: { name: 'Square Yards', factor: 0.836127 },
            acre: { name: 'Acres', factor: 4046.86 },
            hectare: { name: 'Hectares', factor: 10000 }
        }
    },
    volume: {
        name: 'Volume',
        units: {
            liter: { name: 'Liters', factor: 1 },
            milliliter: { name: 'Milliliters', factor: 0.001 },
            gallon: { name: 'Gallons (US)', factor: 3.78541 },
            quart: { name: 'Quarts', factor: 0.946353 },
            pint: { name: 'Pints', factor: 0.473176 },
            cup: { name: 'Cups', factor: 0.236588 },
            fluidounce: { name: 'Fluid Ounces', factor: 0.0295735 }
        }
    },
    speed: {
        name: 'Speed',
        units: {
            mps: { name: 'Meters/Second', factor: 1 },
            kmh: { name: 'Km/Hour', factor: 0.277778 },
            mph: { name: 'Miles/Hour', factor: 0.44704 },
            knot: { name: 'Knots', factor: 0.514444 }
        }
    }
}

function ConversionCalculator() {
    const [category, setCategory] = useState('length')
    const [fromUnit, setFromUnit] = useState('meter')
    const [toUnit, setToUnit] = useState('foot')
    const [value, setValue] = useState(1)

    const result = useMemo(() => {
        const cat = conversions[category]

        if (category === 'temperature') {
            // Special handling for temperature
            let celsius
            if (fromUnit === 'celsius') {
                celsius = value
            } else if (fromUnit === 'fahrenheit') {
                celsius = (value - 32) * 5 / 9
            } else {
                celsius = value - 273.15
            }

            if (toUnit === 'celsius') {
                return celsius
            } else if (toUnit === 'fahrenheit') {
                return celsius * 9 / 5 + 32
            } else {
                return celsius + 273.15
            }
        }

        // Standard conversion
        const fromFactor = cat.units[fromUnit].factor
        const toFactor = cat.units[toUnit].factor
        const baseValue = value * fromFactor
        return baseValue / toFactor
    }, [category, fromUnit, toUnit, value])

    const currentUnits = conversions[category].units

    // Reset units when category changes
    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory)
        const units = Object.keys(conversions[newCategory].units)
        setFromUnit(units[0])
        setToUnit(units[1])
    }

    const swapUnits = () => {
        setFromUnit(toUnit)
        setToUnit(fromUnit)
    }

    return (
        <CalculatorLayout
            title="Conversion Calculator"
            description="Convert between different units of measurement"
            category="Other"
            categoryPath="/other"
            icon={ArrowLeftRight}
            result={result.toFixed(6).replace(/\.?0+$/, '')}
            resultLabel={currentUnits[toUnit]?.name || 'Result'}
        >
            <div className="input-group">
                <label className="input-label">Category</label>
                <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                    {Object.entries(conversions).map(([key, cat]) => (
                        <option key={key} value={key}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Value</label>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    step="any"
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">From</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        {Object.entries(currentUnits).map(([key, unit]) => (
                            <option key={key} value={key}>{unit.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={swapUnits}
                    style={{
                        alignSelf: 'flex-end',
                        padding: 'var(--space-3)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ⇄
                </button>
                <div className="input-group">
                    <label className="input-label">To</label>
                    <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                        {Object.entries(currentUnits).map(([key, unit]) => (
                            <option key={key} value={key}>{unit.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Input</span>
                    <span className="result-detail-value">{value} {currentUnits[fromUnit]?.name}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Result</span>
                    <span className="result-detail-value">{result.toFixed(6).replace(/\.?0+$/, '')} {currentUnits[toUnit]?.name}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ConversionCalculator
