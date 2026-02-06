import { useState } from 'react'
import { X, Send, Bug, CheckCircle } from 'lucide-react'

function BugReportModal({ isOpen, onClose, calculatorName }) {
    const [formData, setFormData] = useState({
        issueType: 'bug',
        description: '',
        expectedBehavior: '',
        steps: '',
        email: '',
        browser: navigator.userAgent
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://plainly.live').replace(/\/$/, '')
    const FEEDBACK_URL = `${API_BASE_URL}/api/feedback/submit`

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            // Send via Plainly server proxy (keeps provider keys off the client)
            const response = await fetch(FEEDBACK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'bug_report',
                    subject: `🐛 Bug Report: ${calculatorName}`,
                    from_name: 'Plainly Bug Report',
                    calculatorName: calculatorName,
                    calculatorUrl: window.location.href,
                    issueType: formData.issueType,
                    description: formData.description,
                    expectedBehavior: formData.expectedBehavior,
                    steps: formData.steps,
                    email: formData.email || '',
                    browser: formData.browser,
                    website: ''
                })
            })

            if (response.ok) {
                setSubmitted(true)
                setTimeout(() => {
                    onClose()
                    setSubmitted(false)
                    setFormData({
                        issueType: 'bug',
                        description: '',
                        expectedBehavior: '',
                        steps: '',
                        email: '',
                        browser: navigator.userAgent
                    })
                }, 2000)
            } else {
                throw new Error('Failed to submit')
            }
        } catch (_err) {
            setError('Failed to submit report. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                background: '#1a1a1a',
                borderRadius: '16px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                border: '1px solid #333'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    borderBottom: '1px solid #333'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Bug size={24} color="#ef4444" />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px' }}>Report an Issue</h2>
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>{calculatorName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                {submitted ? (
                    <div style={{
                        padding: '60px 20px',
                        textAlign: 'center'
                    }}>
                        <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: 0, color: '#22c55e' }}>Thank you!</h3>
                        <p style={{ opacity: 0.6 }}>Your report has been submitted.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                        {/* Issue Type */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: 500
                            }}>
                                Issue Type
                            </label>
                            <select
                                value={formData.issueType}
                                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    background: '#0a0a0a',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="bug">🐛 Bug / Error</option>
                                <option value="calculation">🔢 Wrong Calculation</option>
                                <option value="ui">🎨 UI/Design Issue</option>
                                <option value="performance">⚡ Performance Issue</option>
                                <option value="feature">💡 Feature Request</option>
                                <option value="other">📝 Other</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: 500
                            }}>
                                Describe the Issue *
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What went wrong? Be as specific as possible..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    background: '#0a0a0a',
                                    color: 'white',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Expected Behavior */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: 500
                            }}>
                                Expected Behavior
                            </label>
                            <textarea
                                value={formData.expectedBehavior}
                                onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                                placeholder="What did you expect to happen?"
                                rows={2}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    background: '#0a0a0a',
                                    color: 'white',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Steps to Reproduce */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: 500
                            }}>
                                Steps to Reproduce
                            </label>
                            <textarea
                                value={formData.steps}
                                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                                placeholder="1. Enter value X&#10;2. Click button Y&#10;3. See error..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    background: '#0a0a0a',
                                    color: 'white',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '4px',
                                fontSize: '14px',
                                fontWeight: 500
                            }}>
                                Your Email (optional)
                            </label>
                            <p style={{
                                margin: '0 0 8px 0',
                                fontSize: '12px',
                                color: '#a78bfa',
                                opacity: 0.9
                            }}>
                                📧 We'll notify you when this issue is fixed
                            </p>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email for fix notification"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    background: '#0a0a0a',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Browser Info */}
                        <div style={{
                            marginBottom: '20px',
                            padding: '12px',
                            background: '#0a0a0a',
                            borderRadius: '8px',
                            fontSize: '11px',
                            opacity: 0.5
                        }}>
                            📱 Browser info will be included automatically
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px',
                                background: '#ef444420',
                                borderRadius: '8px',
                                color: '#ef4444',
                                marginBottom: '16px',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: submitting ? '#333' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: submitting ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Send size={18} />
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default BugReportModal
