import { useEditor } from '../../context/EditorContext';
import {
    FileDown,
    Maximize,
    Crop,
    Sliders,
    Wand2,
    Type
} from 'lucide-react';
import './MobileNav.css';

const tools = [
    { id: 'compress', icon: FileDown, label: 'Compress' },
    { id: 'resize', icon: Maximize, label: 'Resize' },
    { id: 'crop', icon: Crop, label: 'Crop' },
    { id: 'adjust', icon: Sliders, label: 'Adjust' },
    { id: 'filters', icon: Wand2, label: 'Filters' },
];

function MobileNav() {
    const { activeTool, setActiveTool, images } = useEditor();

    if (images.length === 0) return null;

    return (
        <nav className="mobile-nav">
            {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                    <button
                        key={tool.id}
                        className={`mobile-nav-item ${activeTool === tool.id ? 'active' : ''}`}
                        onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                    >
                        <Icon size={22} />
                        <span>{tool.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

export default MobileNav;
