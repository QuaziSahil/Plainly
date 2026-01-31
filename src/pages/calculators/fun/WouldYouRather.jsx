import { useState } from 'react'
import { ShuffleIcon, Wand2, Loader2, Sparkles } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq, MODELS } from '../../../services/groqAI'

function WouldYouRather() {
    const [customOption1, setCustomOption1] = useState('')
    const [customOption2, setCustomOption2] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [useAI, setUseAI] = useState(true)
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState('random')

    const classicQuestions = [
        ['Have the ability to fly', 'Have the ability to read minds'],
        ['Live in a treehouse', 'Live in a submarine'],
        ['Be able to speak all languages', 'Be able to talk to animals'],
        ['Have unlimited money', 'Have unlimited time'],
        ['Never use social media again', 'Never watch TV again'],
        ['Be famous but poor', 'Be unknown but rich'],
        ['Travel to space', 'Travel to the bottom of the ocean'],
        ['Have a rewind button for your life', 'Have a pause button for your life'],
        ['Be 10 years older', 'Be 10 years younger'],
        ['Only eat pizza forever', 'Only eat tacos forever']
    ]

    const generateRandom = async () => {
        if (useAI) {
            setLoading(true)
            try {
                const categoryPrompt = category === 'random' ? 'any fun topic' : category
                const prompt = `Generate ONE unique "Would You Rather" question about ${categoryPrompt}.

Format: Return ONLY a JSON array with exactly 2 options:
["option A", "option B"]

Make it fun, thought-provoking, and creative. No explanations, just the JSON.`

                const response = await askGroq(prompt, 'You create fun Would You Rather questions. Return valid JSON only.', {
                    model: MODELS.randomNames,
                    temperature: 0.95,
                    maxTokens: 100
                })

                const jsonMatch = response.match(/\[[\s\S]*\]/)
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0])
                    if (parsed.length >= 2) {
                        setCurrentQuestion([parsed[0], parsed[1]])
                    }
                }
            } catch (err) {
                console.error('AI error:', err)
                // Fallback
                const randomIndex = Math.floor(Math.random() * classicQuestions.length)
                setCurrentQuestion(classicQuestions[randomIndex])
            }
            setLoading(false)
        } else {
            const randomIndex = Math.floor(Math.random() * classicQuestions.length)
            setCurrentQuestion(classicQuestions[randomIndex])
        }
    }

    const generateCustom = () => {
        if (customOption1.trim() && customOption2.trim()) {
            setCurrentQuestion([customOption1.trim(), customOption2.trim()])
        }
    }

    return (
        <CalculatorLayout
            title="Would You Rather"
            description="Fun decision-making game"
            category="Fun"
            categoryPath="/calculators?category=Fun"
            icon={ShuffleIcon}
            result={currentQuestion ? 'Choose!' : '—'}
            resultLabel="Start Playing"
        >
            {/* AI Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: useAI ? '#a78bfa20' : '#33333350',
                borderRadius: '10px',
                marginBottom: '16px',
                border: `1px solid ${useAI ? '#a78bfa40' : '#444'}`
            }}>
                <Wand2 size={18} color={useAI ? '#a78bfa' : '#666'} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                        {useAI ? '✨ AI-Generated Questions' : 'Classic Mode'}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>
                        {useAI ? 'Unlimited unique questions' : '10 classic questions'}
                    </div>
                </div>
                <button
                    onClick={() => setUseAI(!useAI)}
                    style={{
                        padding: '6px 14px',
                        background: useAI ? '#a78bfa' : '#444',
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

            {/* Category selector (AI only) */}
            {useAI && (
                <div className="input-group" style={{ marginBottom: '16px' }}>
                    <label className="input-label">Question Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="random">🎲 Random</option>
                        <option value="superpowers">⚡ Superpowers</option>
                        <option value="food">🍕 Food</option>
                        <option value="travel">✈️ Travel</option>
                        <option value="money">💰 Money</option>
                        <option value="technology">🤖 Technology</option>
                        <option value="relationships">💕 Relationships</option>
                        <option value="silly">🤪 Silly</option>
                        <option value="deep">🧠 Deep/Philosophical</option>
                    </select>
                </div>
            )}

            <button
                onClick={generateRandom}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: loading ? '#333' : (useAI ? 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' : '#a78bfa'),
                    border: 'none',
                    borderRadius: '8px',
                    color: loading ? '#666' : '#fff',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '16px',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        Generating...
                    </>
                ) : (
                    <>
                        {useAI ? <Sparkles size={18} /> : '🎲'}
                        {useAI ? 'Generate AI Question' : 'Random Question'}
                    </>
                )}
            </button>

            {currentQuestion && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{
                        flex: 1,
                        background: '#1a1a2e',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                    }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#a78bfa'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                    >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🅰️</div>
                        <div>{currentQuestion[0]}</div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        opacity: 0.5
                    }}>
                        OR
                    </div>
                    <div style={{
                        flex: 1,
                        background: '#1a1a2e',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                    }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#a78bfa'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                    >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🅱️</div>
                        <div>{currentQuestion[1]}</div>
                    </div>
                </div>
            )}

            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>CREATE YOUR OWN</div>
            <div className="input-row">
                <div className="input-group">
                    <input
                        type="text"
                        value={customOption1}
                        onChange={(e) => setCustomOption1(e.target.value)}
                        placeholder="Option A"
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        value={customOption2}
                        onChange={(e) => setCustomOption2(e.target.value)}
                        placeholder="Option B"
                    />
                </div>
            </div>
            <button
                onClick={generateCustom}
                disabled={!customOption1.trim() || !customOption2.trim()}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: customOption1.trim() && customOption2.trim() ? '#333' : '#222',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: customOption1.trim() && customOption2.trim() ? 'pointer' : 'not-allowed',
                    opacity: customOption1.trim() && customOption2.trim() ? 1 : 0.5
                }}
            >
                Use Custom Options
            </button>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default WouldYouRather
