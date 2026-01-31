import { useState } from 'react'
import { Mail, MapPin, Send, Check, AlertCircle, ArrowRight } from 'lucide-react'
import emailjs from '@emailjs/browser'
import './Contact.css'

// EmailJS Configuration (using existing CyberNotes setup)
const EMAILJS_SERVICE_ID = 'service_cybernotes'
const EMAILJS_TEMPLATE_ID = 'template_contact'
const EMAILJS_PUBLIC_KEY = 'Sy-Wr2EyFohZ12FaC'

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'message' && value.length > 1000) return
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.message) return

        setStatus('loading')
        setErrorMessage('')

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: 'sahilkazi629@gmail.com'
                },
                EMAILJS_PUBLIC_KEY
            )

            setStatus('success')
            setFormData({ name: '', email: '', message: '' })
        } catch (error) {
            console.error('[Contact] Failed to send message:', error)
            setStatus('error')
            setErrorMessage('Failed to send message. Please try again or email us directly.')
        }
    }

    return (
        <div className="contact-page">
            <div className="container">
                {/* Hero */}
                <section className="contact-hero">
                    <h1 className="contact-title">
                        Get in <span className="italic">Touch</span>
                    </h1>
                    <p className="contact-subtitle">
                        QUESTIONS, FEEDBACK, OR COLLABORATION INQUIRIES
                    </p>
                </section>

                <div className="contact-grid">
                    {/* Info Section */}
                    <div className="contact-info">
                        <h2>How Can We Help?</h2>
                        <p className="contact-desc">
                            Whether you have a question about our calculators, found a bug,
                            or want to suggest a new feature — we're here to help. Plainly
                            Calculate is built with precision in mind, and your feedback
                            helps us improve.
                        </p>

                        <div className="contact-types">
                            <div className="contact-type">
                                <h4>General Inquiries</h4>
                                <p>Questions about our calculators or how to use them</p>
                            </div>
                            <div className="contact-type">
                                <h4>Feature Requests</h4>
                                <p>Suggest new calculators or improvements to existing ones</p>
                            </div>
                            <div className="contact-type">
                                <h4>Bug Reports</h4>
                                <p>Found an issue? Let us know and we'll fix it promptly</p>
                            </div>
                        </div>

                        <div className="contact-details">
                            <a href="mailto:sahilkazi629@gmail.com" className="contact-detail">
                                <Mail size={18} />
                                <span>sahilkazi629@gmail.com</span>
                                <ArrowRight size={14} />
                            </a>
                            <div className="contact-detail">
                                <MapPin size={18} />
                                <span>India</span>
                            </div>
                        </div>

                        <p className="response-time">
                            We typically respond within <strong>24–48 hours</strong>
                        </p>
                    </div>

                    {/* Form Section */}
                    <form className="contact-form" onSubmit={handleSubmit}>
                        {status === 'success' ? (
                            <div className="success-message">
                                <div className="success-icon">
                                    <Check size={32} />
                                </div>
                                <h3>Message Sent!</h3>
                                <p>Thanks for reaching out. We'll get back to you soon.</p>
                                <button
                                    type="button"
                                    className="reset-btn"
                                    onClick={() => setStatus('idle')}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                {status === 'error' && (
                                    <div className="error-message">
                                        <AlertCircle size={18} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">
                                        Message
                                        <span className="char-count">{formData.message.length}/1000</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="What's on your mind?"
                                        required
                                        disabled={status === 'loading'}
                                    ></textarea>
                                </div>

                                <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                                    {status === 'loading' ? (
                                        <span className="loading-spinner"></span>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
