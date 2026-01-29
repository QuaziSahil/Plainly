import { useState, useCallback } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
    Sparkles,
    RefreshCw,
    Download,
    Wand2
} from 'lucide-react';
import {
    loadImage,
    downloadBlob,
    generateOutputFilename,
} from '../../utils/imageProcessing';
import './FiltersPanel.css';

// Filter presets
const filterPresets = [
    { id: 'none', name: 'Original', filter: 'none' },
    { id: 'vintage', name: 'Vintage', filter: 'sepia(30%) contrast(110%) brightness(105%)' },
    { id: 'warm', name: 'Warm', filter: 'sepia(20%) saturate(120%) brightness(105%)' },
    { id: 'cool', name: 'Cool', filter: 'saturate(90%) hue-rotate(10deg) brightness(105%)' },
    { id: 'noir', name: 'Noir', filter: 'grayscale(100%) contrast(120%)' },
    { id: 'fade', name: 'Fade', filter: 'contrast(90%) brightness(110%) saturate(85%)' },
    { id: 'vivid', name: 'Vivid', filter: 'saturate(150%) contrast(110%)' },
    { id: 'dramatic', name: 'Dramatic', filter: 'contrast(130%) saturate(110%) brightness(95%)' },
    { id: 'bright', name: 'Bright', filter: 'brightness(120%) contrast(105%)' },
    { id: 'muted', name: 'Muted', filter: 'saturate(70%) brightness(105%)' },
    { id: 'retro', name: 'Retro', filter: 'sepia(40%) hue-rotate(-10deg) saturate(130%)' },
    { id: 'cinema', name: 'Cinema', filter: 'contrast(115%) saturate(90%) brightness(95%)' },
];

function FiltersPanel() {
    const {
        currentImage,
        compression,
        updateImage,
    } = useEditor();

    const [selectedFilter, setSelectedFilter] = useState('none');
    const [isProcessing, setIsProcessing] = useState(false);

    // Apply filter instantly (live preview)
    const applyFilter = useCallback((filterId) => {
        if (!currentImage) return;

        const filter = filterPresets.find(f => f.id === filterId);
        setSelectedFilter(filterId);

        // Apply CSS filter for live preview
        updateImage(currentImage.id, {
            cssFilter: filter?.filter || 'none'
        });
    }, [currentImage, updateImage]);

    // Download with filter
    const handleDownload = useCallback(async () => {
        if (!currentImage) return;

        setIsProcessing(true);

        try {
            const img = await loadImage(currentImage.originalPreview || currentImage.preview);
            const filter = filterPresets.find(f => f.id === selectedFilter);

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            ctx.filter = filter?.filter || 'none';
            ctx.drawImage(img, 0, 0);

            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, `image/${compression.format}`, compression.quality / 100);
            });

            const filename = generateOutputFilename(
                currentImage.name,
                compression.format,
                `_${selectedFilter}`
            );

            downloadBlob(blob, filename);
        } catch (err) {
            console.error('Filter export error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [currentImage, selectedFilter, compression]);

    // Reset
    const handleReset = useCallback(() => {
        setSelectedFilter('none');
        if (currentImage) {
            updateImage(currentImage.id, { cssFilter: 'none' });
        }
    }, [currentImage, updateImage]);

    if (!currentImage) {
        return (
            <div className="filters-panel">
                <div className="panel-empty">
                    <Wand2 size={48} strokeWidth={1} />
                    <p>Upload an image to apply filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="filters-panel">
            <div className="panel-section">
                <div className="panel-section-title">Choose Filter</div>

                <div className="filter-grid">
                    {filterPresets.map((filter) => (
                        <button
                            key={filter.id}
                            className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                            onClick={() => applyFilter(filter.id)}
                        >
                            <div
                                className="filter-preview"
                                style={{
                                    backgroundImage: `url(${currentImage.originalPreview || currentImage.preview})`,
                                    filter: filter.filter
                                }}
                            />
                            <span className="filter-name">{filter.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="panel-actions">
                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={selectedFilter === 'none' || isProcessing}
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

export default FiltersPanel;
