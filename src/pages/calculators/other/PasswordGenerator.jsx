import { useState, useCallback } from 'react'
import { Key, Copy, RefreshCw, Check } from 'lucide-react'
import './PasswordGenerator.css'

function PasswordGenerator() {
    const [length, setLength] = useState(16)
    const [includeLowercase, setIncludeLowercase] = useState(true)
    const [includeUppercase, setIncludeUppercase] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(true)
    const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
    const [password, setPassword] = useState('')
    const [copied, setCopied] = useState(false)

    const generatePassword = useCallback(() => {
        let chars = ''
        const lowercase = 'abcdefghijklmnopqrstuvwxyz'
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const numbers = '0123456789'
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
        const ambiguous = 'il1Lo0O'

        if (includeLowercase) chars += lowercase
        if (includeUppercase) chars += uppercase
        if (includeNumbers) chars += numbers
        if (includeSymbols) chars += symbols

        if (excludeAmbiguous) {
            chars = chars.split('').filter(c => !ambiguous.includes(c)).join('')
        }

        if (chars.length === 0) {
            setPassword('Select at least one option')
            return
        }

        let result = ''
        const array = new Uint32Array(length)
        crypto.getRandomValues(array)

        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length]
        }

        setPassword(result)
        setCopied(false)
    }, [length, includeLowercase, includeUppercase, includeNumbers, includeSymbols, excludeAmbiguous])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(password)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const getStrength = () => {
        if (!password || password.includes('Select')) return { level: 0, text: 'None', color: 'var(--text-muted)' }

        let strength = 0
        if (password.length >= 8) strength++
        if (password.length >= 12) strength++
        if (password.length >= 16) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++

        if (strength <= 2) return { level: 1, text: 'Weak', color: 'var(--error)' }
        if (strength <= 4) return { level: 2, text: 'Fair', color: 'var(--warning)' }
        if (strength <= 5) return { level: 3, text: 'Strong', color: 'var(--info)' }
        return { level: 4, text: 'Very Strong', color: 'var(--success)' }
    }

    const strength = getStrength()

    // Generate initial password
    useState(() => {
        generatePassword()
    })

    return (
        <div className="password-generator">
            <div className="container">
                <div className="pg-header">
                    <div className="pg-icon">
                        <Key size={28} />
                    </div>
                    <h1 className="pg-title">Password Generator</h1>
                    <p className="pg-subtitle">Generate secure, random passwords</p>
                </div>

                <div className="pg-content">
                    {/* Password Display */}
                    <div className="password-display">
                        <div className="password-text">
                            {password || 'Click generate to create password'}
                        </div>
                        <div className="password-actions">
                            <button
                                className="password-action-btn"
                                onClick={copyToClipboard}
                                disabled={!password}
                                aria-label="Copy password"
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                            <button
                                className="password-action-btn generate"
                                onClick={generatePassword}
                                aria-label="Generate new password"
                            >
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Strength Meter */}
                    <div className="strength-meter">
                        <div className="strength-bars">
                            {[1, 2, 3, 4].map(level => (
                                <div
                                    key={level}
                                    className={`strength-bar ${level <= strength.level ? 'active' : ''}`}
                                    style={{ background: level <= strength.level ? strength.color : undefined }}
                                />
                            ))}
                        </div>
                        <span className="strength-text" style={{ color: strength.color }}>
                            {strength.text}
                        </span>
                    </div>

                    {/* Options */}
                    <div className="pg-options">
                        {/* Length Slider */}
                        <div className="option-group slider-option">
                            <div className="option-header">
                                <label>Password Length</label>
                                <span className="option-value">{length}</span>
                            </div>
                            <input
                                type="range"
                                min={4}
                                max={64}
                                value={length}
                                onChange={(e) => {
                                    setLength(Number(e.target.value))
                                    generatePassword()
                                }}
                            />
                        </div>

                        {/* Toggle Options */}
                        <div className="option-group toggle-option">
                            <label>
                                <span>Lowercase (a-z)</span>
                                <input
                                    type="checkbox"
                                    checked={includeLowercase}
                                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                                />
                                <span className="toggle-switch" />
                            </label>
                        </div>

                        <div className="option-group toggle-option">
                            <label>
                                <span>Uppercase (A-Z)</span>
                                <input
                                    type="checkbox"
                                    checked={includeUppercase}
                                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                                />
                                <span className="toggle-switch" />
                            </label>
                        </div>

                        <div className="option-group toggle-option">
                            <label>
                                <span>Numbers (0-9)</span>
                                <input
                                    type="checkbox"
                                    checked={includeNumbers}
                                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                                />
                                <span className="toggle-switch" />
                            </label>
                        </div>

                        <div className="option-group toggle-option">
                            <label>
                                <span>Symbols (!@#$%)</span>
                                <input
                                    type="checkbox"
                                    checked={includeSymbols}
                                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                                />
                                <span className="toggle-switch" />
                            </label>
                        </div>

                        <div className="option-group toggle-option">
                            <label>
                                <span>Exclude Ambiguous (i, l, 1, L, o, 0, O)</span>
                                <input
                                    type="checkbox"
                                    checked={excludeAmbiguous}
                                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                                />
                                <span className="toggle-switch" />
                            </label>
                        </div>
                    </div>

                    <button className="generate-btn" onClick={generatePassword}>
                        <RefreshCw size={20} />
                        Generate Password
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordGenerator
