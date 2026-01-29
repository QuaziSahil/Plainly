import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
    Lock,
    Unlock,
    RefreshCw,
    Download,
    Maximize,
    Instagram,
    Twitter,
    Youtube,
    Facebook,
    Smartphone,
    Monitor,
    Image as ImageIcon
} from 'lucide-react';
import {
    compressImage,
    loadImage,
    downloadBlob,
    formatBytes,
    generateOutputFilename,
} from '../../utils/imageProcessing';
import './ResizePanel.css';

// Social media and common presets
const resizePresets = [
    {
        category: 'Social Media',
        presets: [
            { name: 'Instagram Post', width: 1080, height: 1080, icon: 'instagram' },
            { name: 'Instagram Story', width: 1080, height: 1920, icon: 'instagram' },
            { name: 'Twitter Post', width: 1200, height: 675, icon: 'twitter' },
            { name: 'Facebook Post', width: 1200, height: 630, icon: 'facebook' },
            { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: 'youtube' },
        ]
    },
    {
        category: 'Web',
        presets: [
            { name: 'HD', width: 1920, height: 1080, icon: 'monitor' },
            { name: '4K', width: 3840, height: 2160, icon: 'monitor' },
            { name: 'Thumbnail', width: 150, height: 150, icon: 'image' },
            { name: 'Banner', width: 1200, height: 400, icon: 'image' },
        ]
    },
    {
        category: 'Mobile',
        presets: [
            { name: 'iPhone', width: 1170, height: 2532, icon: 'smartphone' },
            { name: 'Android', width: 1080, height: 2400, icon: 'smartphone' },
        ]
    }
];

function ResizePanel() {
    const {
        currentImage,
        images,
        resize,
        updateResize,
        updateImage,
        compression,
        isProcessing,
        setProcessing
    } = useEditor();

    const [width, setWidth] = useState(currentImage?.dimensions?.width || 0);
    const [height, setHeight] = useState(currentImage?.dimensions?.height || 0);
    const [lockRatio, setLockRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeResult, setResizeResult] = useState(null);

    // Update dimensions when image changes
    useEffect(() => {
        if (currentImage?.dimensions) {
            setWidth(currentImage.dimensions.width);
            setHeight(currentImage.dimensions.height);
            setAspectRatio(currentImage.dimensions.width / currentImage.dimensions.height);
        }
    }, [currentImage]);

    // Handle width change
    const handleWidthChange = useCallback((newWidth) => {
        const w = parseInt(newWidth) || 0;
        setWidth(w);
        if (lockRatio && w > 0) {
            setHeight(Math.round(w / aspectRatio));
        }
    }, [lockRatio, aspectRatio]);

    // Handle height change
    const handleHeightChange = useCallback((newHeight) => {
        const h = parseInt(newHeight) || 0;
        setHeight(h);
        if (lockRatio && h > 0) {
            setWidth(Math.round(h * aspectRatio));
        }
    }, [lockRatio, aspectRatio]);

    // Apply preset
    const applyPreset = useCallback((preset) => {
        setWidth(preset.width);
        setHeight(preset.height);
        setLockRatio(false); // Unlock ratio when applying preset
        setAspectRatio(preset.width / preset.height);
    }, []);

    // Resize image
    const handleResize = useCallback(async () => {
        if (!currentImage || width <= 0 || height <= 0) return;

        setIsResizing(true);

        try {
            const img = await loadImage(currentImage.originalPreview || currentImage.preview);

            // Create canvas with new dimensions
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Draw resized image
            ctx.drawImage(img, 0, 0, width, height);

            // Get result as data URL
            const dataUrl = canvas.toDataURL('image/png');

            // Get blob for size info
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });

            setResizeResult({
                dataUrl,
                blob,
                size: blob.size,
                width,
                height,
            });

            // Update preview
            updateImage(currentImage.id, {
                preview: dataUrl,
                dimensions: { width, height }
            });

        } catch (err) {
            console.error('Resize error:', err);
        } finally {
            setIsResizing(false);
        }
    }, [currentImage, width, height, updateImage]);

    // Download resized image
    const handleDownload = useCallback(async () => {
        if (!resizeResult) return;

        const filename = generateOutputFilename(
            currentImage.name,
            compression.format,
            '_resized'
        );

        downloadBlob(resizeResult.blob, filename);
    }, [currentImage, resizeResult, compression.format]);

    // Reset to original
    const handleReset = useCallback(() => {
        if (!currentImage) return;
        setWidth(currentImage.dimensions?.width || 0);
        setHeight(currentImage.dimensions?.height || 0);
        setAspectRatio((currentImage.dimensions?.width || 1) / (currentImage.dimensions?.height || 1));
        setLockRatio(true);
        setResizeResult(null);
        updateImage(currentImage.id, {
            preview: currentImage.originalPreview,
            dimensions: currentImage.dimensions
        });
    }, [currentImage, updateImage]);

    // Calculate size change
    const sizeChange = useMemo(() => {
        if (!currentImage?.dimensions) return { percent: 0, direction: '' };
        const original = currentImage.dimensions.width * currentImage.dimensions.height;
        const newSize = width * height;
        const percent = Math.round(((newSize - original) / original) * 100);
        return {
            percent: Math.abs(percent),
            direction: percent > 0 ? 'larger' : percent < 0 ? 'smaller' : 'same'
        };
    }, [currentImage, width, height]);

    if (!currentImage) {
        return (
            <div className="resize-panel">
                <div className="panel-empty">
                    <Maximize size={48} strokeWidth={1} />
                    <p>Upload an image to resize</p>
                </div>
            </div>
        );
    }

    return (
        <div className="resize-panel">
            {/* Dimensions Input */}
            <div className="panel-section">
                <div className="panel-section-title">Dimensions</div>

                <div className="dimension-inputs">
                    <div className="dimension-group">
                        <label>Width</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                min="1"
                                max="10000"
                                value={width}
                                onChange={(e) => handleWidthChange(e.target.value)}
                            />
                            <span className="unit">px</span>
                        </div>
                    </div>

                    <button
                        className={`lock-btn ${lockRatio ? 'locked' : ''}`}
                        onClick={() => setLockRatio(!lockRatio)}
                        title={lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                    >
                        {lockRatio ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>

                    <div className="dimension-group">
                        <label>Height</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                min="1"
                                max="10000"
                                value={height}
                                onChange={(e) => handleHeightChange(e.target.value)}
                            />
                            <span className="unit">px</span>
                        </div>
                    </div>
                </div>

                {sizeChange.direction !== 'same' && (
                    <div className={`size-indicator ${sizeChange.direction}`}>
                        {sizeChange.direction === 'larger' ? '↑' : '↓'} {sizeChange.percent}% {sizeChange.direction}
                    </div>
                )}
            </div>

            {/* Presets */}
            <div className="panel-section">
                <div className="panel-section-title">Quick Presets</div>

                {resizePresets.map((category) => (
                    <div key={category.category} className="preset-category">
                        <div className="preset-category-name">{category.category}</div>
                        <div className="preset-grid">
                            {category.presets.map((preset) => (
                                <button
                                    key={preset.name}
                                    className="preset-btn"
                                    onClick={() => applyPreset(preset)}
                                    title={`${preset.width} × ${preset.height}`}
                                >
                                    <span className="preset-name">{preset.name}</span>
                                    <span className="preset-dims">{preset.width}×{preset.height}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Original Info */}
            <div className="panel-section">
                <div className="panel-section-title">Original Size</div>
                <div className="original-info">
                    <span>{currentImage.dimensions?.width} × {currentImage.dimensions?.height}</span>
                    <span className="text-muted">({formatBytes(currentImage.size)})</span>
                </div>
            </div>

            {/* Actions */}
            <div className="panel-actions">
                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={isResizing}
                >
                    <RefreshCw size={16} />
                    Reset
                </button>

                <button
                    className="btn btn-primary"
                    onClick={resizeResult ? handleDownload : handleResize}
                    disabled={isResizing || width <= 0 || height <= 0}
                >
                    {isResizing ? (
                        <>
                            <div className="loading-spinner small"></div>
                            Resizing...
                        </>
                    ) : resizeResult ? (
                        <>
                            <Download size={16} />
                            Download
                        </>
                    ) : (
                        <>
                            <Maximize size={16} />
                            Apply Resize
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ResizePanel;
