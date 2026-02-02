import { useState, useRef, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'
import './Tooltip.css'

function Tooltip({ content, children, position = 'top' }) {
    const [isVisible, setIsVisible] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const tooltipRef = useRef(null)
    const triggerRef = useRef(null)

    // Close on outside click for mobile
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target) &&
                triggerRef.current && !triggerRef.current.contains(e.target)) {
                setIsMobileOpen(false)
            }
        }

        if (isMobileOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isMobileOpen])

    // Close on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsMobileOpen(false)
                setIsVisible(false)
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsMobileOpen(!isMobileOpen)
    }

    return (
        <span className="tooltip-wrapper">
            {children}
            <button
                ref={triggerRef}
                className="tooltip-trigger"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={handleClick}
                aria-label="Show help"
                type="button"
            >
                <HelpCircle size={14} />
            </button>

            {/* Desktop tooltip (hover) */}
            {isVisible && !isMobileOpen && (
                <div className={`tooltip tooltip-${position}`}>
                    {content}
                </div>
            )}

            {/* Mobile tooltip (click) */}
            {isMobileOpen && (
                <div ref={tooltipRef} className="tooltip-mobile">
                    <button
                        className="tooltip-mobile-close"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        <X size={16} />
                    </button>
                    {content}
                </div>
            )}
        </span>
    )
}

// Standalone tooltip button for adding to labels
function TooltipButton({ content, position = 'top' }) {
    const [isVisible, setIsVisible] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const tooltipRef = useRef(null)
    const triggerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target) &&
                triggerRef.current && !triggerRef.current.contains(e.target)) {
                setIsMobileOpen(false)
            }
        }

        if (isMobileOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isMobileOpen])

    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsMobileOpen(!isMobileOpen)
    }

    return (
        <span className="tooltip-btn-wrapper">
            <button
                ref={triggerRef}
                className="tooltip-btn"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={handleClick}
                aria-label="Show help"
                type="button"
            >
                <HelpCircle size={14} />
            </button>

            {isVisible && !isMobileOpen && (
                <div className={`tooltip tooltip-${position}`}>
                    {content}
                </div>
            )}

            {isMobileOpen && (
                <div ref={tooltipRef} className="tooltip-mobile">
                    <button
                        className="tooltip-mobile-close"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        <X size={16} />
                    </button>
                    {content}
                </div>
            )}
        </span>
    )
}

export { Tooltip, TooltipButton }
export default Tooltip
