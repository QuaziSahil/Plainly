/**
 * AIOutputFormatter - Formats AI-generated text into beautiful, structured output
 * Detects: numbered lists, bullet points, headings, and paragraphs
 */
import { memo } from 'react'

// Clean text by removing markdown formatting
const cleanText = (text) => {
    if (!text) return ''
    return text
        .replace(/\*\*/g, '')           // Remove ** bold markers
        .replace(/^["']|["']$/g, '')    // Remove surrounding quotes
        .trim()
}

// Parse AI output into structured elements
const parseAIOutput = (text) => {
    if (!text) return []

    const lines = text.split('\n').filter(line => line.trim())
    const elements = []

    lines.forEach((line) => {
        const trimmed = line.trim()

        // Numbered list: "1. item" or "1) item" or "1: item"
        const numberedMatch = trimmed.match(/^(\d+)[.):\s]+(.+)$/)
        if (numberedMatch) {
            elements.push({
                type: 'numbered',
                number: numberedMatch[1],
                content: cleanText(numberedMatch[2])
            })
            return
        }

        // Bullet point: "- item" or "• item"
        const bulletMatch = trimmed.match(/^[-•]\s+(.+)$/)
        if (bulletMatch) {
            elements.push({
                type: 'bullet',
                content: cleanText(bulletMatch[1])
            })
            return
        }

        // Heading: "## Heading"
        const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/)
        if (headingMatch) {
            elements.push({
                type: 'heading',
                content: cleanText(headingMatch[1])
            })
            return
        }

        // Regular paragraph
        if (trimmed.length > 0) {
            elements.push({
                type: 'paragraph',
                content: cleanText(trimmed)
            })
        }
    })

    return elements
}

// Styles for the formatted output
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    numberedItem: {
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(167, 139, 250, 0.15)',
        transition: 'all 0.2s ease'
    },
    numberBadge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        color: 'white',
        flexShrink: 0
    },
    itemContent: {
        fontSize: '15px',
        lineHeight: '1.6',
        color: 'var(--text-primary, #e8dcc8)',
        flex: 1
    },
    bulletItem: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        borderLeft: '3px solid var(--accent-primary, #a78bfa)'
    },
    bulletDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'var(--accent-primary, #a78bfa)',
        marginTop: '8px',
        flexShrink: 0
    },
    heading: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--accent-primary, #a78bfa)',
        marginTop: '8px',
        marginBottom: '-8px'
    },
    paragraph: {
        fontSize: '15px',
        lineHeight: '1.7',
        color: 'var(--text-secondary, #b8a992)',
        padding: '8px 0'
    }
}

function AIOutputFormatter({ content }) {
    if (!content) return null

    const elements = parseAIOutput(content)

    // If no structured elements found, try to split by common patterns
    if (elements.length === 1 && elements[0].type === 'paragraph') {
        // Try to split by numbered patterns like "1." or "2."
        const numberedSplit = content.split(/(?=\d+[.)]\s)/)
        if (numberedSplit.length > 1) {
            return (
                <div style={styles.container}>
                    {numberedSplit.map((item, index) => {
                        const match = item.trim().match(/^(\d+)[.)]\s*(.+)$/s)
                        if (match) {
                            return (
                                <div key={index} style={styles.numberedItem}>
                                    <span style={styles.numberBadge}>{match[1]}</span>
                                    <span style={styles.itemContent}>
                                        {cleanText(match[2])}
                                    </span>
                                </div>
                            )
                        }
                        return item.trim() ? (
                            <div key={index} style={styles.paragraph}>{cleanText(item)}</div>
                        ) : null
                    }).filter(Boolean)}
                </div>
            )
        }
    }

    return (
        <div style={styles.container}>
            {elements.map((element, index) => {
                switch (element.type) {
                    case 'numbered':
                        return (
                            <div key={index} style={styles.numberedItem}>
                                <span style={styles.numberBadge}>{element.number}</span>
                                <span style={styles.itemContent}>{element.content}</span>
                            </div>
                        )
                    case 'bullet':
                        return (
                            <div key={index} style={styles.bulletItem}>
                                <span style={styles.bulletDot} />
                                <span style={styles.itemContent}>{element.content}</span>
                            </div>
                        )
                    case 'heading':
                        return (
                            <div key={index} style={styles.heading}>{element.content}</div>
                        )
                    case 'paragraph':
                    default:
                        return (
                            <div key={index} style={styles.paragraph}>{element.content}</div>
                        )
                }
            })}
        </div>
    )
}

export default memo(AIOutputFormatter)
