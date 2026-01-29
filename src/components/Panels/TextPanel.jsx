import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
    Type,
    RefreshCw,
    Download,
    Plus,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic
} from 'lucide-react';
import {
    loadImage,
    downloadBlob,
    generateOutputFilename,
} from '../../utils/imageProcessing';
import './TextPanel.css';

// Font options
const fonts = [
    'Inter',
    'Arial',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Impact',
    'Comic Sans MS',
];

// Color presets
const colorPresets = [
    '#FFFFFF', '#000000', '#EC4899', '#F472B6',
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
];

function TextPanel() {
    const {
        currentImage,
        compression,
        updateImage,
    } = useEditor();

    const [text, setText] = useState('Your text here');
    const [fontSize, setFontSize] = useState(48);
    const [fontFamily, setFontFamily] = useState('Inter');
    const [color, setColor] = useState('#FFFFFF');
    const [align, setAlign] = useState('center');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [positionX, setPositionX] = useState(50); // percentage
    const [positionY, setPositionY] = useState(50);
    const [opacity, setOpacity] = useState(100);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewDataUrl, setPreviewDataUrl] = useState(null);

    // Generate preview with text overlay
    const generatePreview = useCallback(async () => {
        if (!currentImage || !text.trim()) return;

        try {
            const img = await loadImage(currentImage.originalPreview || currentImage.preview);

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Setup text style
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity / 100;
            ctx.font = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
            ctx.textAlign = align;
            ctx.textBaseline = 'middle';

            // Add shadow for readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Calculate position
            const x = (positionX / 100) * canvas.width;
            const y = (positionY / 100) * canvas.height;

            // Draw text
            ctx.fillText(text, x, y);

            const dataUrl = canvas.toDataURL('image/png');
            setPreviewDataUrl(dataUrl);

            // Update preview in editor
            updateImage(currentImage.id, { preview: dataUrl });

        } catch (err) {
            console.error('Text overlay error:', err);
        }
    }, [currentImage, text, fontSize, fontFamily, color, align, bold, italic, positionX, positionY, opacity, updateImage]);

    // Auto-update preview when settings change
    useEffect(() => {
        if (!currentImage) return;

        const timer = setTimeout(() => {
            generatePreview();
        }, 200);

        return () => clearTimeout(timer);
    }, [text, fontSize, fontFamily, color, align, bold, italic, positionX, positionY, opacity, currentImage?.id]);

    // Download with text
    const handleDownload = useCallback(async () => {
        if (!previewDataUrl) return;

        setIsProcessing(true);

        try {
            // Convert data URL to blob
            const response = await fetch(previewDataUrl);
            const blob = await response.blob();

            const filename = generateOutputFilename(
                currentImage.name,
                compression.format,
                '_watermarked'
            );

            downloadBlob(blob, filename);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [previewDataUrl, currentImage, compression.format]);

    // Reset
    const handleReset = useCallback(() => {
        if (!currentImage) return;
        setText('Your text here');
        setFontSize(48);
        setFontFamily('Inter');
        setColor('#FFFFFF');
        setAlign('center');
        setBold(false);
        setItalic(false);
        setPositionX(50);
        setPositionY(50);
        setOpacity(100);
        setPreviewDataUrl(null);
        updateImage(currentImage.id, { preview: currentImage.originalPreview });
    }, [currentImage, updateImage]);

    if (!currentImage) {
        return (
            <div className="text-panel">
                <div className="panel-empty">
                    <Type size={48} strokeWidth={1} />
                    <p>Upload an image to add text</p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-panel">
            {/* Text Input */}
            <div className="panel-section">
                <div className="panel-section-title">Text</div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your text..."
                    className="text-input"
                    rows={2}
                />
            </div>

            {/* Font Settings */}
            <div className="panel-section">
                <div className="panel-section-title">Font</div>

                <div className="font-row">
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="font-select"
                    >
                        {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                        ))}
                    </select>
                </div>

                <div className="font-row">
                    <div className="size-control">
                        <button onClick={() => setFontSize(Math.max(12, fontSize - 4))}>
                            <Minus size={14} />
                        </button>
                        <span className="size-value">{fontSize}px</span>
                        <button onClick={() => setFontSize(Math.min(200, fontSize + 4))}>
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="style-buttons">
                        <button
                            className={`style-btn ${bold ? 'active' : ''}`}
                            onClick={() => setBold(!bold)}
                        >
                            <Bold size={16} />
                        </button>
                        <button
                            className={`style-btn ${italic ? 'active' : ''}`}
                            onClick={() => setItalic(!italic)}
                        >
                            <Italic size={16} />
                        </button>
                    </div>
                </div>

                <div className="align-buttons">
                    <button
                        className={`align-btn ${align === 'left' ? 'active' : ''}`}
                        onClick={() => setAlign('left')}
                    >
                        <AlignLeft size={16} />
                    </button>
                    <button
                        className={`align-btn ${align === 'center' ? 'active' : ''}`}
                        onClick={() => setAlign('center')}
                    >
                        <AlignCenter size={16} />
                    </button>
                    <button
                        className={`align-btn ${align === 'right' ? 'active' : ''}`}
                        onClick={() => setAlign('right')}
                    >
                        <AlignRight size={16} />
                    </button>
                </div>
            </div>

            {/* Color */}
            <div className="panel-section">
                <div className="panel-section-title">Color</div>
                <div className="color-grid">
                    {colorPresets.map((c) => (
                        <button
                            key={c}
                            className={`color-btn ${color === c ? 'active' : ''}`}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="color-picker"
                    />
                </div>
            </div>

            {/* Position */}
            <div className="panel-section">
                <div className="panel-section-title">Position</div>

                <div className="control-group">
                    <div className="control-label">
                        <span>Horizontal</span>
                        <span className="control-value">{positionX}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={positionX}
                        onChange={(e) => setPositionX(Number(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <div className="control-label">
                        <span>Vertical</span>
                        <span className="control-value">{positionY}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={positionY}
                        onChange={(e) => setPositionY(Number(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <div className="control-label">
                        <span>Opacity</span>
                        <span className="control-value">{opacity}%</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="panel-actions">
                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={isProcessing}
                >
                    <RefreshCw size={16} />
                    Reset
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleDownload}
                    disabled={isProcessing || !previewDataUrl}
                >
                    {isProcessing ? (
                        <>
                            <div className="loading-spinner small"></div>
                            Saving...
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

export default TextPanel;
