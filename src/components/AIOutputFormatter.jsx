/**
 * AIOutputFormatter - Formats AI-generated markdown into beautiful, styled output
 * Handles: headers (h1-h4), bullets, numbered lists, bold, italic, code, dividers
 */
import { memo } from 'react'

// Convert markdown to beautifully styled React elements
function parseAndStyle(text) {
    if (!text) return null

    const lines = text.split('\n')
    const elements = []
    let currentSection = null

    lines.forEach((line, index) => {
        const trimmed = line.trim()

        // Skip empty lines but track section breaks
        if (!trimmed) {
            if (currentSection) {
                currentSection = null
            }
            return
        }

        // Dividers (=== or ---)
        if (/^[=]{3,}$/.test(trimmed) || /^[-]{3,}$/.test(trimmed)) {
            elements.push({ type: 'divider', key: index })
            return
        }

        // Headers: # ## ### ####
        const h1Match = trimmed.match(/^#\s+(.+)$/)
        const h2Match = trimmed.match(/^##\s+(.+)$/)
        const h3Match = trimmed.match(/^###\s+(.+)$/)
        const h4Match = trimmed.match(/^####\s+(.+)$/)

        if (h1Match) {
            elements.push({ type: 'h1', content: cleanMarkdown(h1Match[1]), key: index })
            currentSection = 'h1'
            return
        }
        if (h2Match) {
            elements.push({ type: 'h2', content: cleanMarkdown(h2Match[1]), key: index })
            currentSection = 'h2'
            return
        }
        if (h3Match) {
            elements.push({ type: 'h3', content: cleanMarkdown(h3Match[1]), key: index })
            currentSection = 'h3'
            return
        }
        if (h4Match) {
            elements.push({ type: 'h4', content: cleanMarkdown(h4Match[1]), key: index })
            currentSection = 'h4'
            return
        }

        // Numbered lists: "1. item" or "1) item"
        const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/)
        if (numberedMatch) {
            elements.push({
                type: 'numbered',
                number: numberedMatch[1],
                content: cleanMarkdown(numberedMatch[2]),
                key: index
            })
            return
        }

        // Bullet points: "* item", "- item", "• item"
        const bulletMatch = trimmed.match(/^[\*\-•]\s+(.+)$/)
        if (bulletMatch) {
            elements.push({
                type: 'bullet',
                content: cleanMarkdown(bulletMatch[1]),
                key: index
            })
            return
        }

        // Question/Answer detection
        if (/^(Question|Q)\s*\d*/i.test(trimmed)) {
            elements.push({
                type: 'question',
                content: cleanMarkdown(trimmed),
                key: index
            })
            return
        }
        if (/^Answer:/i.test(trimmed)) {
            elements.push({
                type: 'answer',
                content: cleanMarkdown(trimmed.replace(/^Answer:\s*/i, '')),
                key: index
            })
            return
        }

        // Regular paragraph
        elements.push({
            type: 'paragraph',
            content: cleanMarkdown(trimmed),
            key: index
        })
    })

    return elements
}

// Clean markdown formatting and convert to styled text
function cleanMarkdown(text) {
    if (!text) return ''

    // Handle inline code first (before removing stars)
    text = text.replace(/`([^`]+)`/g, '‹code›$1‹/code›')

    // Bold text with ** or __
    text = text.replace(/\*\*(.+?)\*\*/g, '‹strong›$1‹/strong›')
    text = text.replace(/__(.+?)__/g, '‹strong›$1‹/strong›')

    // Italic with single * or _ (but not if part of bold)
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '‹em›$1‹/em›')

    return text
}

// Render inline styled text
function renderStyledText(text) {
    if (!text) return null

    const parts = []
    let remaining = text
    let keyIndex = 0

    // Parse special markers
    const regex = /‹(strong|em|code)›(.+?)‹\/\1›/g
    let match
    let lastIndex = 0

    while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index))
        }

        const tag = match[1]
        const content = match[2]

        if (tag === 'strong') {
            parts.push(<strong key={keyIndex++} style={inlineStyles.bold}>{content}</strong>)
        } else if (tag === 'em') {
            parts.push(<em key={keyIndex++} style={inlineStyles.italic}>{content}</em>)
        } else if (tag === 'code') {
            parts.push(<code key={keyIndex++} style={inlineStyles.code}>{content}</code>)
        }

        lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
}

// Inline element styles
const inlineStyles = {
    bold: {
        fontWeight: '600',
        color: '#fff'
    },
    italic: {
        fontStyle: 'italic',
        color: '#c4b5fd'
    },
    code: {
        background: 'rgba(167, 139, 250, 0.2)',
        color: '#e9d5ff',
        padding: '2px 8px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '13px'
    }
}

// Component styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    h1: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#e9d5ff',
        marginTop: '16px',
        marginBottom: '8px',
        paddingBottom: '12px',
        borderBottom: '2px solid rgba(167, 139, 250, 0.4)'
    },
    h2: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#c4b5fd',
        marginTop: '20px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    h2Badge: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '700',
        color: 'white'
    },
    h3: {
        fontSize: '17px',
        fontWeight: '600',
        color: '#a78bfa',
        marginTop: '16px',
        marginBottom: '4px'
    },
    h4: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#8b5cf6',
        marginTop: '12px',
        marginBottom: '4px',
        opacity: 0.9
    },
    divider: {
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.5), transparent)',
        margin: '16px 0',
        border: 'none'
    },
    paragraph: {
        fontSize: '15px',
        lineHeight: '1.7',
        color: 'rgba(255, 255, 255, 0.85)'
    },
    numbered: {
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        padding: '14px 18px',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(167, 139, 250, 0.2)'
    },
    numberBadge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '28px',
        height: '28px',
        background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700',
        color: 'white',
        flexShrink: 0
    },
    bullet: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        padding: '10px 16px',
        marginLeft: '8px',
        borderLeft: '3px solid rgba(167, 139, 250, 0.5)',
        background: 'rgba(167, 139, 250, 0.05)'
    },
    bulletDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
        marginTop: '7px',
        flexShrink: 0
    },
    itemContent: {
        fontSize: '15px',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.9)',
        flex: 1
    },
    question: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
        borderLeft: '4px solid #3b82f6',
        padding: '14px 18px',
        borderRadius: '0 12px 12px 0',
        marginTop: '12px'
    },
    questionContent: {
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#93c5fd',
        fontWeight: '500'
    },
    answer: {
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
        borderLeft: '4px solid #22c55e',
        padding: '14px 18px',
        borderRadius: '0 12px 12px 0',
        marginBottom: '16px'
    },
    answerLabel: {
        display: 'inline-block',
        background: '#22c55e',
        color: 'white',
        fontSize: '11px',
        fontWeight: '700',
        padding: '3px 8px',
        borderRadius: '4px',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    answerContent: {
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#86efac'
    }
}

function AIOutputFormatter({ content }) {
    if (!content) return null

    const elements = parseAndStyle(content)
    if (!elements || elements.length === 0) return null

    // Track section numbers for h2
    let sectionNumber = 0

    return (
        <div style={styles.container}>
            {elements.map((element) => {
                switch (element.type) {
                    case 'h1':
                        return (
                            <h1 key={element.key} style={styles.h1}>
                                {renderStyledText(element.content)}
                            </h1>
                        )
                    case 'h2':
                        sectionNumber++
                        return (
                            <h2 key={element.key} style={styles.h2}>
                                <span style={styles.h2Badge}>{sectionNumber}</span>
                                {renderStyledText(element.content)}
                            </h2>
                        )
                    case 'h3':
                        return (
                            <h3 key={element.key} style={styles.h3}>
                                {renderStyledText(element.content)}
                            </h3>
                        )
                    case 'h4':
                        return (
                            <h4 key={element.key} style={styles.h4}>
                                {renderStyledText(element.content)}
                            </h4>
                        )
                    case 'divider':
                        return <hr key={element.key} style={styles.divider} />
                    case 'numbered':
                        return (
                            <div key={element.key} style={styles.numbered}>
                                <span style={styles.numberBadge}>{element.number}</span>
                                <span style={styles.itemContent}>
                                    {renderStyledText(element.content)}
                                </span>
                            </div>
                        )
                    case 'bullet':
                        return (
                            <div key={element.key} style={styles.bullet}>
                                <span style={styles.bulletDot} />
                                <span style={styles.itemContent}>
                                    {renderStyledText(element.content)}
                                </span>
                            </div>
                        )
                    case 'question':
                        return (
                            <div key={element.key} style={styles.question}>
                                <span style={styles.questionContent}>
                                    {renderStyledText(element.content)}
                                </span>
                            </div>
                        )
                    case 'answer':
                        return (
                            <div key={element.key} style={styles.answer}>
                                <span style={styles.answerLabel}>✓ Answer</span>
                                <div style={styles.answerContent}>
                                    {renderStyledText(element.content)}
                                </div>
                            </div>
                        )
                    case 'paragraph':
                    default:
                        return (
                            <p key={element.key} style={styles.paragraph}>
                                {renderStyledText(element.content)}
                            </p>
                        )
                }
            })}
        </div>
    )
}

export default memo(AIOutputFormatter)
