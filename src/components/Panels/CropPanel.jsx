import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
    Crop,
    RotateCcw,
    RotateCw,
    FlipHorizontal,
    FlipVertical,
    RefreshCw,
    Download,
    Check,
    X
} from 'lucide-react';
import {
    loadImage,
    downloadBlob,
    formatBytes,
    generateOutputFilename,
} from '../../utils/imageProcessing';
import './CropPanel.css';

// Aspect ratio presets
const ratioPresets = [
    { name: 'Free', ratio: null },
    { name: '1:1', ratio: 1 },
    { name: '4:3', ratio: 4 / 3 },
    { name: '3:2', ratio: 3 / 2 },
    { name: '16:9', ratio: 16 / 9 },
    { name: '9:16', ratio: 9 / 16 },
    { name: '3:4', ratio: 3 / 4 },
    { name: '2:3', ratio: 2 / 3 },
];

function CropPanel() {
    const {
        currentImage,
        compression,
        updateImage,
    } = useEditor();

    const [selectedRatio, setSelectedRatio] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [cropResult, setCropResult] = useState(null);

    // Rotation handlers
    const rotateLeft = useCallback(() => {
        setRotation((prev) => (prev - 90) % 360);
    }, []);

    const rotateRight = useCallback(() => {
        setRotation((prev) => (prev + 90) % 360);
    }, []);

    // Apply rotation/flip
    const applyTransform = useCallback(async () => {
        if (!currentImage) return;

        setIsCropping(true);

        try {
            const img = await loadImage(currentImage.originalPreview || currentImage.preview);

            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate dimensions after rotation
            const isRotated = Math.abs(rotation) === 90 || Math.abs(rotation) === 270;
            canvas.width = isRotated ? img.height : img.width;
            canvas.height = isRotated ? img.width : img.height;

            // Apply transformations
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            // Get result
            const dataUrl = canvas.toDataURL('image/png');
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            setCropResult({
                dataUrl,
                blob,
                size: blob.size,
                width: canvas.width,
                height: canvas.height,
            });

            // Update preview
            updateImage(currentImage.id, {
                preview: dataUrl,
                dimensions: { width: canvas.width, height: canvas.height }
            });

        } catch (err) {
            console.error('Transform error:', err);
        } finally {
            setIsCropping(false);
        }
    }, [currentImage, rotation, flipH, flipV, updateImage]);

    // Auto-apply when transform changes
    useEffect(() => {
        if (rotation !== 0 || flipH || flipV) {
            const timer = setTimeout(() => {
                applyTransform();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [rotation, flipH, flipV]);

    // Download
    const handleDownload = useCallback(async () => {
        if (!cropResult) return;

        const filename = generateOutputFilename(
            currentImage.name,
            compression.format,
            '_cropped'
        );

        downloadBlob(cropResult.blob, filename);
    }, [currentImage, cropResult, compression.format]);

    // Reset
    const handleReset = useCallback(() => {
        if (!currentImage) return;
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setSelectedRatio(null);
        setCropResult(null);
        updateImage(currentImage.id, {
            preview: currentImage.originalPreview,
            dimensions: currentImage.dimensions
        });
    }, [currentImage, updateImage]);

    if (!currentImage) {
        return (
            <div className="crop-panel">
                <div className="panel-empty">
                    <Crop size={48} strokeWidth={1} />
                    <p>Upload an image to crop</p>
                </div>
            </div>
        );
    }

    return (
        <div className="crop-panel">
            {/* Rotation & Flip */}
            <div className="panel-section">
                <div className="panel-section-title">Rotate & Flip</div>

                <div className="transform-buttons">
                    <button
                        className="transform-btn"
                        onClick={rotateLeft}
                        title="Rotate left 90°"
                    >
                        <RotateCcw size={20} />
                        <span>Left</span>
                    </button>

                    <button
                        className="transform-btn"
                        onClick={rotateRight}
                        title="Rotate right 90°"
                    >
                        <RotateCw size={20} />
                        <span>Right</span>
                    </button>

                    <button
                        className={`transform-btn ${flipH ? 'active' : ''}`}
                        onClick={() => setFlipH(!flipH)}
                        title="Flip horizontal"
                    >
                        <FlipHorizontal size={20} />
                        <span>Flip H</span>
                    </button>

                    <button
                        className={`transform-btn ${flipV ? 'active' : ''}`}
                        onClick={() => setFlipV(!flipV)}
                        title="Flip vertical"
                    >
                        <FlipVertical size={20} />
                        <span>Flip V</span>
                    </button>
                </div>

                {rotation !== 0 && (
                    <div className="rotation-indicator">
                        Rotation: {rotation}°
                    </div>
                )}
            </div>

            {/* Aspect Ratio Presets */}
            <div className="panel-section">
                <div className="panel-section-title">Aspect Ratio</div>

                <div className="ratio-grid">
                    {ratioPresets.map((preset) => (
                        <button
                            key={preset.name}
                            className={`ratio-btn ${selectedRatio === preset.ratio ? 'active' : ''}`}
                            onClick={() => setSelectedRatio(preset.ratio)}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>

                <p className="help-text">
                    Select a ratio, then drag on the image to crop (coming soon)
                </p>
            </div>

            {/* Current Dimensions */}
            <div className="panel-section">
                <div className="panel-section-title">Current Size</div>
                <div className="size-info">
                    <span>{currentImage.dimensions?.width} × {currentImage.dimensions?.height}</span>
                    <span className="text-muted">{formatBytes(currentImage.size)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="panel-actions">
                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={isCropping}
                >
                    <RefreshCw size={16} />
                    Reset
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleDownload}
                    disabled={isCropping || !cropResult}
                >
                    {isCropping ? (
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
            </div>
        </div>
    );
}

export default CropPanel;
