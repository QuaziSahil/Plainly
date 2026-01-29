import { useEditor } from '../../context/EditorContext';
import {
    Maximize,
    Crop,
    SlidersHorizontal,
    Palette,
    Type,
    Layers,
    Download,
    Image as ImageIcon
} from 'lucide-react';
import './Sidebar.css';

const tools = [
    {
        id: 'compress',
        name: 'Compress',
        icon: Download,
        description: 'Reduce file size while maintaining quality'
    },
    {
        id: 'resize',
        name: 'Resize',
        icon: Maximize,
        description: 'Change image dimensions with presets'
    },
    {
        id: 'crop',
        name: 'Crop',
        icon: Crop,
        description: 'Trim and frame your image'
    },
    {
        id: 'adjust',
        name: 'Adjust',
        icon: SlidersHorizontal,
        description: 'Fine-tune brightness, contrast, and more'
    },
    {
        id: 'filters',
        name: 'Filters',
        icon: Palette,
        description: 'Apply creative filters and effects'
    },
    {
        id: 'text',
        name: 'Text',
        icon: Type,
        description: 'Add text overlays and watermarks'
    },
];

function Sidebar() {
    const { activeTool, setActiveTool, images } = useEditor();
    const hasImages = images.length > 0;

    return (
        <aside className="app-sidebar">
            <div className="sidebar-tools">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;

                    return (
                        <button
                            key={tool.id}
                            className={`sidebar-tool ${isActive ? 'active' : ''} ${!hasImages ? 'disabled' : ''}`}
                            onClick={() => hasImages && setActiveTool(tool.id)}
                            disabled={!hasImages}
                            title={tool.description}
                        >
                            <div className="sidebar-tool-icon">
                                <Icon size={22} />
                            </div>
                            <span className="sidebar-tool-name">{tool.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-help">
                    <span className="sidebar-help-text">Select a tool to get started</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
