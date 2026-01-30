import { useState, useMemo } from 'react'
import { Percent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PercentageCalculator() {
    const [mode, setMode] = useState('whatIs')
    const [value1, setValue1] = useState(25)
    const [value2, setValue2] = useState(200)

    const results = useMemo(() => {
        switch (mode) {
            case 'whatIs': // What is X% of Y?
                return (value1 / 100) * value2
            case 'isWhatPercent': // X is what percent of Y?
                return (value1 / value2) * 100
            case 'percentChange': // % change from X to Y
                return ((value2 - value1) / value1) * 100
            case 'increaseBy': // Increase X by Y%
                return value1 * (1 + value2 / 100)
            case 'decreaseBy': // Decrease X by Y%
                return value1 * (1 - value2 / 100)
            default:
                return 0
        }
    }, [mode, value1, value2])

    const getLabels = () => {
        switch (mode) {
            case 'whatIs':
                return { label1: 'Percentage (%)', label2: 'Number', resultLabel: 'Result' }
            case 'isWhatPercent':
                return { label1: 'Value', label2: 'Total', resultLabel: 'Percentage' }
            case 'percentChange':
                return { label1: 'From', label2: 'To', resultLabel: 'Change (%)' }
            case 'increaseBy':
                return { label1: 'Original Value', label2: 'Increase by (%)', resultLabel: 'New Value' }
            case 'decreaseBy':
                return { label1: 'Original Value', label2: 'Decrease by (%)', resultLabel: 'New Value' }
            default:
                return { label1: 'Value 1', label2: 'Value 2', resultLabel: 'Result' }
        }
    }

    const labels = getLabels()

    const formatResult = () => {
        if (mode === 'isWhatPercent' || mode === 'percentChange') {
            return `${results.toFixed(2)}%`
        }
        return results.toFixed(2)
    }

    return (
        <CalculatorLayout
            title="Percentage Calculator"
            subtitle="Calculate percentages, increases, and differences"
            category="Math"
            categoryPath="/math"
            icon={Percent}
            result={formatResult()}
            resultLabel={labels.resultLabel}
        >
            <div className="input-group">
                <label className="input-label">Calculation Type</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="whatIs">What is X% of Y?</option>
                    <option value="isWhatPercent">X is what percent of Y?</option>
                    <option value="percentChange">Percentage change from X to Y</option>
                    <option value="increaseBy">Increase X by Y%</option>
                    <option value="decreaseBy">Decrease X by Y%</option>
                </select>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">{labels.label1}</label>
                    <input
                        type="number"
                        value={value1}
                        onChange={(e) => setValue1(Number(e.target.value))}
                        step="any"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">{labels.label2}</label>
                    <input
                        type="number"
                        value={value2}
                        onChange={(e) => setValue2(Number(e.target.value))}
                        step="any"
                    />
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PercentageCalculator
