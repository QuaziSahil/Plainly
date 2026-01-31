import { useState, useMemo } from 'react'
import { Bitcoin } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CryptoConverter() {
    const [amount, setAmount] = useState(1)
    const [currency, setCurrency] = useState('btc')
    const [fiat, setFiat] = useState('usd')

    // Simulated exchange rates (in real app, fetch from API)
    const cryptoRates = {
        btc: { usd: 43250, eur: 39800, gbp: 34100, name: 'Bitcoin' },
        eth: { usd: 2280, eur: 2100, gbp: 1800, name: 'Ethereum' },
        sol: { usd: 98, eur: 90, gbp: 77, name: 'Solana' },
        xrp: { usd: 0.52, eur: 0.48, gbp: 0.41, name: 'XRP' },
        ada: { usd: 0.51, eur: 0.47, gbp: 0.40, name: 'Cardano' },
        doge: { usd: 0.082, eur: 0.075, gbp: 0.065, name: 'Dogecoin' }
    }

    const fiatSymbols = { usd: '$', eur: '€', gbp: '£' }

    const results = useMemo(() => {
        const rate = cryptoRates[currency][fiat]
        const value = amount * rate

        // Cross rates
        const crossRates = Object.keys(fiatSymbols).map(f => ({
            currency: f,
            symbol: fiatSymbols[f],
            value: amount * cryptoRates[currency][f]
        }))

        // How much crypto for $1000
        const per1000 = 1000 / cryptoRates[currency].usd

        return { value, rate, crossRates, per1000, cryptoName: cryptoRates[currency].name }
    }, [amount, currency, fiat])

    const formatValue = (val) => {
        if (val >= 1000000) return val.toLocaleString(undefined, { maximumFractionDigits: 0 })
        if (val >= 1) return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        return val.toFixed(6)
    }

    return (
        <CalculatorLayout
            title="Crypto Converter"
            description="Convert cryptocurrency to fiat"
            category="Finance"
            categoryPath="/finance"
            icon={Bitcoin}
            result={`${fiatSymbols[fiat]}${formatValue(results.value)}`}
            resultLabel={`${results.cryptoName} Value`}
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={0}
                        step="any"
                    />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Crypto</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        {Object.entries(cryptoRates).map(([key, data]) => (
                            <option key={key} value={key}>{key.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Convert To</label>
                <select value={fiat} onChange={(e) => setFiat(e.target.value)}>
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                </select>
            </div>
            <div style={{
                background: 'linear-gradient(135deg, #f59e0b20, #a78bfa20)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '4px' }}>
                    {amount} {currency.toUpperCase()} =
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>
                    {fiatSymbols[fiat]}{formatValue(results.value)}
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {results.crossRates.map(rate => (
                    <div
                        key={rate.currency}
                        style={{
                            background: rate.currency === fiat ? '#a78bfa20' : '#1a1a2e',
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase' }}>{rate.currency}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{rate.symbol}{formatValue(rate.value)}</div>
                    </div>
                ))}
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Exchange Rate</span>
                    <span className="result-detail-value">1 {currency.toUpperCase()} = {fiatSymbols[fiat]}{formatValue(results.rate)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">$1,000 buys</span>
                    <span className="result-detail-value">{results.per1000.toFixed(6)} {currency.toUpperCase()}</span>
                </div>
            </div>
            <div style={{
                marginTop: '12px',
                padding: '10px',
                background: '#f59e0b20',
                borderRadius: '6px',
                fontSize: '11px',
                textAlign: 'center'
            }}>
                ⚠️ Rates are simulated for demo purposes. Use a live API for real trading.
            </div>
        </CalculatorLayout>
    )
}

export default CryptoConverter
