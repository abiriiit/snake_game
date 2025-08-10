// Game Configuration
const GAME_CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 400,
    CELL_SIZE: 20,
    
    // Game mechanics
    DEFAULT_SPEED: 5,
    MIN_SPEED: 1,
    MAX_SPEED: 10,
    INITIAL_SNAKE_LENGTH: 1,
    
    // Scoring
    POINTS_PER_FOOD: 1, // Multiplied by speed
    
    // Visual effects
    ENABLE_PARTICLES: true,
    ENABLE_ANIMATIONS: true,
    ENABLE_SOUND: false, // Set to true if you add sound files
    
    // Colors (can be overridden by themes)
    COLORS: {
        SNAKE_HEAD: '#28a745',
        SNAKE_BODY: '#1e7e34',
        FOOD: '#ff6b6b',
        BACKGROUND: '#f8f9fa',
        PARTICLE: '#4ecdc4'
    },
    
    // Responsive breakpoints
    BREAKPOINTS: {
        MOBILE: 480,
        TABLET: 768,
        DESKTOP: 1024
    },
    
    // Local storage keys
    STORAGE_KEYS: {
        HIGH_SCORE: 'snakeHighScore',
        THEME: 'snakeGameTheme',
        SETTINGS: 'snakeGameSettings'
    },
    
    // Animation timing
    ANIMATION: {
        FOOD_PULSE_SPEED: 0.005,
        PARTICLE_LIFE: 30,
        SCORE_POPUP_DURATION: 1000
    }
};

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
}