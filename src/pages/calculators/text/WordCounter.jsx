import { useState, useMemo } from 'react'
import { FileText } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WordCounter() {
    const [text, setText] = useState('Type or paste your text here to count words, characters, and more.')

    const results = useMemo(() => {
        const trimmedText = text.trim()

        const characters = text.length
        const charactersNoSpaces = text.replace(/\s/g, '').length
        const words = trimmedText ? trimmedText.split(/\s+/).filter(w => w.length > 0).length : 0
        const sentences = trimmedText ? (trimmedText.match(/[.!?]+/g) || []).length : 0
        const paragraphs = trimmedText ? trimmedText.split(/\n\n+/).filter(p => p.trim()).length : 0
        const lines = text.split('\n').length

        const avgWordLength = words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0
        const readingTime = Math.ceil(words / 200)
        const speakingTime = Math.ceil(words / 150)

        return {
            characters,
            charactersNoSpaces,
            words,
            sentences,
            paragraphs,
            lines,
            avgWordLength,
            readingTime,
            speakingTime
        }
    }, [text])

    return (
        <CalculatorLayout
            title="Word Counter"
            description="Count words, characters, sentences, and more"
            category="Text"
            categoryPath="/text"
            icon={FileText}
            result={results.words.toLocaleString()}
            resultLabel="Words"
        >
            <div className="input-group">
                <label className="input-label">Enter Text</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    placeholder="Type or paste your text here..."
                    style={{ resize: 'vertical', minHeight: '120px' }}
                />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Words</span>
                    <span className="result-detail-value">{results.words.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Characters</span>
                    <span className="result-detail-value">{results.characters.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Characters (no spaces)</span>
                    <span className="result-detail-value">{results.charactersNoSpaces.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Sentences</span>
                    <span className="result-detail-value">{results.sentences}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Reading Time</span>
                    <span className="result-detail-value">{results.readingTime} min</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Speaking Time</span>
                    <span className="result-detail-value">{results.speakingTime} min</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default WordCounter
