import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
    const footerLinks = {
        instruments: [
            { name: 'Financial Metrics', path: '/finance' },
            { name: 'Health Analytics', path: '/health' },
            { name: 'Metric Systems', path: '/math' },
            { name: 'Unit Systems', path: '/converter' },
        ],
        company: [
            { name: 'About', path: '/about' },
            { name: 'Privacy', path: '/privacy' },
            { name: 'Terms', path: '/terms' },
            { name: 'Contact', path: '/contact' },
        ],
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon">◇</span>
                            <span className="logo-text">PLAINLY</span>
                        </div>
                        <p className="footer-tagline">
                            Premium calculator suite with
                            mathematical instruments. Minimalist by
                            design, powerful by nature.
                        </p>
                    </div>

                    {/* Instruments Links */}
                    <div className="footer-column">
                        <h4 className="footer-heading">INSTRUMENTS</h4>
                        <nav className="footer-nav">
                            {footerLinks.instruments.map((link) => (
                                <Link key={link.path} to={link.path} className="footer-link">
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Company Links */}
                    <div className="footer-column">
                        <h4 className="footer-heading">COMPANY</h4>
                        <nav className="footer-nav">
                            {footerLinks.company.map((link) => (
                                <Link key={link.path} to={link.path} className="footer-link">
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Popular */}
                    <div className="footer-column">
                        <h4 className="footer-heading">POPULAR</h4>
                        <nav className="footer-nav">
                            <Link to="/mortgage-calculator" className="footer-link">Mortgage Calculator</Link>
                            <Link to="/bmi-calculator" className="footer-link">BMI Calculator</Link>
                            <Link to="/percentage-calculator" className="footer-link">Percentage Calculator</Link>
                            <Link to="/unit-converter" className="footer-link">Unit Converter</Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2024 Plainly. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
