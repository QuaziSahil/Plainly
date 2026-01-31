import { useState, useMemo } from 'react'
import { PenLine } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ReadabilityCalculator() {
    const [text, setText] = useState('The quick brown fox jumps over the lazy dog. This is a sample text to analyze for readability. It contains multiple sentences of varying complexity. Some sentences are short. Others are considerably longer and contain more sophisticated vocabulary that may challenge younger readers.')

    const results = useMemo(() => {
        if (!text.trim()) return null

        const words = text.split(/\s+/).filter(w => w.length > 0)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
        const syllables = words.reduce((total, word) => {
            return total + countSyllables(word)
        }, 0)

        const wordCount = words.length
        const sentenceCount = sentences.length
        const avgWordsPerSentence = wordCount / sentenceCount
        const avgSyllablesPerWord = syllables / wordCount

        // Flesch Reading Ease
        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)

        // Flesch-Kincaid Grade Level
        const fkGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59

        // Gunning Fog Index
        const complexWords = words.filter(w => countSyllables(w) >= 3).length
        const fogIndex = 0.4 * (avgWordsPerSentence + 100 * (complexWords / wordCount))

        // SMOG Index
        const smog = 1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291

        let difficulty, color
        if (fleschScore >= 80) { difficulty = 'Very Easy'; color = '#22c55e' }
        else if (fleschScore >= 60) { difficulty = 'Easy'; color = '#10b981' }
        else if (fleschScore >= 40) { difficulty = 'Moderate'; color = '#f59e0b' }
        else if (fleschScore >= 20) { difficulty = 'Difficult'; color = '#f97316' }
        else { difficulty = 'Very Difficult'; color = '#ef4444' }

        return {
            wordCount,
            sentenceCount,
            syllables,
            avgWordsPerSentence,
            avgSyllablesPerWord,
            fleschScore,
            fkGrade,
            fogIndex,
            smog,
            complexity: complexWords,
            difficulty,
            color
        }
    }, [text])

    function countSyllables(word) {
        word = word.toLowerCase().replace(/[^a-z]/g, '')
        if (word.length <= 3) return 1

        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        word = word.replace(/^y/, '')

        const syllables = word.match(/[aeiouy]{1,2}/g)
        return syllables ? syllables.length : 1
    }

    return (
        <CalculatorLayout
            title="Readability Calculator"
            description="Analyze text readability scores"
            category="Text"
            categoryPath="/calculators?category=Text"
            icon={PenLine}
            result={results ? results.difficulty : '—'}
            resultLabel="Difficulty"
        >
            <div className="input-group">
                <label className="input-label">Text to Analyze</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    placeholder="Enter text to analyze..."
                />
            </div>
            {results && (
                <>
                    <div style={{
                        background: `${results.color}20`,
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        marginBottom: '16px',
                        border: `1px solid ${results.color}40`
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: results.color }}>
                            {Math.round(results.fleschScore)}
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>Flesch Reading Ease</div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: results.color, marginTop: '4px' }}>
                            {results.difficulty}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#a78bfa' }}>{results.wordCount}</div>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>Words</div>
                        </div>
                        <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#a78bfa' }}>{results.sentenceCount}</div>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>Sentences</div>
                        </div>
                        <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#a78bfa' }}>{results.complexity}</div>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>Complex</div>
                        </div>
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">Flesch-Kincaid Grade</span>
                            <span className="result-detail-value">Grade {results.fkGrade.toFixed(1)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Gunning Fog Index</span>
                            <span className="result-detail-value">{results.fogIndex.toFixed(1)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">SMOG Index</span>
                            <span className="result-detail-value">{results.smog.toFixed(1)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Avg Words/Sentence</span>
                            <span className="result-detail-value">{results.avgWordsPerSentence.toFixed(1)}</span>
                        </div>
                    </div>
                </>
            )}
        </CalculatorLayout>
    )
}

export default ReadabilityCalculator
