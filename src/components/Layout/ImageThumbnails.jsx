import { useEditor } from '../../context/EditorContext';
import { X, Plus } from 'lucide-react';
import './ImageThumbnails.css';

function ImageThumbnails() {
    const { images, currentImage, selectImage, removeImage } = useEditor();

    if (images.length <= 1) return null;

    return (
        <div className="image-thumbnails-bar">
            <div className="thumbnails-scroll">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={`thumbnail-item ${currentImage?.id === image.id ? 'active' : ''}`}
                        onClick={() => selectImage(image.id)}
                    >
                        <img src={image.preview} alt={image.name} />
                        <button
                            className="thumbnail-remove"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage(image.id);
                            }}
                        >
                            <X size={12} />
                        </button>
                        <span className="thumbnail-name">{image.name}</span>
                    </div>
                ))}
            </div>
            <div className="thumbnails-count">
                {images.length} images
            </div>
        </div>
    );
}

export default ImageThumbnails;
