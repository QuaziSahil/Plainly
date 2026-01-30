import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Share2, Bookmark, RotateCcw } from 'lucide-react'
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

    return (
        <div className="calculator-page">
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
                    {Icon && (
                        <div className="calc-icon">
                            <Icon size={24} />
                        </div>
                    )}
                    <h1 className="calc-title">{title}</h1>
                    <p className="calc-description">{description}</p>
                    <div className="calc-actions">
                        <button className="action-btn" aria-label="Share">
                            <Share2 size={18} />
                        </button>
                        <button className="action-btn" aria-label="Bookmark">
                            <Bookmark size={18} />
                        </button>
                        {onReset && (
                            <button className="action-btn" onClick={onReset} aria-label="Reset">
                                <RotateCcw size={18} />
                            </button>
                        )}
                    </div>
                </header>

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
