/**
 * Plainly AI - Image & Video Generation Service
 * Powered by Pollinations.AI with automatic model fallback
 * Users see "Plainly AI" branding, models auto-fallback from best to worst
 * 
 * Updated Feb 2026: User has UNLIMITED API key with ALL models access
 * Models ordered from BEST QUALITY to WORST for optimal results
 */

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

// Image models ranked from BEST to WORST quality
// User has unlimited access to all models
const IMAGE_MODELS = [
    // PREMIUM models (best quality first)
    'seedream-pro',   // #1 ranked, best consistency - Seedream 4.5 Pro
    'gptimage-large', // GPT Image 1.5 - high quality creative
    'flux',           // Flux Schnell - excellent quality
    'gptimage',       // GPT Image 1 Mini - good creative
    'seedream',       // Seedream 4.0 - artistic
    'klein-large',    // FLUX.2 Klein 9B - higher quality
    'klein',          // FLUX.2 Klein 4B - fast quality
    'turbo',          // SDXL Turbo - fast reliable
    'nanobanana-pro', // NanoBanana Pro - creative
    'nanobanana',     // NanoBanana - experimental
    'zimage',         // Z-Image Turbo
    'kontext',        // FLUX.1 Kontext - context editing
]

// Video models ranked from BEST to WORST quality
const VIDEO_MODELS = [
    'veo',           // Veo 3.1 - Google's best video AI
    'wan',           // Wan 2.6 - excellent quality
    'seedance-pro',  // Seedance Pro - high quality
    'seedance',      // Seedance Lite - fast
]

// Timeout for image generation (some models take longer)
const FETCH_TIMEOUT = 90000 // 90 seconds (increased for premium models)

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

    console.log('API Key present:', !!POLLINATIONS_API_KEY)
    console.log('API Key value (first 10 chars):', POLLINATIONS_API_KEY?.substring(0, 10) || 'MISSING')

    // Try each model in order until one succeeds
    for (let i = 0; i < IMAGE_MODELS.length; i++) {
        const model = IMAGE_MODELS[i]

        try {
            console.log(`🎨 Trying image model: ${model} (${i + 1}/${IMAGE_MODELS.length})`)

            // Build URL with API key
            let imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`

            // CRITICAL: Add API key for premium model access
            if (POLLINATIONS_API_KEY) {
                imageUrl += `&key=${POLLINATIONS_API_KEY}`
            } else {
                console.warn('⚠️ No API key found - premium models may not work')
            }

            console.log('Request URL:', imageUrl.substring(0, 100) + '...')

            const response = await fetchWithTimeout(imageUrl)

            if (!response.ok) {
                const errMsg = `Model ${model} failed with HTTP ${response.status}`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            // Check if response is actually an image (not rate limit page)
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.startsWith('image/')) {
                const errMsg = `Model ${model} returned non-image: ${contentType}`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            // Convert to data URL
            const blob = await response.blob()

            // Check blob size - rate limit images are usually small
            if (blob.size < 10000) {
                const errMsg = `Model ${model} returned small image (${blob.size} bytes)`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            console.log(`✅ SUCCESS with model: ${model} (${blob.size} bytes)`)

            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            const errMsg = `Model ${model} error: ${error.message}`
            console.warn('❌', errMsg)
            errors.push(errMsg)
            continue
        }
    }

    // All models failed
    console.error('🚨 All image models failed:', errors)
    throw new Error('All models failed. Please try again later.')
}

/**
 * Generate a video with automatic model fallback
 * Uses gen.pollinations.ai endpoint
 */
export async function generateVideo(prompt, _options = {}) {
    const encodedPrompt = encodeURIComponent(prompt)
    const errors = []

    console.log('🎬 Starting video generation...')
    console.log('API Key present:', !!POLLINATIONS_API_KEY)

    // Try each video model in order
    for (let i = 0; i < VIDEO_MODELS.length; i++) {
        const model = VIDEO_MODELS[i]

        try {
            console.log(`🎬 Trying video model: ${model} (${i + 1}/${VIDEO_MODELS.length})`)

            // Use gen.pollinations.ai for video
            let videoUrl = `https://gen.pollinations.ai/video/${encodedPrompt}?model=${model}`

            // Add API key for premium access
            if (POLLINATIONS_API_KEY) {
                videoUrl += `&key=${POLLINATIONS_API_KEY}`
            }

            const response = await fetchWithTimeout(videoUrl, 180000) // 3 min for video

            if (!response.ok) {
                const errMsg = `Video model ${model} failed with ${response.status}`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            // Convert to blob URL for video playback
            const blob = await response.blob()

            // Check if it's actually video content
            if (blob.size < 50000) {
                const errMsg = `Video model ${model} returned small file (${blob.size} bytes)`
                console.warn('❌', errMsg)
                errors.push(errMsg)
                continue
            }

            console.log(`✅ SUCCESS with video model: ${model} (${blob.size} bytes)`)
            return URL.createObjectURL(blob)
        } catch (error) {
            const errMsg = `Video model ${model} error: ${error.message}`
            console.warn('❌', errMsg)
            errors.push(errMsg)
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
