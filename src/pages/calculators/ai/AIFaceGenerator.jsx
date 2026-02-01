import { useState, useRef } from 'react'
import { User, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIFaceGenerator() {
    const [gender, setGender] = useState('female')
    const [age, setAge] = useState('young-adult')
    const [ethnicity, setEthnicity] = useState('diverse')
    const [expression, setExpression] = useState('neutral')
    const [style, setStyle] = useState('realistic')
    const [additionalDetails, setAdditionalDetails] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const genders = [
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
        { value: 'androgynous', label: 'Androgynous' }
    ]

    const ages = [
        { value: 'child', label: 'Child (5-12)' },
        { value: 'teenager', label: 'Teenager (13-19)' },
        { value: 'young-adult', label: 'Young Adult (20-35)' },
        { value: 'middle-aged', label: 'Middle Aged (36-55)' },
        { value: 'elderly', label: 'Elderly (55+)' }
    ]

    const ethnicities = [
        { value: 'diverse', label: 'Diverse/Any' },
        { value: 'caucasian', label: 'Caucasian' },
        { value: 'asian', label: 'Asian' },
        { value: 'african', label: 'African' },
        { value: 'latino', label: 'Latino/Hispanic' },
        { value: 'middle-eastern', label: 'Middle Eastern' },
        { value: 'south-asian', label: 'South Asian' }
    ]

    const expressions = [
        { value: 'neutral', label: 'Neutral' },
        { value: 'smiling', label: 'Smiling' },
        { value: 'serious', label: 'Serious' },
        { value: 'confident', label: 'Confident' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'professional', label: 'Professional' },
        { value: 'thoughtful', label: 'Thoughtful' }
    ]

    const styles = [
        { value: 'realistic', label: 'Photorealistic', prompt: 'ultra realistic photograph, professional headshot, studio lighting, 8k, sharp focus' },
        { value: 'portrait', label: 'Portrait Art', prompt: 'professional portrait, artistic lighting, cinematic, detailed' },
        { value: 'corporate', label: 'Corporate', prompt: 'professional corporate headshot, business attire, clean background, studio lighting' },
        { value: 'casual', label: 'Casual', prompt: 'casual lifestyle photo, natural lighting, relaxed pose' },
        { value: 'artistic', label: 'Artistic', prompt: 'artistic portrait, creative lighting, shallow depth of field' },
        { value: 'avatar', label: 'Avatar/Profile', prompt: 'clean profile picture, centered face, soft lighting, minimal background' }
    ]

    const handleGenerate = async () => {
        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedStyle = styles.find(s => s.value === style)
        const selectedAge = ages.find(a => a.value === age)
        const selectedEthnicity = ethnicities.find(e => e.value === ethnicity)
        const selectedExpression = expressions.find(e => e.value === expression)

        const prompt = `portrait of a ${selectedAge?.label || 'young adult'} ${gender} person${selectedEthnicity?.value !== 'diverse' ? ` of ${selectedEthnicity?.label} ethnicity` : ''}, ${selectedExpression?.label?.toLowerCase()} expression, ${selectedStyle?.prompt || 'professional headshot'}, face focused, high quality${additionalDetails ? `, ${additionalDetails}` : ''}`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate face')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `ai-face-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setGender('female')
        setAge('young-adult')
        setEthnicity('diverse')
        setExpression('neutral')
        setStyle('realistic')
        setAdditionalDetails('')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Face Generator"
            description="Create realistic synthetic faces with AI - Perfect for avatars, profiles, and mockups"
            category="AI Tools"
            categoryPath="/ai"
            icon={User}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Gender Selection */}
            <div className="input-group">
                <label className="input-label">Gender</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {genders.map(g => (
                        <button
                            key={g.value}
                            onClick={() => setGender(g.value)}
                            style={{
                                padding: '10px 20px',
                                background: gender === g.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: gender === g.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontWeight: gender === g.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Age Selection */}
            <div className="input-group">
                <label className="input-label">Age Group</label>
                <select value={age} onChange={(e) => setAge(e.target.value)}>
                    {ages.map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                </select>
            </div>

            {/* Ethnicity Selection */}
            <div className="input-group">
                <label className="input-label">Ethnicity</label>
                <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}>
                    {ethnicities.map(e => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                </select>
            </div>

            {/* Expression Selection */}
            <div className="input-group">
                <label className="input-label">Expression</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {expressions.map(e => (
                        <button
                            key={e.value}
                            onClick={() => setExpression(e.value)}
                            style={{
                                padding: '10px 8px',
                                background: expression === e.value
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                                    : '#21262d',
                                border: expression === e.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: expression === e.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {e.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Style Selection */}
            <div className="input-group">
                <label className="input-label">Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {styles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: style === s.value
                                    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                    : '#21262d',
                                border: style === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: style === s.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Additional Details */}
            <div className="input-group">
                <label className="input-label">Additional Details (Optional)</label>
                <input
                    type="text"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="e.g., wearing glasses, beard, specific hair color..."
                    className="input-field"
                />
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#ef444420',
                    border: '1px solid #ef444440',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px',
                    minHeight: '52px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Generating Face...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Face
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Face
                    </>
                )}
            </button>

            {/* Info */}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#3b82f610',
                border: '1px solid #3b82f630',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#60a5fa'
            }}>
                💡 <strong>Note:</strong> All generated faces are synthetic and do not represent real people. Perfect for avatars, mockups, and design projects.
            </div>

            {/* Loading Animation */}
            {loading && (
                <div style={{ marginTop: '24px' }}>
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        overflow: 'hidden',
                        padding: '40px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            border: '4px solid #333',
                            borderTopColor: '#a78bfa',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{
                                margin: '0 0 8px 0',
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#e6edf3'
                            }}>
                                👤 Creating Face...
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#8b949e' }}>
                                This may take 10-30 seconds
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Result */}
            {imageUrl && !loading && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: '#0d1117',
                            borderBottom: '1px solid #333'
                        }}>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#e6edf3',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <User size={16} style={{ color: '#a78bfa' }} />
                                Generated Face
                            </span>
                            <button
                                onClick={handleDownload}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    minHeight: '36px'
                                }}
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#0a0a0a',
                            padding: '16px'
                        }}>
                            <img
                                src={imageUrl}
                                alt="AI Generated Face"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        background: '#10b98110',
                        border: '1px solid #10b98130',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#10b981'
                    }}>
                        👤 <strong>Synthetic Face Generated</strong> - Free to use for any purpose
                    </div>
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

export default AIFaceGenerator
