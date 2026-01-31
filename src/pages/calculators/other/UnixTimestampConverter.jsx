import { useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function UnixTimestampConverter() {
    const [mode, setMode] = useState('toDate')
    const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000))
    const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16))

    const results = useMemo(() => {
        if (mode === 'toDate') {
            const date = new Date(timestamp * 1000)
            return {
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString(),
                iso: date.toISOString(),
                utc: date.toUTCString()
            }
        } else {
            const date = new Date(dateInput)
            const unix = Math.floor(date.getTime() / 1000)
            const unixMs = date.getTime()
            return {
                unix,
                unixMs,
                iso: date.toISOString()
            }
        }
    }, [mode, timestamp, dateInput])

    return (
        <CalculatorLayout
            title="Unix Timestamp Converter"
            description="Convert between Unix timestamps and dates"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Clock}
            result={mode === 'toDate' ? results.date : results.unix?.toString()}
            resultLabel={mode === 'toDate' ? 'Date' : 'Unix Timestamp'}
        >
            <div className="input-group">
                <label className="input-label">Conversion Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="toDate">Timestamp → Date</option>
                    <option value="toTimestamp">Date → Timestamp</option>
                </select>
            </div>
            {mode === 'toDate' ? (
                <div className="input-group">
                    <label className="input-label">Unix Timestamp (seconds)</label>
                    <input type="number" value={timestamp} onChange={(e) => setTimestamp(Number(e.target.value))} />
                </div>
            ) : (
                <div className="input-group">
                    <label className="input-label">Date & Time</label>
                    <input type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
                </div>
            )}
            <button
                onClick={() => setTimestamp(Math.floor(Date.now() / 1000))}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: '#333',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    marginBottom: '16px'
                }}
            >
                Use Current Time
            </button>
            <div className="result-details">
                {mode === 'toDate' ? (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Local Date</span>
                            <span className="result-detail-value">{results.date}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Local Time</span>
                            <span className="result-detail-value">{results.time}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">ISO 8601</span>
                            <span className="result-detail-value" style={{ fontSize: '11px' }}>{results.iso}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Unix (seconds)</span>
                            <span className="result-detail-value">{results.unix}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Unix (milliseconds)</span>
                            <span className="result-detail-value">{results.unixMs}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">ISO 8601</span>
                            <span className="result-detail-value" style={{ fontSize: '11px' }}>{results.iso}</span>
                        </div>
                    </>
                )}
            </div>
        </CalculatorLayout>
    )
}

export default UnixTimestampConverter
