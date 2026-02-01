/**
 * Pollinations.AI Image Generation Service
 * Uses API key as query parameter for authentication
 * sk_ keys = No rate limits
 */

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

/**
 * Generate an image using Pollinations.AI
 * Passes API key as query parameter for authenticated requests
 */
export async function generateImage(prompt, options = {}) {
    const {
        width = 1024,
        height = 1024,
        model = 'flux',  // Best quality model
        seed = Math.floor(Math.random() * 1000000)
    } = options

    // Build the image URL
    const encodedPrompt = encodeURIComponent(prompt)
    let imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`

    // Add API key as query parameter if available
    if (POLLINATIONS_API_KEY) {
        imageUrl += `&key=${POLLINATIONS_API_KEY}`
    }

    // Fetch the image
    try {
        const response = await fetch(imageUrl)

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        // Convert response to blob then to data URL for display
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.warn('Image generation failed:', error.message)
        throw new Error('Failed to generate image. Please try again.')
    }
}

/**
 * Check if API key is configured
 */
export function isConfigured() {
    return true
}

/**
 * Check if API key exists (for UI display)
 */
export function hasApiKey() {
    return !!POLLINATIONS_API_KEY
}

export default {
    generateImage,
    isConfigured,
    hasApiKey
}
