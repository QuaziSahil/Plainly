import { useState, useMemo } from 'react'
import { Timer } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PaceCalculator() {
    const [distance, setDistance] = useState(5)
    const [distanceUnit, setDistanceUnit] = useState('km')
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(25)
    const [seconds, setSeconds] = useState(0)

    const results = useMemo(() => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        const distanceInKm = distanceUnit === 'miles' ? distance * 1.60934 : distance
        const distanceInMiles = distanceUnit === 'km' ? distance * 0.621371 : distance

        if (distance <= 0 || totalSeconds <= 0) {
            return {
                pacePerKm: '0:00',
                pacePerMile: '0:00',
                speedKmh: 0,
                speedMph: 0
            }
        }

        // Pace per km
        const secondsPerKm = totalSeconds / distanceInKm
        const paceKmMin = Math.floor(secondsPerKm / 60)
        const paceKmSec = Math.floor(secondsPerKm % 60)

        // Pace per mile
        const secondsPerMile = totalSeconds / distanceInMiles
        const paceMileMin = Math.floor(secondsPerMile / 60)
        const paceMileSec = Math.floor(secondsPerMile % 60)

        // Speed
        const speedKmh = (distanceInKm / totalSeconds) * 3600
        const speedMph = (distanceInMiles / totalSeconds) * 3600

        return {
            pacePerKm: `${paceKmMin}:${String(paceKmSec).padStart(2, '0')}`,
            pacePerMile: `${paceMileMin}:${String(paceMileSec).padStart(2, '0')}`,
            speedKmh: speedKmh.toFixed(2),
            speedMph: speedMph.toFixed(2)
        }
    }, [distance, distanceUnit, hours, minutes, seconds])

    return (
        <CalculatorLayout
            title="Pace Calculator"
            description="Calculate your running or cycling pace and speed"
            category="Health"
            categoryPath="/health"
            icon={Timer}
            result={`${results.pacePerKm} /km`}
            resultLabel="Pace"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Distance</label>
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        min={0}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Unit</label>
                    <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}>
                        <option value="km">Kilometers</option>
                        <option value="miles">Miles</option>
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Time</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        min={0}
                        max={99}
                        placeholder="Hours"
                    />
                    <input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))}
                        min={0}
                        max={59}
                        placeholder="Minutes"
                    />
                    <input
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(Number(e.target.value))}
                        min={0}
                        max={59}
                        placeholder="Seconds"
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Pace per km</span>
                    <span className="result-detail-value">{results.pacePerKm} /km</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Pace per mile</span>
                    <span className="result-detail-value">{results.pacePerMile} /mi</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Speed (km/h)</span>
                    <span className="result-detail-value">{results.speedKmh} km/h</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Speed (mph)</span>
                    <span className="result-detail-value">{results.speedMph} mph</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PaceCalculator
