/**
 * Image Processing Utilities
 * Handles compression, format conversion, and image manipulation
 */

/**
 * Compress image to target quality or file size
 * @param {HTMLImageElement} image - Source image element
 * @param {Object} options - Compression options
 * @param {number} options.quality - Quality 1-100
 * @param {string} options.format - 'jpeg', 'png', 'webp'
 * @param {number|null} options.targetSizeKB - Target file size in KB (optional)
 * @returns {Promise<{blob: Blob, dataUrl: string, size: number}>}
 */
export async function compressImage(image, options = {}) {
    const {
        quality = 80,
        format = 'jpeg',
        targetSizeKB = null,
        width = image.naturalWidth,
        height = image.naturalHeight,
    } = options;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Draw image
    ctx.drawImage(image, 0, 0, width, height);

    // Get MIME type
    const mimeType = getMimeType(format);

    // If target size is specified, use iterative compression
    if (targetSizeKB) {
        return await compressToTargetSize(canvas, mimeType, targetSizeKB);
    }

    // Standard quality-based compression
    const finalQuality = mimeType === 'image/png' ? undefined : quality / 100;

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        blob,
                        dataUrl: reader.result,
                        size: blob.size,
                        width,
                        height,
                        format,
                    });
                };
                reader.readAsDataURL(blob);
            },
            mimeType,
            finalQuality
        );
    });
}

/**
 * Compress image to target file size using binary search
 * @param {HTMLCanvasElement} canvas
 * @param {string} mimeType
 * @param {number} targetSizeKB
 * @returns {Promise<{blob: Blob, dataUrl: string, size: number}>}
 */
async function compressToTargetSize(canvas, mimeType, targetSizeKB) {
    const targetBytes = targetSizeKB * 1024;

    // PNG doesn't support quality parameter
    if (mimeType === 'image/png') {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        blob,
                        dataUrl: reader.result,
                        size: blob.size,
                        width: canvas.width,
                        height: canvas.height,
                        format: 'png',
                    });
                };
                reader.readAsDataURL(blob);
            }, mimeType);
        });
    }

    let minQuality = 0.1;
    let maxQuality = 1.0;
    let bestBlob = null;
    let bestDataUrl = null;
    let iterations = 0;
    const maxIterations = 10;

    while (iterations < maxIterations && maxQuality - minQuality > 0.02) {
        const testQuality = (minQuality + maxQuality) / 2;

        const result = await new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({ blob, dataUrl: reader.result });
                    };
                    reader.readAsDataURL(blob);
                },
                mimeType,
                testQuality
            );
        });

        if (result.blob.size <= targetBytes) {
            bestBlob = result.blob;
            bestDataUrl = result.dataUrl;
            minQuality = testQuality;
        } else {
            maxQuality = testQuality;
        }

        iterations++;
    }

    // If we couldn't find a good quality, use the minimum
    if (!bestBlob) {
        const result = await new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({ blob, dataUrl: reader.result });
                    };
                    reader.readAsDataURL(blob);
                },
                mimeType,
                minQuality
            );
        });
        bestBlob = result.blob;
        bestDataUrl = result.dataUrl;
    }

    return {
        blob: bestBlob,
        dataUrl: bestDataUrl,
        size: bestBlob.size,
        width: canvas.width,
        height: canvas.height,
        format: mimeType.split('/')[1],
    };
}

/**
 * Convert format string to MIME type
 */
function getMimeType(format) {
    const mimeTypes = {
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
    };
    return mimeTypes[format.toLowerCase()] || 'image/jpeg';
}

/**
 * Load image from data URL
 * @param {string} dataUrl
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}

/**
 * Download blob as file
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Download multiple files as ZIP
 * @param {Array<{blob: Blob, name: string}>} files
 */
export async function downloadAsZip(files) {
    // Simple implementation without external library
    // For proper ZIP support, would need JSZip or similar
    // For now, download files individually with a delay
    for (let i = 0; i < files.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        downloadBlob(files[i].blob, files[i].name);
    }
}

/**
 * Estimate compressed file size
 * @param {number} originalSize - Original file size in bytes
 * @param {number} quality - Quality 1-100
 * @param {string} format - Target format
 * @returns {number} Estimated size in bytes
 */
export function estimateCompressedSize(originalSize, quality, format) {
    // Rough estimation based on format and quality
    const formatMultiplier = {
        jpeg: 0.6,
        jpg: 0.6,
        png: 1.0,
        webp: 0.5,
    };

    const qualityMultiplier = quality / 100;
    const baseMultiplier = formatMultiplier[format.toLowerCase()] || 0.7;

    // WebP and JPEG benefit more from quality reduction
    if (format.toLowerCase() === 'webp' || format.toLowerCase() === 'jpeg') {
        return Math.round(originalSize * baseMultiplier * qualityMultiplier);
    }

    return Math.round(originalSize * baseMultiplier);
}

/**
 * Format bytes to human readable string
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Get file extension from format
 * @param {string} format
 * @returns {string}
 */
export function getExtension(format) {
    const extensions = {
        jpeg: 'jpg',
        jpg: 'jpg',
        png: 'png',
        webp: 'webp',
    };
    return extensions[format.toLowerCase()] || 'jpg';
}

/**
 * Generate output filename
 * @param {string} originalName
 * @param {string} format
 * @param {string} suffix
 * @returns {string}
 */
export function generateOutputFilename(originalName, format, suffix = '_compressed') {
    const nameParts = originalName.split('.');
    nameParts.pop(); // Remove original extension
    const baseName = nameParts.join('.');
    return `${baseName}${suffix}.${getExtension(format)}`;
}
