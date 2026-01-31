import { useState } from 'react'
import { Shuffle, Wand2, Loader2, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq, MODELS } from '../../../services/groqAI'

function RandomPicker() {
    const [items, setItems] = useState('Pizza\nBurger\nSushi\nTacos\nPasta')
    const [selectedItem, setSelectedItem] = useState('')
    const [isSpinning, setIsSpinning] = useState(false)
    const [useAI, setUseAI] = useState(false)
    const [aiReason, setAiReason] = useState('')
    const [context, setContext] = useState('')

    const pickRandom = async () => {
        const list = items.split('\n').filter(i => i.trim())
        if (list.length === 0) return

        setIsSpinning(true)
        setAiReason('')

        if (useAI && list.length > 1) {
            try {
                const contextText = context.trim() ? `Context: ${context}` : ''
                const prompt = `From these options: ${list.join(', ')}
${contextText}

Pick ONE option that would be the best choice. Be decisive and fun!
Return ONLY a JSON object:
{"pick": "exact option name", "reason": "brief fun reason in 10 words or less"}

Important: "pick" must be EXACTLY one of the options listed.`

                const response = await askGroq(prompt, 'You help make decisions. Be fun and decisive. Return valid JSON only.', {
                    model: MODELS.randomNames,
                    temperature: 0.9,
                    maxTokens: 100
                })

                const jsonMatch = response.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0])
                    // Verify the pick is in the list
                    const match = list.find(item => item.toLowerCase().trim() === parsed.pick?.toLowerCase().trim())
                    if (match) {
                        // Animate to the result
                        let count = 0
                        const interval = setInterval(() => {
                            setSelectedItem(list[Math.floor(Math.random() * list.length)])
                            count++
                            if (count > 10) {
                                clearInterval(interval)
                                setSelectedItem(match)
                                setAiReason(parsed.reason || '')
                                setIsSpinning(false)
                            }
                        }, 80)
                        return
                    }
                }
            } catch (err) {
                console.error('AI error:', err)
            }
        }

        // Classic random pick with animation
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
            {/* AI Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: useAI ? '#f59e0b20' : '#33333350',
                borderRadius: '10px',
                marginBottom: '16px',
                border: `1px solid ${useAI ? '#f59e0b40' : '#444'}`
            }}>
                <Wand2 size={18} color={useAI ? '#f59e0b' : '#666'} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                        {useAI ? '✨ AI Smart Pick' : 'Random Mode'}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>
                        {useAI ? 'AI picks based on context' : 'Pure random selection'}
                    </div>
                </div>
                <button
                    onClick={() => setUseAI(!useAI)}
                    style={{
                        padding: '6px 14px',
                        background: useAI ? '#f59e0b' : '#444',
                        border: 'none',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    {useAI ? 'ON' : 'OFF'}
                </button>
            </div>

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

            {/* Context for AI (only when AI is on) */}
            {useAI && (
                <div className="input-group">
                    <label className="input-label">Context (optional)</label>
                    <input
                        type="text"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="e.g., I want something healthy, for a birthday party..."
                    />
                </div>
            )}

            <button onClick={pickRandom} disabled={isSpinning || itemList.length === 0} style={{
                width: '100%',
                padding: '16px',
                background: isSpinning ? '#666' : (useAI ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#333'),
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: isSpinning ? 'wait' : 'pointer',
                fontSize: '16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}>
                {isSpinning ? (
                    <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        {useAI ? 'AI Thinking...' : 'Picking...'}
                    </>
                ) : (
                    <>
                        {useAI ? <Sparkles size={18} /> : '🎲'}
                        {useAI ? 'AI Smart Pick' : 'Pick Random'}
                    </>
                )}
            </button>

            {selectedItem && (
                <div style={{
                    background: useAI && aiReason ? 'linear-gradient(135deg, #f59e0b20 0%, #d9770620 100%)' : '#333',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    border: useAI && aiReason ? '1px solid #f59e0b40' : 'none'
                }}>
                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>
                        {useAI && aiReason ? '✨ AI Picked:' : 'Winner:'}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{selectedItem}</div>
                    {aiReason && (
                        <div style={{
                            fontSize: '13px',
                            opacity: 0.7,
                            marginTop: '8px',
                            fontStyle: 'italic'
                        }}>
                            "{aiReason}"
                        </div>
                    )}
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

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default RandomPicker
