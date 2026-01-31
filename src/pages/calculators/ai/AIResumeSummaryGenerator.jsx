import { useState, useRef, useEffect } from 'react'
import { FileText, Loader2, Wand2, Copy, Check, RefreshCw, UserCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { generateResumeSummary } from '../../../services/groqAI'

function AIResumeSummaryGenerator() {
    const [jobTitle, setJobTitle] = useState('')
    const [experience, setExperience] = useState('')
    const [achievements, setAchievements] = useState('')
    const [result, setResult] = useState('')
    const resultRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!jobTitle.trim()) {
            setError('Please enter your Job Title')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const summary = await generateResumeSummary(jobTitle, experience, achievements)
            setResult(summary)
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
        setJobTitle('')
        setExperience('')
        setAchievements('')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Resume Summary Generator"
            description="Generate powerful, keyword-optimized summaries for your resume"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={UserCircle}
            result={result ? 'Summaries Ready' : 'Ready'}
            resultLabel="Generated"
            onReset={handleReset}
        >
            <div className="input-group">
                <label className="input-label">Target Job Title *</label>
                <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Marketing Manager"
                    className="input-field"
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Years of Experience</label>
                    <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g., 8 years"
                        className="input-field"
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Key Achievements / Skills</label>
                <textarea
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="e.g., Managed $1M budget, Increased sales by 30%, Expert in SEO..."
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
                disabled={loading || !jobTitle.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !jobTitle.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !jobTitle.trim() ? 'not-allowed' : 'pointer',
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
                        Creating Summaries...
                    </>
                ) : result ? (
                    <>
                        <RefreshCw size={20} />
                        Get New Options
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Generate Summaries
                    </>
                )}
            </button>

            {result && (<div ref={resultRef} style={{
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
                            ✨ Recommended Summaries
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
                            {copied ? 'Copied!' : 'Copy Options'}
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

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </CalculatorLayout>
    )
}

export default AIResumeSummaryGenerator
