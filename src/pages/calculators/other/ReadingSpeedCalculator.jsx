import { useState, useMemo } from 'react'
import { BookOpen } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ReadingSpeedCalculator() {
    const [wordCount, setWordCount] = useState(1000)
    const [timeMinutes, setTimeMinutes] = useState(5)
    const [mode, setMode] = useState('calculate')
    const [wpm, setWpm] = useState(250)
    const [targetWords, setTargetWords] = useState(5000)

    const results = useMemo(() => {
        if (mode === 'calculate') {
            const wordsPerMinute = wordCount / timeMinutes
            let level = ''
            if (wordsPerMinute < 150) level = 'Below Average'
            else if (wordsPerMinute < 250) level = 'Average'
            else if (wordsPerMinute < 350) level = 'Above Average'
            else if (wordsPerMinute < 500) level = 'Fast'
            else level = 'Speed Reader'

            return { wordsPerMinute, level }
        } else {
            const timeNeeded = targetWords / wpm
            const hours = Math.floor(timeNeeded / 60)
            const minutes = Math.round(timeNeeded % 60)
            return { timeNeeded, hours, minutes }
        }
    }, [mode, wordCount, timeMinutes, wpm, targetWords])

    return (
        <CalculatorLayout
            title="Reading Speed Calculator"
            description="Calculate your reading speed (WPM)"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={BookOpen}
            result={mode === 'calculate' ? `${Math.round(results.wordsPerMinute)} WPM` : `${results.hours}h ${results.minutes}m`}
            resultLabel={mode === 'calculate' ? 'Reading Speed' : 'Time Needed'}
        >
            <div className="input-group">
                <label className="input-label">Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="calculate">Calculate My Speed</option>
                    <option value="estimate">Estimate Reading Time</option>
                </select>
            </div>
            {mode === 'calculate' ? (
                <>
                    <div className="input-group">
                        <label className="input-label">Words Read</label>
                        <input type="number" value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} min={1} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Time Taken (minutes)</label>
                        <input type="number" value={timeMinutes} onChange={(e) => setTimeMinutes(Number(e.target.value))} min={0.1} step={0.5} />
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">Words per Minute</span>
                            <span className="result-detail-value">{Math.round(results.wordsPerMinute)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Level</span>
                            <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.level}</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="input-group">
                        <label className="input-label">Your Reading Speed (WPM)</label>
                        <input type="number" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} min={50} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Target Word Count</label>
                        <input type="number" value={targetWords} onChange={(e) => setTargetWords(Number(e.target.value))} min={1} />
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">Time Needed</span>
                            <span className="result-detail-value">{results.hours}h {results.minutes}m</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Total Minutes</span>
                            <span className="result-detail-value">{Math.round(results.timeNeeded)}</span>
                        </div>
                    </div>
                </>
            )}
        </CalculatorLayout>
    )
}

export default ReadingSpeedCalculator
