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

        const systemPrompt = `You are a world-class infographic designer with expertise in visual storytelling, data visualization, and content strategy. You create STUNNING, PROFESSIONAL-GRADE infographics that could be published in major magazines or presentations.

## YOUR MISSION:
Create an infographic that is BOTH beautiful AND deeply informative. The quality should match professional design agencies. Every element must have purpose and polish.

## CRITICAL OUTPUT FORMAT:
- Start IMMEDIATELY with <!DOCTYPE html>
- NO markdown code blocks, NO explanations
- ALL CSS in <style> tags, ALL content in <body>
- SELF-CONTAINED: no external fonts, icons, or libraries

## DESIGN EXCELLENCE PRINCIPLES:

### 1. TYPOGRAPHY HIERARCHY (Critical for Professional Look):
- **Main Title**: Large (36-48px), can use serif font (Georgia) for elegance or sans-serif for modern
- **Subtitles**: Italicized or different weight, slightly smaller
- **Section Headings**: Bold, 20-24px, clear visual weight
- **Body Text**: 15-16px, comfortable reading, 1.6-1.8 line-height
- **Labels/Captions**: 12-13px, uppercase with letter-spacing for emphasis
- **Numbers/Stats**: Extra bold, 32-48px, can use accent colors

### 2. LAYOUT RULES (CRITICAL - FOLLOW EXACTLY):
⚠️ VERTICAL STACKING ONLY for content sections:
- ALL content sections must be FULL WIDTH and stack VERTICALLY
- NEVER use horizontal columns for content sections (causes text cutoff)
- ONLY the stats grid can use grid columns (max 3-4 items)
- Each section takes 100% width, one below the other
- Container max-width: 720px centered

CORRECT structure:
- Hero (full width, centered)
- Stats Grid (3-4 small cards in a row - OK)
- Section 1 (full width card)
- Section 2 (full width card)
- Section 3 (full width card)
- Quote/Highlight (full width)
- Footer (full width)

### 3. COLOR APPLICATION:
Use the specified color scheme: ${selectedColors?.label}
${selectedColors?.colors}

- Primary color for headings, accents, key numbers
- Secondary color for highlights, progress bars, icons
- Background should enhance readability
- Ensure sufficient contrast (4.5:1 minimum)

### 4. RICH VISUAL ELEMENTS:
- **Emoji Icons**: Use relevant emojis (🏛️ 📊 💡 ⚡ 🎯 etc.) as section icons
- **Stats Grid**: 3-4 key numbers in a visually striking grid
- **Progress Bars**: For percentages and comparisons
- **Info Cards**: For grouped facts with icon + title + description
- **Highlight Boxes**: For quotes, key insights, or warnings
- **Visual Separators**: Borders, backgrounds to define sections

### 5. CONTENT DEPTH (This is what makes it professional):
You MUST include:
- 6-10 REAL, ACCURATE facts researched from your knowledge
- Specific numbers, dates, statistics (not vague statements)
- Historical context or background where relevant
- Multiple perspectives or categories within the topic
- Practical insights or "did you know" elements
- Sources of data mentioned where appropriate

### 6. DESIGN STYLE: ${selectedStyle?.label}
${selectedStyle?.desc}

### 7. LAYOUT TYPE: ${selectedLayout?.label}
${selectedLayout?.desc}

## HTML STRUCTURE TO FOLLOW:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Topic] Infographic</title>
    <style>
        :root {
            --bg: [background];
            --text: [text color];
            --text-muted: [muted text];
            --primary: [primary accent];
            --secondary: [secondary accent];
            --card-bg: [card background];
            --border: [border color];
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.7;
            padding: 40px 24px;
        }
        
        .container { max-width: 720px; margin: 0 auto; }
        
        /* Hero - Make it commanding */
        .hero {
            text-align: center;
            margin-bottom: 40px;
            padding: 48px 32px;
            background: [gradient or solid];
            border-radius: 24px;
        }
        
        .hero h1 {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 16px;
            line-height: 1.2;
        }
        
        .hero .subtitle {
            font-size: 18px;
            opacity: 0.9;
            max-width: 500px;
            margin: 0 auto;
        }
        
        /* Stats Grid - Impactful numbers */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 28px 20px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 40px;
            font-weight: 800;
            color: var(--primary);
            line-height: 1;
        }
        
        .stat-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
            margin-top: 12px;
        }
        
        /* Content Sections */
        .section {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 24px;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        }
        
        .section-icon { font-size: 32px; }
        
        .section-title {
            font-size: 22px;
            font-weight: 700;
        }
        
        .section-content {
            font-size: 15px;
            color: var(--text);
            line-height: 1.8;
        }
        
        .section-content p { margin-bottom: 16px; }
        .section-content p:last-child { margin-bottom: 0; }
        
        /* Progress/Metric Bars */
        .metric {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
        }
        
        .metric-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .metric-bar {
            height: 12px;
            background: rgba(128,128,128,0.2);
            border-radius: 6px;
            overflow: hidden;
        }
        
        .metric-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            border-radius: 6px;
        }
        
        /* Highlight Box */
        .highlight {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 24px;
            border-radius: 16px;
            margin: 32px 0;
            text-align: center;
        }
        
        .highlight-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        /* Quote Block */
        .quote {
            padding: 24px;
            border-left: 4px solid var(--primary);
            background: var(--card-bg);
            margin: 24px 0;
            font-style: italic;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 32px 20px;
            color: var(--text-muted);
            font-size: 13px;
            margin-top: 40px;
            border-top: 1px solid var(--border);
        }
        
        /* Print Styles */
        @media print {
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { padding: 20px !important; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Build a complete infographic with all sections filled with real content -->
    </div>
</body>
</html>

## REMEMBER:
1. RESEARCH the topic thoroughly - include REAL facts, dates, numbers
2. Make it VISUALLY stunning - professional designers would approve
3. Make it INFORMATIVE - readers should learn something valuable
4. Create 5-7 distinct content sections minimum
5. Use the exact color scheme, style, and layout specified
6. Include a compelling title and subtitle in the hero
7. End with "Created with Plainly AI" footer

OUTPUT: Return ONLY the complete HTML. Start with <!DOCTYPE html>`

        const prompt = `Create a PROFESSIONAL-GRADE infographic about: "${topic}"

DESIGN SPECIFICATIONS:
- Style: ${selectedStyle?.label} (${selectedStyle?.desc})
- Colors: ${selectedColors?.label} (${selectedColors?.colors})
- Layout: VERTICAL SCROLL - all sections stacked vertically, full width

⚠️ CRITICAL LAYOUT RULE:
- Content sections must be FULL WIDTH, stacked VERTICALLY (one below another)
- DO NOT put content sections side-by-side in columns
- Only the stats grid (3-4 numbers) can be horizontal
- Each section takes 100% width of container

CONTENT REQUIREMENTS:
- Compelling, creative title (not just topic name)
- Subtitle that hooks the reader
- 3-4 statistics in a horizontal grid (numbers only)
- 5-7 FULL WIDTH content sections stacked vertically
- Each section: emoji icon, bold title, 2-3 sentences of real facts
- Progress bars or metrics where relevant
- End with a quote or key takeaway

QUALITY: Professional agency level design.

Generate complete HTML now.`

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
