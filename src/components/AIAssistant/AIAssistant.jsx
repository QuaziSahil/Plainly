import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send, Loader, Sparkles, ArrowRight, Bot } from 'lucide-react'
import { askGroq, MODELS } from '../../services/groqAI'
import { allCalculators } from '../../data/calculators'
import './AIAssistant.css'

// Simple markdown parser for formatting - handles *, -, • bullets cleanly
const parseMarkdown = (text) => {
    if (!text) return ''

    // Process line by line for better control
    const lines = text.split('\n')
    let result = []
    let inList = false

    lines.forEach((line) => {
        // Trim the line for processing
        const trimmedLine = line.trim()

        // Bold: **text** or __text__
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        line = line.replace(/__(.*?)__/g, '<strong>$1</strong>')

        // Code: `text` - do this BEFORE italic processing
        line = line.replace(/`([^`]+)`/g, '<code>$1</code>')

        // Tool paths: /path-name - make them clickable-looking
        line = line.replace(/\s(\/[\w-]+)/g, ' <code class="tool-path">$1</code>')

        // Bullet lists: *, -, •, or numbered (1., 2., etc)
        const bulletMatch = trimmedLine.match(/^[\*\-\•]\s+(.*)/)
        const numberedMatch = trimmedLine.match(/^\d+\.\s+(.*)/)

        if (bulletMatch) {
            if (!inList) {
                result.push('<ul class="ai-list">')
                inList = true
            }
            // Remove the bullet and wrap in li
            line = '<li>' + bulletMatch[1]
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code>$1</code>') + '</li>'
        } else if (numberedMatch) {
            if (!inList) {
                result.push('<ol class="ai-list">')
                inList = 'ol'
            }
            line = '<li>' + numberedMatch[1]
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code>$1</code>') + '</li>'
        } else if (inList && trimmedLine === '') {
            result.push(inList === 'ol' ? '</ol>' : '</ul>')
            inList = false
            line = ''
        }

        if (line.trim()) {
            result.push(line)
        }
    })

    // Close any open list
    if (inList) result.push(inList === 'ol' ? '</ol>' : '</ul>')

    return result.join('<br/>')
}

// Build knowledge base from all calculators
const CATEGORIES_SUMMARY = {
    'Finance': 'Mortgage, loans, interest, investment, tax, budget calculators',
    'Health': 'BMI, calories, nutrition, fitness, pregnancy calculators',
    'Math': 'Percentage, algebra, geometry, statistics calculators',
    'Converter': 'Unit, currency, time, temperature converters',
    'AI': 'Text generators, name generators, content creators, code generators, knowledge tools',
    'Fun': 'Games, random generators, entertainment tools',
    'Tech': 'Developer tools, code generators, QR codes',
    'Text': 'Grammar checker, summarizer, translator, paraphraser',
    'Real Estate': 'Property, rent, mortgage comparison calculators',
    'Sustainability': 'Carbon footprint, eco calculators',
    'Other': 'Various utility tools'
}

// Complete AI Tools list with EXACT names and paths
const AI_TOOLS_KNOWLEDGE = `
## AI WRITING & CONTENT TOOLS:
• **AI Email Generator** (/ai-email-generator) - Draft professional emails instantly
• **AI Cover Letter Generator** (/ai-cover-letter-generator) - Create tailored cover letters
• **AI Resume Summary Generator** (/ai-resume-summary-generator) - Produce impactful resume summaries
• **AI Product Description Generator** (/ai-product-description-generator) - Write compelling product copy
• **AI Slogan Generator** (/ai-slogan-generator) - Find catchy taglines for brands
• **AI Tweet Generator** (/ai-tweet-generator) - Generate engaging tweets
• **AI Instagram Caption Generator** (/ai-instagram-caption-generator) - Create Instagram captions
• **AI YouTube Title Generator** (/ai-youtube-title-generator) - Generate high-CTR video titles
• **AI Blog Post Generator** (/ai-blog-post-generator) - Draft complete blog posts
• **AI Meta Description Generator** (/ai-meta-description-generator) - Generate SEO meta tags
• **AI Paraphraser** (/ai-paraphraser) - Rewrite and improve text
• **AI LinkedIn Post Generator** (/ai-linkedin-post-generator) - Create professional LinkedIn posts
• **AI Grammar Checker** (/ai-grammar-checker) - Fix grammar and spelling errors
• **AI Voice Transformer** (/ai-voice-transformer) - Convert passive to active voice
• **AI Sentence Expander** (/ai-sentence-expander) - Add detail to writing
• **AI Sentence Shortener** (/ai-sentence-shortener) - Make writing concise
• **AI Essay Outline Generator** (/ai-essay-outline-generator) - Create essay outlines
• **AI Meeting Notes Generator** (/ai-meeting-notes-generator) - Turn transcripts into notes
• **AI Paragraph Generator** (/ai-paragraph-generator) - Generate paragraphs instantly
• **AI Text Summarizer** (/ai-text-summarizer) - Summarize long text
• **AI Translator** (/ai-translator) - Translate to 25+ languages
• **AI Hashtag Generator** (/ai-hashtag-generator) - Generate trending hashtags

## AI CREATIVE TOOLS:
• **AI Story Starter Generator** (/ai-story-starter-generator) - Find story ideas
• **AI Plot Generator** (/ai-plot-generator) - Generate story plots
• **AI Poem Generator** (/ai-poem-generator) - Compose poetry
• **AI Song Lyrics Generator** (/ai-song-lyrics-generator) - Write song lyrics
• **AI Joke Generator** (/ai-joke-generator) - Generate original jokes
• **AI Quote Generator** (/ai-quote-generator) - Generate inspirational quotes
• **AI Pickup Line Generator** (/ai-pickup-line-generator) - Witty pickup lines
• **AI Band Name Generator** (/ai-band-name-generator) - Find band names
• **AI Rap Name Generator** (/ai-rap-name-generator) - Get stage names
• **AI Username Generator** (/ai-username-generator) - Find unique usernames
• **AI Business Name Generator** (/ai-business-name-generator) - Generate brand names
• **AI Color Palette Generator** (/ai-color-palette-generator) - Generate color schemes
• **AI Meeting Agenda Generator** (/ai-meeting-agenda-generator) - Plan meeting agendas

## AI CODE & DEVELOPMENT TOOLS:
• **AI Code Generator** (/ai-code-generator) - Generate code in any language
• **AI Code Debugger** (/ai-code-debugger) - Find and fix bugs
• **AI Code Explainer** (/ai-code-explainer) - Explain code snippets
• **AI Code Converter** (/ai-code-converter) - Convert between languages
• **AI SQL Generator** (/ai-sql-generator) - Generate SQL queries
• **AI Regex Generator** (/ai-regex-generator) - Create regex patterns
• **AI Git Commit Generator** (/ai-git-commit-generator) - Generate commit messages
• **AI API Documentation Generator** (/ai-api-doc-generator) - Generate API docs
• **AI Unit Test Generator** (/ai-unit-test-generator) - Generate unit tests
• **AI Code Comment Generator** (/ai-code-comment-generator) - Add code comments
• **AI Code Review Assistant** (/ai-code-review-assistant) - Get code review feedback
• **AI Variable Name Generator** (/ai-variable-name-generator) - Get variable names
• **AI CSS Generator** (/ai-css-generator) - Generate CSS styles
• **AI HTML Generator** (/ai-html-generator) - Generate HTML structure
• **AI React Component Generator** (/ai-react-component-generator) - Generate React components
• **AI REST API Designer** (/ai-rest-api-designer) - Design RESTful APIs
• **AI Database Schema Generator** (/ai-database-schema-generator) - Design database schemas
• **AI Algorithm Selector** (/ai-algorithm-selector) - Find best algorithms
• **AI Tech Stack Recommender** (/ai-tech-stack-recommender) - Get tech recommendations
• **AI Function Name Generator** (/ai-function-name-generator) - Get function names
• **Code Preview & Download** (/ai-code-preview) - Preview and download code
• **Code Runner** (/ai-code-runner) - Run JavaScript code

## AI MARKETING & SEO TOOLS:
• **AI SEO Keyword Research** (/ai-seo-keyword-research) - Find keyword opportunities
• **AI Ad Copy Generator** (/ai-ad-copy-generator) - Create ad copy
• **AI Customer Persona Generator** (/ai-customer-persona-generator) - Create buyer personas

## AI IMAGE & DESIGN TOOLS:
• **AI Image Generator** (/ai-image-generator) - Create images from text
• **AI Video Generator** (/ai-video-generator) - Create videos from text
• **AI Face Generator** (/ai-face-generator) - Generate realistic faces
• **AI Logo Generator** (/ai-logo-generator) - Create logos
• **AI Cartoon Avatar Generator** (/ai-cartoon-avatar-generator) - Generate cartoon avatars
• **AI Pattern Generator** (/ai-pattern-generator) - Create seamless patterns
• **AI Album Cover Generator** (/ai-album-cover-generator) - Design album artwork
• **AI Business Card Designer** (/ai-business-card-designer) - Create business cards
• **AI Instagram Story Template** (/ai-instagram-story-template) - Generate story templates
• **AI Infographic Generator** (/ai-infographic-generator) - Create infographics
• **AI Presentation Slide Generator** (/ai-presentation-slide-generator) - Generate slides
• **AI Mockup Generator** (/ai-mockup-generator) - Create product mockups
• **AI Icon Generator** (/ai-icon-generator) - Design custom icons
• **AI QR Art Generator** (/ai-qr-art-generator) - Generate artistic QR codes
• **AI Meme Generator** (/ai-meme-generator) - Create meme concepts
• **AI Thumbnail Generator** (/ai-thumbnail-generator) - Generate thumbnail concepts

## AI EDUCATION & LEARNING TOOLS:
• **AI Quiz Generator** (/ai-quiz-generator) - Generate custom quizzes
• **AI Flashcard Generator** (/ai-flashcard-generator) - Create study flashcards
• **AI Study Guide Generator** (/ai-study-guide-generator) - Create study materials
• **AI Lesson Plan Generator** (/ai-lesson-plan-generator) - Generate teaching materials
• **AI Explanation Simplifier** (/ai-explanation-simplifier) - Simplify complex topics
• **AI Practice Problem Generator** (/ai-practice-problem-generator) - Generate math problems
• **AI Essay Grader** (/ai-essay-grader) - Get essay feedback
• **AI Citation Generator** (/ai-citation-generator) - Generate perfect citations
• **AI Research Question Generator** (/ai-research-question-generator) - Generate research ideas
• **AI Thesis Statement Generator** (/ai-thesis-statement-generator) - Draft thesis statements
• **AI Annotated Bibliography** (/ai-annotated-bibliography) - Summarize sources
• **AI Mind Map Generator** (/ai-mind-map-generator) - Create visual outlines
• **AI Mnemonic Generator** (/ai-mnemonic-generator) - Create memory aids
• **AI Language Learning Tutor** (/ai-language-learning-tutor) - Practice languages
• **AI Analogy Generator** (/ai-analogy-generator) - Explain with analogies

## AI KNOWLEDGE & HISTORY TOOLS (NEW!):
• **AI Encyclopedia** (/ai-encyclopedia) - Get Wikipedia-style explanations on any topic
• **AI History Explorer** (/ai-history-explorer) - Explore historical events and eras
• **AI Biography Generator** (/ai-biography-generator) - Get biographies of famous people
• **AI Fact Checker** (/ai-fact-checker) - Verify claims with AI analysis
• **AI Timeline Generator** (/ai-timeline-generator) - Generate chronological timelines
• **AI Country Guide** (/ai-country-guide) - Get information about any country
• **AI Science Explainer** (/ai-science-explainer) - Understand scientific concepts
• **AI Word Origin Finder** (/ai-word-origin-finder) - Discover etymology of words
• **AI Historical Comparison** (/ai-historical-comparison) - Compare historical events
• **AI Mythology Guide** (/ai-mythology-guide) - Explore myths and legends
• **AI Cultural Explorer** (/ai-cultural-explorer) - Learn about cultures worldwide
• **AI Famous Quotes Finder** (/ai-famous-quotes) - Find quotes with context
• **AI Invention History** (/ai-invention-history) - Stories behind inventions
• **AI War Summary** (/ai-war-summary) - Educational conflict summaries
• **AI Philosophy Explainer** (/ai-philosophy-explainer) - Understand philosophy concepts
`

const POPULAR_FINANCE_TOOLS = `
## POPULAR CALCULATORS:
• **Mortgage Calculator** (/mortgage-calculator) - Calculate home loan payments
• **BMI Calculator** (/bmi-calculator) - Calculate Body Mass Index
• **Compound Interest Calculator** (/compound-interest-calculator) - Visualize growth
• **Calorie Calculator** (/calorie-calculator) - Estimate daily caloric needs
• **Tip Calculator** (/tip-calculator) - Calculate tips and split bills
• **Percentage Calculator** (/percentage-calculator) - Calculate percentages
• **Unit Converter** (/unit-converter) - Convert between units
• **Currency Converter** (/currency-converter) - Convert world currencies
• **Age Calculator** (/age-calculator) - Calculate exact age
• **GPA Calculator** (/gpa-calculator) - Calculate Grade Point Average
`

// ALL OTHER TOOLS - Complete knowledge base
const ALL_TOOLS_KNOWLEDGE = `
## FINANCE CALCULATORS (63 tools):
• **Mortgage Calculator** (/mortgage-calculator) - Calculate monthly payments and amortization
• **Loan Calculator** (/loan-calculator) - Compute loan payments and interest
• **Compound Interest Calculator** (/compound-interest-calculator) - Visualize exponential growth
• **Investment Calculator** (/investment-calculator) - Project investment growth
• **Salary Calculator** (/salary-calculator) - Convert hourly/monthly/annual salary
• **Tip Calculator** (/tip-calculator) - Calculate tips and split bills
• **Auto Loan Calculator** (/auto-loan-calculator) - Calculate auto loan payments
• **Interest Calculator** (/interest-calculator) - Calculate simple and compound interest
• **Payment Calculator** (/payment-calculator) - Calculate loan payments
• **Retirement Calculator** (/retirement-calculator) - Plan retirement savings
• **Amortization Calculator** (/amortization-calculator) - Calculate loan amortization
• **Inflation Calculator** (/inflation-calculator) - Calculate purchasing power over time
• **Finance Calculator** (/finance-calculator) - General financial calculations
• **Income Tax Calculator** (/income-tax-calculator) - Estimate federal income tax
• **Interest Rate Calculator** (/interest-rate-calculator) - Calculate interest rate needed
• **Sales Tax Calculator** (/sales-tax-calculator) - Calculate sales tax
• **EMI Calculator** (/emi-calculator) - Calculate monthly installments
• **SIP Calculator** (/sip-calculator) - Calculate SIP investment returns
• **GST Calculator** (/gst-calculator) - Calculate Goods and Services Tax
• **Profit Margin Calculator** (/profit-margin-calculator) - Calculate profit margins
• **Break Even Calculator** (/break-even-calculator) - Calculate break-even point
• **ROI Calculator** (/roi-calculator) - Calculate Return on Investment
• **Rent vs Buy Calculator** (/rent-vs-buy-calculator) - Compare renting vs buying
• **401k Calculator** (/401k-calculator) - Project 401k retirement savings
• **Net Worth Calculator** (/net-worth-calculator) - Track assets and liabilities
• **Currency Converter** (/currency-converter) - Convert world currencies
• **Crypto Converter** (/crypto-converter) - Convert cryptocurrency
• **Budget Calculator** (/budget-calculator) - Plan monthly budget
• **CAGR Calculator** (/cagr-calculator) - Calculate Compound Annual Growth Rate
• **Stock Profit Calculator** (/stock-profit-calculator) - Calculate stock profits
• **Dividend Calculator** (/dividend-calculator) - Calculate dividend income
• **Bond Yield Calculator** (/bond-yield-calculator) - Calculate bond yields
• **Debt Payoff Calculator** (/debt-payoff-calculator) - Plan debt payoff
• **Emergency Fund Calculator** (/emergency-fund-calculator) - Calculate emergency fund needs
• **Savings Goal Calculator** (/savings-goal-calculator) - Plan savings for goals
• **Home Affordability Calculator** (/home-affordability-calculator) - Calculate home affordability
• **Rule of 72 Calculator** (/rule-of-72-calculator) - Calculate investment doubling time
• **Compound Growth Calculator** (/compound-growth-calculator) - Calculate compound growth
• **FIRE Calculator** (/fire-calculator) - Financial Independence, Retire Early
• **Coast FIRE Calculator** (/coast-fire-calculator) - Coast to retirement calculator
• **Lean FIRE Calculator** (/lean-fire-calculator) - Minimalist financial independence
• **Fat FIRE Calculator** (/fat-fire-calculator) - Luxury retirement planning
• **Crypto Portfolio Calculator** (/crypto-portfolio-calculator) - Track crypto holdings
• **DeFi Yield Calculator** (/defi-yield-calculator) - Calculate DeFi yields
• **NFT Profit Calculator** (/nft-profit-calculator) - Calculate NFT profits
• **Staking Rewards Calculator** (/staking-rewards-calculator) - Calculate staking earnings
• **Gas Fee Calculator** (/gas-fee-calculator) - Estimate Ethereum gas costs
• **Dollar Cost Averaging Calculator** (/dca-calculator) - Plan DCA strategy
• **Side Hustle Calculator** (/side-hustle-calculator) - Track side hustle income
• **Freelance Rate Calculator** (/freelance-rate-calculator) - Calculate freelance rate
• **Invoice Generator** (/invoice-generator) - Create invoices
• **Hourly to Salary Converter** (/hourly-to-salary-converter) - Convert pay rates
• **Take Home Pay Calculator** (/take-home-pay-calculator) - Calculate net pay
• **Paycheck Calculator** (/paycheck-calculator) - Calculate net paycheck
• **Overtime Calculator** (/overtime-calculator) - Calculate overtime pay
• **Commission Calculator** (/commission-calculator) - Calculate sales commission
• **Subscription Cost Calculator** (/subscription-cost-calculator) - Track subscriptions
• **Cost Per Use Calculator** (/cost-per-use-calculator) - Calculate true value
• **Rent Affordability Calculator** (/rent-affordability-calculator) - Calculate rent affordability
• **Utility Bill Splitter** (/utility-bill-splitter) - Split utility bills
• **Wealth Tax Calculator** (/wealth-tax-calculator) - Calculate wealth tax
• **Estate Tax Calculator** (/estate-tax-calculator) - Estimate estate tax
• **Gift Tax Calculator** (/gift-tax-calculator) - Calculate gift tax

## HEALTH CALCULATORS (26 tools):
• **BMI Calculator** (/bmi-calculator) - Calculate Body Mass Index
• **Calorie Calculator** (/calorie-calculator) - Estimate daily caloric needs
• **BMR Calculator** (/bmr-calculator) - Calculate Basal Metabolic Rate
• **Body Fat Calculator** (/body-fat-calculator) - Estimate body fat percentage
• **Ideal Weight Calculator** (/ideal-weight-calculator) - Find ideal body weight
• **Pace Calculator** (/pace-calculator) - Calculate running/cycling pace
• **Pregnancy Calculator** (/pregnancy-calculator) - Calculate due date
• **Conception Calculator** (/conception-calculator) - Estimate conception date
• **Due Date Calculator** (/due-date-calculator) - Calculate pregnancy due date
• **Water Intake Calculator** (/water-intake-calculator) - Calculate daily water needs
• **Macro Calculator** (/macro-calculator) - Calculate macronutrient needs
• **Sleep Calculator** (/sleep-calculator) - Calculate optimal sleep times
• **TDEE Calculator** (/tdee-calculator) - Calculate Total Daily Energy Expenditure
• **One Rep Max Calculator** (/one-rep-max-calculator) - Calculate one-rep max
• **Heart Rate Zone Calculator** (/heart-rate-zone-calculator) - Calculate heart rate zones
• **Ovulation Calculator** (/ovulation-calculator) - Calculate ovulation dates
• **Period Calculator** (/period-calculator) - Track menstrual cycle
• **BAC Calculator** (/bac-calculator) - Estimate blood alcohol content
• **Weight Loss Calculator** (/weight-loss-calculator) - Plan weight loss
• **Caffeine Calculator** (/caffeine-calculator) - Track caffeine intake
• **Calorie Burn Calculator** (/calorie-burn-calculator) - Calculate calories burned
• **Lean Body Mass Calculator** (/lean-body-mass-calculator) - Calculate lean mass
• **Sleep Cycle Calculator** (/sleep-cycle-calculator) - Optimize sleep cycles
• **VO2 Max Calculator** (/vo2-max-calculator) - Estimate cardiovascular fitness
• **Running Calorie Calculator** (/running-calorie-calculator) - Calories burned running
• **Pregnancy Weight Calculator** (/pregnancy-weight-calculator) - Healthy pregnancy weight

## MATH CALCULATORS (27 tools):
• **Scientific Calculator** (/scientific-calculator) - Advanced calculations
• **Percentage Calculator** (/percentage-calculator) - Calculate percentages
• **Fraction Calculator** (/fraction-calculator) - Add, subtract, multiply fractions
• **Random Number Generator** (/random-number-generator) - Generate random numbers
• **Triangle Calculator** (/triangle-calculator) - Calculate triangle properties
• **Standard Deviation Calculator** (/standard-deviation-calculator) - Calculate statistics
• **Quadratic Equation Solver** (/quadratic-calculator) - Solve quadratic equations
• **Prime Number Checker** (/prime-checker) - Check if number is prime
• **LCM & GCD Calculator** (/lcm-gcd-calculator) - Calculate LCM and GCD
• **Binary/Hex Converter** (/binary-hex-converter) - Convert number bases
• **Logarithm Calculator** (/logarithm-calculator) - Calculate logarithms
• **Exponent Calculator** (/exponent-calculator) - Calculate powers and roots
• **Permutation & Combination Calculator** (/permutation-combination-calculator) - Calculate nPr and nCr
• **Matrix Calculator** (/matrix-calculator) - Matrix operations
• **Wave Calculator** (/wave-calculator) - Calculate wave properties
• **Vector Calculator** (/vector-calculator) - Vector operations
• **Permutation Calculator** (/permutation-calculator) - Calculate permutations
• **Circle Calculator** (/circle-calculator) - Calculate circle properties
• **Factorial Calculator** (/factorial-calculator) - Calculate factorials
• **Mean Median Mode Calculator** (/mean-median-mode-calculator) - Statistical measures
• **Probability Calculator** (/probability-calculator) - Calculate probability
• **Pythagorean Calculator** (/pythagorean-calculator) - Pythagorean theorem
• **Quadratic Solver** (/quadratic-solver) - Solve quadratic equations
• **Roman Numeral Converter** (/roman-numeral-converter) - Convert Roman numerals
• **Sphere Calculator** (/sphere-calculator) - Calculate sphere properties
• **Trigonometry Calculator** (/trigonometry-calculator) - Trigonometric functions
• **GCD LCM Calculator** (/gcd-lcm-calculator) - Find GCD and LCM

## CONVERTER TOOLS (16 tools):
• **Unit Converter** (/unit-converter) - Convert between units
• **Conversion Calculator** (/conversion-calculator) - Convert measurements
• **Cooking Converter** (/cooking-converter) - Convert cooking measurements
• **Temperature Converter** (/temperature-converter) - Convert temperatures
• **Length Converter** (/length-converter) - Convert length units
• **Time Converter** (/time-converter) - Convert time units
• **Pressure Converter** (/pressure-converter) - Convert pressure units
• **Angle Converter** (/angle-converter) - Convert angle units
• **Recipe Scaler** (/recipe-scaler) - Scale recipe ingredients
• **Frequency Converter** (/frequency-converter) - Convert frequency units
• **Area Converter** (/area-converter) - Convert area units
• **Data Storage Converter** (/data-storage-converter) - Convert data units
• **Energy Converter** (/energy-converter) - Convert energy units
• **Speed Converter** (/speed-converter) - Convert speed units
• **Weight Converter** (/weight-converter) - Convert weight units
• **Shoe Size Converter** (/shoe-size-converter) - Convert shoe sizes

## TEXT TOOLS (11 tools):
• **Word Counter** (/word-counter) - Count words and characters
• **Lorem Ipsum Generator** (/lorem-ipsum-generator) - Generate placeholder text
• **UUID Generator** (/uuid-generator) - Generate unique identifiers
• **Color Picker** (/color-picker) - Pick and convert colors
• **JSON Formatter** (/json-formatter) - Format JSON data
• **Readability Calculator** (/readability-calculator) - Analyze text readability
• **Slug Generator** (/slug-generator) - Generate SEO-friendly slugs
• **Text Scrambler** (/text-scrambler) - Scramble text
• **Duplicate Remover** (/duplicate-remover) - Remove duplicate lines
• **Text Reverser** (/text-reverser) - Reverse text
• **Text Sorter** (/text-sorter) - Sort text lines

## TECH TOOLS (13 tools):
• **QR Code Generator** (/qr-code-generator) - Generate QR codes
• **Hash Generator** (/hash-generator) - Generate SHA hashes
• **IP Subnet Calculator** (/ip-subnet-calculator) - Calculate subnet info
• **JSON Formatter Calculator** (/json-formatter-calculator) - Format JSON
• **Hash Generator Calculator** (/hash-generator-calculator) - Generate hashes
• **Power Calculator** (/power-calculator) - Calculate electrical power
• **Base64 Encoder** (/base64-encoder) - Encode/decode Base64
• **Color Converter** (/color-converter) - Convert color formats
• **Markdown Previewer** (/markdown-previewer) - Preview Markdown
• **Number Base Converter** (/number-base-converter) - Convert number bases
• **Password Generator** (/password-generator) - Generate secure passwords
• **Regex Tester** (/regex-tester) - Test regular expressions
• **URL Encoder** (/url-encoder) - Encode/decode URLs

## SUSTAINABILITY TOOLS (9 tools):
• **Solar Panel Calculator** (/solar-panel-calculator) - Calculate solar system size
• **EV Savings Calculator** (/ev-savings-calculator) - Compare EV vs gas costs
• **Carbon Footprint Calculator** (/carbon-footprint-calculator) - Calculate CO2 emissions
• **Compost Calculator** (/compost-calculator) - Calculate composting ratios
• **Solar ROI Calculator** (/solar-roi-calculator) - Calculate solar ROI
• **Rainwater Calculator** (/rainwater-calculator) - Calculate rainwater potential
• **Plastic Footprint Calculator** (/plastic-footprint-calculator) - Track plastic usage
• **Electricity Usage Calculator** (/electricity-usage-calculator) - Calculate electricity
• **Tree Carbon Calculator** (/tree-carbon-calculator) - Calculate carbon absorbed

## REAL ESTATE TOOLS (7 tools):
• **Flooring Calculator** (/flooring-calculator) - Calculate flooring materials
• **Rental Yield Calculator** (/rental-yield-calculator) - Calculate rental returns
• **Paint Calculator** (/paint-calculator) - Calculate paint needed
• **Concrete Calculator** (/concrete-calculator) - Calculate concrete volume
• **Fence Calculator** (/fence-calculator) - Calculate fencing materials
• **Tile Calculator** (/tile-calculator) - Calculate tiles needed
• **Wallpaper Calculator** (/wallpaper-calculator) - Calculate wallpaper rolls

## FUN TOOLS (17 tools):
• **Dice Roller** (/dice-roller) - Roll virtual dice
• **Random Picker** (/random-picker) - Pick random items
• **Coin Flip** (/coin-flip) - Flip a virtual coin
• **Love Calculator** (/love-calculator) - Calculate love compatibility
• **Zodiac Finder** (/zodiac-finder) - Find zodiac sign
• **Numerology Calculator** (/numerology-calculator) - Calculate life path number
• **Magic 8-Ball** (/magic-8-ball) - Ask yes/no questions
• **Baby Name Generator** (/baby-name-generator) - Generate baby names
• **Pet Age Calculator** (/pet-age-calculator) - Convert pet years
• **Lottery Odds Calculator** (/lottery-odds-calculator) - Calculate lottery odds
• **Spin the Wheel** (/spin-the-wheel) - Spin decision wheel
• **Secret Santa Generator** (/secret-santa-generator) - Generate gift assignments
• **Dog Age Calculator** (/dog-age-calculator) - Convert dog years
• **Compatibility Calculator** (/compatibility-calculator) - Calculate compatibility
• **Reaction Time Game** (/reaction-time-game) - Test reaction speed
• **Team Randomizer** (/team-randomizer) - Randomly assign teams
• **Would You Rather** (/would-you-rather) - Fun questions game

## OTHER TOOLS (37 tools):
• **Age Calculator** (/age-calculator) - Calculate exact age
• **Date Calculator** (/date-calculator) - Find date differences
• **GPA Calculator** (/gpa-calculator) - Calculate Grade Point Average
• **CGPA Calculator** (/cgpa-calculator) - Convert CGPA to percentage
• **Discount Calculator** (/discount-calculator) - Calculate sale prices
• **Time Calculator** (/time-calculator) - Add/subtract time
• **Hours Calculator** (/hours-calculator) - Calculate work hours
• **Grade Calculator** (/grade-calculator) - Calculate grades
• **Subnet Calculator** (/subnet-calculator) - Calculate subnet mask
• **Fuel Cost Calculator** (/fuel-cost-calculator) - Calculate fuel costs
• **Electricity Bill Calculator** (/electricity-bill-calculator) - Estimate electricity costs
• **Tip Split Calculator** (/tip-split-calculator) - Split bills
• **World Clock** (/world-clock) - View time across timezones
• **Countdown Timer** (/countdown-timer) - Set countdowns
• **Stopwatch** (/stopwatch) - Precise stopwatch with laps
• **Distance Calculator** (/distance-calculator) - Calculate distance
• **Countdown Calculator** (/countdown-calculator) - Count days until event
• **Life Stats Calculator** (/life-stats-calculator) - Life statistics
• **Package Dimension Calculator** (/package-dimension-calculator) - Shipping dimensions
• **Split Time Calculator** (/stopwatch-calculator) - Analyze split times
• **Car Depreciation Calculator** (/car-depreciation-calculator) - Vehicle depreciation
• **MPG Calculator** (/mpg-calculator) - Calculate fuel efficiency
• **Reading Speed Calculator** (/reading-speed-calculator) - Calculate reading speed
• **Typing Speed Calculator** (/typing-speed-calculator) - Test typing speed
• **Timezone Converter** (/timezone-converter) - Convert timezones
• **Unix Timestamp Converter** (/unix-timestamp-converter) - Convert timestamps
• **Weighted GPA Calculator** (/weighted-gpa-calculator) - Weighted GPA
• **Workdays Calculator** (/workdays-calculator) - Calculate business days
• **Pool Volume Calculator** (/pool-volume-calculator) - Calculate pool volume
• **Mulch Calculator** (/mulch-calculator) - Calculate mulch needed
• **Rainwater Harvest Calculator** (/rainwater-harvest-calculator) - Rainwater potential
• **Score Keeper** (/score-keeper) - Track game scores
• **Bracket Generator** (/bracket-generator) - Generate tournament brackets
• **Magic Eight Ball** (/magic-eight-ball) - Ask the magic 8-ball
• **Volume Converter** (/volume-converter) - Convert volume units
• **Screen Time Calculator** (/screen-time-calculator) - Track screen time
`

const TOOL_INDEX_COMPACT = allCalculators
    .map((tool) => `- ${tool.name} (${tool.path})`)
    .join('\n')

const SYSTEM_PROMPT = `You are the Plainly AI Assistant - a smart, friendly guide for Plainly Tools.

Platform categories:
${Object.entries(CATEGORIES_SUMMARY).map(([cat, desc]) => `- ${cat}: ${desc}`).join('\n')}

Exact tool index (name + path):
${TOOL_INDEX_COMPACT}

Rules:
1. Use ONLY exact tool names and paths from the index.
2. Always include the recommended path in backticks, like \`/ai-email-generator\`.
3. Keep answers concise (2-4 short lines unless user asks for detail).
4. If multiple tools match, suggest top 1-3.
5. Never invent tools or paths.
6. Format answers with clean markdown:
   - Start with one short heading line.
   - Use bullet points for recommendations.
   - Bold tool names and put paths in backticks.
   - Add a short "Why this tool" line when recommending.`

function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "👋 Hi! I'm Plainly AI Assistant. I can help you find the right tool, answer questions, or even do quick calculations. What do you need?"
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [suggestedTool, setSuggestedTool] = useState(null)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const navigate = useNavigate()

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Parse tool recommendation from response - improved detection
    const parseToolSuggestion = (text) => {
        // First, try to find any explicit paths like /bmi-calculator
        const pathMatches = text.match(/\/[\w-]+/g)
        if (pathMatches) {
            for (const path of pathMatches) {
                const tool = allCalculators.find(c => c.path === path)
                if (tool) return tool
            }
        }

        // Fallback: search for tool name mentions in the text
        const textLower = text.toLowerCase()
        for (const calc of allCalculators) {
            // Check if the tool name is mentioned (case insensitive)
            const nameLower = calc.name.toLowerCase()
            if (textLower.includes(nameLower) && nameLower.length > 5) {
                return calc
            }
        }

        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)
        setSuggestedTool(null)

        try {
            // Build conversation context
            const conversationHistory = messages.slice(-6).map(m => ({
                role: m.role,
                content: m.content
            }))

            // Create the prompt with context
            const prompt = `User question: ${userMessage}

Previous conversation context: ${JSON.stringify(conversationHistory)}

Respond helpfully and concisely. If recommending a tool, include its path.`

            const response = await askGroq(prompt, SYSTEM_PROMPT, {
                model: MODELS.primary,
                maxTokens: 500,
                temperature: 0.7
            })

            setMessages(prev => [...prev, { role: 'assistant', content: response }])

            // Check if response suggests a tool
            const tool = parseToolSuggestion(response)
            if (tool) setSuggestedTool(tool)

        } catch (error) {
            console.error('AI Assistant error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Try searching with Ctrl+K or browsing our categories!"
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleToolClick = (path) => {
        setIsOpen(false)
        navigate(path)
    }

    const quickActions = [
        { label: 'Calculate BMI', query: 'I want to calculate my BMI' },
        { label: 'Find loan tools', query: 'What loan calculators do you have?' },
        { label: 'AI text tools', query: 'Show me AI writing tools' },
    ]

    return (
        <>
            {/* Floating Button */}
            <button
                className={`ai-assistant-fab ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="ai-assistant-panel">
                    {/* Header */}
                    <div className="ai-assistant-header">
                        <div className="ai-assistant-header-info">
                            <Sparkles size={20} className="ai-header-icon" />
                            <div>
                                <h3>Plainly AI Assistant</h3>
                                <span>Powered by AI • 317+ tools</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="ai-close-btn">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="ai-assistant-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`ai-message ${msg.role}`}>
                                {msg.role === 'assistant' && (
                                    <div className="ai-avatar">
                                        <Bot size={16} />
                                    </div>
                                )}
                                <div
                                    className="ai-message-content"
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                                />
                            </div>
                        ))}

                        {isLoading && (
                            <div className="ai-message assistant">
                                <div className="ai-avatar">
                                    <Bot size={16} />
                                </div>
                                <div className="ai-message-content loading">
                                    <Loader size={16} className="spinner" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}

                        {/* Suggested Tool Card */}
                        {suggestedTool && (
                            <div className="ai-tool-suggestion">
                                <span className="ai-tool-label">Recommended Tool</span>
                                <button
                                    className="ai-tool-card"
                                    onClick={() => handleToolClick(suggestedTool.path)}
                                >
                                    <suggestedTool.icon size={20} />
                                    <div className="ai-tool-info">
                                        <span className="ai-tool-name">{suggestedTool.name}</span>
                                        <span className="ai-tool-desc">{suggestedTool.description}</span>
                                    </div>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions - Show only when messages are minimal */}
                    {messages.length <= 1 && (
                        <div className="ai-quick-actions">
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    className="ai-quick-btn"
                                    onClick={() => {
                                        setInput(action.query)
                                        inputRef.current?.focus()
                                    }}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="ai-assistant-input">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={!input.trim() || isLoading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default AIAssistant

