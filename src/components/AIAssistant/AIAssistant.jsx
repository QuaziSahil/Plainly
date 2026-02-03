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
    'AI': 'Text generators, name generators, content creators, code generators',
    'Fun': 'Games, random generators, entertainment tools',
    'Tech': 'Developer tools, code generators, QR codes',
    'Text': 'Grammar checker, summarizer, translator, paraphraser',
    'Real Estate': 'Property, rent, mortgage comparison calculators',
    'Sustainability': 'Carbon footprint, eco calculators',
    'Other': 'Various utility tools'
}

const POPULAR_TOOLS = allCalculators.slice(0, 30).map(c =>
    `• **${c.name}** (${c.path})`
).join('\n')

const SYSTEM_PROMPT = `You are the Plainly AI Assistant - a smart, friendly guide for Plainly Tools website.

## ABOUT PLAINLY
Plainly Tools has **317+ free calculators and AI tools**:
${Object.entries(CATEGORIES_SUMMARY).map(([cat, desc]) => `• **${cat}**: ${desc}`).join('\n')}

## POPULAR TOOLS (recommend these often):
${POPULAR_TOOLS}

## YOUR RESPONSE STYLE:
1. **Be CONCISE** - Max 2-3 sentences for simple questions
2. **Use formatting** - Bold for emphasis, bullets for lists
3. **Always include the tool path** like \`/bmi-calculator\`
4. **Be friendly but professional** - No excessive emojis
5. **For calculations** - Either give quick answer OR recommend tool

## RESPONSE FORMAT EXAMPLES:

**User asks for a tool:**
"Try the **BMI Calculator** at \`/bmi-calculator\` - just enter your height and weight!"

**User asks about categories:**
"We have **43 AI tools** including:
• **AI Code Generator** - Generate code in any language
• **AI Text Summarizer** - Summarize articles instantly
• **AI Name Generator** - Creative name suggestions"

**User asks for help:**
"I can help you:
• Find the right calculator
• Explain how tools work
• Do quick calculations
What do you need?"

## IMPORTANT:
- Always suggest specific tools with their paths
- Keep answers SHORT and actionable
- Format with **bold** and bullets
- Be helpful and enthusiastic!`

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
