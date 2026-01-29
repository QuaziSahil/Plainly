import { useEditor } from '../../context/EditorContext';
import { X, Info } from 'lucide-react';
import CompressionPanel from '../Panels/CompressionPanel';
import ResizePanel from '../Panels/ResizePanel';
import CropPanel from '../Panels/CropPanel';
import AdjustmentsPanel from '../Panels/AdjustmentsPanel';
import FiltersPanel from '../Panels/FiltersPanel';
import TextPanel from '../Panels/TextPanel';
import './Panel.css';

const toolInfo = {
    compress: {
        title: 'Compress',
        description: 'Reduce file size while maintaining quality.',
        component: CompressionPanel,
    },
    resize: {
        title: 'Resize',
        description: 'Change dimensions with presets.',
        component: ResizePanel,
    },
    crop: {
        title: 'Crop & Rotate',
        description: 'Rotate, flip, and frame your image.',
        component: CropPanel,
    },
    adjust: {
        title: 'Adjustments',
        description: 'Tune brightness, contrast & more.',
        component: AdjustmentsPanel,
    },
    filters: {
        title: 'Filters',
        description: 'Apply creative filters instantly.',
        component: FiltersPanel,
    },
    text: {
        title: 'Text & Watermark',
        description: 'Add text overlays to your images.',
        component: TextPanel,
    },
};

function Panel() {
    const { activeTool, setActiveTool, showPanel, images } = useEditor();

    if (!activeTool || !showPanel || images.length === 0) return null;

    const info = toolInfo[activeTool];
    const ToolComponent = info?.component;

    return (
        <aside className={`app-panel ${activeTool ? 'open' : ''}`}>
            <div className="panel-header">
                <h3 className="panel-title">{info?.title}</h3>
                <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => setActiveTool(null)}
                >
                    <X size={18} />
                </button>
            </div>

            <div className="panel-description">
                <Info size={14} />
                <span>{info?.description}</span>
            </div>

            <div className="panel-content">
                {ToolComponent ? (
                    <ToolComponent />
                ) : (
                    <div className="panel-placeholder">
                        <p>Coming soon...</p>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default Panel;
