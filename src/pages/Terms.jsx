import { FileText, Check, AlertTriangle, Scale, RefreshCw } from 'lucide-react'
import './Legal.css'

function Terms() {
    return (
        <div className="legal-page">
            <div className="container">
                {/* Hero */}
                <section className="legal-hero">
                    <div className="legal-icon">
                        <FileText size={32} />
                    </div>
                    <h1 className="legal-title">
                        Terms of <span className="italic">Service</span>
                    </h1>
                    <p className="legal-subtitle">
                        SIMPLE, FAIR, AND TRANSPARENT
                    </p>
                    <p className="legal-date">Last updated: January 2025</p>
                </section>

                {/* Summary */}
                <section className="legal-summary">
                    <h2>The Basics</h2>
                    <p>
                        By using Plainly Calculate, you agree to these simple terms. We provide free calculation tools
                        for personal and professional use. Be responsible, use common sense, and we'll all get along just fine.
                    </p>
                </section>

                {/* Sections */}
                <section className="legal-content">
                    <div className="legal-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <Check size={20} />
                            </div>
                            <h3>What You Can Do</h3>
                        </div>
                        <ul className="legal-list">
                            <li>Use any calculator for personal or professional purposes</li>
                            <li>Share links to our calculators</li>
                            <li>Use our tools for educational purposes</li>
                            <li>Access the site from any device</li>
                            <li>Provide feedback and suggestions</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <AlertTriangle size={20} />
                            </div>
                            <h3>Disclaimer</h3>
                        </div>
                        <p>
                            While we strive for accuracy in all our calculators, Plainly Calculate is provided "as is"
                            without warranties of any kind. Our calculators are designed for general informational purposes.
                        </p>
                        <p className="legal-important">
                            <strong>Important:</strong> Do not use these calculators as the sole basis for financial,
                            medical, or legal decisions. Always consult with qualified professionals for important matters.
                        </p>
                    </div>

                    <div className="legal-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <Scale size={20} />
                            </div>
                            <h3>Limitation of Liability</h3>
                        </div>
                        <p>
                            Plainly Calculate and its creator shall not be held liable for any damages or losses
                            arising from the use of our calculators. You use our tools at your own discretion and risk.
                        </p>
                    </div>

                    <div className="legal-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <RefreshCw size={20} />
                            </div>
                            <h3>Changes to Terms</h3>
                        </div>
                        <p>
                            We may update these terms occasionally. Continued use of Plainly Calculate after changes
                            constitutes acceptance of the new terms. We'll update the "Last updated" date when changes are made.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <section className="legal-contact">
                    <h3>Questions?</h3>
                    <p>
                        If you have any questions about these terms, please contact us at{' '}
                        <a href="mailto:peakliterature@gmail.com">peakliterature@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    )
}

export default Terms
