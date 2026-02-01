/**
 * Plainly AI - Image & Video Generation Service
 * Powered by Pollinations.AI with automatic model fallback
 * Users see "Plainly AI" branding, models auto-fallback from best to worst
 */

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

// Image models ranked from best to worst quality
// Based on 2026 benchmarks: Seedream 4.5 #1 ranked, Flux best quality
const IMAGE_MODELS = [
    'seedream-pro',   // #1 ranked, best consistency
    'flux',           // Best quality, recommended
    'gptimage-large', // GPT Image 1.5 - creative
    'seedream',       // Seedream 4.0 - artistic
    'gptimage',       // GPT Image 1 Mini
    'klein-large',    // FLUX.2 Klein 9B
    'klein',          // FLUX.2 Klein 4B - fast
    'turbo',          // SDXL Turbo - fastest
    'zimage',         // Z-Image Turbo
    'nanobanana-pro', // NanoBanana Pro
    'nanobanana',     // NanoBanana - experimental
    'kontext'         // FLUX.1 Kontext - context editing
]

// Video models ranked from best to worst
const VIDEO_MODELS = [
    'wan',           // Wan 2.6 - best quality
    'veo',           // Veo 3.1 - Google video AI
    'seedance-pro',  // Seedance Pro - high quality
    'seedance'       // Seedance Lite - fast
]

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

    // Try each model in order until one succeeds
    for (let i = 0; i < IMAGE_MODELS.length; i++) {
        const model = IMAGE_MODELS[i]

        try {
            let imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`

            if (POLLINATIONS_API_KEY) {
                imageUrl += `&key=${POLLINATIONS_API_KEY}`
            }

            const response = await fetch(imageUrl)

            if (!response.ok) {
                console.warn(`Model ${model} failed with ${response.status}, trying next...`)
                continue
            }

            // Check if response is actually an image (not rate limit page)
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.startsWith('image/')) {
                console.warn(`Model ${model} returned non-image, trying next...`)
                continue
            }

            // Convert to data URL
            const blob = await response.blob()

            // Check blob size - rate limit images are usually small
            if (blob.size < 10000) {
                console.warn(`Model ${model} returned small image (likely rate limit), trying next...`)
                continue
            }

            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            console.warn(`Model ${model} error: ${error.message}, trying next...`)
            continue
        }
    }

    throw new Error('All models failed. Please try again later.')
}

/**
 * Generate a video with automatic model fallback
 * Video models use the same /image/ endpoint but return video content
 */
export async function generateVideo(prompt, options = {}) {
    const encodedPrompt = encodeURIComponent(prompt)

    // Try each video model in order
    for (let i = 0; i < VIDEO_MODELS.length; i++) {
        const model = VIDEO_MODELS[i]

        try {
            let videoUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}`

            if (POLLINATIONS_API_KEY) {
                videoUrl += `&key=${POLLINATIONS_API_KEY}`
            }

            const response = await fetch(videoUrl)

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
