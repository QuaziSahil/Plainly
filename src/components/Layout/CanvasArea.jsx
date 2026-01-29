import { useState, useCallback, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Upload, ImagePlus, FolderOpen } from 'lucide-react';
import ImageThumbnails from './ImageThumbnails';
import './CanvasArea.css';

function CanvasArea() {
    const { images, currentImage, addImages, zoom, setZoom } = useEditor();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Generate unique ID
    const generateId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Process uploaded files
    const processFiles = useCallback(async (files) => {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) return;

        const processedImages = await Promise.all(
            imageFiles.map(async (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            resolve({
                                id: generateId(),
                                file,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                dimensions: { width: img.width, height: img.height },
                                preview: e.target.result,
                                originalPreview: e.target.result,
                            });
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            })
        );

        addImages(processedImages);
    }, [addImages]);

    // Drag and drop handlers
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    // File input handler
    const handleFileSelect = useCallback((e) => {
        processFiles(e.target.files);
        e.target.value = ''; // Reset input
    }, [processFiles]);

    // Click to upload
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // Zoom handlers
    const handleWheel = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -10 : 10;
            setZoom(Math.min(Math.max(zoom + delta, 10), 400));
        }
    }, [zoom, setZoom]);

    // Format file size
    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    // Empty state - upload zone
    if (images.length === 0) {
        return (
            <main
                className={`app-canvas-area ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="upload-zone" onClick={handleClick}>
                    <div className="upload-zone-content">
                        <div className="upload-icon">
                            <ImagePlus size={64} strokeWidth={1.5} />
                        </div>
                        <h2 className="upload-title">Drop images here</h2>
                        <p className="upload-subtitle">or click to browse</p>
                        <div className="upload-formats">
                            <span>JPG</span>
                            <span>PNG</span>
                            <span>WebP</span>
                            <span>GIF</span>
                            <span>BMP</span>
                        </div>
                        <button className="btn btn-primary upload-btn">
                            <FolderOpen size={18} />
                            <span>Choose Files</span>
                        </button>
                    </div>

                    {isDragging && (
                        <div className="upload-overlay">
                            <Upload size={48} />
                            <span>Drop to upload</span>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </main>
        );
    }

    // Image preview
    return (
        <main
            className="app-canvas-area has-image"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onWheel={handleWheel}
        >
            <div
                className="canvas-container"
                style={{ transform: `scale(${zoom / 100})` }}
            >
                {currentImage && (
                    <img
                        src={currentImage.preview}
                        alt={currentImage.name}
                        className="canvas-image"
                        style={{ filter: currentImage.cssFilter || 'none' }}
                    />
                )}
            </div>

            {isDragging && (
                <div className="upload-overlay-floating">
                    <Upload size={32} />
                    <span>Add more images</span>
                </div>
            )}

            <ImageThumbnails />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </main>
    );
}

export default CanvasArea;
