import { useState, useMemo } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CurrencyConverter() {
    const [amount, setAmount] = useState(100)
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('EUR')

    // Static exchange rates (in production, these would come from an API)
    const rates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        CAD: 1.36,
        AUD: 1.53,
        CHF: 0.88,
        CNY: 7.24,
        INR: 83.12,
        MXN: 17.15,
        BRL: 4.97,
        KRW: 1320.50
    }

    const currencies = [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'MXN', name: 'Mexican Peso' },
        { code: 'BRL', name: 'Brazilian Real' },
        { code: 'KRW', name: 'South Korean Won' }
    ]

    const results = useMemo(() => {
        const amountInUsd = amount / rates[fromCurrency]
        const convertedAmount = amountInUsd * rates[toCurrency]
        const exchangeRate = rates[toCurrency] / rates[fromCurrency]
        const inverseRate = 1 / exchangeRate

        return { convertedAmount, exchangeRate, inverseRate }
    }, [amount, fromCurrency, toCurrency])

    const swapCurrencies = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
    }

    return (
        <CalculatorLayout
            title="Currency Converter"
            description="Convert between currencies"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={ArrowRightLeft}
            result={results.convertedAmount.toFixed(2)}
            resultLabel={toCurrency}
        >
            <div className="input-group">
                <label className="input-label">Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} step={0.01} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">From</label>
                    <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                        {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={swapCurrencies}
                    style={{
                        padding: '12px',
                        background: '#333',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '4px'
                    }}
                >
                    <ArrowRightLeft size={18} color="#fff" />
                </button>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">To</label>
                    <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                        {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">{amount} {fromCurrency} =</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.convertedAmount.toFixed(2)} {toCurrency}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">1 {fromCurrency} =</span>
                    <span className="result-detail-value">{results.exchangeRate.toFixed(4)} {toCurrency}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">1 {toCurrency} =</span>
                    <span className="result-detail-value">{results.inverseRate.toFixed(4)} {fromCurrency}</span>
                </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>
                Note: Exchange rates are approximate and may not reflect current market rates
            </div>
        </CalculatorLayout>
    )
}

export default CurrencyConverter
