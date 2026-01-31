import { useState, useMemo } from 'react'
import { Ruler } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

const SHOE_SIZES = {
    US_M: { name: 'US Men', offset: 0, multiplier: 1 },
    US_W: { name: 'US Women', offset: 1.5, multiplier: 1 },
    UK: { name: 'UK', offset: 0.5, multiplier: 1 },
    EU: { name: 'EU', offset: 31.5, multiplier: 1 },
    CM: { name: 'CM', offset: 22.5, multiplier: 0.667 }
}

function ShoeSizeConverter() {
    const [usSize, setUsSize] = useState(10)
    const [gender, setGender] = useState('M')

    const results = useMemo(() => {
        const baseSize = gender === 'M' ? usSize : usSize - 1.5

        return {
            usM: baseSize.toFixed(1),
            usW: (baseSize + 1.5).toFixed(1),
            uk: (baseSize - 0.5).toFixed(1),
            eu: Math.round(baseSize + 32.5),
            cm: (baseSize * 0.667 + 22.5).toFixed(1)
        }
    }, [usSize, gender])

    return (
        <CalculatorLayout
            title="Shoe Size Converter"
            description="Convert between international shoe size standards"
            category="Converter"
            categoryPath="/converter"
            icon={Ruler}
            result={`EU ${results.eu}`}
            resultLabel="European Size"
        >
            <div className="input-group">
                <label className="input-label">Gender</label>
                <div className="radio-group">
                    <label className="radio-option">
                        <input
                            type="radio"
                            checked={gender === 'M'}
                            onChange={() => setGender('M')}
                        />
                        <span>Men</span>
                    </label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            checked={gender === 'W'}
                            onChange={() => setGender('W')}
                        />
                        <span>Women</span>
                    </label>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">US Size</label>
                <input
                    type="number"
                    value={usSize}
                    onChange={(e) => setUsSize(Number(e.target.value))}
                    min={1}
                    max={20}
                    step={0.5}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">US Men's</span>
                    <span className="result-detail-value">{results.usM}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">US Women's</span>
                    <span className="result-detail-value">{results.usW}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">UK</span>
                    <span className="result-detail-value">{results.uk}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">EU</span>
                    <span className="result-detail-value">{results.eu}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">CM</span>
                    <span className="result-detail-value">{results.cm}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ShoeSizeConverter
