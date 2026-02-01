/**
 * Hugging Face AI Service for Image Generation
 * Uses the Inference API with Stable Diffusion XL
 * Falls back to Pollinations.AI if HF fails
 */

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY

// Available models for image generation
const MODELS = {
    SDXL_TURBO: 'stabilityai/sdxl-turbo',  // Fast, works well
    FLUX: 'black-forest-labs/FLUX.1-schnell',  // Very fast
    SD_3: 'stabilityai/stable-diffusion-3-medium-diffusers'
}

// Default model - SDXL Turbo is faster and more reliable
const DEFAULT_MODEL = MODELS.SDXL_TURBO

/**
 * Generate an image using Hugging Face Inference API
 * Falls back to Pollinations.AI if HF fails
 */
export async function generateImage(prompt, options = {}) {
    const {
        width = 1024,
        height = 1024,
    } = options

    // Try Hugging Face first if API key is available
    if (HF_API_KEY) {
        try {
            const imageUrl = await generateWithHuggingFace(prompt, { width, height })
            return imageUrl
        } catch (error) {
            console.warn('Hugging Face failed, falling back to Pollinations.AI:', error.message)
            // Fall through to Pollinations.AI
        }
    }

    // Fallback to Pollinations.AI (free, no API key needed)
    return generateWithPollinations(prompt, { width, height })
}

/**
 * Generate with Hugging Face API
 */
async function generateWithHuggingFace(prompt, options = {}) {
    const { width = 1024, height = 1024 } = options

    const response = await fetch(`https://api-inference.huggingface.co/models/${DEFAULT_MODEL}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
            'x-wait-for-model': 'true'  // Wait for model to load
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                width: Math.min(width, 1024),
                height: Math.min(height, 1024)
            }
        })
    })

    if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HF Error ${response.status}`

        try {
            const errorData = JSON.parse(errorText)
            if (errorData.error) {
                errorMessage = errorData.error
            }
        } catch {
            // Not JSON
        }

        if (response.status === 503) {
            throw new Error('Model is loading. Please wait 30 seconds and try again.')
        }
        if (response.status === 429) {
            throw new Error('Rate limit reached')
        }

        throw new Error(errorMessage)
    }

    // Response is a blob (image)
    const blob = await response.blob()

    // Convert blob to base64 data URL
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

/**
 * Generate with Pollinations.AI (free fallback)
 */
async function generateWithPollinations(prompt, options = {}) {
    const { width = 1024, height = 1024 } = options

    const encodedPrompt = encodeURIComponent(prompt)
    const seed = Math.floor(Math.random() * 1000000)

    // Pollinations.AI URL - returns image directly
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`

    // Return the URL directly (it's a valid image URL)
    return url
}

/**
 * Check if Hugging Face API key is configured
 */
export function isConfigured() {
    return true  // Always return true since we have Pollinations fallback
}

/**
 * Check if using Hugging Face (has API key)
 */
export function hasHuggingFaceKey() {
    return !!HF_API_KEY
}

export default {
    generateImage,
    isConfigured,
    hasHuggingFaceKey,
    MODELS
}
