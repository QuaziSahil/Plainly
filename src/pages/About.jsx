import { Calculator, Heart, Brain, ArrowRightLeft, Sparkles, Shield, Zap } from 'lucide-react'
import './About.css'

function About() {
    const features = [
        {
            icon: Sparkles,
            title: 'Precision First',
            description: 'Every calculator is built with mathematical accuracy at its core. No approximations, no shortcuts.'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Instant calculations with no loading screens. Just pure, immediate results when you need them.'
        },
        {
            icon: Shield,
            title: 'Privacy Focused',
            description: 'All calculations happen locally in your browser. Your data never leaves your device.'
        }
    ]

    const categories = [
        { icon: Calculator, name: 'Finance', count: '8+ Tools', desc: 'Mortgages, investments, loans, and more' },
        { icon: Heart, name: 'Health', count: '6+ Tools', desc: 'BMI, calories, macros, and fitness trackers' },
        { icon: Brain, name: 'Mathematics', count: '6+ Tools', desc: 'Percentages, fractions, and advanced math' },
        { icon: ArrowRightLeft, name: 'Converters', count: '6+ Tools', desc: 'Units, currencies, and measurements' }
    ]

    return (
        <div className="about-page">
            <div className="container">
                {/* Hero */}
                <section className="about-hero">
                    <h1 className="about-title">
                        About <span className="italic">Plainly</span>
                    </h1>
                    <p className="about-subtitle">
                        THE PHILOSOPHY BEHIND CALCULATED PRECISION
                    </p>
                </section>

                {/* Mission */}
                <section className="about-section">
                    <div className="section-content">
                        <h2>Our Mission</h2>
                        <p className="lead-text">
                            In a world cluttered with ads, trackers, and unnecessary complexity,
                            <strong> Plainly Calculate</strong> stands as a sanctuary of simplicity.
                        </p>
                        <p>
                            We believe that calculation tools should be exactly that — tools.
                            Not advertising platforms. Not data collection points. Just clean,
                            fast, accurate instruments that help you get your work done.
                        </p>
                        <p>
                            Every calculator on this platform is designed with intention.
                            The dark interface reduces eye strain. The minimal design eliminates
                            distractions. The instant calculations respect your time.
                        </p>
                    </div>
                </section>

                {/* Features */}
                <section className="about-section">
                    <h2>What Sets Us Apart</h2>
                    <div className="features-grid">
                        {features.map((feature) => (
                            <div key={feature.title} className="feature-card">
                                <div className="feature-icon">
                                    <feature.icon size={24} />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="about-section">
                    <h2>Our Instruments</h2>
                    <p className="section-intro">
                        A curated collection of calculators spanning four essential categories.
                    </p>
                    <div className="categories-grid">
                        {categories.map((cat) => (
                            <div key={cat.name} className="category-item">
                                <div className="category-icon">
                                    <cat.icon size={20} />
                                </div>
                                <div className="category-info">
                                    <h4>{cat.name}</h4>
                                    <span className="category-count">{cat.count}</span>
                                </div>
                                <p>{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Creator */}
                <section className="about-section creator-section">
                    <h2>The Creator</h2>
                    <div className="creator-card">
                        <div className="creator-info">
                            <h3>Sahil Kazi</h3>
                            <p className="creator-role">Developer & Designer</p>
                            <p className="creator-bio">
                                A developer passionate about creating tools that are both
                                beautiful and functional. Plainly Calculate is part of a
                                larger vision to build digital products that respect users —
                                their time, their privacy, and their intelligence.
                            </p>
                            <a
                                href="https://sahil-me.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="creator-link"
                            >
                                Visit Portfolio →
                            </a>
                        </div>
                    </div>
                </section>

                {/* Philosophy */}
                <section className="about-section philosophy-section">
                    <blockquote className="philosophy-quote">
                        <p>"Simplicity is the ultimate sophistication."</p>
                        <cite>— Leonardo da Vinci</cite>
                    </blockquote>
                </section>
            </div>
        </div>
    )
}

export default About
