import { useState, useCallback } from 'react'
import { Download, FileText, File, X, Loader, Check } from 'lucide-react'
import './ExportResult.css'

// Convert markdown to beautifully styled HTML for PDF
function markdownToStyledHtml(markdown) {
    if (!markdown) return ''

    const lines = markdown.split('\n')
    const result = []
    let sectionNumber = 0
    let questionNumber = 0

    lines.forEach((line, index) => {
        const trimmed = line.trim()

        // Skip empty lines
        if (!trimmed) {
            result.push('<div class="spacer"></div>')
            return
        }

        // Dividers (=== or ---)
        if (/^[=]{3,}$/.test(trimmed)) {
            result.push('<hr class="section-divider">')
            return
        }
        if (/^[-]{3,}$/.test(trimmed)) {
            result.push('<hr>')
            return
        }

        // H1: # Header
        const h1Match = trimmed.match(/^#\s+(.+)$/)
        if (h1Match) {
            result.push(`<h1 class="main-title">${cleanInlineMarkdown(h1Match[1])}</h1>`)
            return
        }

        // H2: ## Header (with numbered badge)
        const h2Match = trimmed.match(/^##\s+(.+)$/)
        if (h2Match) {
            sectionNumber++
            result.push(`<h2 class="section-header"><span class="section-badge">${sectionNumber}</span>${cleanInlineMarkdown(h2Match[1])}</h2>`)
            return
        }

        // H3: ### Header
        const h3Match = trimmed.match(/^###\s+(.+)$/)
        if (h3Match) {
            result.push(`<h3 class="sub-header">${cleanInlineMarkdown(h3Match[1])}</h3>`)
            return
        }

        // H4: #### Header
        const h4Match = trimmed.match(/^####\s+(.+)$/)
        if (h4Match) {
            result.push(`<h4 class="sub-sub-header">${cleanInlineMarkdown(h4Match[1])}</h4>`)
            return
        }

        // Numbered section like "1. Key Concepts"
        const numberedSectionMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
        if (numberedSectionMatch && !trimmed.match(/^[a-d]\)/i)) {
            const num = numberedSectionMatch[1]
            const text = cleanInlineMarkdown(numberedSectionMatch[2])
            // Check if it's a major section (short text, likely a title)
            if (text.length < 60 && !text.includes(':')) {
                result.push(`<h2 class="section-header"><span class="section-badge">${num}</span>${text}</h2>`)
            } else {
                result.push(`<div class="numbered-item"><span class="number-badge">${num}</span><span class="item-text">${text}</span></div>`)
            }
            return
        }

        // Bullet points: * item, - item, • item
        const bulletMatch = trimmed.match(/^[\*\-•]\s+(.+)$/)
        if (bulletMatch) {
            result.push(`<div class="bullet-item"><span class="bullet-dot"></span><span class="bullet-text">${cleanInlineMarkdown(bulletMatch[1])}</span></div>`)
            return
        }

        // Answer choices: a) b) c) d) or A) B) C) D)
        const choiceMatch = trimmed.match(/^([a-dA-D])[)]\s+(.+)$/)
        if (choiceMatch) {
            result.push(`<div class="choice-item"><span class="choice-badge">${choiceMatch[1].toLowerCase()}</span><span class="choice-text">${cleanInlineMarkdown(choiceMatch[2])}</span></div>`)
            return
        }

        // Question detection
        if (/^(Question\s*\d*|Q\d+)/i.test(trimmed)) {
            questionNumber++
            const questionText = trimmed.replace(/^(Question\s*\d*:?\s*|Q\d+:?\s*)/i, '')
            result.push(`<div class="question-box"><span class="question-badge">${questionNumber}</span><span class="question-text">${cleanInlineMarkdown(questionText)}</span></div>`)
            return
        }

        // Answer detection
        if (/^Answer:/i.test(trimmed)) {
            const answerText = trimmed.replace(/^Answer:\s*/i, '')
            result.push(`<div class="answer-box"><span class="answer-label">✓ ANSWER</span><div class="answer-text">${cleanInlineMarkdown(answerText)}</div></div>`)
            return
        }

        // Regular paragraph
        result.push(`<p class="paragraph">${cleanInlineMarkdown(trimmed)}</p>`)
    })

    return result.join('\n')
}

// Clean inline markdown (bold, italic, code)
function cleanInlineMarkdown(text) {
    if (!text) return ''

    // Bold with **
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>')

    // Italic with *
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>')

    return text
}

function ExportResult({
    title,
    result,
    resultUnit,
    resultDetails,
    fullContent,
    onClose
}) {
    const [exporting, setExporting] = useState(false)
    const [exported, setExported] = useState(false)
    const [exportType, setExportType] = useState(null)

    // Get the full content to export
    const getExportContent = useCallback(() => {
        let content = `${title}\n${'='.repeat(title.length)}\n\n`

        if (fullContent) {
            content += fullContent
        } else {
            if (result) {
                content += `Result: ${result}${resultUnit ? ' ' + resultUnit : ''}\n\n`
            }

            if (resultDetails) {
                if (typeof resultDetails === 'string') {
                    content += resultDetails
                } else if (Array.isArray(resultDetails)) {
                    content += 'Details:\n'
                    resultDetails.forEach(detail => {
                        if (detail.label && detail.value) {
                            content += `• ${detail.label}: ${detail.value}\n`
                        } else if (typeof detail === 'string') {
                            content += `• ${detail}\n`
                        }
                    })
                }
            }
        }

        content += `\n\n---\nGenerated by Plainly Tools\nhttps://plainly.live${window.location.pathname}\nDate: ${new Date().toLocaleString()}`

        return content
    }, [title, result, resultUnit, resultDetails, fullContent])

    // Export as text file
    const exportAsText = useCallback(() => {
        setExporting(true)
        setExportType('text')

        try {
            const content = getExportContent()

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-result.txt`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)

            setExported(true)
            setTimeout(() => {
                setExported(false)
                setExporting(false)
                setExportType(null)
            }, 2000)

        } catch (err) {
            console.error('Export failed:', err)
            setExporting(false)
            setExportType(null)
        }
    }, [title, getExportContent])

    // Export as PDF with beautiful styling
    const exportAsPDF = useCallback(() => {
        setExporting(true)
        setExportType('pdf')

        try {
            const rawContent = fullContent || (typeof resultDetails === 'string' ? resultDetails : '')
            const formattedContent = markdownToStyledHtml(rawContent)

            const printWindow = window.open('', '_blank')

            if (!printWindow) {
                alert('Please allow pop-ups to export as PDF')
                setExporting(false)
                setExportType(null)
                return
            }

            const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title} - Plainly Tools</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', system-ui, sans-serif;
            padding: 40px 48px;
            line-height: 1.7;
            color: #1f2937;
            background: #fff;
            max-width: 850px;
            margin: 0 auto;
        }
        
        /* Header */
        .pdf-header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 3px solid #7c3aed;
        }
        
        .pdf-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 6px;
        }
        
        .pdf-header .subtitle {
            font-size: 13px;
            color: #6b7280;
        }
        
        /* Main Title */
        .main-title {
            font-size: 26px;
            font-weight: 700;
            color: #1f2937;
            margin: 24px 0 16px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        /* Section Headers with Badge */
        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 20px;
            font-weight: 600;
            color: #7c3aed;
            margin: 28px 0 16px 0;
        }
        
        .section-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
            color: white;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 700;
        }
        
        /* Sub Headers */
        .sub-header {
            font-size: 17px;
            font-weight: 600;
            color: #4b5563;
            margin: 20px 0 10px 0;
        }
        
        .sub-sub-header {
            font-size: 15px;
            font-weight: 600;
            color: #6b7280;
            margin: 16px 0 8px 0;
        }
        
        /* Paragraphs */
        .paragraph {
            font-size: 14px;
            line-height: 1.8;
            color: #374151;
            margin: 10px 0;
        }
        
        /* Numbered Items */
        .numbered-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 16px;
            margin: 10px 0;
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
            border-radius: 10px;
            border: 1px solid #ddd6fe;
        }
        
        .number-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 26px;
            height: 26px;
            background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
            color: white;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 700;
            flex-shrink: 0;
        }
        
        .item-text {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
        }
        
        /* Bullet Items */
        .bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 16px;
            margin: 6px 0 6px 16px;
            border-left: 3px solid #a78bfa;
            background: #faf5ff;
        }
        
        .bullet-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #a78bfa, #7c3aed);
            border-radius: 50%;
            margin-top: 6px;
            flex-shrink: 0;
        }
        
        .bullet-text {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
        }
        
        /* Answer Choices */
        .choice-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 8px 14px;
            margin: 4px 0 4px 20px;
        }
        
        .choice-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 600;
            color: #4b5563;
            flex-shrink: 0;
        }
        
        .choice-text {
            font-size: 14px;
            line-height: 1.5;
            color: #374151;
        }
        
        /* Question Box */
        .question-box {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 16px 20px;
            margin: 20px 0 12px 0;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 12px;
            border: 1px solid #93c5fd;
        }
        
        .question-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            flex-shrink: 0;
        }
        
        .question-text {
            font-size: 15px;
            font-weight: 500;
            line-height: 1.6;
            color: #1e40af;
        }
        
        /* Answer Box */
        .answer-box {
            padding: 14px 20px;
            margin: 8px 0 20px 0;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-radius: 12px;
            border: 1px solid #86efac;
        }
        
        .answer-label {
            display: inline-block;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 4px;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .answer-text {
            font-size: 15px;
            font-weight: 500;
            color: #166534;
        }
        
        /* Dividers */
        hr {
            border: none;
            height: 1px;
            background: #e5e7eb;
            margin: 20px 0;
        }
        
        hr.section-divider {
            height: 3px;
            background: linear-gradient(90deg, #a78bfa, #7c3aed, #a78bfa);
            margin: 28px 0;
        }
        
        /* Inline Styles */
        strong {
            font-weight: 600;
            color: #1f2937;
        }
        
        em {
            font-style: italic;
            color: #6b7280;
        }
        
        code {
            background: #f3e8ff;
            color: #7c3aed;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 13px;
        }
        
        .spacer {
            height: 8px;
        }
        
        /* Footer */
        .pdf-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }
        
        .pdf-footer .logo {
            font-size: 14px;
            font-weight: 600;
            color: #7c3aed;
            margin-bottom: 4px;
        }
        
        .pdf-footer a {
            color: #7c3aed;
            text-decoration: none;
        }
        
        @media print {
            body { 
                padding: 20px;
                max-width: 100%;
            }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="pdf-header">
        <h1>${title}</h1>
        <p class="subtitle">Generated by Plainly Tools</p>
    </div>
    
    <div class="content">
        ${formattedContent}
    </div>
    
    <div class="pdf-footer">
        <p class="logo">📊 Plainly Tools</p>
        <p><a href="https://plainly.live${window.location.pathname}">${window.location.href}</a></p>
        <p>${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
    </div>
    
    <script>
        window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
            window.onafterprint = function() { window.close(); };
        }
    </script>
</body>
</html>`

            printWindow.document.write(htmlContent)
            printWindow.document.close()

            setExported(true)
            setTimeout(() => {
                setExported(false)
                setExporting(false)
                setExportType(null)
            }, 2000)

        } catch (err) {
            console.error('Export failed:', err)
            setExporting(false)
            setExportType(null)
        }
    }, [title, result, resultUnit, resultDetails, fullContent])

    // Preview content
    const previewContent = fullContent
        ? fullContent.substring(0, 200) + (fullContent.length > 200 ? '...' : '')
        : (typeof resultDetails === 'string'
            ? resultDetails.substring(0, 200) + (resultDetails.length > 200 ? '...' : '')
            : `${result || ''}${resultUnit ? ' ' + resultUnit : ''}`)

    return (
        <div className="export-modal-overlay" onClick={onClose}>
            <div className="export-modal" onClick={e => e.stopPropagation()}>
                <button className="export-modal-close" onClick={onClose}>
                    <X size={18} />
                </button>

                <div className="export-modal-header">
                    <Download size={24} className="export-modal-icon" />
                    <h3>Export Result</h3>
                    <p>Download your result as a file</p>
                </div>

                <div className="export-preview">
                    <div className="export-preview-card">
                        <span className="export-preview-title">{title}</span>
                        <div className="export-preview-content">
                            {previewContent}
                        </div>
                        <span className="export-preview-brand">plainly.live</span>
                    </div>
                </div>

                <div className="export-options">
                    <button
                        className={`export-option ${exported && exportType === 'text' ? 'success' : ''}`}
                        onClick={exportAsText}
                        disabled={exporting}
                    >
                        {exporting && exportType === 'text' ? (
                            <Loader size={20} className="spinner" />
                        ) : exported && exportType === 'text' ? (
                            <Check size={20} />
                        ) : (
                            <FileText size={20} />
                        )}
                        <div className="export-option-text">
                            <span className="export-option-title">
                                {exported && exportType === 'text' ? 'Downloaded!' : 'Save as Text'}
                            </span>
                            <span className="export-option-desc">Plain text file (.txt)</span>
                        </div>
                    </button>

                    <button
                        className={`export-option ${exported && exportType === 'pdf' ? 'success' : ''}`}
                        onClick={exportAsPDF}
                        disabled={exporting}
                    >
                        {exporting && exportType === 'pdf' ? (
                            <Loader size={20} className="spinner" />
                        ) : exported && exportType === 'pdf' ? (
                            <Check size={20} />
                        ) : (
                            <File size={20} />
                        )}
                        <div className="export-option-text">
                            <span className="export-option-title">
                                {exported && exportType === 'pdf' ? 'Downloaded!' : 'Save as PDF'}
                            </span>
                            <span className="export-option-desc">Beautifully formatted PDF</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExportResult
