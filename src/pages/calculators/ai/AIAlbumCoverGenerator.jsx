import { useState, useRef } from 'react'
import { Disc3, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { generateImage, isConfigured } from '../../../services/pollinationsAI'

function AIAlbumCoverGenerator() {
    const [albumName, setAlbumName] = useState('')
    const [artistName, setArtistName] = useState('')
    const [genre, setGenre] = useState('pop')
    const [artStyle, setArtStyle] = useState('modern')
    const [mood, setMood] = useState('energetic')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const resultRef = useRef(null)

    const genres = [
        { value: 'pop', label: 'Pop', prompt: 'pop music, colorful, trendy, vibrant' },
        { value: 'hiphop', label: 'Hip-Hop/Rap', prompt: 'hip-hop, urban, street culture, bold' },
        { value: 'rock', label: 'Rock', prompt: 'rock music, edgy, electric, powerful' },
        { value: 'electronic', label: 'Electronic/EDM', prompt: 'electronic music, futuristic, neon, digital' },
        { value: 'jazz', label: 'Jazz', prompt: 'jazz, sophisticated, classic, smooth' },
        { value: 'classical', label: 'Classical', prompt: 'classical music, elegant, orchestral, timeless' },
        { value: 'indie', label: 'Indie', prompt: 'indie music, artistic, alternative, creative' },
        { value: 'metal', label: 'Metal', prompt: 'heavy metal, dark, intense, aggressive' },
        { value: 'country', label: 'Country', prompt: 'country music, rustic, acoustic, warm' },
        { value: 'rnb', label: 'R&B/Soul', prompt: 'r&b soul music, smooth, emotional, sensual' }
    ]

    const artStyles = [
        { value: 'modern', label: 'Modern', prompt: 'modern contemporary design, clean' },
        { value: 'retro', label: 'Retro/Vintage', prompt: 'retro vintage style, nostalgic, 80s 90s' },
        { value: 'minimalist', label: 'Minimalist', prompt: 'minimalist design, simple, elegant' },
        { value: 'abstract', label: 'Abstract', prompt: 'abstract art, artistic, expressive' },
        { value: 'photographic', label: 'Photographic', prompt: 'photographic style, realistic, portrait' },
        { value: 'illustrated', label: 'Illustrated', prompt: 'illustrated, hand-drawn, artistic' },
        { value: 'surreal', label: 'Surreal', prompt: 'surrealist art, dreamlike, fantasy' },
        { value: 'graffiti', label: 'Graffiti/Street', prompt: 'graffiti street art, urban, bold colors' }
    ]

    const moods = [
        { value: 'energetic', label: 'Energetic', prompt: 'energetic, dynamic, vibrant' },
        { value: 'dark', label: 'Dark/Moody', prompt: 'dark moody, atmospheric, mysterious' },
        { value: 'romantic', label: 'Romantic', prompt: 'romantic, soft, emotional' },
        { value: 'party', label: 'Party/Fun', prompt: 'party fun, celebration, exciting' },
        { value: 'chill', label: 'Chill/Relaxed', prompt: 'chill relaxed, calm, peaceful' },
        { value: 'epic', label: 'Epic/Grand', prompt: 'epic grand, majestic, powerful' }
    ]

    const handleGenerate = async () => {
        if (!isConfigured()) {
            setError('Image generation service not configured')
            return
        }

        setLoading(true)
        setError('')
        setImageUrl('')

        const selectedGenre = genres.find(g => g.value === genre)
        const selectedStyle = artStyles.find(s => s.value === artStyle)
        const selectedMood = moods.find(m => m.value === mood)

        const albumText = albumName.trim() ? `for album "${albumName}"` : ''
        const artistText = artistName.trim() ? `by ${artistName}` : ''

        const prompt = `album cover artwork ${albumText} ${artistText}, ${selectedGenre?.prompt}, ${selectedStyle?.prompt}, ${selectedMood?.prompt}, professional music album art, square format, high quality, detailed, professional record cover design`

        try {
            const imageDataUrl = await generateImage(prompt, {
                width: 1024,
                height: 1024
            })

            setImageUrl(imageDataUrl)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to generate album cover')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!imageUrl) return

        try {
            const link = document.createElement('a')
            link.href = imageUrl
            const filename = albumName.trim()
                ? `${albumName.replace(/\s+/g, '-').toLowerCase()}-cover-${Date.now()}.png`
                : `album-cover-${Date.now()}.png`
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
            window.open(imageUrl, '_blank')
        }
    }

    const handleReset = () => {
        setAlbumName('')
        setArtistName('')
        setGenre('pop')
        setArtStyle('modern')
        setMood('energetic')
        setImageUrl('')
        setError('')
    }

    return (
        <CalculatorLayout
            title="AI Album Cover Generator"
            description="Create professional album artwork for your music - Free & Unlimited"
            category="AI Tools"
            categoryPath="/ai"
            icon={Disc3}
            result={loading ? 'Generating...' : imageUrl ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Album Name */}
            <div className="input-group">
                <label className="input-label">Album Name (Optional)</label>
                <input
                    type="text"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    placeholder="e.g., Midnight Dreams, Electric Soul..."
                    className="input-field"
                />
            </div>

            {/* Artist Name */}
            <div className="input-group">
                <label className="input-label">Artist Name (Optional)</label>
                <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g., The Wavelengths, Sarah Moon..."
                    className="input-field"
                />
            </div>

            {/* Genre */}
            <div className="input-group">
                <label className="input-label">Music Genre</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {genres.map(g => (
                        <button
                            key={g.value}
                            onClick={() => setGenre(g.value)}
                            style={{
                                padding: '10px 8px',
                                background: genre === g.value
                                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                                    : '#21262d',
                                border: genre === g.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: genre === g.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Art Style */}
            <div className="input-group">
                <label className="input-label">Art Style</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {artStyles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setArtStyle(s.value)}
                            style={{
                                padding: '10px 8px',
                                background: artStyle === s.value
                                    ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                                    : '#21262d',
                                border: artStyle === s.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: artStyle === s.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mood */}
            <div className="input-group">
                <label className="input-label">Mood</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '8px'
                }}>
                    {moods.map(m => (
                        <button
                            key={m.value}
                            onClick={() => setMood(m.value)}
                            style={{
                                padding: '10px 8px',
                                background: mood === m.value
                                    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                    : '#21262d',
                                border: mood === m.value ? 'none' : '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: mood === m.value ? '600' : '400',
                                minHeight: '44px'
                            }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
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
                        Creating Album Art...
                    </>
                ) : imageUrl ? (
                    <>
                        <RefreshCw size={20} />
                        Generate New Cover
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Album Cover
                    </>
                )}
            </button>

            {/* Loading Animation */}
            {loading && (
                <div style={{ marginTop: '24px' }}>
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '12px',
                        border: '1px solid #333',
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
                            borderTopColor: '#8b5cf6',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#e6edf3' }}>
                                🎵 Creating Album Art...
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
                                <Disc3 size={16} style={{ color: '#a78bfa' }} />
                                {albumName || 'Album Cover'}
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
                                alt="Album Cover"
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
                        background: '#8b5cf610',
                        border: '1px solid #8b5cf630',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#a78bfa'
                    }}>
                        🎵 <strong>Album Cover Ready!</strong> - Perfect for Spotify, Apple Music, and more
                    </div>

                    {/* Refresh Tip */}
                    <div style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #1e3a5f10 0%, #3b82f620 100%)',
                        border: '1px solid #3b82f640',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '16px' }}>💡</span>
                        <span><strong>Tip:</strong> If the tool doesn't respond after generation, try refreshing the page and generating again.</span>
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

export default AIAlbumCoverGenerator
