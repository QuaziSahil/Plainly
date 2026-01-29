import { useEditor } from '../../context/EditorContext';
import { Sun, Moon, Upload, Download, Trash2, FolderOpen } from 'lucide-react';
import './Header.css';

function Header() {
    const {
        theme,
        toggleTheme,
        images,
        clearImages,
        isProcessing
    } = useEditor();

    const handleExport = () => {
        // Will be implemented in compression phase
        console.log('Export clicked');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <div className="header-logo">
                    <div className="logo-icon">P</div>
                    <span className="logo-text">Plainly</span>
                </div>
            </div>

            <div className="header-center">
                {images.length > 0 && (
                    <div className="header-actions">
                        <button className="btn btn-ghost" disabled>
                            <FolderOpen size={18} />
                            <span>{images.length} file{images.length !== 1 ? 's' : ''}</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="header-right">
                {images.length > 0 && (
                    <>
                        <button
                            className="btn btn-ghost tooltip"
                            data-tooltip="Clear all images"
                            onClick={clearImages}
                            disabled={isProcessing}
                        >
                            <Trash2 size={18} />
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={handleExport}
                            disabled={isProcessing}
                        >
                            <Download size={18} />
                            <span>Export</span>
                        </button>
                    </>
                )}

                <button
                    className="btn btn-icon btn-ghost tooltip"
                    data-tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}

export default Header;
