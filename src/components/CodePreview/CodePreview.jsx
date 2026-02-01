import { useState } from 'react'
import { Copy, Check, Download, Code2, FileCode } from 'lucide-react'
import './CodePreview.css'

function CodePreview({ code, language = 'javascript', filename = 'code' }) {
    const [copied, setCopied] = useState(false)
    const [downloaded, setDownloaded] = useState(false)

    // Get file extension based on language
    const getExtension = (lang) => {
        const extensions = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            java: 'java',
            csharp: 'cs',
            cpp: 'cpp',
            c: 'c',
            go: 'go',
            rust: 'rs',
            ruby: 'rb',
            php: 'php',
            swift: 'swift',
            kotlin: 'kt',
            scala: 'scala',
            sql: 'sql',
            html: 'html',
            css: 'css',
            scss: 'scss',
            json: 'json',
            xml: 'xml',
            yaml: 'yml',
            markdown: 'md',
            shell: 'sh',
            bash: 'sh',
            powershell: 'ps1',
            jsx: 'jsx',
            tsx: 'tsx',
            vue: 'vue',
            dart: 'dart',
            r: 'r',
            perl: 'pl',
            lua: 'lua',
            regex: 'txt'
        }
        return extensions[lang?.toLowerCase()] || 'txt'
    }

    // Extract code from markdown code blocks if present
    const extractCode = (rawCode) => {
        if (!rawCode) return ''

        // Match code block pattern: ```language\n...code...\n```
        const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g
        const matches = [...rawCode.matchAll(codeBlockRegex)]

        if (matches.length > 0) {
            // Return all code blocks concatenated
            return matches.map(m => m[1].trim()).join('\n\n')
        }

        return rawCode
    }

    const cleanCode = extractCode(code)
    const lines = cleanCode.split('\n')

    const handleCopy = async () => {
        await navigator.clipboard.writeText(cleanCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const ext = getExtension(language)
        const blob = new Blob([cleanCode], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.${ext}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setDownloaded(true)
        setTimeout(() => setDownloaded(false), 2000)
    }

    if (!code) {
        return (
            <div className="code-preview-placeholder">
                <Code2 size={48} strokeWidth={1} />
                <p>Your code will appear here</p>
                <span>Enter a description and generate</span>
            </div>
        )
    }

    return (
        <div className="code-preview">
            {/* Header */}
            <div className="code-preview-header">
                <div className="code-preview-lang">
                    <FileCode size={14} />
                    <span>{language}</span>
                </div>
                <div className="code-preview-actions">
                    <button
                        onClick={handleCopy}
                        className={`code-action-btn ${copied ? 'success' : ''}`}
                        title="Copy code"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        className={`code-action-btn download ${downloaded ? 'success' : ''}`}
                        title="Download file"
                    >
                        {downloaded ? <Check size={14} /> : <Download size={14} />}
                        <span>{downloaded ? 'Downloaded!' : 'Download'}</span>
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div className="code-preview-content">
                <div className="code-line-numbers">
                    {lines.map((_, i) => (
                        <span key={i}>{i + 1}</span>
                    ))}
                </div>
                <pre className="code-block">
                    <code>{cleanCode}</code>
                </pre>
            </div>

            {/* Footer */}
            <div className="code-preview-footer">
                <span>{lines.length} lines</span>
                <span>•</span>
                <span>{cleanCode.length} characters</span>
            </div>
        </div>
    )
}

export default CodePreview
