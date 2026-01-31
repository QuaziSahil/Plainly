import { useState, useMemo } from 'react'
import { Star } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ZodiacFinder() {
    const [birthDate, setBirthDate] = useState('1995-07-15')

    const results = useMemo(() => {
        if (!birthDate) return { sign: '', symbol: '', element: '', dates: '' }

        const date = new Date(birthDate)
        const month = date.getMonth() + 1
        const day = date.getDate()

        const zodiacSigns = [
            { sign: 'Capricorn', symbol: '♑', element: 'Earth', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
            { sign: 'Aquarius', symbol: '♒', element: 'Air', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
            { sign: 'Pisces', symbol: '♓', element: 'Water', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
            { sign: 'Aries', symbol: '♈', element: 'Fire', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
            { sign: 'Taurus', symbol: '♉', element: 'Earth', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
            { sign: 'Gemini', symbol: '♊', element: 'Air', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
            { sign: 'Cancer', symbol: '♋', element: 'Water', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
            { sign: 'Leo', symbol: '♌', element: 'Fire', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
            { sign: 'Virgo', symbol: '♍', element: 'Earth', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
            { sign: 'Libra', symbol: '♎', element: 'Air', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
            { sign: 'Scorpio', symbol: '♏', element: 'Water', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
            { sign: 'Sagittarius', symbol: '♐', element: 'Fire', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 }
        ]

        const traits = {
            Aries: 'Bold, ambitious, competitive',
            Taurus: 'Reliable, patient, devoted',
            Gemini: 'Curious, adaptable, witty',
            Cancer: 'Intuitive, emotional, protective',
            Leo: 'Dramatic, confident, loyal',
            Virgo: 'Practical, analytical, hardworking',
            Libra: 'Diplomatic, fair, social',
            Scorpio: 'Passionate, resourceful, brave',
            Sagittarius: 'Optimistic, honest, adventurous',
            Capricorn: 'Disciplined, responsible, ambitious',
            Aquarius: 'Independent, original, humanitarian',
            Pisces: 'Compassionate, intuitive, artistic'
        }

        let zodiac = zodiacSigns[0]
        for (const z of zodiacSigns) {
            if (z.startMonth === 12) {
                if ((month === 12 && day >= z.startDay) || (month === 1 && day <= z.endDay)) {
                    zodiac = z
                    break
                }
            } else if ((month === z.startMonth && day >= z.startDay) || (month === z.endMonth && day <= z.endDay)) {
                zodiac = z
                break
            }
        }

        return {
            ...zodiac,
            traits: traits[zodiac.sign],
            dates: `${zodiac.startMonth}/${zodiac.startDay} - ${zodiac.endMonth}/${zodiac.endDay}`
        }
    }, [birthDate])

    return (
        <CalculatorLayout
            title="Zodiac Sign Finder"
            description="Find your zodiac sign from birth date"
            category="Other"
            categoryPath="/other"
            icon={Star}
            result={results.sign}
            resultLabel="Your Zodiac Sign"
        >
            <div className="input-group">
                <label className="input-label">Birth Date</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            {results.sign && (
                <div className="result-details">
                    <div style={{ textAlign: 'center', fontSize: '64px', margin: '16px 0' }}>
                        {results.symbol}
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Sign</span>
                        <span className="result-detail-value">{results.sign}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Element</span>
                        <span className="result-detail-value">{results.element}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Dates</span>
                        <span className="result-detail-value">{results.dates}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Traits</span>
                        <span className="result-detail-value" style={{ fontSize: '12px' }}>{results.traits}</span>
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default ZodiacFinder
