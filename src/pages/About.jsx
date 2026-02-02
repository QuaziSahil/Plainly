import { Calculator, Heart, Brain, ArrowRightLeft, Sparkles, Shield, Zap, Wand2, Type, Cpu, Leaf, Home, Gamepad2 } from 'lucide-react'
import './About.css'

function About() {
    const features = [
        {
            icon: Sparkles,
            title: 'Precision First',
            description: 'Every tool is built with accuracy at its core. From AI generators to calculators — no approximations, no shortcuts.'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Instant results with no loading screens. Just pure, immediate output when you need it.'
        },
        {
            icon: Shield,
            title: 'Privacy Focused',
            description: 'All processing happens locally in your browser. Your data never leaves your device.'
        }
    ]

    const categories = [
        { icon: Wand2, name: 'AI Tools', count: '43 Tools', desc: 'Text generators, code helpers, image creators & more' },
        { icon: Calculator, name: 'Finance', count: '38 Tools', desc: 'Mortgages, investments, loans, taxes & crypto' },
        { icon: Heart, name: 'Health', count: '27 Tools', desc: 'BMI, calories, macros, pregnancy & fitness' },
        { icon: Brain, name: 'Mathematics', count: '28 Tools', desc: 'Percentages, fractions, statistics & geometry' },
        { icon: ArrowRightLeft, name: 'Converters', count: '16 Tools', desc: 'Units, temperature, weight & measurements' },
        { icon: Type, name: 'Text Tools', count: '11 Tools', desc: 'Word counter, formatters & text utilities' },
        { icon: Cpu, name: 'Tech', count: '13 Tools', desc: 'QR codes, hashing, base converters & dev tools' },
        { icon: Leaf, name: 'Sustainability', count: '9 Tools', desc: 'Carbon footprint, solar & eco calculators' },
        { icon: Home, name: 'Real Estate', count: '7 Tools', desc: 'Flooring, paint, tile & property tools' },
        { icon: Gamepad2, name: 'Fun', count: '17 Tools', desc: 'Dice, spinners, games & random generators' },
        { icon: Sparkles, name: 'Other', count: '40 Tools', desc: 'Age, GPA, time zones & everyday utilities' }
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
                            <strong> Plainly Tools</strong> stands as a sanctuary of simplicity.
                        </p>
                        <p>
                            We believe that online tools should be exactly that — tools.
                            Not advertising platforms. Not data collection points. Just clean,
                            fast, accurate instruments that help you get your work done.
                        </p>
                        <p>
                            Every tool on this platform — from AI generators to calculators to converters —
                            is designed with intention. The dark interface reduces eye strain. The minimal
                            design eliminates distractions. The instant results respect your time.
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
                        A curated collection of 249+ tools spanning 11 categories.
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
                            <h3>Quazi Sahil Mahammad</h3>
                            <p className="creator-role">Developer & Designer</p>
                            <p className="creator-bio">
                                A developer passionate about creating tools that are both
                                beautiful and functional. Plainly Tools is part of a
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
