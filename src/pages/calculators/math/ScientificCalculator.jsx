import { useState, useCallback } from 'react'
import { Calculator } from 'lucide-react'
import './ScientificCalculator.css'

function ScientificCalculator() {
    const [display, setDisplay] = useState('0')
    const [expression, setExpression] = useState('')
    const [memory, setMemory] = useState(0)
    const [isRadians, setIsRadians] = useState(true)

    const handleNumber = useCallback((num) => {
        setDisplay(prev => prev === '0' || prev === 'Error' ? num : prev + num)
    }, [])

    const handleOperator = useCallback((op) => {
        setExpression(display + ' ' + op + ' ')
        setDisplay('0')
    }, [display])

    const handleFunction = useCallback((func) => {
        try {
            const num = parseFloat(display)
            let result

            switch (func) {
                case 'sin':
                    result = isRadians ? Math.sin(num) : Math.sin(num * Math.PI / 180)
                    break
                case 'cos':
                    result = isRadians ? Math.cos(num) : Math.cos(num * Math.PI / 180)
                    break
                case 'tan':
                    result = isRadians ? Math.tan(num) : Math.tan(num * Math.PI / 180)
                    break
                case 'sqrt':
                    result = Math.sqrt(num)
                    break
                case 'log':
                    result = Math.log10(num)
                    break
                case 'ln':
                    result = Math.log(num)
                    break
                case 'x²':
                    result = Math.pow(num, 2)
                    break
                case 'x³':
                    result = Math.pow(num, 3)
                    break
                case '1/x':
                    result = 1 / num
                    break
                case '±':
                    result = -num
                    break
                case '%':
                    result = num / 100
                    break
                case 'π':
                    result = Math.PI
                    break
                case 'e':
                    result = Math.E
                    break
                case '!':
                    result = factorial(num)
                    break
                default:
                    result = num
            }

            setDisplay(String(result))
        } catch (e) {
            setDisplay('Error')
        }
    }, [display, isRadians])

    const factorial = (n) => {
        if (n < 0) return NaN
        if (n === 0 || n === 1) return 1
        let result = 1
        for (let i = 2; i <= n; i++) result *= i
        return result
    }

    const calculate = useCallback(() => {
        try {
            const fullExpression = expression + display
            // Safe evaluation using Function constructor
            const sanitized = fullExpression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**')
            const result = new Function('return ' + sanitized)()
            setDisplay(String(result))
            setExpression('')
        } catch (e) {
            setDisplay('Error')
        }
    }, [expression, display])

    const clear = useCallback(() => {
        setDisplay('0')
        setExpression('')
    }, [])

    const clearEntry = useCallback(() => {
        setDisplay('0')
    }, [])

    const backspace = useCallback(() => {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
    }, [])

    const buttons = [
        ['MC', 'MR', 'M+', 'M-', 'MS'],
        ['2nd', 'π', 'e', 'C', '⌫'],
        ['x²', '1/x', '|x|', 'exp', '%'],
        ['√', '(', ')', 'n!', '÷'],
        ['xʸ', '7', '8', '9', '×'],
        ['log', '4', '5', '6', '-'],
        ['ln', '1', '2', '3', '+'],
        ['sin', 'cos', 'tan', '0', '='],
    ]

    const handleButtonClick = (btn) => {
        if (btn >= '0' && btn <= '9') {
            handleNumber(btn)
        } else if (btn === '.') {
            if (!display.includes('.')) handleNumber('.')
        } else if (['+', '-', '×', '÷'].includes(btn)) {
            handleOperator(btn)
        } else if (btn === '=') {
            calculate()
        } else if (btn === 'C') {
            clear()
        } else if (btn === 'CE') {
            clearEntry()
        } else if (btn === '⌫') {
            backspace()
        } else if (btn === '√') {
            handleFunction('sqrt')
        } else if (btn === 'x²') {
            handleFunction('x²')
        } else if (btn === 'x³') {
            handleFunction('x³')
        } else if (btn === '1/x') {
            handleFunction('1/x')
        } else if (btn === 'sin') {
            handleFunction('sin')
        } else if (btn === 'cos') {
            handleFunction('cos')
        } else if (btn === 'tan') {
            handleFunction('tan')
        } else if (btn === 'log') {
            handleFunction('log')
        } else if (btn === 'ln') {
            handleFunction('ln')
        } else if (btn === 'π') {
            handleFunction('π')
        } else if (btn === 'e') {
            handleFunction('e')
        } else if (btn === 'n!') {
            handleFunction('!')
        } else if (btn === '%') {
            handleFunction('%')
        } else if (btn === '±') {
            handleFunction('±')
        } else if (btn === 'xʸ') {
            handleOperator('^')
        } else if (btn === '(' || btn === ')') {
            setDisplay(prev => prev === '0' ? btn : prev + btn)
        } else if (btn === 'MC') {
            setMemory(0)
        } else if (btn === 'MR') {
            setDisplay(String(memory))
        } else if (btn === 'M+') {
            setMemory(prev => prev + parseFloat(display))
        } else if (btn === 'M-') {
            setMemory(prev => prev - parseFloat(display))
        } else if (btn === 'MS') {
            setMemory(parseFloat(display))
        } else if (btn === '2nd') {
            setIsRadians(prev => !prev)
        } else if (btn === '|x|') {
            setDisplay(prev => String(Math.abs(parseFloat(prev))))
        } else if (btn === 'exp') {
            setDisplay(prev => String(Math.exp(parseFloat(prev))))
        }
    }

    const getButtonClass = (btn) => {
        if (btn === '=') return 'calc-btn btn-equals'
        if (['+', '-', '×', '÷', 'xʸ'].includes(btn)) return 'calc-btn btn-operator'
        if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', 'x³', 'n!', '%', '1/x', '|x|', 'exp'].includes(btn)) return 'calc-btn btn-function'
        if (['MC', 'MR', 'M+', 'M-', 'MS'].includes(btn)) return 'calc-btn btn-memory'
        if (['C', '⌫', '2nd'].includes(btn)) return 'calc-btn btn-clear'
        if (['π', 'e', '(', ')'].includes(btn)) return 'calc-btn btn-constant'
        return 'calc-btn btn-number'
    }

    return (
        <div className="scientific-calculator">
            <div className="calc-container">
                <div className="calc-header">
                    <h1 className="calc-title">Scientific Calculator</h1>
                    <div className="calc-mode">
                        <span className={isRadians ? 'active' : ''}>RAD</span>
                        <span className={!isRadians ? 'active' : ''}>DEG</span>
                    </div>
                </div>

                <div className="calc-display">
                    <div className="display-expression">{expression}</div>
                    <div className="display-result">{display}</div>
                    {memory !== 0 && <div className="display-memory">M: {memory}</div>}
                </div>

                <div className="calc-keypad">
                    {buttons.map((row, rowIndex) => (
                        <div key={rowIndex} className="calc-row">
                            {row.map((btn) => (
                                <button
                                    key={btn}
                                    className={getButtonClass(btn)}
                                    onClick={() => handleButtonClick(btn)}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ScientificCalculator
