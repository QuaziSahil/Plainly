import { useState, useMemo } from 'react'
import { Baby } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PregnancyWeightCalculator() {
    const [prePregnancyWeight, setPrePregnancyWeight] = useState(140)
    const [height, setHeight] = useState(65)
    const [currentWeek, setCurrentWeek] = useState(20)
    const [currentWeight, setCurrentWeight] = useState(150)
    const [twins, setTwins] = useState(false)

    const results = useMemo(() => {
        // Calculate pre-pregnancy BMI
        const heightM = height * 0.0254
        const weightKg = prePregnancyWeight * 0.453592
        const bmi = weightKg / (heightM * heightM)

        // Recommended weight gain ranges based on BMI
        let minGain, maxGain
        if (twins) {
            if (bmi < 18.5) { minGain = 50; maxGain = 62 }
            else if (bmi < 25) { minGain = 37; maxGain = 54 }
            else if (bmi < 30) { minGain = 31; maxGain = 50 }
            else { minGain = 25; maxGain = 42 }
        } else {
            if (bmi < 18.5) { minGain = 28; maxGain = 40 }
            else if (bmi < 25) { minGain = 25; maxGain = 35 }
            else if (bmi < 30) { minGain = 15; maxGain = 25 }
            else { minGain = 11; maxGain = 20 }
        }

        const actualGain = currentWeight - prePregnancyWeight
        const expectedGainNow = (currentWeek / 40) * ((minGain + maxGain) / 2)
        const onTrack = actualGain >= (currentWeek / 40) * minGain && actualGain <= (currentWeek / 40) * maxGain

        let status = 'On Track'
        if (actualGain < (currentWeek / 40) * minGain) status = 'Below Range'
        if (actualGain > (currentWeek / 40) * maxGain) status = 'Above Range'

        return { bmi, minGain, maxGain, actualGain, expectedGainNow, onTrack, status }
    }, [prePregnancyWeight, height, currentWeek, currentWeight, twins])

    return (
        <CalculatorLayout
            title="Pregnancy Weight Calculator"
            description="Track healthy pregnancy weight gain"
            category="Health"
            categoryPath="/health"
            icon={Baby}
            result={`${results.actualGain.toFixed(1)} lbs`}
            resultLabel="Weight Gained"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Pre-pregnancy Weight (lbs)</label>
                    <input type="number" value={prePregnancyWeight} onChange={(e) => setPrePregnancyWeight(Number(e.target.value))} min={80} />
                </div>
                <div className="input-group">
                    <label className="input-label">Height (inches)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={48} max={84} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Week</label>
                    <input type="number" value={currentWeek} onChange={(e) => setCurrentWeek(Number(e.target.value))} min={1} max={42} />
                </div>
                <div className="input-group">
                    <label className="input-label">Current Weight (lbs)</label>
                    <input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(Number(e.target.value))} min={80} />
                </div>
            </div>
            <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={twins} onChange={(e) => setTwins(e.target.checked)} />
                    Expecting Twins
                </label>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Pre-pregnancy BMI</span>
                    <span className="result-detail-value">{results.bmi.toFixed(1)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weight Gained</span>
                    <span className="result-detail-value">{results.actualGain.toFixed(1)} lbs</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Recommended Total Gain</span>
                    <span className="result-detail-value">{results.minGain} - {results.maxGain} lbs</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Status</span>
                    <span className="result-detail-value" style={{
                        color: results.status === 'On Track' ? '#10b981' : '#f59e0b'
                    }}>
                        {results.status}
                    </span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PregnancyWeightCalculator
