import { useState, useMemo } from 'react'
import { KeyRound, Wand2, Loader2, Copy, Check } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq, MODELS } from '../../../services/groqAI'

function PasswordGenerator() {
    const [length, setLength] = useState(16)
    const [includeUppercase, setIncludeUppercase] = useState(true)
    const [includeLowercase, setIncludeLowercase] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(true)
    const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
    const [password, setPassword] = useState('')
    const [useAI, setUseAI] = useState(false)
    const [aiMnemonic, setAiMnemonic] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const generatePassword = async () => {
        setLoading(true)
        setAiMnemonic('')

        if (useAI) {
            try {
                const prompt = `Generate ONE secure, memorable password that is:
- ${length} characters long
- Easy to remember but hard to guess
- Uses a combination of words, numbers, and symbols
- Creative and unique

Also provide a short mnemonic (memory trick) to remember it.

Return ONLY JSON:
{"password": "ThePassword123!", "mnemonic": "brief memory trick"}

Make sure the password is EXACTLY ${length} characters.`

                const response = await askGroq(prompt, 'You generate secure memorable passwords. Return valid JSON only.', {
                    model: MODELS.randomNames,
                    temperature: 0.9,
                    maxTokens: 100
                })

                const jsonMatch = response.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0])
                    // Adjust length if needed
                    let pwd = parsed.password || ''
                    if (pwd.length > length) pwd = pwd.substring(0, length)
                    if (pwd.length < length) {
                        const chars = '!@#$%^&*()_+-=0123456789'
                        while (pwd.length < length) {
                            pwd += chars.charAt(Math.floor(Math.random() * chars.length))
                        }
                    }
                    setPassword(pwd)
                    setAiMnemonic(parsed.mnemonic || '')
                    setLoading(false)
                    return
                }
            } catch (err) {
                console.error('AI error:', err)
            }
        }

        // Classic generation
        let chars = ''
        if (includeLowercase) chars += excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
        if (includeUppercase) chars += excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (includeNumbers) chars += excludeAmbiguous ? '23456789' : '0123456789'
        if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

        if (!chars) {
            setPassword('Select at least one character type')
            setLoading(false)
            return
        }

        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setPassword(result)
        setLoading(false)
    }

    const strength = useMemo(() => {
        if (!password || password.includes('Select at least')) return { score: 0, label: 'None', color: '#666' }

        let score = 0
        if (password.length >= 8) score++
        if (password.length >= 12) score++
        if (password.length >= 16) score++
        if (/[a-z]/.test(password)) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^a-zA-Z0-9]/.test(password)) score++

        if (score <= 2) return { score, label: 'Weak', color: '#ef4444' }
        if (score <= 4) return { score, label: 'Fair', color: '#f59e0b' }
        if (score <= 5) return { score, label: 'Good', color: '#10b981' }
        return { score, label: 'Strong', color: '#22c55e' }
    }, [password])

    const copyPassword = () => {
        if (password && !password.includes('Select at least')) {
            navigator.clipboard.writeText(password)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <CalculatorLayout
            title="Password Generator"
            description="Generate secure passwords"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={KeyRound}
            result={password ? strength.label : '—'}
            resultLabel="Strength"
        >
            {/* AI Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: useAI ? '#22c55e20' : '#33333350',
                borderRadius: '10px',
                marginBottom: '16px',
                border: `1px solid ${useAI ? '#22c55e40' : '#444'}`
            }}>
                <Wand2 size={18} color={useAI ? '#22c55e' : '#666'} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                        {useAI ? '✨ AI Memorable Passwords' : 'Random Mode'}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>
                        {useAI ? 'Easy to remember + memory trick' : 'Random character generation'}
                    </div>
                </div>
                <button
                    onClick={() => setUseAI(!useAI)}
                    style={{
                        padding: '6px 14px',
                        background: useAI ? '#22c55e' : '#444',
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
                <label className="input-label">Password Length: {length}</label>
                <input
                    type="range"
                    min={8}
                    max={32}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                />
            </div>

            {/* Classic options (hidden when AI mode) */}
            {!useAI && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} />
                            Uppercase (A-Z)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} />
                            Lowercase (a-z)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />
                            Numbers (0-9)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
                            Symbols (!@#$%)
                        </label>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
                        <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} />
                        Exclude ambiguous characters (0, O, l, 1, I)
                    </label>
                </>
            )}

            <button
                onClick={generatePassword}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: loading ? '#333' : (useAI ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#a78bfa'),
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
                    <>🔐 {useAI ? 'Generate Memorable Password' : 'Generate Password'}</>
                )}
            </button>

            {password && !password.includes('Select at least') && (
                <>
                    <div className="input-group">
                        <label className="input-label">Generated Password</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={password}
                                readOnly
                                style={{
                                    flex: 1,
                                    fontFamily: 'monospace',
                                    fontSize: '16px',
                                    background: '#1a1a2e',
                                    letterSpacing: '1px'
                                }}
                            />
                            <button
                                onClick={copyPassword}
                                style={{
                                    padding: '12px',
                                    background: copied ? '#22c55e' : '#333',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* AI Mnemonic */}
                    {aiMnemonic && (
                        <div style={{
                            background: '#22c55e15',
                            border: '1px solid #22c55e40',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, marginBottom: '4px' }}>
                                💡 Memory Trick
                            </div>
                            <div style={{ fontSize: '13px', fontStyle: 'italic' }}>
                                "{aiMnemonic}"
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 0 ? strength.color : '#333' }} />
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 2 ? strength.color : '#333' }} />
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 4 ? strength.color : '#333' }} />
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 5 ? strength.color : '#333' }} />
                    </div>
                    <div style={{ textAlign: 'center', color: strength.color, fontWeight: 600 }}>
                        {strength.label} Password
                    </div>
                </>
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

export default PasswordGenerator
