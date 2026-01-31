import { useState, useRef } from 'react'
import { QrCode } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function QRCodeGenerator() {
    const [text, setText] = useState('https://plainly.live')
    const [size, setSize] = useState(200)

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`

    const handleDownload = async () => {
        try {
            const response = await fetch(qrUrl)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'qrcode.png'
            a.click()
            URL.revokeObjectURL(url)
        } catch (e) {
            console.error('Download failed', e)
        }
    }

    return (
        <CalculatorLayout
            title="QR Code Generator"
            description="Generate QR codes for URLs, text, and more"
            category="Tech"
            categoryPath="/tech"
            icon={QrCode}
            result="Generated"
            resultLabel="QR Code"
        >
            <div className="input-group">
                <label className="input-label">Text or URL</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text or URL"
                />
            </div>
            <div className="input-group">
                <label className="input-label">Size (px)</label>
                <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
                    <option value={150}>Small (150px)</option>
                    <option value={200}>Medium (200px)</option>
                    <option value={300}>Large (300px)</option>
                    <option value={400}>Extra Large (400px)</option>
                </select>
            </div>
            {text && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '16px'
                }}>
                    <img
                        src={qrUrl}
                        alt="QR Code"
                        style={{
                            background: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            maxWidth: '100%'
                        }}
                    />
                    <button onClick={handleDownload} style={{
                        width: '100%',
                        padding: '12px',
                        background: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer'
                    }}>
                        Download QR Code
                    </button>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default QRCodeGenerator
