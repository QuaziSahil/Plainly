import { useState } from 'react'
import { ShuffleIcon } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WouldYouRather() {
    const [customOption1, setCustomOption1] = useState('')
    const [customOption2, setCustomOption2] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState(null)

    const questions = [
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

    const generateRandom = () => {
        const randomIndex = Math.floor(Math.random() * questions.length)
        setCurrentQuestion(questions[randomIndex])
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
            <button
                onClick={generateRandom}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: '#a78bfa',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '16px',
                    fontSize: '15px'
                }}
            >
                🎲 Random Question
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
        </CalculatorLayout>
    )
}

export default WouldYouRather
