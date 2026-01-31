import { useState, useMemo, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CurrencyConverter() {
    const [amount, setAmount] = useState(100)
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('EUR')

    // Static rates (would use API in production)
    const rates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        INR: 83.12,
        CAD: 1.36,
        AUD: 1.53,
        CHF: 0.88,
        CNY: 7.24,
        MXN: 17.15,
        BRL: 4.97,
        KRW: 1328.50,
        SGD: 1.34,
        AED: 3.67
    }

    const currencies = Object.keys(rates)

    const results = useMemo(() => {
        const fromRate = rates[fromCurrency]
        const toRate = rates[toCurrency]
        const usdAmount = amount / fromRate
        const converted = usdAmount * toRate
        const exchangeRate = toRate / fromRate

        return { converted, exchangeRate, usdAmount }
    }, [amount, fromCurrency, toCurrency])

    const swap = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
    }

    const formatNumber = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <CalculatorLayout
            title="Currency Converter"
            description="Convert between world currencies"
            category="Finance"
            categoryPath="/finance"
            icon={DollarSign}
            result={`${formatNumber(results.converted)} ${toCurrency}`}
            resultLabel="Converted Amount"
        >
            <div className="input-group">
                <label className="input-label">Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} step={0.01} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">From</label>
                    <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <button onClick={swap} style={{
                    background: '#333',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    alignSelf: 'flex-end',
                    marginBottom: '4px'
                }}>⇄</button>
                <div className="input-group">
                    <label className="input-label">To</label>
                    <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">{amount} {fromCurrency}</span>
                    <span className="result-detail-value">{formatNumber(results.converted)} {toCurrency}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Exchange Rate</span>
                    <span className="result-detail-value">1 {fromCurrency} = {results.exchangeRate.toFixed(4)} {toCurrency}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">USD Equivalent</span>
                    <span className="result-detail-value">${formatNumber(results.usdAmount)}</span>
                </div>
            </div>
            <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '12px' }}>
                * Rates are approximate. For live rates, check financial services.
            </p>
        </CalculatorLayout>
    )
}

export default CurrencyConverter
