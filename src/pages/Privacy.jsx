import { Shield, Eye, Database, Lock, Globe, Bell } from 'lucide-react'
import './Legal.css'

function Privacy() {
    const sections = [
        {
            icon: Eye,
            title: 'No Tracking',
            content: `Plainly Calculate does not use cookies, analytics trackers, or any form of user tracking. 
            We don't know who you are, what you calculate, or when you visit. That's intentional.`
        },
        {
            icon: Database,
            title: 'No Data Collection',
            content: `All calculations happen entirely in your browser. Your inputs, outputs, and any numbers 
            you enter never leave your device. We have no servers storing your data because we never receive it.`
        },
        {
            icon: Lock,
            title: 'Local Processing',
            content: `Every calculator runs client-side JavaScript. This means your calculations are processed 
            on your own computer or phone — not on our servers. This is the most private way to build a calculator.`
        },
        {
            icon: Globe,
            title: 'Third-Party Services',
            content: `We use Cloudflare for hosting and CDN services. Cloudflare may collect minimal technical 
            data (like IP addresses) for security and performance purposes. We do not control this data and 
            it is subject to Cloudflare's privacy policy.`
        },
        {
            icon: Bell,
            title: 'Contact Form',
            content: `If you use our contact form, we receive your name, email, and message through EmailJS. 
            This information is used solely to respond to your inquiry. We do not add you to any mailing lists 
            or share your contact information.`
        }
    ]

    return (
        <div className="legal-page">
            <div className="container">
                {/* Hero */}
                <section className="legal-hero">
                    <div className="legal-icon">
                        <Shield size={32} />
                    </div>
                    <h1 className="legal-title">
                        Privacy <span className="italic">Policy</span>
                    </h1>
                    <p className="legal-subtitle">
                        YOUR DATA STAYS WITH YOU — ALWAYS
                    </p>
                    <p className="legal-date">Last updated: January 2025</p>
                </section>

                {/* Summary */}
                <section className="legal-summary">
                    <h2>The Short Version</h2>
                    <p>
                        We don't collect your data. We don't track you. We don't use cookies.
                        All calculations happen in your browser. Your privacy is not just protected — it's guaranteed by design.
                    </p>
                </section>

                {/* Sections */}
                <section className="legal-content">
                    {sections.map((section, index) => (
                        <div key={index} className="legal-section">
                            <div className="section-header">
                                <div className="section-icon">
                                    <section.icon size={20} />
                                </div>
                                <h3>{section.title}</h3>
                            </div>
                            <p>{section.content}</p>
                        </div>
                    ))}
                </section>

                {/* Contact */}
                <section className="legal-contact">
                    <h3>Questions?</h3>
                    <p>
                        If you have any questions about our privacy practices, please contact us at{' '}
                        <a href="mailto:peakliterature@gmail.com">peakliterature@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    )
}

export default Privacy
