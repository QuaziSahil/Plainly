import { useState, useMemo } from 'react'
import { Map } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DistanceCalculator() {
    const [lat1, setLat1] = useState(40.7128)
    const [lon1, setLon1] = useState(-74.0060)
    const [lat2, setLat2] = useState(51.5074)
    const [lon2, setLon2] = useState(-0.1278)
    const [unit, setUnit] = useState('km')

    const presets = {
        nyLondon: { lat1: 40.7128, lon1: -74.0060, lat2: 51.5074, lon2: -0.1278, name: 'New York → London' },
        laTokyo: { lat1: 34.0522, lon1: -118.2437, lat2: 35.6762, lon2: 139.6503, name: 'Los Angeles → Tokyo' },
        sydneyParis: { lat1: -33.8688, lon1: 151.2093, lat2: 48.8566, lon2: 2.3522, name: 'Sydney → Paris' }
    }

    const results = useMemo(() => {
        const R = unit === 'km' ? 6371 : 3959 // Earth radius

        const toRad = (deg) => deg * Math.PI / 180

        const dLat = toRad(lat2 - lat1)
        const dLon = toRad(lon2 - lon1)

        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c

        // Calculate bearing
        const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2))
        const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1))
        let bearing = Math.atan2(y, x) * 180 / Math.PI
        bearing = (bearing + 360) % 360

        // Estimated travel times
        const flightHours = distance / (unit === 'km' ? 900 : 560)
        const driveHours = distance / (unit === 'km' ? 100 : 62)

        return { distance, bearing, flightHours, driveHours }
    }, [lat1, lon1, lat2, lon2, unit])

    const setPreset = (preset) => {
        setLat1(preset.lat1)
        setLon1(preset.lon1)
        setLat2(preset.lat2)
        setLon2(preset.lon2)
    }

    return (
        <CalculatorLayout
            title="Distance Calculator"
            description="Calculate distance between coordinates"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Map}
            result={`${Math.round(results.distance).toLocaleString()} ${unit}`}
            resultLabel="Distance"
        >
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {Object.entries(presets).map(([key, preset]) => (
                    <button
                        key={key}
                        onClick={() => setPreset(preset)}
                        style={{
                            padding: '6px 12px',
                            background: '#333',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>📍 START POINT</div>
                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">Latitude</label>
                        <input type="number" value={lat1} onChange={(e) => setLat1(Number(e.target.value))} step="any" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Longitude</label>
                        <input type="number" value={lon1} onChange={(e) => setLon1(Number(e.target.value))} step="any" />
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>📍 END POINT</div>
                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">Latitude</label>
                        <input type="number" value={lat2} onChange={(e) => setLat2(Number(e.target.value))} step="any" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Longitude</label>
                        <input type="number" value={lon2} onChange={(e) => setLon2(Number(e.target.value))} step="any" />
                    </div>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="km">Kilometers</option>
                    <option value="mi">Miles</option>
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Distance</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>
                        {Math.round(results.distance).toLocaleString()} {unit}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Bearing</span>
                    <span className="result-detail-value">{results.bearing.toFixed(1)}°</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">✈️ Flight Time (est.)</span>
                    <span className="result-detail-value">{results.flightHours.toFixed(1)} hours</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">🚗 Drive Time (est.)</span>
                    <span className="result-detail-value">{results.driveHours.toFixed(0)} hours</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default DistanceCalculator
