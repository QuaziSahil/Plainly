import { createContext, useContext, useState, useCallback, useReducer } from 'react';

// Initial state for the editor
const initialState = {
    // Images
    images: [], // Array of { id, file, name, size, dimensions, preview, processed }
    selectedImageId: null,

    // Current image state
    currentImage: null, // The active image being edited
    originalImage: null, // Original for reset

    // Tool state
    activeTool: null, // 'compress', 'resize', 'crop', 'adjust', 'filter', 'text'

    // Compression settings
    compression: {
        quality: 80,
        format: 'jpeg', // 'jpeg', 'png', 'webp'
        targetSize: null, // null = quality-based, number = target KB
        targetSizeEnabled: false,
    },

    // Resize settings
    resize: {
        width: null,
        height: null,
        lockAspectRatio: true,
        preset: null,
    },

    // Adjustments
    adjustments: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        exposure: 0,
        temperature: 0,
        tint: 0,
        hue: 0,
        vibrance: 0,
    },

    // History for undo/redo
    history: [],
    historyIndex: -1,

    // UI state
    isProcessing: false,
    isBulkMode: false,
    showPanel: true,

    // Zoom
    zoom: 100,
};

// Action types
const actions = {
    ADD_IMAGES: 'ADD_IMAGES',
    REMOVE_IMAGE: 'REMOVE_IMAGE',
    CLEAR_IMAGES: 'CLEAR_IMAGES',
    SELECT_IMAGE: 'SELECT_IMAGE',
    SET_ACTIVE_TOOL: 'SET_ACTIVE_TOOL',
    UPDATE_COMPRESSION: 'UPDATE_COMPRESSION',
    UPDATE_RESIZE: 'UPDATE_RESIZE',
    UPDATE_ADJUSTMENTS: 'UPDATE_ADJUSTMENTS',
    RESET_ADJUSTMENTS: 'RESET_ADJUSTMENTS',
    SET_PROCESSING: 'SET_PROCESSING',
    SET_BULK_MODE: 'SET_BULK_MODE',
    TOGGLE_PANEL: 'TOGGLE_PANEL',
    SET_ZOOM: 'SET_ZOOM',
    ADD_TO_HISTORY: 'ADD_TO_HISTORY',
    UNDO: 'UNDO',
    REDO: 'REDO',
    UPDATE_IMAGE: 'UPDATE_IMAGE',
};

// Reducer
function editorReducer(state, action) {
    switch (action.type) {
        case actions.ADD_IMAGES:
            return {
                ...state,
                images: [...state.images, ...action.payload],
                selectedImageId: state.selectedImageId || action.payload[0]?.id,
                currentImage: state.currentImage || action.payload[0],
                originalImage: state.originalImage || action.payload[0],
            };

        case actions.REMOVE_IMAGE:
            const filteredImages = state.images.filter(img => img.id !== action.payload);
            return {
                ...state,
                images: filteredImages,
                selectedImageId: state.selectedImageId === action.payload
                    ? filteredImages[0]?.id || null
                    : state.selectedImageId,
            };

        case actions.CLEAR_IMAGES:
            return {
                ...state,
                images: [],
                selectedImageId: null,
                currentImage: null,
                originalImage: null,
                history: [],
                historyIndex: -1,
            };

        case actions.SELECT_IMAGE:
            const selectedImg = state.images.find(img => img.id === action.payload);
            return {
                ...state,
                selectedImageId: action.payload,
                currentImage: selectedImg,
                originalImage: selectedImg,
            };

        case actions.SET_ACTIVE_TOOL:
            return { ...state, activeTool: action.payload };

        case actions.UPDATE_COMPRESSION:
            return {
                ...state,
                compression: { ...state.compression, ...action.payload },
            };

        case actions.UPDATE_RESIZE:
            return {
                ...state,
                resize: { ...state.resize, ...action.payload },
            };

        case actions.UPDATE_ADJUSTMENTS:
            return {
                ...state,
                adjustments: { ...state.adjustments, ...action.payload },
            };

        case actions.RESET_ADJUSTMENTS:
            return {
                ...state,
                adjustments: initialState.adjustments,
            };

        case actions.SET_PROCESSING:
            return { ...state, isProcessing: action.payload };

        case actions.SET_BULK_MODE:
            return { ...state, isBulkMode: action.payload };

        case actions.TOGGLE_PANEL:
            return { ...state, showPanel: !state.showPanel };

        case actions.SET_ZOOM:
            return { ...state, zoom: action.payload };

        case actions.UPDATE_IMAGE:
            return {
                ...state,
                images: state.images.map(img =>
                    img.id === action.payload.id ? { ...img, ...action.payload.updates } : img
                ),
                currentImage: state.selectedImageId === action.payload.id
                    ? { ...state.currentImage, ...action.payload.updates }
                    : state.currentImage,
            };

        case actions.ADD_TO_HISTORY:
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            return {
                ...state,
                history: [...newHistory, action.payload],
                historyIndex: newHistory.length,
            };

        case actions.UNDO:
            if (state.historyIndex <= 0) return state;
            return {
                ...state,
                historyIndex: state.historyIndex - 1,
            };

        case actions.REDO:
            if (state.historyIndex >= state.history.length - 1) return state;
            return {
                ...state,
                historyIndex: state.historyIndex + 1,
            };

        default:
            return state;
    }
}

// Create context
const EditorContext = createContext(null);

// Provider component
export function EditorProvider({ children }) {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    // Theme state
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('plainly-theme');
            if (savedTheme) return savedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark';
    });

    // Apply theme
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('plainly-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [theme]);

    // Initialize theme on mount
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Helper functions
    const addImages = useCallback((images) => {
        dispatch({ type: actions.ADD_IMAGES, payload: images });
    }, []);

    const removeImage = useCallback((id) => {
        dispatch({ type: actions.REMOVE_IMAGE, payload: id });
    }, []);

    const clearImages = useCallback(() => {
        dispatch({ type: actions.CLEAR_IMAGES });
    }, []);

    const selectImage = useCallback((id) => {
        dispatch({ type: actions.SELECT_IMAGE, payload: id });
    }, []);

    const setActiveTool = useCallback((tool) => {
        dispatch({ type: actions.SET_ACTIVE_TOOL, payload: tool });
    }, []);

    const updateCompression = useCallback((settings) => {
        dispatch({ type: actions.UPDATE_COMPRESSION, payload: settings });
    }, []);

    const updateResize = useCallback((settings) => {
        dispatch({ type: actions.UPDATE_RESIZE, payload: settings });
    }, []);

    const updateAdjustments = useCallback((settings) => {
        dispatch({ type: actions.UPDATE_ADJUSTMENTS, payload: settings });
    }, []);

    const resetAdjustments = useCallback(() => {
        dispatch({ type: actions.RESET_ADJUSTMENTS });
    }, []);

    const setProcessing = useCallback((isProcessing) => {
        dispatch({ type: actions.SET_PROCESSING, payload: isProcessing });
    }, []);

    const setBulkMode = useCallback((isBulk) => {
        dispatch({ type: actions.SET_BULK_MODE, payload: isBulk });
    }, []);

    const togglePanel = useCallback(() => {
        dispatch({ type: actions.TOGGLE_PANEL });
    }, []);

    const setZoom = useCallback((zoom) => {
        dispatch({ type: actions.SET_ZOOM, payload: zoom });
    }, []);

    const updateImage = useCallback((id, updates) => {
        dispatch({ type: actions.UPDATE_IMAGE, payload: { id, updates } });
    }, []);

    const value = {
        ...state,
        theme,
        toggleTheme,
        addImages,
        removeImage,
        clearImages,
        selectImage,
        setActiveTool,
        updateCompression,
        updateResize,
        updateAdjustments,
        resetAdjustments,
        setProcessing,
        setBulkMode,
        togglePanel,
        setZoom,
        updateImage,
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

// Custom hook for using the context
export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
}

export default EditorContext;
