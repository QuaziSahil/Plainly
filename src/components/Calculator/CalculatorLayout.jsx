import { useState, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronLeft, Share2, Star, RotateCcw, Bug, Copy, Check, Link2, X, Twitter, Facebook, Linkedin, Mail, Download, Code } from 'lucide-react'
import { useStorage } from '../../context/StorageContext'
import { allCalculators } from '../../data/calculators'
import BugReportModal from '../BugReportModal'
import ExportResult from '../ExportResult/ExportResult'
import EmbedWidget from '../EmbedWidget/EmbedWidget'
import './CalculatorLayout.css'

function CalculatorLayout({
    title,
    description,
    category,
    categoryPath,
    icon: Icon,
    children,
    result,
    resultLabel,
    resultUnit,
    resultDetails,
    onReset
}) {
    const navigate = useNavigate()
    const location = useLocation()
    const { isFavorite, toggleFavorite } = useStorage()
    const [showBugReport, setShowBugReport] = useState(false)
    const [showCopied, setShowCopied] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [showLinkCopied, setShowLinkCopied] = useState(false)
    const [showExport, setShowExport] = useState(false)
    const [showEmbed, setShowEmbed] = useState(false)


    const currentPath = location.pathname
    const isCurrentFavorite = isFavorite(currentPath)

    // Get related tools from same category (max 4)
    const relatedTools = useMemo(() => {
        return allCalculators
            .filter(calc => calc.category === category && calc.path !== currentPath)
            .slice(0, 4)
    }, [category, currentPath])

    const handleFavoriteClick = () => {
        toggleFavorite(currentPath)
    }

    const shareUrl = window.location.href

    const handleShare = async () => {
        // On mobile, use native share if available
        if (navigator.share && window.matchMedia('(max-width: 768px)').matches) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: shareUrl,
                })
            } catch (_err) {
                // User cancelled or share failed
            }
        } else {
            // On desktop, show share modal
            setShowShareModal(true)
        }
    }

    const copyShareLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setShowLinkCopied(true)
            setTimeout(() => setShowLinkCopied(false), 2000)
        } catch (_err) {
            console.error('Failed to copy URL')
        }
    }

    const socialShareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this ${title}!`)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(`${title} - Plainly Tools`)}&body=${encodeURIComponent(`${description}\n\nCheck it out: ${shareUrl}`)}`
    }

    const handleCopyResult = async () => {
        const textToCopy = result ? `${result}${resultUnit ? ' ' + resultUnit : ''}` : ''
        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy)
                setShowCopied(true)
                setTimeout(() => setShowCopied(false), 2000)
            } catch (_err) {
                console.error('Failed to copy result')
            }
        }
    }

    return (
        <div className="calculator-page">
            {/* Dynamic SEO Meta Tags */}
            <Helmet>
                <title>{title} - Free Online Calculator | Plainly Tools</title>
                <meta name="description" content={`${description} Use this free ${title.toLowerCase()} tool online at Plainly Tools.`} />
                <meta property="og:title" content={`${title} | Plainly Tools`} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={`https://www.plainly.live${currentPath}`} />
                <meta name="twitter:title" content={`${title} | Plainly Tools`} />
                <meta name="twitter:description" content={description} />
                <link rel="canonical" href={`https://www.plainly.live${currentPath}`} />
            </Helmet>

            <div className="container">
                {/* Breadcrumb */}
                <div className="calc-breadcrumb">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ChevronLeft size={16} />
                    </button>
                    <Link to={categoryPath || '/'} className="breadcrumb-link">
                        {category}
                    </Link>
                </div>

                {/* Header */}
                <header className="calc-header">
                    <div className="calc-header-main">
                        {Icon && (
                            <div className="calc-icon">
                                <Icon size={24} />
                            </div>
                        )}
                        <div className="calc-header-text">
                            <h1 className="calc-title">{title}</h1>
                            <p className="calc-description">{description}</p>
                        </div>
                    </div>
                    <div className="calc-actions">
                        <button className="action-btn" onClick={handleShare} aria-label="Share">
                            <Share2 size={18} />
                        </button>
                        <button
                            className={`action-btn ${isCurrentFavorite ? 'active' : ''}`}
                            onClick={handleFavoriteClick}
                            aria-label={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Star size={18} fill={isCurrentFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            className="action-btn"
                            onClick={onReset || (() => window.location.reload())}
                            aria-label="Reset"
                            title="Reset values"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            className="action-btn bug-report-btn"
                            onClick={() => setShowBugReport(true)}
                            aria-label="Report Bug"
                            title="Report an issue"
                        >
                            <Bug size={18} />
                        </button>
                    </div>
                </header>

                {/* Bug Report Modal */}
                <BugReportModal
                    isOpen={showBugReport}
                    onClose={() => setShowBugReport(false)}
                    calculatorName={title}
                    calculatorPath={currentPath}
                />

                {/* Share Modal */}
                {showShareModal && (
                    <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
                        <div className="share-modal" onClick={e => e.stopPropagation()}>
                            <button
                                className="share-modal-close"
                                onClick={() => setShowShareModal(false)}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>

                            <div className="share-modal-header">
                                <Share2 size={24} className="share-modal-icon" />
                                <h3>Share this tool</h3>
                                <p>Share "{title}" with others</p>
                            </div>

                            {/* Copy Link Section */}
                            <div className="share-link-box">
                                <div className="share-link-url">
                                    <Link2 size={16} />
                                    <span>{shareUrl}</span>
                                </div>
                                <button
                                    className={`share-copy-btn ${showLinkCopied ? 'copied' : ''}`}
                                    onClick={copyShareLink}
                                >
                                    {showLinkCopied ? (
                                        <>
                                            <Check size={16} />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Social Share Buttons */}
                            <div className="share-social">
                                <span className="share-social-label">Share on</span>
                                <div className="share-social-buttons">
                                    <a
                                        href={socialShareLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-social-btn twitter"
                                        aria-label="Share on Twitter"
                                    >
                                        <Twitter size={18} />
                                    </a>
                                    <a
                                        href={socialShareLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-social-btn facebook"
                                        aria-label="Share on Facebook"
                                    >
                                        <Facebook size={18} />
                                    </a>
                                    <a
                                        href={socialShareLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-social-btn linkedin"
                                        aria-label="Share on LinkedIn"
                                    >
                                        <Linkedin size={18} />
                                    </a>
                                    <a
                                        href={socialShareLinks.email}
                                        className="share-social-btn email"
                                        aria-label="Share via Email"
                                    >
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Main Content Grid */}
                <div className="calc-grid">
                    {/* Left: Parameters */}
                    <div className="calc-parameters">
                        <h2 className="section-label">Parameters</h2>
                        <div className="parameters-content">
                            {children}
                        </div>
                    </div>

                    {/* Right: Result */}
                    <div className="calc-result-section">
                        <h2 className="section-label">{resultLabel || 'Result'}</h2>
                        <div className="result-card">
                            <div className="result-display">
                                <span className="result-value">{result || '0'}</span>
                                {resultUnit && <span className="result-unit">{resultUnit}</span>}
                            </div>
                            {result && (
                                <div className="result-actions">
                                    <button
                                        className={`result-action-btn ${showCopied ? 'copied' : ''}`}
                                        onClick={handleCopyResult}
                                        aria-label="Copy result"
                                        title={showCopied ? 'Copied!' : 'Copy result'}
                                    >
                                        {showCopied ? <Check size={16} /> : <Copy size={16} />}
                                        <span>{showCopied ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                    <button
                                        className="result-action-btn export"
                                        onClick={() => setShowExport(true)}
                                        aria-label="Export result"
                                        title="Export result"
                                    >
                                        <Download size={16} />
                                        <span>Export</span>
                                    </button>
                                    <button
                                        className="result-action-btn embed"
                                        onClick={() => setShowEmbed(true)}
                                        aria-label="Embed tool"
                                        title="Embed this tool"
                                    >
                                        <Code size={16} />
                                        <span>Embed</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Additional Result Details */}
                        {resultDetails && (
                            <div className="result-details">
                                {resultDetails}
                            </div>
                        )}
                    </div>
                </div>

                {/* Export Modal */}
                {showExport && (
                    <ExportResult
                        title={title}
                        result={result}
                        resultUnit={resultUnit}
                        resultDetails={typeof resultDetails === 'object' ? null : resultDetails}
                        onClose={() => setShowExport(false)}
                    />
                )}

                {/* Embed Modal */}
                {showEmbed && (
                    <EmbedWidget
                        title={title}
                        toolPath={currentPath}
                        onClose={() => setShowEmbed(false)}
                    />
                )}
                {relatedTools.length > 0 && (
                    <section className="related-tools-section">
                        <h3 className="related-tools-title">Related Tools</h3>
                        <div className="related-tools-grid">
                            {relatedTools.map((tool) => {
                                const ToolIcon = tool.icon
                                return (
                                    <Link
                                        key={tool.path}
                                        to={tool.path}
                                        className="related-tool-card"
                                    >
                                        <div className="related-tool-icon">
                                            <ToolIcon size={18} />
                                        </div>
                                        <div className="related-tool-info">
                                            <span className="related-tool-name">{tool.name}</span>
                                            <span className="related-tool-desc">{tool.description}</span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

export default CalculatorLayout

