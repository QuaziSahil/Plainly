import { useState, useRef } from 'react'
import { Layers, Loader2, Download, RefreshCw, Eye, Code2, Copy, Check, Sparkles, FileText, Image, ExternalLink } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'
import { askGroq } from '../../../services/groqAI'

function AIInfographicDesigner() {
    const [topic, setTopic] = useState('')
    const [style, setStyle] = useState('modern')
    const [layout, setLayout] = useState('vertical')
    const [colorScheme, setColorScheme] = useState('dark')
    const [generatedCode, setGeneratedCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showCode, setShowCode] = useState(false)
    const [copied, setCopied] = useState(false)
    const [exporting, setExporting] = useState(false)
    const resultRef = useRef(null)

    const styles = [
        { value: 'modern', label: '✨ Modern', desc: 'Glassmorphism, gradients, card-based design with shadows' },
        { value: 'professional', label: '💼 Professional', desc: 'Clean corporate look with charts and data focus' },
        { value: 'creative', label: '🎨 Creative', desc: 'Bold colors, artistic elements, unique layouts' },
        { value: 'minimal', label: '🎯 Minimal', desc: 'Clean whitespace, elegant typography, simple' },
        { value: 'data', label: '📊 Data-Rich', desc: 'Statistics-heavy with multiple visualizations' }
    ]

    const layouts = [
        { value: 'vertical', label: '📜 Vertical', desc: 'Scrollable top-to-bottom flow' },
        { value: 'sections', label: '📦 Sections', desc: 'Distinct card sections' },
        { value: 'timeline', label: '⏱️ Timeline', desc: 'Chronological steps' },
        { value: 'comparison', label: '⚖️ Compare', desc: 'Side-by-side analysis' },
        { value: 'process', label: '🔄 Process', desc: 'Step-by-step flow' }
    ]

    const colorSchemes = [
        { value: 'dark', label: '🌙 Dark', colors: 'Background: #0f0f23, Text: #ffffff, Accent: #8b5cf6 purple and #06b6d4 cyan' },
        { value: 'light', label: '☀️ Light', colors: 'Background: #ffffff, Text: #1a1a2e, Accent: #3b82f6 blue and #8b5cf6 purple' },
        { value: 'ocean', label: '🌊 Ocean', colors: 'Background: #0c1929, Text: #e0f2fe, Accent: #0ea5e9 sky and #06b6d4 teal' },
        { value: 'nature', label: '🌿 Nature', colors: 'Background: #0f1a0f, Text: #ecfccb, Accent: #22c55e green and #84cc16 lime' },
        { value: 'sunset', label: '🌅 Sunset', colors: 'Background: #1a0a1a, Text: #fef3c7, Accent: #f97316 orange and #ec4899 pink' },
        { value: 'neon', label: '💜 Neon', colors: 'Background: #0a0a0a, Text: #ffffff, Accent: #ff00ff magenta and #00ffff cyan, with glow effects' }
    ]

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for your infographic')
            return
        }

        setLoading(true)
        setError('')
        setGeneratedCode('')

        const selectedStyle = styles.find(s => s.value === style)
        const selectedLayout = layouts.find(l => l.value === layout)
        const selectedColors = colorSchemes.find(c => c.value === colorScheme)

        const systemPrompt = `You are an expert infographic designer creating presentation-ready HTML infographics. Output ONLY valid HTML code.

## CRITICAL OUTPUT RULES:
1. Start with <!DOCTYPE html> - no other text before it
2. All CSS must be in <style> tags inside <head>
3. No external dependencies - everything self-contained
4. No markdown code blocks - just raw HTML

## COLOR SCHEME: ${selectedColors?.label}
${selectedColors?.colors}

## DESIGN STYLE: ${selectedStyle?.label}
${selectedStyle?.desc}

## LAYOUT: ${selectedLayout?.label}
${selectedLayout?.desc}

## REQUIRED HTML STRUCTURE:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Infographic</title>
    <style>
        /* CSS Variables */
        :root {
            --bg: [background color];
            --text: [text color];
            --primary: [primary accent];
            --secondary: [secondary accent];
        }
        
        /* Reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            padding: 32px 24px;
        }
        
        .container {
            max-width: 680px;
            margin: 0 auto;
        }
        
        /* Hero section with gradient */
        .hero {
            text-align: center;
            padding: 40px 24px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 20px;
            margin-bottom: 32px;
        }
        
        .hero h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
            color: white;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .hero p {
            font-size: 16px;
            opacity: 0.95;
            color: white;
        }
        
        /* Stats grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }
        
        .stat-card {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 16px;
            padding: 24px 16px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .stat-label {
            font-size: 13px;
            opacity: 0.7;
            margin-top: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Content sections */
        .section {
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .section-icon {
            font-size: 28px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
        }
        
        .section-content {
            font-size: 15px;
            opacity: 0.9;
            margin-bottom: 16px;
        }
        
        /* Progress bar */
        .progress-container {
            margin-top: 16px;
        }
        
        .progress-label {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-bottom: 8px;
        }
        
        .progress-bar {
            height: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 5px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            border-radius: 5px;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 24px;
            font-size: 13px;
            opacity: 0.5;
            border-top: 1px solid rgba(255,255,255,0.1);
            margin-top: 32px;
        }
        
        /* CRITICAL: Print styles for PDF export */
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            body {
                background: var(--bg) !important;
                padding: 20px !important;
            }
            .hero {
                background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
            }
            .stat-card, .section {
                background: rgba(128,128,128,0.2) !important;
                border: 1px solid rgba(128,128,128,0.3) !important;
            }
            .stat-number {
                -webkit-text-fill-color: var(--primary) !important;
                color: var(--primary) !important;
            }
            .progress-fill {
                background: var(--primary) !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero Section -->
        <div class="hero">
            <h1>[Title]</h1>
            <p>[Subtitle hook]</p>
        </div>
        
        <!-- Stats Grid - 3-4 key numbers -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">[Number]</div>
                <div class="stat-label">[Label]</div>
            </div>
            <!-- More stat cards -->
        </div>
        
        <!-- Content Sections with facts and progress bars -->
        <div class="section">
            <div class="section-header">
                <span class="section-icon">[Emoji]</span>
                <h2 class="section-title">[Title]</h2>
            </div>
            <p class="section-content">[2-3 sentences of real facts]</p>
            <div class="progress-container">
                <div class="progress-label">
                    <span>[Label]</span>
                    <span>[Percentage]%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: [X]%;"></div>
                </div>
            </div>
        </div>
        
        <!-- More sections... -->
        
        <div class="footer">Created with Plainly AI</div>
    </div>
</body>
</html>

## CONTENT REQUIREMENTS:
1. Include 5-7 REAL, accurate facts about "${topic}"
2. Use actual statistics and numbers from your knowledge
3. Each section should be educational with real data
4. Include at least 3 progress bars or visual metrics
5. Make content presentation-ready and professional

## OUTPUT:
Return ONLY the HTML code starting with <!DOCTYPE html>. No explanations, no markdown.`

        const prompt = `Create a professional infographic about: "${topic}"

Style: ${selectedStyle?.label}
Colors: ${selectedColors?.label}
Layout: ${selectedLayout?.label}

Requirements:
- Hero with gradient and compelling title
- 3-4 key statistics in a grid
- 4-5 content sections with real facts
- Progress bars showing relevant metrics
- Professional typography and spacing

Generate complete, valid HTML now.`

        try {
            const response = await askGroq(prompt, systemPrompt, { maxTokens: 8000 })

            let htmlCode = response.trim()

            // Remove markdown code blocks if present
            const codeBlockMatch = htmlCode.match(/```(?:html)?\s*([\s\S]*?)```/)
            if (codeBlockMatch) {
                htmlCode = codeBlockMatch[1].trim()
            }

            // Find the start of HTML
            const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype')
            const htmlTagIndex = htmlCode.toLowerCase().indexOf('<html')

            if (doctypeIndex > 0) {
                htmlCode = htmlCode.substring(doctypeIndex)
            } else if (htmlTagIndex > 0) {
                htmlCode = htmlCode.substring(htmlTagIndex)
            }

            // If no proper HTML structure, wrap it
            if (!htmlCode.toLowerCase().startsWith('<!doctype') && !htmlCode.toLowerCase().startsWith('<html')) {
                // Determine background based on color scheme
                const bgColors = {
                    dark: '#0f0f23',
                    light: '#ffffff',
                    ocean: '#0c1929',
                    nature: '#0f1a0f',
                    sunset: '#1a0a1a',
                    neon: '#0a0a0a'
                }
                const textColors = {
                    dark: '#ffffff',
                    light: '#1a1a2e',
                    ocean: '#e0f2fe',
                    nature: '#ecfccb',
                    sunset: '#fef3c7',
                    neon: '#ffffff'
                }

                htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic} - Infographic</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: ${bgColors[colorScheme] || '#0f0f23'}; 
            color: ${textColors[colorScheme] || '#ffffff'}; 
            padding: 24px; 
            line-height: 1.6;
        }
        .container { max-width: 680px; margin: 0 auto; }
    </style>
</head>
<body>
<div class="container">
${htmlCode}
</div>
</body>
</html>`
            }

            setGeneratedCode(htmlCode)
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        } catch (err) {
            setError('Failed to generate infographic. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadHTML = () => {
        if (!generatedCode) return
        const blob = new Blob([generatedCode], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `infographic-${topic.replace(/\s+/g, '-').toLowerCase()}.html`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
    }

    const handleOpenInNewTab = () => {
        if (!generatedCode) return
        const blob = new Blob([generatedCode], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
    }

    const handleExportImage = async () => {
        if (!generatedCode) return

        setExporting(true)
        try {
            // Create a new window with the HTML content
            const printWindow = window.open('', '_blank')
            if (!printWindow) {
                setError('Please allow popups to export as image/PDF')
                return
            }

            // Write the HTML with export instructions
            printWindow.document.write(`
                ${generatedCode.replace('</body>', `
                    <div style="position: fixed; bottom: 20px; right: 20px; background: #333; color: white; padding: 16px 24px; border-radius: 12px; font-family: system-ui; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                        <strong>📥 To Save:</strong><br>
                        • <b>PDF:</b> Press Ctrl+P → Save as PDF<br>
                        • <b>Image:</b> Screenshot (Win+Shift+S)<br>
                        <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 6px 12px; border: none; background: #666; color: white; border-radius: 6px; cursor: pointer;">Got it!</button>
                    </div>
                </body>`)}
            `)
            printWindow.document.close()
        } catch (err) {
            console.error('Export error:', err)
            setError('Export failed. Try downloading as HTML instead.')
        } finally {
            setExporting(false)
        }
    }

    const handleCopyCode = async () => {
        if (!generatedCode) return
        await navigator.clipboard.writeText(generatedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setTopic('')
        setStyle('modern')
        setLayout('vertical')
        setColorScheme('dark')
        setGeneratedCode('')
        setError('')
        setShowCode(false)
    }

    return (
        <CalculatorLayout
            title="AI Infographic Designer"
            description="Create stunning infographics with AI - download as HTML or export as PDF/Image"
            category="AI Tools"
            categoryPath="/ai"
            icon={Layers}
            result={generatedCode ? 'Generated ✓' : 'Ready'}
            resultLabel="Status"
            onReset={handleReset}
        >
            {/* Topic */}
            <div className="input-group">
                <label className="input-label">📝 Topic *</label>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Be specific for best results:
• Benefits of meditation for mental health
• History of artificial intelligence
• Climate change effects on oceans"
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        background: '#0a0a0a',
                        color: 'white',
                        fontSize: '15px',
                        resize: 'vertical',
                        minHeight: '85px'
                    }}
                />
            </div>

            {/* Style */}
            <div className="input-group">
                <label className="input-label">🎨 Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                    {styles.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setStyle(s.value)}
                            style={{
                                padding: '12px 10px',
                                background: style === s.value ? 'linear-gradient(135deg, #a78bfa, #8b5cf6)' : '#1a1a2e',
                                border: style === s.value ? 'none' : '1px solid #333',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '13px',
                                cursor: 'pointer',
                                fontWeight: style === s.value ? '600' : '400',
                                minHeight: '46px'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout */}
            <div className="input-group">
                <label className="input-label">📐 Layout</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                    {layouts.map(l => (
                        <button
                            key={l.value}
                            onClick={() => setLayout(l.value)}
                            style={{
                                padding: '12px 10px',
                                background: layout === l.value ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#1a1a2e',
                                border: layout === l.value ? 'none' : '1px solid #333',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: layout === l.value ? '600' : '400',
                                minHeight: '46px'
                            }}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="input-group">
                <label className="input-label">🎭 Colors</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '8px' }}>
                    {colorSchemes.map(c => (
                        <button
                            key={c.value}
                            onClick={() => setColorScheme(c.value)}
                            style={{
                                padding: '12px 8px',
                                background: colorScheme === c.value ? 'linear-gradient(135deg, #10b981, #059669)' : '#1a1a2e',
                                border: colorScheme === c.value ? 'none' : '1px solid #333',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: colorScheme === c.value ? '600' : '400',
                                minHeight: '46px'
                            }}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    background: '#ef444420',
                    border: '1px solid #ef444440',
                    borderRadius: '10px',
                    color: '#f87171',
                    fontSize: '14px'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Generate */}
            <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading || !topic.trim()
                        ? '#333'
                        : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px',
                    minHeight: '54px'
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Designing...
                    </>
                ) : generatedCode ? (
                    <>
                        <RefreshCw size={20} />
                        Regenerate
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Infographic
                    </>
                )}
            </button>

            {/* Loading */}
            {loading && (
                <div style={{ marginTop: '24px', textAlign: 'center', padding: '40px 20px', background: '#1a1a2e', borderRadius: '14px', border: '1px solid #333' }}>
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 16px', borderRadius: '50%', border: '4px solid #333', borderTopColor: '#a78bfa', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ fontSize: '16px', color: '#e6edf3' }}>Creating your infographic...</p>
                </div>
            )}

            {/* Result */}
            {generatedCode && !loading && (
                <div ref={resultRef} style={{ marginTop: '24px' }}>
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '14px',
                        border: '1px solid #333',
                        overflow: 'hidden'
                    }}>
                        {/* Actions */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 14px',
                            background: '#0d1117',
                            borderBottom: '1px solid #333',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => setShowCode(false)}
                                    style={{
                                        padding: '8px 14px',
                                        background: !showCode ? '#a78bfa' : 'transparent',
                                        border: !showCode ? 'none' : '1px solid #444',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        minHeight: '36px'
                                    }}
                                >
                                    <Eye size={14} /> Preview
                                </button>
                                <button
                                    onClick={() => setShowCode(true)}
                                    style={{
                                        padding: '8px 14px',
                                        background: showCode ? '#a78bfa' : 'transparent',
                                        border: showCode ? 'none' : '1px solid #444',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        minHeight: '36px'
                                    }}
                                >
                                    <Code2 size={14} /> Code
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleCopyCode}
                                    style={{
                                        padding: '8px 12px',
                                        background: copied ? '#10b981' : '#21262d',
                                        border: '1px solid #444',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        minHeight: '36px'
                                    }}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                                    onClick={handleOpenInNewTab}
                                    style={{
                                        padding: '8px 12px',
                                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        minHeight: '36px'
                                    }}
                                >
                                    <ExternalLink size={14} /> Open Full
                                </button>
                                <button
                                    onClick={handleExportImage}
                                    disabled={exporting}
                                    style={{
                                        padding: '8px 12px',
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        minHeight: '36px'
                                    }}
                                >
                                    <Image size={14} /> Export
                                </button>
                                <button
                                    onClick={handleDownloadHTML}
                                    style={{
                                        padding: '8px 12px',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        minHeight: '36px'
                                    }}
                                >
                                    <Download size={14} /> HTML
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {!showCode ? (
                            <div style={{ padding: '16px', background: '#0a0a0a' }}>
                                <iframe
                                    srcDoc={generatedCode}
                                    title="Infographic Preview"
                                    style={{
                                        width: '100%',
                                        minHeight: '600px',
                                        border: 'none',
                                        borderRadius: '10px',
                                        background: colorScheme === 'light' ? '#fff' : '#0f0f23'
                                    }}
                                    sandbox="allow-scripts"
                                />
                            </div>
                        ) : (
                            <div style={{ padding: '16px', background: '#0d1117', maxHeight: '600px', overflow: 'auto' }}>
                                <pre style={{
                                    margin: 0,
                                    padding: '16px',
                                    background: '#0a0a0a',
                                    borderRadius: '10px',
                                    color: '#e6edf3',
                                    fontSize: '12px',
                                    lineHeight: '1.5',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {generatedCode}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Tips */}
                    <div style={{
                        marginTop: '14px',
                        padding: '14px',
                        background: '#10b98115',
                        border: '1px solid #10b98130',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#34d399'
                    }}>
                        <strong>💡 Export Tips:</strong><br />
                        • Click <strong>Open Full</strong> to view in new tab, then use <strong>Ctrl+P → Save as PDF</strong><br />
                        • Use <strong>Win+Shift+S</strong> (Windows) or <strong>Cmd+Shift+4</strong> (Mac) to screenshot
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

export default AIInfographicDesigner
