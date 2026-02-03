/**
 * Plainly AI - Image & Video Generation Service
 * Powered by Pollinations.AI with automatic model fallback
 * Users see "Plainly AI" branding, models auto-fallback from best to worst
 * 
 * Updated Feb 2026: Using gen.pollinations.ai unified API endpoint
 * User has UNLIMITED API key with ALL models access
 */

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

// Image models ranked from BEST to WORST quality
// User has unlimited access to all models
const IMAGE_MODELS = [
    // PREMIUM models (best quality first)
    'flux',           // Flux Schnell - most reliable, excellent quality
    'turbo',          // SDXL Turbo - fast and reliable
    'seedream',       // Seedream 4.0 - artistic
    'gptimage',       // GPT Image 1 Mini - good creative
    'klein',          // FLUX.2 Klein 4B - fast quality
    'seedream-pro',   // Seedream 4.5 Pro - premium
    'gptimage-large', // GPT Image 1.5 - high quality
    'klein-large',    // FLUX.2 Klein 9B - higher quality
    'nanobanana',     // NanoBanana - experimental
    'nanobanana-pro', // NanoBanana Pro - creative
    'zimage',         // Z-Image Turbo
    'kontext',        // FLUX.1 Kontext - context editing
]

// Video models ranked from BEST to WORST quality
const VIDEO_MODELS = [
    'wan',           // Wan 2.6 - best free quality
    'seedance',      // Seedance Lite - fast
    'seedance-pro',  // Seedance Pro - high quality
    'veo',           // Veo 3.1 - Google's video AI
]

// Timeout for generation
const IMAGE_TIMEOUT = 90000  // 90 seconds
const VIDEO_TIMEOUT = 180000 // 3 minutes

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url, timeout) {
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
 * Uses gen.pollinations.ai unified endpoint
 */
export async function generateImage(prompt, options = {}) {
    const {
        width = 1024,
        height = 1024,
        seed = Math.floor(Math.random() * 1000000)
    } = options

    const encodedPrompt = encodeURIComponent(prompt)
    const errors = []

    console.log('🎨 Image Generation Started')
    console.log('API Key present:', !!POLLINATIONS_API_KEY)

    // Try each model in order until one succeeds
    for (let i = 0; i < IMAGE_MODELS.length; i++) {
        const model = IMAGE_MODELS[i]

        try {
            console.log(`🎨 Trying: ${model} (${i + 1}/${IMAGE_MODELS.length})`)

            // Use gen.pollinations.ai unified endpoint
            const params = new URLSearchParams({
                width: width.toString(),
                height: height.toString(),
                seed: seed.toString(),
                nologo: 'true',
                model: model,
            })

            if (POLLINATIONS_API_KEY) {
                params.append('key', POLLINATIONS_API_KEY)
            }

            const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`
            console.log('URL:', imageUrl.substring(0, 80) + '...')

            const response = await fetchWithTimeout(imageUrl, IMAGE_TIMEOUT)

            if (!response.ok) {
                const errMsg = `${model}: HTTP ${response.status}`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            // Check content type
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.startsWith('image/')) {
                const errMsg = `${model}: Not an image (${contentType})`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            // Get blob
            const blob = await response.blob()

            // Verify size (small = likely error page)
            if (blob.size < 10000) {
                const errMsg = `${model}: Too small (${blob.size}b)`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            console.log(`✅ SUCCESS: ${model} (${(blob.size / 1024).toFixed(1)}KB)`)

            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            const errMsg = `${model}: ${error.message}`
            console.warn('❌', errMsg)
            errors.push(errMsg)
            continue
        }
    }

    // All failed
    console.error('🚨 All models failed:', errors)
    throw new Error('All models failed. Please try again later.')
}

/**
 * Generate a video with automatic model fallback
 */
export async function generateVideo(prompt, _options = {}) {
    const encodedPrompt = encodeURIComponent(prompt)
    const errors = []

    console.log('🎬 Video Generation Started')

    for (let i = 0; i < VIDEO_MODELS.length; i++) {
        const model = VIDEO_MODELS[i]

        try {
            console.log(`🎬 Trying: ${model} (${i + 1}/${VIDEO_MODELS.length})`)

            const params = new URLSearchParams({ model })
            if (POLLINATIONS_API_KEY) {
                params.append('key', POLLINATIONS_API_KEY)
            }

            const videoUrl = `https://gen.pollinations.ai/video/${encodedPrompt}?${params.toString()}`

            const response = await fetchWithTimeout(videoUrl, VIDEO_TIMEOUT)

            if (!response.ok) {
                errors.push(`${model}: HTTP ${response.status}`)
                continue
            }

            const blob = await response.blob()
            if (blob.size < 50000) {
                errors.push(`${model}: Too small`)
                continue
            }

            console.log(`✅ SUCCESS: ${model} (${(blob.size / 1024).toFixed(1)}KB)`)
            return URL.createObjectURL(blob)
        } catch (error) {
            errors.push(`${model}: ${error.message}`)
            continue
        }
    }

    console.error('🚨 All video models failed:', errors)
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
