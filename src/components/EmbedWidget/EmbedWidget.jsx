import { useState } from 'react'
import { Code, Copy, Check, X, ExternalLink } from 'lucide-react'
import './EmbedWidget.css'

function EmbedWidget({ title, toolPath, onClose }) {
    const [copied, setCopied] = useState(false)
    const [embedSize, setEmbedSize] = useState('medium')

    const baseUrl = 'https://plainly.live'
    const embedUrl = `${baseUrl}${toolPath}?embed=true`

    const sizes = {
        small: { width: 320, height: 400 },
        medium: { width: 480, height: 500 },
        large: { width: 640, height: 600 },
        responsive: { width: '100%', height: 500 }
    }

    const currentSize = sizes[embedSize]

    const embedCode = embedSize === 'responsive'
        ? `<iframe 
  src="${embedUrl}"
  width="100%"
  height="${currentSize.height}"
  frameborder="0"
  style="border: 1px solid #333; border-radius: 12px; max-width: 100%;"
  title="${title} - Plainly Tools"
  loading="lazy"
></iframe>`.trim()
        : `<iframe 
  src="${embedUrl}"
  width="${currentSize.width}"
  height="${currentSize.height}"
  frameborder="0"
  style="border: 1px solid #333; border-radius: 12px;"
  title="${title} - Plainly Tools"
  loading="lazy"
></iframe>`.trim()

    const copyEmbedCode = async () => {
        try {
            await navigator.clipboard.writeText(embedCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="embed-modal-overlay" onClick={onClose}>
            <div className="embed-modal" onClick={e => e.stopPropagation()}>
                <button className="embed-modal-close" onClick={onClose}>
                    <X size={18} />
                </button>

                <div className="embed-modal-header">
                    <Code size={24} className="embed-modal-icon" />
                    <h3>Embed this Tool</h3>
                    <p>Add "{title}" to your website</p>
                </div>

                {/* Size Options */}
                <div className="embed-size-options">
                    <span className="embed-size-label">Size:</span>
                    <div className="embed-size-buttons">
                        {Object.keys(sizes).map(size => (
                            <button
                                key={size}
                                className={`embed-size-btn ${embedSize === size ? 'active' : ''}`}
                                onClick={() => setEmbedSize(size)}
                            >
                                {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="embed-preview">
                    <div
                        className="embed-preview-frame"
                        style={{
                            width: embedSize === 'responsive' ? '100%' : Math.min(currentSize.width, 400),
                            height: Math.min(currentSize.height, 300),
                            maxWidth: '100%'
                        }}
                    >
                        <div className="embed-preview-content">
                            <span className="embed-preview-title">{title}</span>
                            <span className="embed-preview-placeholder">Widget Preview</span>
                        </div>
                    </div>
                </div>

                {/* Code Block */}
                <div className="embed-code-section">
                    <div className="embed-code-header">
                        <span>Embed Code</span>
                        <a
                            href={embedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="embed-preview-link"
                        >
                            Preview <ExternalLink size={12} />
                        </a>
                    </div>
                    <pre className="embed-code-block">
                        <code>{embedCode}</code>
                    </pre>
                    <button
                        className={`embed-copy-btn ${copied ? 'copied' : ''}`}
                        onClick={copyEmbedCode}
                    >
                        {copied ? (
                            <>
                                <Check size={16} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                Copy Embed Code
                            </>
                        )}
                    </button>
                </div>

                <p className="embed-note">
                    By embedding this tool, you agree to our terms of use.
                    The widget will include Plainly branding.
                </p>
            </div>
        </div>
    )
}

export default EmbedWidget
