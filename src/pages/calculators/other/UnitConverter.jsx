import { useState, useMemo } from 'react'
import { ArrowLeftRight, ArrowRightLeft } from 'lucide-react'
import './UnitConverter.css'

const unitCategories = {
    length: {
        name: 'Length',
        units: {
            meter: { name: 'Meters', symbol: 'm', toBase: 1 },
            kilometer: { name: 'Kilometers', symbol: 'km', toBase: 1000 },
            centimeter: { name: 'Centimeters', symbol: 'cm', toBase: 0.01 },
            millimeter: { name: 'Millimeters', symbol: 'mm', toBase: 0.001 },
            mile: { name: 'Miles', symbol: 'mi', toBase: 1609.344 },
            yard: { name: 'Yards', symbol: 'yd', toBase: 0.9144 },
            foot: { name: 'Feet', symbol: 'ft', toBase: 0.3048 },
            inch: { name: 'Inches', symbol: 'in', toBase: 0.0254 },
        }
    },
    weight: {
        name: 'Weight',
        units: {
            kilogram: { name: 'Kilograms', symbol: 'kg', toBase: 1 },
            gram: { name: 'Grams', symbol: 'g', toBase: 0.001 },
            milligram: { name: 'Milligrams', symbol: 'mg', toBase: 0.000001 },
            pound: { name: 'Pounds', symbol: 'lb', toBase: 0.453592 },
            ounce: { name: 'Ounces', symbol: 'oz', toBase: 0.0283495 },
            ton: { name: 'Metric Tons', symbol: 't', toBase: 1000 },
        }
    },
    temperature: {
        name: 'Temperature',
        units: {
            celsius: { name: 'Celsius', symbol: '°C' },
            fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
            kelvin: { name: 'Kelvin', symbol: 'K' },
        }
    },
    volume: {
        name: 'Volume',
        units: {
            liter: { name: 'Liters', symbol: 'L', toBase: 1 },
            milliliter: { name: 'Milliliters', symbol: 'mL', toBase: 0.001 },
            gallon: { name: 'Gallons (US)', symbol: 'gal', toBase: 3.78541 },
            quart: { name: 'Quarts', symbol: 'qt', toBase: 0.946353 },
            pint: { name: 'Pints', symbol: 'pt', toBase: 0.473176 },
            cup: { name: 'Cups', symbol: 'cup', toBase: 0.236588 },
            fluidOunce: { name: 'Fluid Ounces', symbol: 'fl oz', toBase: 0.0295735 },
        }
    },
    speed: {
        name: 'Speed',
        units: {
            mps: { name: 'Meters/Second', symbol: 'm/s', toBase: 1 },
            kmph: { name: 'Kilometers/Hour', symbol: 'km/h', toBase: 0.277778 },
            mph: { name: 'Miles/Hour', symbol: 'mph', toBase: 0.44704 },
            knot: { name: 'Knots', symbol: 'kn', toBase: 0.514444 },
        }
    },
    area: {
        name: 'Area',
        units: {
            sqMeter: { name: 'Square Meters', symbol: 'm²', toBase: 1 },
            sqKm: { name: 'Square Kilometers', symbol: 'km²', toBase: 1000000 },
            sqFoot: { name: 'Square Feet', symbol: 'ft²', toBase: 0.092903 },
            sqYard: { name: 'Square Yards', symbol: 'yd²', toBase: 0.836127 },
            acre: { name: 'Acres', symbol: 'ac', toBase: 4046.86 },
            hectare: { name: 'Hectares', symbol: 'ha', toBase: 10000 },
        }
    },
}

function UnitConverter() {
    const [category, setCategory] = useState('length')
    const [fromUnit, setFromUnit] = useState('meter')
    const [toUnit, setToUnit] = useState('foot')
    const [fromValue, setFromValue] = useState(1)

    const convert = (value, from, to, cat) => {
        if (cat === 'temperature') {
            // Special handling for temperature
            let celsius
            if (from === 'celsius') celsius = value
            else if (from === 'fahrenheit') celsius = (value - 32) * 5 / 9
            else if (from === 'kelvin') celsius = value - 273.15

            if (to === 'celsius') return celsius
            else if (to === 'fahrenheit') return (celsius * 9 / 5) + 32
            else if (to === 'kelvin') return celsius + 273.15
        }

        const units = unitCategories[cat].units
        const baseValue = value * units[from].toBase
        return baseValue / units[to].toBase
    }

    const toValue = useMemo(() => {
        return convert(fromValue, fromUnit, toUnit, category)
    }, [fromValue, fromUnit, toUnit, category])

    const swapUnits = () => {
        setFromUnit(toUnit)
        setToUnit(fromUnit)
        setFromValue(toValue)
    }

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory)
        const units = Object.keys(unitCategories[newCategory].units)
        setFromUnit(units[0])
        setToUnit(units[1] || units[0])
        setFromValue(1)
    }

    const formatNumber = (num) => {
        if (Math.abs(num) < 0.001 || Math.abs(num) >= 1000000) {
            return num.toExponential(4)
        }
        return num.toLocaleString('en-US', { maximumFractionDigits: 6 })
    }

    return (
        <div className="unit-converter">
            {/* Header */}
            <div className="converter-header">
                <div className="container">
                    <h1 className="converter-title">Elite Unit Converter</h1>
                    <p className="converter-subtitle">Precision metric transformations</p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
                <div className="container">
                    <div className="tabs-wrapper">
                        {Object.entries(unitCategories).map(([key, cat]) => (
                            <button
                                key={key}
                                className={`tab-btn ${category === key ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(key)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Converter Main */}
            <div className="converter-main">
                <div className="container">
                    <div className="converter-panels">
                        {/* From Panel */}
                        <div className="converter-panel from-panel">
                            <div className="panel-label">Input</div>
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="unit-select"
                            >
                                {Object.entries(unitCategories[category].units).map(([key, unit]) => (
                                    <option key={key} value={key}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={fromValue}
                                onChange={(e) => setFromValue(Number(e.target.value))}
                                className="value-input"
                                placeholder="Enter value"
                            />
                            <div className="unit-symbol">
                                {unitCategories[category].units[fromUnit].symbol}
                            </div>
                        </div>

                        {/* Swap Button */}
                        <button className="swap-btn" onClick={swapUnits} aria-label="Swap units">
                            <ArrowRightLeft size={24} />
                        </button>

                        {/* To Panel */}
                        <div className="converter-panel to-panel">
                            <div className="panel-label">Output</div>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="unit-select"
                            >
                                {Object.entries(unitCategories[category].units).map(([key, unit]) => (
                                    <option key={key} value={key}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                            <div className="result-display">
                                <span className="result-value">{formatNumber(toValue)}</span>
                            </div>
                            <div className="unit-symbol">
                                {unitCategories[category].units[toUnit].symbol}
                            </div>
                        </div>
                    </div>

                    {/* Formula Display */}
                    <div className="formula-display">
                        <span className="formula">
                            {fromValue} {unitCategories[category].units[fromUnit].symbol} = {formatNumber(toValue)} {unitCategories[category].units[toUnit].symbol}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnitConverter
