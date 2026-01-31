import { useState, useMemo } from 'react'
import { FileText } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function MarkdownPreviewer() {
    const [markdown, setMarkdown] = useState(`# Hello World

This is **bold** and this is *italic*.

## Features
- List item 1
- List item 2
- List item 3

\`\`\`
code block
\`\`\`

> This is a blockquote

[Link](https://example.com)
`)

    const html = useMemo(() => {
        // Simple markdown to HTML conversion
        let result = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Code blocks
            .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/gim, '<code>$1</code>')
            // Blockquote
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
            // List items
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            // Line breaks
            .replace(/\n/gim, '<br>')

        return result
    }, [markdown])

    return (
        <CalculatorLayout
            title="Markdown Previewer"
            description="Preview markdown in real-time"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={FileText}
            result={`${markdown.length} chars`}
            resultLabel="Input Length"
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                    <label className="input-label">Markdown</label>
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        rows={12}
                        style={{ fontFamily: 'monospace', fontSize: '13px' }}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Preview</label>
                    <div
                        dangerouslySetInnerHTML={{ __html: html }}
                        style={{
                            background: '#1a1a2e',
                            padding: '16px',
                            borderRadius: '8px',
                            minHeight: '250px',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }}
                    />
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default MarkdownPreviewer
