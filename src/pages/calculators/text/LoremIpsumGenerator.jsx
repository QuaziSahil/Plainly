import { useState, useMemo } from 'react'
import { Text } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LoremIpsumGenerator() {
    const [paragraphs, setParagraphs] = useState(3)
    const [type, setType] = useState('lorem')

    const loremWords = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

    const hipsterWords = 'Typewriter biodiesel raw denim aesthetic freegan vinyl kombucha artisan helvetica craft beer keffiyeh tumblr portland sustainable farm-to-table tattooed fixie selfies fingerstache kale chips ennui authentic butcher chambray mumblecore waistcoat quinoa messenger bag scenester irony plaid synth beard put a bird on it mlkshk'.split(' ')

    const results = useMemo(() => {
        const words = type === 'lorem' ? loremWords : hipsterWords
        const paras = []

        for (let i = 0; i < paragraphs; i++) {
            const sentences = Math.floor(Math.random() * 3) + 4
            let para = ''

            for (let j = 0; j < sentences; j++) {
                const wordCount = Math.floor(Math.random() * 10) + 8
                const sentenceWords = []

                for (let k = 0; k < wordCount; k++) {
                    sentenceWords.push(words[Math.floor(Math.random() * words.length)])
                }

                sentenceWords[0] = sentenceWords[0].charAt(0).toUpperCase() + sentenceWords[0].slice(1)
                para += sentenceWords.join(' ') + '. '
            }

            paras.push(para.trim())
        }

        const text = paras.join('\n\n')
        const wordCount = text.split(/\s+/).length
        const charCount = text.length

        return { text, paras, wordCount, charCount }
    }, [paragraphs, type])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(results.text)
    }

    return (
        <CalculatorLayout
            title="Lorem Ipsum Generator"
            description="Generate placeholder text"
            category="Text"
            categoryPath="/calculators?category=Text"
            icon={Text}
            result={`${results.wordCount} words`}
            resultLabel="Generated"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Paragraphs</label>
                    <input type="number" value={paragraphs} onChange={(e) => setParagraphs(Math.min(10, Math.max(1, Number(e.target.value))))} min={1} max={10} />
                </div>
                <div className="input-group">
                    <label className="input-label">Style</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="lorem">Classic Lorem Ipsum</option>
                        <option value="hipster">Hipster Ipsum</option>
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Generated Text</label>
                <textarea
                    value={results.text}
                    readOnly
                    rows={8}
                    style={{ background: '#1a1a2e', fontSize: '13px', lineHeight: '1.6' }}
                />
            </div>
            <div className="result-details" style={{ marginBottom: '16px' }}>
                <div className="result-detail-row">
                    <span className="result-detail-label">Paragraphs</span>
                    <span className="result-detail-value">{results.paras.length}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Words</span>
                    <span className="result-detail-value">{results.wordCount}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Characters</span>
                    <span className="result-detail-value">{results.charCount}</span>
                </div>
            </div>
            <button
                onClick={copyToClipboard}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: '#a78bfa',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}
            >
                Copy Text
            </button>
        </CalculatorLayout>
    )
}

export default LoremIpsumGenerator
