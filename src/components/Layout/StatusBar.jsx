import { useEditor } from '../../context/EditorContext';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import './StatusBar.css';

function StatusBar() {
    const { currentImage, zoom, setZoom, images } = useEditor();

    const handleZoomIn = () => setZoom(Math.min(zoom + 25, 400));
    const handleZoomOut = () => setZoom(Math.max(zoom - 25, 10));
    const handleZoomFit = () => setZoom(100);

    // Format file size
    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <footer className="app-status-bar">
            <div className="status-left">
                {currentImage ? (
                    <>
                        <span className="status-item">
                            {currentImage.dimensions?.width} × {currentImage.dimensions?.height}
                        </span>
                        <span className="status-separator">•</span>
                        <span className="status-item">
                            {formatSize(currentImage.size)}
                        </span>
                        <span className="status-separator">•</span>
                        <span className="status-item">
                            {currentImage.type?.split('/')[1]?.toUpperCase()}
                        </span>
                    </>
                ) : (
                    <span className="status-item text-muted">No image selected</span>
                )}
            </div>

            <div className="status-center">
                {images.length > 1 && (
                    <span className="status-item">
                        {images.findIndex(img => img.id === currentImage?.id) + 1} / {images.length} images
                    </span>
                )}
            </div>

            <div className="status-right">
                <div className="zoom-controls">
                    <button
                        className="zoom-btn tooltip"
                        data-tooltip="Zoom out"
                        onClick={handleZoomOut}
                        disabled={zoom <= 10}
                    >
                        <ZoomOut size={14} />
                    </button>

                    <span className="zoom-value">{zoom}%</span>

                    <button
                        className="zoom-btn tooltip"
                        data-tooltip="Zoom in"
                        onClick={handleZoomIn}
                        disabled={zoom >= 400}
                    >
                        <ZoomIn size={14} />
                    </button>

                    <button
                        className="zoom-btn tooltip"
                        data-tooltip="Fit to screen"
                        onClick={handleZoomFit}
                    >
                        <Maximize2 size={14} />
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default StatusBar;
