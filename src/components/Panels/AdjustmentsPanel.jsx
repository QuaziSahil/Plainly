import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
    Sun,
    Contrast,
    Droplets,
    Thermometer,
    Sparkles,
    RefreshCw,
    Download,
    Sliders
} from 'lucide-react';
import {
    loadImage,
    downloadBlob,
    generateOutputFilename,
} from '../../utils/imageProcessing';
import './AdjustmentsPanel.css';

// Default adjustment values
const defaultAdjustments = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sharpen: 0,
};

function AdjustmentsPanel() {
    const {
        currentImage,
        compression,
        updateImage,
    } = useEditor();

    const [adjustments, setAdjustments] = useState(defaultAdjustments);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef(null);

    // Update single adjustment
    const updateAdjustment = useCallback((key, value) => {
        setAdjustments(prev => ({ ...prev, [key]: value }));
    }, []);

    // Apply adjustments with live preview (CSS filters for speed)
    useEffect(() => {
        if (!currentImage) return;

        // Build CSS filter string for live preview
        const filterString = buildFilterString(adjustments);

        // Update the preview with CSS filter (fast, non-destructive)
        updateImage(currentImage.id, {
            cssFilter: filterString
        });
    }, [adjustments, currentImage?.id]);

    // Build CSS filter string
    const buildFilterString = (adj) => {
        const filters = [];
        if (adj.brightness !== 100) filters.push(`brightness(${adj.brightness}%)`);
        if (adj.contrast !== 100) filters.push(`contrast(${adj.contrast}%)`);
        if (adj.saturation !== 100) filters.push(`saturate(${adj.saturation}%)`);
        if (adj.hue !== 0) filters.push(`hue-rotate(${adj.hue}deg)`);
        if (adj.blur > 0) filters.push(`blur(${adj.blur}px)`);
        return filters.join(' ') || 'none';
    };

    // Apply adjustments to canvas (for export)
    const applyToCanvas = useCallback(async () => {
        if (!currentImage) return null;

        const img = await loadImage(currentImage.originalPreview || currentImage.preview);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Apply filter
        ctx.filter = buildFilterString(adjustments);
        ctx.drawImage(img, 0, 0);

        // Reset filter
        ctx.filter = 'none';

        return canvas;
    }, [currentImage, adjustments]);

    // Download with adjustments
    const handleDownload = useCallback(async () => {
        setIsProcessing(true);

        try {
            const canvas = await applyToCanvas();
            if (!canvas) return;

            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, `image/${compression.format}`, compression.quality / 100);
            });

            const filename = generateOutputFilename(
                currentImage.name,
                compression.format,
                '_adjusted'
            );

            downloadBlob(blob, filename);
        } catch (err) {
            console.error('Adjustment export error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [applyToCanvas, currentImage, compression]);

    // Reset to defaults
    const handleReset = useCallback(() => {
        setAdjustments(defaultAdjustments);
        if (currentImage) {
            updateImage(currentImage.id, { cssFilter: 'none' });
        }
    }, [currentImage, updateImage]);

    // Check if modified
    const isModified = Object.keys(adjustments).some(
        key => adjustments[key] !== defaultAdjustments[key]
    );

    if (!currentImage) {
        return (
            <div className="adjustments-panel">
                <div className="panel-empty">
                    <Sliders size={48} strokeWidth={1} />
                    <p>Upload an image to adjust</p>
                </div>
            </div>
        );
    }

    return (
        <div className="adjustments-panel">
            {/* Brightness */}
            <div className="panel-section">
                <div className="adjustment-slider">
                    <div className="adjustment-header">
                        <div className="adjustment-label">
                            <Sun size={16} />
                            <span>Brightness</span>
                        </div>
                        <span className="adjustment-value">{adjustments.brightness}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={adjustments.brightness}
                        onChange={(e) => updateAdjustment('brightness', Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Contrast */}
            <div className="panel-section">
                <div className="adjustment-slider">
                    <div className="adjustment-header">
                        <div className="adjustment-label">
                            <Contrast size={16} />
                            <span>Contrast</span>
                        </div>
                        <span className="adjustment-value">{adjustments.contrast}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={adjustments.contrast}
                        onChange={(e) => updateAdjustment('contrast', Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Saturation */}
            <div className="panel-section">
                <div className="adjustment-slider">
                    <div className="adjustment-header">
                        <div className="adjustment-label">
                            <Droplets size={16} />
                            <span>Saturation</span>
                        </div>
                        <span className="adjustment-value">{adjustments.saturation}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={adjustments.saturation}
                        onChange={(e) => updateAdjustment('saturation', Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Hue */}
            <div className="panel-section">
                <div className="adjustment-slider">
                    <div className="adjustment-header">
                        <div className="adjustment-label">
                            <Thermometer size={16} />
                            <span>Hue</span>
                        </div>
                        <span className="adjustment-value">{adjustments.hue}°</span>
                    </div>
                    <input
                        type="range"
                        min="-180"
                        max="180"
                        value={adjustments.hue}
                        onChange={(e) => updateAdjustment('hue', Number(e.target.value))}
                        className="hue-slider"
                    />
                </div>
            </div>

            {/* Quick Presets */}
            <div className="panel-section">
                <div className="panel-section-title">Quick Enhance</div>
                <div className="preset-buttons">
                    <button
                        className="preset-btn"
                        onClick={() => setAdjustments({ ...defaultAdjustments, brightness: 110, contrast: 110 })}
                    >
                        <Sparkles size={14} />
                        Brighten
                    </button>
                    <button
                        className="preset-btn"
                        onClick={() => setAdjustments({ ...defaultAdjustments, saturation: 130 })}
                    >
                        <Droplets size={14} />
                        Vivid
                    </button>
                    <button
                        className="preset-btn"
                        onClick={() => setAdjustments({ ...defaultAdjustments, saturation: 0 })}
                    >
                        <Contrast size={14} />
                        B&W
                    </button>
                    <button
                        className="preset-btn"
                        onClick={() => setAdjustments({ ...defaultAdjustments, contrast: 85, brightness: 105, saturation: 90 })}
                    >
                        <Sun size={14} />
                        Fade
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="panel-actions">
                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={!isModified || isProcessing}
                >
                    <RefreshCw size={16} />
                    Reset
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleDownload}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <div className="loading-spinner small"></div>
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            Download
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default AdjustmentsPanel;
