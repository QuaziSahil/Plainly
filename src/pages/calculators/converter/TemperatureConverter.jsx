import { useState, useMemo } from 'react'
import { Thermometer } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TemperatureConverter() {
    const [value, setValue] = useState(72)
    const [fromUnit, setFromUnit] = useState('fahrenheit')

    const results = useMemo(() => {
        let celsius, fahrenheit, kelvin

        switch (fromUnit) {
            case 'celsius':
                celsius = value
                fahrenheit = (value * 9 / 5) + 32
                kelvin = value + 273.15
                break
            case 'fahrenheit':
                fahrenheit = value
                celsius = (value - 32) * 5 / 9
                kelvin = celsius + 273.15
                break
            case 'kelvin':
                kelvin = value
                celsius = value - 273.15
                fahrenheit = (celsius * 9 / 5) + 32
                break
            default:
                celsius = value
                fahrenheit = value
                kelvin = value
        }

        // Determine temperature description
        let description, emoji
        if (celsius < 0) { description = 'Freezing'; emoji = '🥶' }
        else if (celsius < 10) { description = 'Cold'; emoji = '❄️' }
        else if (celsius < 20) { description = 'Cool'; emoji = '🌤️' }
        else if (celsius < 30) { description = 'Warm'; emoji = '☀️' }
        else if (celsius < 40) { description = 'Hot'; emoji = '🔥' }
        else { description = 'Extreme Heat'; emoji = '🌡️' }

        return { celsius, fahrenheit, kelvin, description, emoji }
    }, [value, fromUnit])

    return (
        <CalculatorLayout
            title="Temperature Converter"
            description="Convert between temperature units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Thermometer}
            result={`${results.celsius.toFixed(1)}°C`}
            resultLabel="Celsius"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Temperature</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Unit</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        <option value="fahrenheit">Fahrenheit</option>
                        <option value="celsius">Celsius</option>
                        <option value="kelvin">Kelvin</option>
                    </select>
                </div>
            </div>
            <div style={{
                background: '#1a1a2e',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{results.emoji}</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{results.description}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{
                    background: fromUnit === 'celsius' ? '#a78bfa20' : '#1a1a2e',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: fromUnit === 'celsius' ? '1px solid #a78bfa40' : 'none'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>CELSIUS</div>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>{results.celsius.toFixed(2)}°C</div>
                </div>
                <div style={{
                    background: fromUnit === 'fahrenheit' ? '#a78bfa20' : '#1a1a2e',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: fromUnit === 'fahrenheit' ? '1px solid #a78bfa40' : 'none'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>FAHRENHEIT</div>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>{results.fahrenheit.toFixed(2)}°F</div>
                </div>
                <div style={{
                    background: fromUnit === 'kelvin' ? '#a78bfa20' : '#1a1a2e',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: fromUnit === 'kelvin' ? '1px solid #a78bfa40' : 'none'
                }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>KELVIN</div>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>{results.kelvin.toFixed(2)} K</div>
                </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px', opacity: 0.6 }}>
                <strong>Reference Points:</strong> Water freezes at 0°C / 32°F / 273.15K • Water boils at 100°C / 212°F / 373.15K
            </div>
        </CalculatorLayout>
    )
}

export default TemperatureConverter
