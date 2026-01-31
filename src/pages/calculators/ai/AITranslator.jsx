import { useState } from 'react'
import { Languages, Loader2, Copy, Check, ArrowRight } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import AIOutputFormatter from '../../../components/AIOutputFormatter'
import { translateText } from '../../../services/groqAI'

function AITranslator() {
    const [inputText, setInputText] = useState('')
    const [targetLang, setTargetLang] = useState('Spanish')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const languages = [
        'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch',
        'Russian', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese',
        'Korean', 'Arabic', 'Hindi', 'Bengali', 'Turkish', 'Vietnamese',
        'Thai', 'Polish', 'Ukrainian', 'Greek', 'Hebrew', 'Swedish',
        'Norwegian', 'Danish', 'Finnish', 'Indonesian', 'Malay'
    ]

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setError('Please enter text to translate')
            return
        }

        setLoading(true)
        setError('')
        setResult('')

        try {
            const translation = await translateText(inputText, targetLang)
            setResult(translation)
        } catch (err) {
            setError('Failed to translate. Please try again.')
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
        setInputText('')
        setTargetLang('Spanish')
        setResult('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Translator"
            description="Translate text to 25+ languages instantly"
            category="AI Tools"
            categoryPath="/calculators?category=AI"
            icon={Languages}
            result={result ? '✓ Translated' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Input Text */}
            <div className="input-group">
                <label className="input-label">Text to Translate</label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text you want to translate..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                        lineHeight: '1.6'
                    }}
                />
            </div>

            {/* Language Selection */}
            <div className="input-group">
                <label className="input-label">Translate To</label>
                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
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

            {/* Translate Button */}
            <button
                onClick={handleTranslate}
                disabled={loading || !inputText.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !inputText.trim() ? '#333' : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !inputText.trim() ? 'not-allowed' : 'pointer',
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
                        Translating...
                    </>
                ) : (
                    <>
                        <Languages size={20} />
                        Translate to {targetLang}
                        <ArrowRight size={18} />
                    </>
                )}
            </button>

            {/* Result */}
            {result && (
                <div style={{
                    background: '#1a1a2e',
                    borderRadius: '12px',
                    border: '1px solid #8b5cf640',
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
                        <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 600 }}>
                            🌐 {targetLang} Translation
                        </span>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: copied ? '#8b5cf6' : '#333',
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

            {!result && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    opacity: 0.5,
                    fontSize: '14px'
                }}>
                    🌍 Enter text and select a language to translate
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

export default AITranslator
