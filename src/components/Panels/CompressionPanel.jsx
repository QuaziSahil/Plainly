import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
    Download,
    FileDown,
    Info,
    RefreshCw,
    Target,
    Zap,
    CheckCircle,
    AlertCircle,
    CheckSquare,
    Square,
    Images,
    Settings
} from 'lucide-react';
import {
    compressImage,
    loadImage,
    downloadBlob,
    formatBytes,
    generateOutputFilename,
    estimateCompressedSize
} from '../../utils/imageProcessing';
import './CompressionPanel.css';

const formatOptions = [
    { value: 'jpeg', label: 'JPG', description: 'Best for photos' },
    { value: 'png', label: 'PNG', description: 'Lossless quality' },
    { value: 'webp', label: 'WebP', description: 'Smallest size' },
];

function CompressionPanel() {
    const {
        currentImage,
        images,
        compression,
        updateCompression,
        updateImage,
        isProcessing,
        setProcessing
    } = useEditor();

    const [previewResult, setPreviewResult] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState(null);
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
    const [bulkResults, setBulkResults] = useState([]);

    // Auto-select all images when entering bulk mode
    useEffect(() => {
        if (bulkMode) {
            setSelectedImages(images.map(img => img.id));
        } else {
            setSelectedImages([]);
        }
    }, [bulkMode, images]);

    // Toggle image selection
    const toggleImageSelection = useCallback((imageId) => {
        setSelectedImages(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    }, []);

    // Select/deselect all
    const toggleSelectAll = useCallback(() => {
        if (selectedImages.length === images.length) {
            setSelectedImages([]);
        } else {
            setSelectedImages(images.map(img => img.id));
        }
    }, [selectedImages.length, images]);

    // Estimated size based on settings
    const estimatedSize = useMemo(() => {
        if (!currentImage) return 0;
        return estimateCompressedSize(
            currentImage.size,
            compression.quality,
            compression.format
        );
    }, [currentImage, compression.quality, compression.format]);

    // Total original size of selected images
    const totalOriginalSize = useMemo(() => {
        return images
            .filter(img => selectedImages.includes(img.id))
            .reduce((sum, img) => sum + img.size, 0);
    }, [images, selectedImages]);

    // Total compressed size (after bulk compression)
    const totalCompressedSize = useMemo(() => {
        return bulkResults.reduce((sum, r) => sum + r.size, 0);
    }, [bulkResults]);

    // Compression ratio
    const compressionRatio = useMemo(() => {
        if (!currentImage || !previewResult) return 0;
        return Math.round((1 - previewResult.size / currentImage.size) * 100);
    }, [currentImage, previewResult]);

    // Generate preview when settings change (single image mode)
    const generatePreview = useCallback(async () => {
        if (!currentImage || bulkMode) return;

        setIsCompressing(true);
        setError(null);

        try {
            const img = await loadImage(currentImage.originalPreview || currentImage.preview);

            const options = {
                quality: compression.quality,
                format: compression.format,
                targetSizeKB: compression.targetSizeEnabled ? compression.targetSize : null,
            };

            const result = await compressImage(img, options);
            setPreviewResult(result);

            // Update the preview in editor
            updateImage(currentImage.id, { preview: result.dataUrl });

        } catch (err) {
            console.error('Compression error:', err);
            setError('Failed to compress image');
        } finally {
            setIsCompressing(false);
        }
    }, [currentImage, compression, updateImage, bulkMode]);

    // Auto-generate preview on settings change
    useEffect(() => {
        if (!currentImage || bulkMode) return;

        const timer = setTimeout(() => {
            generatePreview();
        }, 300);

        return () => clearTimeout(timer);
    }, [compression.quality, compression.format, compression.targetSize, compression.targetSizeEnabled, bulkMode]);

    // Download single image
    const handleDownload = useCallback(async () => {
        if (!currentImage || !previewResult) return;

        const filename = generateOutputFilename(
            currentImage.name,
            compression.format
        );

        downloadBlob(previewResult.blob, filename);
    }, [currentImage, previewResult, compression.format]);

    // Bulk compress all selected images
    const handleBulkCompress = useCallback(async () => {
        if (selectedImages.length === 0) return;

        setProcessing(true);
        setBulkResults([]);
        setBulkProgress({ current: 0, total: selectedImages.length });

        const results = [];

        try {
            for (let i = 0; i < selectedImages.length; i++) {
                const image = images.find(img => img.id === selectedImages[i]);
                if (!image) continue;

                setBulkProgress({ current: i + 1, total: selectedImages.length });

                const img = await loadImage(image.originalPreview || image.preview);

                const options = {
                    quality: compression.quality,
                    format: compression.format,
                    targetSizeKB: compression.targetSizeEnabled ? compression.targetSize : null,
                };

                const result = await compressImage(img, options);

                results.push({
                    id: image.id,
                    name: image.name,
                    originalSize: image.size,
                    size: result.size,
                    blob: result.blob,
                    saved: Math.round((1 - result.size / image.size) * 100)
                });
            }

            setBulkResults(results);

        } catch (err) {
            console.error('Bulk compression error:', err);
            setError('Failed to compress some images');
        } finally {
            setProcessing(false);
        }
    }, [selectedImages, images, compression, setProcessing]);

    // Download all compressed images
    const handleDownloadAll = useCallback(async () => {
        if (bulkResults.length === 0) return;

        for (const result of bulkResults) {
            const filename = generateOutputFilename(result.name, compression.format);
            downloadBlob(result.blob, filename);
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    }, [bulkResults, compression.format]);

    // Reset
    const handleReset = useCallback(() => {
        if (!currentImage) return;
        updateImage(currentImage.id, { preview: currentImage.originalPreview });
        setPreviewResult(null);
        setBulkResults([]);
        updateCompression({ quality: 80, format: 'jpeg', targetSize: 500, targetSizeEnabled: false });
    }, [currentImage, updateImage, updateCompression]);

    if (images.length === 0) {
        return (
            <div className="compression-panel">
                <div className="panel-empty">
                    <FileDown size={48} strokeWidth={1} />
                    <p>Upload images to compress</p>
                </div>
            </div>
        );
    }

    return (
        <div className="compression-panel">
            {/* Bulk Mode Toggle */}
            {images.length > 1 && (
                <div className="panel-section bulk-toggle-section">
                    <button
                        className={`bulk-toggle-btn ${bulkMode ? 'active' : ''}`}
                        onClick={() => setBulkMode(!bulkMode)}
                    >
                        <Images size={18} />
                        <span>Bulk Mode ({images.length} images)</span>
                        {bulkMode && <CheckCircle size={16} />}
                    </button>
                </div>
            )}

            {/* Bulk Image Selection */}
            {bulkMode && (
                <div className="panel-section">
                    <div className="bulk-header">
                        <button className="select-all-btn" onClick={toggleSelectAll}>
                            {selectedImages.length === images.length ? (
                                <><CheckSquare size={16} /> Deselect All</>
                            ) : (
                                <><Square size={16} /> Select All</>
                            )}
                        </button>
                        <span className="selected-count">{selectedImages.length} selected</span>
                    </div>

                    <div className="bulk-image-list">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className={`bulk-image-item ${selectedImages.includes(image.id) ? 'selected' : ''}`}
                                onClick={() => toggleImageSelection(image.id)}
                            >
                                <div className="bulk-image-checkbox">
                                    {selectedImages.includes(image.id) ? (
                                        <CheckSquare size={18} />
                                    ) : (
                                        <Square size={18} />
                                    )}
                                </div>
                                <img src={image.preview} alt={image.name} className="bulk-image-thumb" />
                                <div className="bulk-image-info">
                                    <span className="bulk-image-name">{image.name}</span>
                                    <span className="bulk-image-size">{formatBytes(image.size)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Format Selection */}
            <div className="panel-section">
                <div className="panel-section-title">Output Format</div>
                <div className="format-grid">
                    {formatOptions.map((format) => (
                        <button
                            key={format.value}
                            className={`format-option ${compression.format === format.value ? 'active' : ''}`}
                            onClick={() => updateCompression({ format: format.value })}
                        >
                            <span className="format-label">{format.label}</span>
                            <span className="format-desc">{format.description}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quality Slider */}
            <div className="panel-section">
                <div className="panel-section-title">Quality</div>
                <div className="control-group">
                    <div className="control-label">
                        <span>Compression Level</span>
                        <span className="control-value">{compression.quality}%</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={compression.quality}
                        onChange={(e) => updateCompression({ quality: Number(e.target.value) })}
                        disabled={compression.format === 'png'}
                    />
                    <div className="slider-labels">
                        <span>Smaller</span>
                        <span>Better Quality</span>
                    </div>
                </div>

                {compression.format === 'png' && (
                    <div className="info-message">
                        <Info size={14} />
                        <span>PNG is lossless - quality slider doesn't apply</span>
                    </div>
                )}
            </div>

            {/* Target File Size */}
            <div className="panel-section">
                <div className="panel-section-title">Target Size (Optional)</div>
                <div className="target-size-toggle">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={compression.targetSizeEnabled}
                            onChange={(e) => updateCompression({ targetSizeEnabled: e.target.checked })}
                        />
                        <span className="toggle-switch"></span>
                        <span>Compress to specific size</span>
                    </label>
                </div>

                {compression.targetSizeEnabled && (
                    <div className="control-group">
                        <div className="target-size-input">
                            <Target size={16} />
                            <input
                                type="number"
                                min="10"
                                max="10000"
                                value={compression.targetSize || 500}
                                onChange={(e) => updateCompression({ targetSize: Number(e.target.value) })}
                                placeholder="500"
                            />
                            <span className="input-suffix">KB</span>
                        </div>
                        <p className="help-text">
                            Each image will be compressed to fit within this size
                        </p>
                    </div>
                )}
            </div>

            {/* Size Comparison */}
            {!bulkMode && currentImage && (
                <div className="panel-section">
                    <div className="panel-section-title">Size Comparison</div>
                    <div className="size-comparison">
                        <div className="size-item">
                            <span className="size-label">Original</span>
                            <span className="size-value">{formatBytes(currentImage.size)}</span>
                        </div>
                        <div className="size-arrow">→</div>
                        <div className="size-item result">
                            <span className="size-label">
                                {previewResult ? 'Compressed' : 'Estimated'}
                            </span>
                            <span className="size-value">
                                {previewResult
                                    ? formatBytes(previewResult.size)
                                    : formatBytes(estimatedSize)
                                }
                            </span>
                        </div>
                    </div>

                    {previewResult && compressionRatio > 0 && (
                        <div className="compression-result">
                            <CheckCircle size={16} />
                            <span>Reduced by <strong>{compressionRatio}%</strong></span>
                        </div>
                    )}
                </div>
            )}

            {/* Bulk Size Summary */}
            {bulkMode && selectedImages.length > 0 && (
                <div className="panel-section">
                    <div className="panel-section-title">Bulk Summary</div>
                    <div className="size-comparison">
                        <div className="size-item">
                            <span className="size-label">Total Original</span>
                            <span className="size-value">{formatBytes(totalOriginalSize)}</span>
                        </div>
                        <div className="size-arrow">→</div>
                        <div className="size-item result">
                            <span className="size-label">
                                {bulkResults.length > 0 ? 'Compressed' : 'Estimated'}
                            </span>
                            <span className="size-value">
                                {bulkResults.length > 0
                                    ? formatBytes(totalCompressedSize)
                                    : '~' + formatBytes(totalOriginalSize * (compression.quality / 100) * 0.7)
                                }
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Progress */}
            {isProcessing && bulkMode && (
                <div className="panel-section">
                    <div className="bulk-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            Processing {bulkProgress.current} of {bulkProgress.total}...
                        </span>
                    </div>
                </div>
            )}

            {/* Bulk Results */}
            {bulkMode && bulkResults.length > 0 && (
                <div className="panel-section">
                    <div className="panel-section-title">Results</div>
                    <div className="bulk-results">
                        {bulkResults.map((result) => (
                            <div key={result.id} className="bulk-result-item">
                                <span className="result-name">{result.name}</span>
                                <span className="result-saved">-{result.saved}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="panel-section">
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="panel-actions">
                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={isCompressing || isProcessing}
                >
                    <RefreshCw size={16} />
                    Reset
                </button>

                {bulkMode ? (
                    bulkResults.length > 0 ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleDownloadAll}
                            disabled={isProcessing}
                        >
                            <Download size={16} />
                            Download All ({bulkResults.length})
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={handleBulkCompress}
                            disabled={isProcessing || selectedImages.length === 0}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="loading-spinner small"></div>
                                    Compressing...
                                </>
                            ) : (
                                <>
                                    <Zap size={16} />
                                    Compress {selectedImages.length} Images
                                </>
                            )}
                        </button>
                    )
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={handleDownload}
                        disabled={isCompressing || !previewResult}
                    >
                        {isCompressing ? (
                            <>
                                <div className="loading-spinner small"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                Download
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default CompressionPanel;
