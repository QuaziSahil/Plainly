import { useState, useMemo } from 'react'
import { SortAsc } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TextSorter() {
    const [text, setText] = useState('Banana\nApple\nCherry\nDate\nElderberry\nFig\nGrape')
    const [sortType, setSortType] = useState('alphabetical')
    const [order, setOrder] = useState('asc')

    const result = useMemo(() => {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line)

        let sorted
        if (sortType === 'alphabetical') {
            sorted = [...lines].sort((a, b) => a.localeCompare(b))
        } else if (sortType === 'length') {
            sorted = [...lines].sort((a, b) => a.length - b.length)
        } else if (sortType === 'numeric') {
            sorted = [...lines].sort((a, b) => parseFloat(a) - parseFloat(b))
        } else if (sortType === 'reverse-alpha') {
            sorted = [...lines].sort((a, b) => {
                const revA = a.split('').reverse().join('')
                const revB = b.split('').reverse().join('')
                return revA.localeCompare(revB)
            })
        }

        if (order === 'desc') {
            sorted = sorted.reverse()
        }

        return sorted
    }, [text, sortType, order])

    const copyResult = () => {
        navigator.clipboard.writeText(result.join('\n'))
    }

    return (
        <CalculatorLayout
            title="Text Sorter"
            description="Sort lines of text"
            category="Text"
            categoryPath="/calculators?category=Text"
            icon={SortAsc}
            result={`${result.length} lines`}
            resultLabel="Sorted"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Sort By</label>
                    <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="length">Line Length</option>
                        <option value="numeric">Numeric</option>
                        <option value="reverse-alpha">Reverse Alphabetical</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Order</label>
                    <select value={order} onChange={(e) => setOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Input (one item per line)</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    placeholder="Enter items, one per line..."
                />
            </div>
            <div className="input-group">
                <label className="input-label">Sorted Output</label>
                <textarea
                    value={result.join('\n')}
                    readOnly
                    rows={5}
                    style={{ background: '#1a1a2e' }}
                />
            </div>
            <button
                onClick={copyResult}
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
                Copy Sorted Text
            </button>
        </CalculatorLayout>
    )
}

export default TextSorter
