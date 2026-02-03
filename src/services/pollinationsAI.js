/**
 * Plainly AI - Image & Video Generation Service
 * Powered by Pollinations.AI with automatic model fallback
 * Users see "Plainly AI" branding, models auto-fallback from best to worst
 * 
 * Updated Feb 2026: Prioritize FREE models that don't require pollen credits
 * Paid models (seedream-pro, veo, nanobanana-pro) moved to end of fallback chain
 */

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

// Image models ranked - FREE models first, paid models last
// Based on Pollinations changelog: seedream-pro, veo, nanobanana-pro require paid credits
const IMAGE_MODELS = [
    // FREE models (no pollen credits required)
    'flux',           // Best free quality, recommended
    'turbo',          // SDXL Turbo - fastest, reliable
    'klein',          // FLUX.2 Klein 4B - fast
    'klein-large',    // FLUX.2 Klein 9B - better quality
    'gptimage',       // GPT Image 1 Mini
    'gptimage-large', // GPT Image 1.5 - creative
    'seedream',       // Seedream 4.0 - artistic
    'kontext',        // FLUX.1 Kontext - context editing
    'zimage',         // Z-Image Turbo
    'nanobanana',     // NanoBanana - experimental
    // PAID models (require pollen credits - try last)
    'seedream-pro',   // Paid - requires credits
    'nanobanana-pro', // Paid - requires credits
]

// Video models ranked from best to worst
// Note: veo requires paid credits
const VIDEO_MODELS = [
    'wan',           // Wan 2.6 - best quality (free)
    'seedance',      // Seedance Lite - fast (free)
    'seedance-pro',  // Seedance Pro - high quality
    'veo',           // Veo 3.1 - requires paid credits
]

// Timeout for image generation (some models take longer)
const FETCH_TIMEOUT = 60000 // 60 seconds

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)
        return response
    } catch (error) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
            throw new Error('Request timed out')
        }
        throw error
    }
}

/**
 * Generate an image with automatic model fallback
 * Tries best model first, falls back to next if it fails
 */
export async function generateImage(prompt, options = {}) {
    const {
        width = 1024,
        height = 1024,
        seed = Math.floor(Math.random() * 1000000)
    } = options

    const encodedPrompt = encodeURIComponent(prompt)
    const errors = []

    // Try each model in order until one succeeds
    for (let i = 0; i < IMAGE_MODELS.length; i++) {
        const model = IMAGE_MODELS[i]

        try {
            console.log(`Trying model: ${model} (${i + 1}/${IMAGE_MODELS.length})`)

            let imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`

            if (POLLINATIONS_API_KEY) {
                imageUrl += `&key=${POLLINATIONS_API_KEY}`
            }

            const response = await fetchWithTimeout(imageUrl)

            if (!response.ok) {
                const errMsg = `Model ${model} failed with ${response.status}`
                console.warn(errMsg)
                errors.push(errMsg)
                continue
            }

            // Check if response is actually an image (not rate limit page)
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.startsWith('image/')) {
                const errMsg = `Model ${model} returned non-image content type: ${contentType}`
                console.warn(errMsg)
                errors.push(errMsg)
                continue
            }

            // Convert to data URL
            const blob = await response.blob()

            // Check blob size - rate limit images are usually small
            if (blob.size < 10000) {
                const errMsg = `Model ${model} returned small image (${blob.size} bytes, likely rate limit)`
                console.warn(errMsg)
                errors.push(errMsg)
                continue
            }

            console.log(`✅ Success with model: ${model} (${blob.size} bytes)`)

            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            const errMsg = `Model ${model} error: ${error.message}`
            console.warn(errMsg)
            errors.push(errMsg)
            continue
        }
    }

    // All models failed
    console.error('All image models failed:', errors)
    throw new Error('All models failed. Please try again later.')
}

/**
 * Generate a video with automatic model fallback
 * Video models use the same /image/ endpoint but return video content
 */
export async function generateVideo(prompt, _options = {}) {
    const encodedPrompt = encodeURIComponent(prompt)

    // Try each video model in order
    for (let i = 0; i < VIDEO_MODELS.length; i++) {
        const model = VIDEO_MODELS[i]

        try {
            let videoUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}`

            if (POLLINATIONS_API_KEY) {
                videoUrl += `&key=${POLLINATIONS_API_KEY}`
            }

            const response = await fetchWithTimeout(videoUrl, 120000) // 2 min for video

            if (!response.ok) {
                console.warn(`Video model ${model} failed with ${response.status}, trying next...`)
                continue
            }

            // Convert to blob URL for video playback
            const blob = await response.blob()

            // Check if it's actually video content
            if (blob.size < 50000) {
                console.warn(`Video model ${model} returned small file, trying next...`)
                continue
            }

            return URL.createObjectURL(blob)
        } catch (error) {
            console.warn(`Video model ${model} error: ${error.message}, trying next...`)
            continue
        }
    }

    throw new Error('Video generation failed. Please try again later.')
}

/**
 * Check if service is configured
 */
export function isConfigured() {
    return true
}

/**
 * Check if API key exists
 */
export function hasApiKey() {
    return !!POLLINATIONS_API_KEY
}

export default {
    generateImage,
    generateVideo,
    isConfigured,
    hasApiKey,
    IMAGE_MODELS,
    VIDEO_MODELS
}
