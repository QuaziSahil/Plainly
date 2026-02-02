import { useState, useRef } from 'react'
import { Languages, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { languageLearningTutor } from '../../../services/groqAI'

function AILanguageLearningTutor() {
    const [targetLanguage, setTargetLanguage] = useState('Spanish')
    const [lessonLevel, setLessonLevel] = useState('beginner')
    const [goal, setGoal] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!goal.trim()) {
            setError('Please enter a learning goal or topic')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const tutor = await languageLearningTutor(lessonLevel, targetLanguage, goal)
            setResult(tutor)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            setError('Failed to generate. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setTargetLanguage('Spanish')
        setLessonLevel('beginner')
        setGoal('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Language Learning Tutor"
            description="Practice vocabulary, grammar, and conversation in any target language"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Languages}
            result={result ? "Lesson Ready" : 'Ready'}
            resultLabel="Status"
            fullContent={result}
            toolType="ai"
            onReset={handleReset}
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Target Language *</label>
                    <input
                        type="text"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        placeholder="e.g., Spanish, French, Japanese, Python..."
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#0a0a0a',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Your Level</label>
                    <select value={lessonLevel} onChange={(e) => setLessonLevel(e.target.value)}>
                        <option value="absolute beginner">Absolute Beginner</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Learning Goal / Current Topic *</label>
                <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Ordering food at a restaurant, Present tense conjugation, Common travel phrases..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
                />
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#ef444420',
                    border: '1px solid #ef444440',
                    borderRadius: '8px',
                    color: '#ef4444',
                    marginBottom: '16px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={loading || !goal.trim() || !targetLanguage.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !goal.trim() || !targetLanguage.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !goal.trim() || !targetLanguage.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Preparing Lesson...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        New Version
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Tutor Lesson
                    </>
                )}
            </button>

            {result && (
                <div ref={resultRef} style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    border: '1px solid #333',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #333',
                        background: '#0a0a0a'
                    }}>
                        <span style={{ fontSize: '12px', opacity: 0.6 }}>
                            ✨ Personalized Language Lesson
                        </span>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: copied ? '#10b981' : '#333',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div style={{
                        padding: '20px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                    }}>
                        <AIOutputFormatter content={result} />
                    </div>
                </div>
            )}

            {/* Refresh Tip */}
            <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)',
                border: '1px solid #3b82f640',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
            }}>
                <span style={{ fontSize: '16px' }}>💡</span>
                <span><strong>Tip:</strong> If the tool doesn't respond after generation, try refreshing the page and generating again.</span>
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

export default AILanguageLearningTutor
