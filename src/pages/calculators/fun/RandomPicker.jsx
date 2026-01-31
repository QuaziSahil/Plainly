import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RandomPicker() {
    const [items, setItems] = useState('Pizza\nBurger\nSushi\nTacos\nPasta')
    const [selectedItem, setSelectedItem] = useState('')
    const [isSpinning, setIsSpinning] = useState(false)

    const pickRandom = () => {
        const list = items.split('\n').filter(i => i.trim())
        if (list.length === 0) return

        setIsSpinning(true)

        // Animate through items
        let count = 0
        const interval = setInterval(() => {
            setSelectedItem(list[Math.floor(Math.random() * list.length)])
            count++
            if (count > 15) {
                clearInterval(interval)
                setSelectedItem(list[Math.floor(Math.random() * list.length)])
                setIsSpinning(false)
            }
        }, 100)
    }

    const itemList = items.split('\n').filter(i => i.trim())

    return (
        <CalculatorLayout
            title="Random Picker"
            description="Pick random items from a list"
            category="Fun"
            categoryPath="/fun"
            icon={Shuffle}
            result={selectedItem || 'Click Pick!'}
            resultLabel="Selected"
        >
            <div className="input-group">
                <label className="input-label">Enter Items (one per line)</label>
                <textarea
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    rows={6}
                    placeholder="Item 1&#10;Item 2&#10;Item 3"
                    style={{ resize: 'vertical' }}
                />
            </div>
            <button onClick={pickRandom} disabled={isSpinning} style={{
                width: '100%',
                padding: '16px',
                background: isSpinning ? '#666' : '#333',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: isSpinning ? 'wait' : 'pointer',
                fontSize: '16px',
                marginBottom: '16px'
            }}>
                {isSpinning ? '🎰 Picking...' : '🎲 Pick Random'}
            </button>
            {selectedItem && (
                <div style={{
                    background: '#333',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    marginBottom: '16px'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>Winner:</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{selectedItem}</div>
                </div>
            )}
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Items</span>
                    <span className="result-detail-value">{itemList.length}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Odds per item</span>
                    <span className="result-detail-value">{itemList.length > 0 ? (100 / itemList.length).toFixed(1) : 0}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RandomPicker
