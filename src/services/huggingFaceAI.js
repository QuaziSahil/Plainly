/**
 * Hugging Face AI Service for Image Generation
 * Uses the Inference API with Stable Diffusion XL
 */

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY

// Available models for image generation (best quality, free tier compatible)
const MODELS = {
    SDXL: 'stabilityai/stable-diffusion-xl-base-1.0',
    SD_TURBO: 'stabilityai/sdxl-turbo',
    DREAMSHAPER: 'Lykon/dreamshaper-xl-1-0',
    REALISTIC: 'SG161222/RealVisXL_V4.0'
}

// Default model
const DEFAULT_MODEL = MODELS.SDXL

/**
 * Generate an image using Hugging Face Inference API
 * @param {string} prompt - The text prompt for image generation
 * @param {object} options - Generation options
 * @returns {Promise<string>} - Base64 data URL of the generated image
 */
export async function generateImage(prompt, options = {}) {
    const {
        model = DEFAULT_MODEL,
        negative_prompt = 'blurry, low quality, distorted, ugly, bad anatomy, watermark, text',
        width = 1024,
        height = 1024,
        num_inference_steps = 30,
        guidance_scale = 7.5
    } = options

    if (!HF_API_KEY) {
        throw new Error('Hugging Face API key not configured')
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                negative_prompt,
                width: Math.min(width, 1024),  // Max 1024 on free tier
                height: Math.min(height, 1024),
                num_inference_steps,
                guidance_scale
            }
        })
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // Handle specific errors
        if (response.status === 503) {
            throw new Error('Model is loading. Please try again in 20-30 seconds.')
        }
        if (response.status === 429) {
            throw new Error('Rate limit reached. Please wait a moment and try again.')
        }
        if (errorData.error) {
            throw new Error(errorData.error)
        }
        throw new Error(`Image generation failed: ${response.status}`)
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
 * Check if the API key is configured
 */
export function isConfigured() {
    return !!HF_API_KEY
}

/**
 * Get list of available models
 */
export function getModels() {
    return Object.entries(MODELS).map(([key, value]) => ({
        id: key,
        model: value,
        name: key.replace(/_/g, ' ')
    }))
}

export default {
    generateImage,
    isConfigured,
    getModels,
    MODELS
}
