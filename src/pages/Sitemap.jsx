import { Link } from 'react-router-dom'
import {
    Home, Calculator, Heart, Brain, ArrowRightLeft, FileText,
    Code, Leaf, Building2, Gamepad2, ChevronRight, Map,
    DollarSign, Scale, Percent, Thermometer, QrCode, Droplet
} from 'lucide-react'
import { allCalculators } from '../data/calculators'
import './Sitemap.css'

function Sitemap() {
    // Group calculators by category
    const categories = [
        {
            name: 'Finance',
            icon: DollarSign,
            path: '/finance',
            description: 'Financial planning and investment tools',
            calculators: allCalculators.filter(c => c.category === 'Finance')
        },
        {
            name: 'Health',
            icon: Heart,
            path: '/health',
            description: 'Health, fitness, and wellness calculators',
            calculators: allCalculators.filter(c => c.category === 'Health')
        },
        {
            name: 'Math',
            icon: Brain,
            path: '/math',
            description: 'Mathematical and scientific tools',
            calculators: allCalculators.filter(c => c.category === 'Math')
        },
        {
            name: 'Converter',
            icon: ArrowRightLeft,
            path: '/converter',
            description: 'Unit conversion and measurement tools',
            calculators: allCalculators.filter(c => c.category === 'Converter')
        },
        {
            name: 'Text',
            icon: FileText,
            path: '/calculators?category=Text',
            description: 'Text processing and formatting utilities',
            calculators: allCalculators.filter(c => c.category === 'Text')
        },
        {
            name: 'Tech',
            icon: Code,
            path: '/calculators?category=Tech',
            description: 'Developer and technical tools',
            calculators: allCalculators.filter(c => c.category === 'Tech')
        },
        {
            name: 'Sustainability',
            icon: Leaf,
            path: '/calculators?category=Sustainability',
            description: 'Environmental and green living calculators',
            calculators: allCalculators.filter(c => c.category === 'Sustainability')
        },
        {
            name: 'Real Estate',
            icon: Building2,
            path: '/calculators?category=Real Estate',
            description: 'Property and home improvement tools',
            calculators: allCalculators.filter(c => c.category === 'Real Estate')
        },
        {
            name: 'Fun',
            icon: Gamepad2,
            path: '/calculators?category=Fun',
            description: 'Entertainment and game calculators',
            calculators: allCalculators.filter(c => c.category === 'Fun')
        },
        {
            name: 'Other',
            icon: Calculator,
            path: '/calculators?category=Other',
            description: 'Miscellaneous utility tools',
            calculators: allCalculators.filter(c => c.category === 'Other')
        }
    ]

    const mainPages = [
        { name: 'Home', path: '/', description: 'Welcome to Plainly Calculate' },
        { name: 'All Calculators', path: '/calculators', description: 'Browse all 200+ calculators' },
        { name: 'About', path: '/about', description: 'Learn about our mission' },
        { name: 'Contact', path: '/contact', description: 'Get in touch with us' },
        { name: 'Privacy Policy', path: '/privacy', description: 'How we protect your data' },
        { name: 'Terms of Service', path: '/terms', description: 'Terms and conditions' }
    ]

    const totalCalculators = allCalculators.length

    return (
        <div className="sitemap-page">
            <div className="container">
                {/* Hero */}
                <section className="sitemap-hero">
                    <div className="sitemap-icon-wrapper">
                        <Map size={32} />
                    </div>
                    <h1 className="sitemap-title">
                        Site <span className="italic">Map</span>
                    </h1>
                    <p className="sitemap-subtitle">
                        COMPLETE DIRECTORY OF {totalCalculators}+ INSTRUMENTS
                    </p>
                </section>

                {/* Stats */}
                <section className="sitemap-stats">
                    <div className="stat-card">
                        <span className="stat-number">{totalCalculators}</span>
                        <span className="stat-label">Total Calculators</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">10</span>
                        <span className="stat-label">Categories</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">6</span>
                        <span className="stat-label">Main Pages</span>
                    </div>
                </section>

                {/* Main Pages */}
                <section className="sitemap-section">
                    <h2 className="section-heading">Main Pages</h2>
                    <div className="main-pages-grid">
                        {mainPages.map((page) => (
                            <Link to={page.path} key={page.path} className="main-page-card">
                                <h3>{page.name}</h3>
                                <p>{page.description}</p>
                                <ChevronRight size={16} className="arrow" />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="sitemap-section">
                    <h2 className="section-heading">Calculator Categories</h2>
                    <p className="section-description">
                        Explore our comprehensive collection organized by category
                    </p>

                    <div className="categories-container">
                        {categories.map((category) => (
                            <div key={category.name} className="category-block">
                                <div className="category-header">
                                    <div className="category-header-left">
                                        <div className="category-icon-box">
                                            <category.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="category-name">{category.name}</h3>
                                            <p className="category-description">{category.description}</p>
                                        </div>
                                    </div>
                                    <span className="category-count">{category.calculators.length} tools</span>
                                </div>

                                <div className="calculator-links">
                                    {category.calculators.map((calc) => (
                                        <Link
                                            to={calc.path}
                                            key={calc.path}
                                            className="calculator-link"
                                        >
                                            {calc.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* XML Sitemap Reference */}
                <section className="sitemap-section xml-section">
                    <h2 className="section-heading">For Search Engines</h2>
                    <p className="section-description">
                        Looking for our XML sitemap? Access it at:
                    </p>
                    <a
                        href="/sitemap.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="xml-link"
                    >
                        plainly.live/sitemap.xml
                    </a>
                </section>
            </div>
        </div>
    )
}

export default Sitemap
