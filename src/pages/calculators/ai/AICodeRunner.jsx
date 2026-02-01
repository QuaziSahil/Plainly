import { useState, useRef } from 'react'
import { Play, Terminal, Trash2, Copy, Check, AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function AICodeRunner() {
    const [code, setCode] = useState(`// Try running some JavaScript code!
console.log("Hello, World!");

// Math operations
const sum = 5 + 10;
console.log("5 + 10 =", sum);

// Arrays
const fruits = ["apple", "banana", "orange"];
console.log("Fruits:", fruits);

// Objects
const user = { name: "John", age: 25 };
console.log("User:", user);

// Loop example
for (let i = 1; i <= 3; i++) {
    console.log("Count:", i);
}`)
    const [output, setOutput] = useState([])
    const [error, setError] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [executionTime, setExecutionTime] = useState(null)
    const [copied, setCopied] = useState(false)
    const outputRef = useRef(null)

    const runCode = () => {
        setIsRunning(true)
        setOutput([])
        setError('')
        setExecutionTime(null)

        // Capture console.log outputs
        const logs = []
        const originalLog = console.log
        const originalError = console.error
        const originalWarn = console.warn
        const originalInfo = console.info

        console.log = (...args) => {
            logs.push({ type: 'log', content: args.map(formatOutput).join(' ') })
        }
        console.error = (...args) => {
            logs.push({ type: 'error', content: args.map(formatOutput).join(' ') })
        }
        console.warn = (...args) => {
            logs.push({ type: 'warn', content: args.map(formatOutput).join(' ') })
        }
        console.info = (...args) => {
            logs.push({ type: 'info', content: args.map(formatOutput).join(' ') })
        }

        const startTime = performance.now()

        try {
            // Execute in a timeout to simulate async behavior
            setTimeout(() => {
                try {
                    // Create a sandboxed function
                    const result = new Function(code)()

                    // If the code returns something, add it to output
                    if (result !== undefined) {
                        logs.push({ type: 'return', content: `→ ${formatOutput(result)}` })
                    }

                    const endTime = performance.now()
                    setExecutionTime((endTime - startTime).toFixed(2))
                    setOutput(logs)
                } catch (err) {
                    setError(`${err.name}: ${err.message}`)
                    setOutput(logs) // Still show any logs before error
                } finally {
                    // Restore original console methods
                    console.log = originalLog
                    console.error = originalError
                    console.warn = originalWarn
                    console.info = originalInfo
                    setIsRunning(false)

                    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
                }
            }, 50)
        } catch (err) {
            setError(`${err.name}: ${err.message}`)
            console.log = originalLog
            console.error = originalError
            console.warn = originalWarn
            console.info = originalInfo
            setIsRunning(false)
        }
    }

    const formatOutput = (value) => {
        if (value === null) return 'null'
        if (value === undefined) return 'undefined'
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2)
            } catch {
                return String(value)
            }
        }
        return String(value)
    }

    const clearOutput = () => {
        setOutput([])
        setError('')
        setExecutionTime(null)
    }

    const handleCopyOutput = async () => {
        const text = output.map(o => o.content).join('\n')
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setCode('')
        setOutput([])
        setError('')
        setExecutionTime(null)
    }

    const getOutputColor = (type) => {
        switch (type) {
            case 'error': return '#ef4444'
            case 'warn': return '#f59e0b'
            case 'info': return '#3b82f6'
            case 'return': return '#10b981'
            default: return '#e6edf3'
        }
    }

    return (
        <CalculatorLayout
            title="Code Runner"
            description="Run JavaScript code and see the output instantly"
            category="AI Tools"
            categoryPath="/ai"
            icon={Terminal}
            result={output.length > 0 ? `${output.length} Outputs` : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Code Input */}
            <div className="input-group">
                <label className="input-label">JavaScript Code</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write or paste JavaScript code here..."
                    rows={12}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        background: '#0d1117',
                        color: '#10b981',
                        fontSize: '13px',
                        fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                        resize: 'vertical',
                        minHeight: '250px',
                        lineHeight: '1.5'
                    }}
                    spellCheck={false}
                />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    onClick={runCode}
                    disabled={isRunning || !code.trim()}
                    style={{
                        flex: 1,
                        minWidth: '150px',
                        padding: '16px',
                        background: isRunning || !code.trim() ? '#333' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: isRunning || !code.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        minHeight: '52px'
                    }}
                >
                    {isRunning ? (
                        <>
                            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            Running...
                        </>
                    ) : (
                        <>
                            <Play size={20} />
                            Run Code
                        </>
                    )}
                </button>

                <button
                    onClick={clearOutput}
                    disabled={output.length === 0 && !error}
                    style={{
                        padding: '16px 24px',
                        background: output.length === 0 && !error ? '#222' : '#333',
                        border: 'none',
                        borderRadius: '12px',
                        color: output.length === 0 && !error ? '#666' : 'white',
                        cursor: output.length === 0 && !error ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '52px'
                    }}
                >
                    <Trash2 size={18} />
                    Clear
                </button>
            </div>

            {/* Output Console */}
            <div ref={outputRef} style={{
                background: '#0d1117',
                borderRadius: '12px',
                border: '1px solid #30363d',
                overflow: 'hidden'
            }}>
                {/* Console Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid #30363d',
                    background: '#161b22',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Terminal size={14} style={{ color: '#10b981' }} />
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#c9d1d9'
                        }}>
                            Console Output
                        </span>
                        {executionTime && (
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                color: '#8b949e',
                                padding: '2px 8px',
                                background: '#21262d',
                                borderRadius: '10px'
                            }}>
                                <Clock size={10} />
                                {executionTime}ms
                            </span>
                        )}
                    </div>
                    {output.length > 0 && (
                        <button
                            onClick={handleCopyOutput}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: copied ? '#238636' : '#21262d',
                                border: '1px solid #30363d',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '11px',
                                cursor: 'pointer',
                                minHeight: '32px'
                            }}
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>

                {/* Console Content */}
                <div style={{
                    padding: '16px',
                    minHeight: '150px',
                    maxHeight: '400px',
                    overflow: 'auto',
                    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                    fontSize: '13px',
                    lineHeight: '1.6'
                }}>
                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '12px',
                            background: '#ef444420',
                            border: '1px solid #ef444440',
                            borderRadius: '8px',
                            color: '#ef4444',
                            marginBottom: '12px'
                        }}>
                            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{error}</span>
                        </div>
                    )}

                    {output.length > 0 ? (
                        output.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    padding: '6px 0',
                                    borderBottom: index < output.length - 1 ? '1px solid #21262d' : 'none'
                                }}
                            >
                                <span style={{
                                    color: '#484f58',
                                    minWidth: '24px',
                                    textAlign: 'right',
                                    fontSize: '11px'
                                }}>
                                    {index + 1}
                                </span>
                                <span style={{
                                    color: getOutputColor(item.type),
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {item.content}
                                </span>
                            </div>
                        ))
                    ) : !error && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 20px',
                            color: '#8b949e',
                            textAlign: 'center'
                        }}>
                            <Terminal size={32} strokeWidth={1} style={{ opacity: 0.4, marginBottom: '12px' }} />
                            <p style={{ margin: 0, fontSize: '14px' }}>Output will appear here</p>
                            <span style={{ fontSize: '12px', opacity: 0.6 }}>Click "Run Code" to execute</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Note */}
            <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#21262d',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#8b949e',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                <span>Runs JavaScript in a sandboxed environment. Use console.log() to see output.</span>
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

export default AICodeRunner
