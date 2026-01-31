import { useState, useMemo } from 'react'
import { KeyRound } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PasswordGenerator() {
    const [length, setLength] = useState(16)
    const [includeUppercase, setIncludeUppercase] = useState(true)
    const [includeLowercase, setIncludeLowercase] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(true)
    const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
    const [password, setPassword] = useState('')

    const generatePassword = () => {
        let chars = ''
        if (includeLowercase) chars += excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
        if (includeUppercase) chars += excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (includeNumbers) chars += excludeAmbiguous ? '23456789' : '0123456789'
        if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

        if (!chars) {
            setPassword('Select at least one character type')
            return
        }

        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setPassword(result)
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
            <div className="input-group">
                <label className="input-label">Password Length: {length}</label>
                <input
                    type="range"
                    min={4}
                    max={64}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                />
            </div>
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
            <button
                onClick={generatePassword}
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
                🔐 Generate Password
            </button>
            {password && (
                <>
                    <div className="input-group">
                        <label className="input-label">Generated Password</label>
                        <input
                            type="text"
                            value={password}
                            readOnly
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '16px',
                                background: '#1a1a2e',
                                letterSpacing: '1px'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 0 ? strength.color : '#333' }} />
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 2 ? strength.color : '#333' }} />
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 4 ? strength.color : '#333' }} />
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: strength.score > 5 ? strength.color : '#333' }} />
                    </div>
                    <button
                        onClick={copyPassword}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: '#333',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Copy Password
                    </button>
                </>
            )}
        </CalculatorLayout>
    )
}

export default PasswordGenerator
