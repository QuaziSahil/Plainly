import { useState, useRef } from 'react'
import { Presentation, Loader2, Wand2, Copy, Check, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateLessonPlan } from '../../../services/groqAI'

function AILessonPlanGenerator() {
    const [subject, setSubject] = useState('')
    const [gradeLevel, setGradeLevel] = useState('middle school')
    const [duration, setDuration] = useState('60')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!subject.trim()) {
            setError('Please enter a subject')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const quiz = await generateLessonPlan(subject, gradeLevel, duration)
            setResult(quiz)
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
        setSubject('')
        setGradeLevel('middle school')
        setDuration('60')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Lesson Plan Generator"
            description="Generate detailed teaching materials and curricula for any subject"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Presentation}
            result={result ? "Plan Ready" : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Subject / Topic *</label>
                <textarea
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Introduction to Fractions, The Water Cycle, Shakespeare's Macbeth..."
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

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Grade Level</label>
                    <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
                        <option value="kindergarten">Kindergarten</option>
                        <option value="elementary">Elementary School</option>
                        <option value="middle school">Middle School</option>
                        <option value="high school">High School</option>
                        <option value="university">University / Higher Ed</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Lesson Duration (mins)</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                        <option value="30">30 Minutes</option>
                        <option value="45">45 Minutes</option>
                        <option value="60">60 Minutes</option>
                        <option value="90">90 Minutes</option>
                        <option value="120">2 Hours</option>
                    </select>
                </div>
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
                disabled={loading || !subject.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !subject.trim() ? '#333' : 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !subject.trim() ? 'not-allowed' : 'pointer',
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
                        Developing Plan...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        New Version
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Lesson Plan
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
                            ✨ Result Generated
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

export default AILessonPlanGenerator
