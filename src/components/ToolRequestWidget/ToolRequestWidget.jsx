import { useState } from 'react'
import { Lightbulb, X, Send, CheckCircle, Loader } from 'lucide-react'
import './ToolRequestWidget.css'

function ToolRequestWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        toolName: '',
        description: '',
        category: 'other',
        email: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://plainly.live').replace(/\/$/, '')
    const FEEDBACK_URL = `${API_BASE_URL}/api/feedback/submit`

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.description.trim()) return

        setSubmitting(true)
        setError('')

        try {
            // Send via Plainly server proxy (keeps provider keys off the client)
            const response = await fetch(FEEDBACK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'tool_request',
                    subject: `💡 Tool Suggestion: ${formData.toolName || 'New Tool Request'}`,
                    from_name: 'Plainly Tool Suggestion',
                    toolName: formData.toolName || '',
                    description: formData.description,
                    category: formData.category,
                    email: formData.email || '',
                    pageUrl: window.location.href,
                    website: ''
                })
            })

            if (response.ok) {
                setSubmitted(true)
                // Reset after 3 seconds
                setTimeout(() => {
                    setSubmitted(false)
                    setIsOpen(false)
                    setFormData({
                        toolName: '',
                        description: '',
                        category: 'other',
                        email: ''
                    })
                }, 3000)
            } else {
                throw new Error('Failed to submit')
            }
        } catch (_err) {
            setError('Failed to submit suggestion. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const categories = [
        { value: 'ai', label: '🤖 AI Tools' },
        { value: 'finance', label: '💰 Finance' },
        { value: 'health', label: '🏥 Health' },
        { value: 'math', label: '🔢 Math' },
        { value: 'converter', label: '🔄 Converter' },
        { value: 'text', label: '📝 Text' },
        { value: 'tech', label: '💻 Tech' },
        { value: 'fun', label: '🎮 Fun' },
        { value: 'other', label: '📦 Other' }
    ]

    return (
        <>
            {/* Floating Button */}
            <button
                className={`tool-request-fab ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Suggest a tool"
                title="Suggest a tool"
            >
                <Lightbulb size={20} />
                <span className="fab-label">Suggest Tool</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="tool-request-overlay" onClick={() => !submitting && setIsOpen(false)}>
                    <div className="tool-request-modal" onClick={e => e.stopPropagation()}>
                        <button
                            className="tool-request-close"
                            onClick={() => !submitting && setIsOpen(false)}
                            disabled={submitting}
                        >
                            <X size={18} />
                        </button>

                        {submitted ? (
                            <div className="tool-request-success">
                                <CheckCircle size={48} className="success-check" />
                                <h3>Thanks for your suggestion!</h3>
                                <p>We'll review it and add it to our roadmap.</p>
                            </div>
                        ) : (
                            <>
                                <div className="tool-request-header">
                                    <Lightbulb size={24} className="header-icon" />
                                    <h3>Suggest a Tool</h3>
                                    <p>Can't find what you need? Tell us!</p>
                                </div>

                                <form onSubmit={handleSubmit} className="tool-request-form">
                                    {/* Tool Name */}
                                    <div className="form-group">
                                        <label htmlFor="toolName">Tool Name (optional)</label>
                                        <input
                                            type="text"
                                            id="toolName"
                                            value={formData.toolName}
                                            onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                                            placeholder="e.g., Mortgage Amortization Chart"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="form-group">
                                        <label htmlFor="category">Category</label>
                                        <select
                                            id="category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div className="form-group">
                                        <label htmlFor="description">Description *</label>
                                        <textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the tool you'd like us to add and how it would help you..."
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label htmlFor="email">Your Email (optional)</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="We'll notify you when it's ready"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="tool-request-error">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="tool-request-submit"
                                        disabled={submitting || !formData.description.trim()}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader size={16} className="spinner" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Submit Suggestion
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ToolRequestWidget
