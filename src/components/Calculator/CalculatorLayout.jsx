import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronLeft, Share2, Star, RotateCcw, Bug } from 'lucide-react'
import { useStorage } from '../../context/StorageContext'
import BugReportModal from '../BugReportModal'
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

    const currentPath = location.pathname
    const isCurrentFavorite = isFavorite(currentPath)

    const handleFavoriteClick = () => {
        toggleFavorite(currentPath)
    }

    const handleShare = async () => {
        const shareUrl = window.location.href
        if (navigator.share) {
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
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl)
                // Could show a toast notification here
            } catch (_err) {
                console.error('Failed to copy URL')
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
                        </div>

                        {/* Additional Result Details */}
                        {resultDetails && (
                            <div className="result-details">
                                {resultDetails}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalculatorLayout

