// server.js (Main MCP Server for Railway)
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

class SnakeGameMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'snake-game-mcp-server',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.gameState = {
            isRunning: false,
            isPaused: false,
            score: 0,
            highScore: 0,
            speed: 5,
            snake: [],
            food: {},
            direction: 'right',
            theme: 'dark'
        };

        this.setupToolHandlers();
    }

    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'get_game_info',
                        description: 'Get information about the Snake Game including features and how to play',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'get_game_state',
                        description: 'Get current game state including score, high score, and game status',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'get_game_statistics',
                        description: 'Get game statistics and configuration details',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'get_controls_guide',
                        description: 'Get a guide on how to control the snake game',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'simulate_game_action',
                        description: 'Simulate a game action (for demonstration purposes)',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                action: {
                                    type: 'string',
                                    enum: ['start', 'pause', 'restart', 'move_up', 'move_down', 'move_left', 'move_right', 'change_speed'],
                                    description: 'The action to perform',
                                },
                                value: {
                                    type: 'number',
                                    description: 'Value for actions like change_speed (1-10)',
                                    minimum: 1,
                                    maximum: 10,
                                },
                            },
                            required: ['action'],
                        },
                    },
                    {
                        name: 'get_theme_info',
                        description: 'Get information about available themes and visual features',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    }
                ],
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    case 'get_game_info':
                        return await this.getGameInfo();
                    
                    case 'get_game_state':
                        return await this.getGameState();
                    
                    case 'get_game_statistics':
                        return await this.getGameStatistics();
                    
                    case 'get_controls_guide':
                        return await this.getControlsGuide();
                    
                    case 'simulate_game_action':
                        return await this.simulateGameAction(args.action, args.value);
                    
                    case 'get_theme_info':
                        return await this.getThemeInfo();
                    
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error executing tool ${name}: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }

    async getGameInfo() {
        return {
            content: [
                {
                    type: 'text',
                    text: `🐍 Enhanced Snake Game Information

**About the Game:**
This is an enhanced version of the classic Snake game built with HTML5, CSS3, and JavaScript. The game features modern design, smooth animations, and responsive controls.

**Key Features:**
• Responsive design that works on desktop, tablet, and mobile
• Adjustable game speed (1-10 levels)
• Dark/Light theme toggle
• Touch-friendly directional controls
• Particle effects and animations
• Score tracking with persistent high scores
• Smooth gameplay with 60fps animations
• Visual feedback for all interactions

**Game Objective:**
Control the snake to eat food and grow longer. Avoid hitting the walls or the snake's own body. The longer you survive and the more food you eat, the higher your score!

**Scoring System:**
Points = Food eaten × Current Speed Level
Higher speeds give more points but make the game more challenging.`,
                },
            ],
        };
    }

    async getGameState() {
        return {
            content: [
                {
                    type: 'text',
                    text: `🎮 Current Game State:

**Game Status:** ${this.gameState.isRunning ? (this.gameState.isPaused ? 'Paused' : 'Running') : 'Not Started'}
**Current Score:** ${this.gameState.score}
**High Score:** ${this.gameState.highScore}
**Speed Level:** ${this.gameState.speed}/10
**Snake Length:** ${this.gameState.snake.length || 1}
**Current Direction:** ${this.gameState.direction}
**Active Theme:** ${this.gameState.theme}

**Canvas Size:** 600×400 pixels
**Cell Size:** 20×20 pixels
**Grid Size:** 30×20 cells`,
                },
            ],
        };
    }

    async getGameStatistics() {
        return {
            content: [
                {
                    type: 'text',
                    text: `📊 Game Configuration & Statistics:

**Canvas Settings:**
• Width: 600px, Height: 400px
• Cell Size: 20×20 pixels
• Grid: 30×20 cells

**Speed Settings:**
• Min Speed: 1 (300ms interval)
• Max Speed: 10 (50ms interval)  
• Default Speed: 5 (150ms interval)

**Scoring:**
• Points per food: Speed Level × 1
• Speed multiplier encourages faster play

**Visual Features:**
• Particle effects enabled
• Smooth animations
• Pulsing food animation
• Theme switching (Dark/Light)
• Responsive design breakpoints:
  - Mobile: <480px
  - Tablet: 480-768px  
  - Desktop: >768px

**Storage:**
• High scores saved locally
• Theme preference saved
• Settings persistent across sessions`,
                },
            ],
        };
    }

    async getControlsGuide() {
        return {
            content: [
                {
                    type: 'text',
                    text: `🎮 Snake Game Controls Guide:

**Movement Controls:**
• Arrow Keys (↑↓←→) - Move snake in respective directions
• On-screen Direction Buttons - Touch/click for mobile users
• WASD keys - Alternative movement (if enabled)

**Game Controls:**
• Start Game Button - Begin a new game
• Pause Button - Pause/Resume current game
• Restart Button - Restart current game
• Speed Slider - Adjust game speed (1-10)

**Keyboard Shortcuts:**
• Space Bar - Pause/Resume game
• R Key - Restart game (when game over)

**Mobile/Touch Controls:**
• Large directional buttons optimized for touch
• All buttons have haptic feedback
• Responsive design adapts to screen size

**Tips:**
• Higher speeds give more points but increase difficulty
• Use the pause feature to take breaks
• The snake cannot reverse direction directly
• Plan your moves ahead to avoid trapping yourself`,
                },
            ],
        };
    }

    async simulateGameAction(action, value) {
        switch (action) {
            case 'start':
                this.gameState.isRunning = true;
                this.gameState.isPaused = false;
                this.gameState.snake = [{ x: 15, y: 10 }];
                this.gameState.direction = 'right';
                return {
                    content: [{
                        type: 'text',
                        text: '🎮 Game Started! Snake is now moving right from the center of the game area.',
                    }],
                };

            case 'pause':
                if (this.gameState.isRunning) {
                    this.gameState.isPaused = !this.gameState.isPaused;
                    return {
                        content: [{
                            type: 'text',
                            text: `⏸️ Game ${this.gameState.isPaused ? 'Paused' : 'Resumed'}`,
                        }],
                    };
                }
                return {
                    content: [{
                        type: 'text',
                        text: '❌ Cannot pause - game is not running',
                    }],
                };

            case 'restart':
                this.gameState = {
                    ...this.gameState,
                    isRunning: true,
                    isPaused: false,
                    score: 0,
                    snake: [{ x: 15, y: 10 }],
                    direction: 'right'
                };
                return {
                    content: [{
                        type: 'text',
                        text: '🔄 Game Restarted! Score reset to 0, snake back to center.',
                    }],
                };

            case 'change_speed':
                if (value >= 1 && value <= 10) {
                    this.gameState.speed = value;
                    return {
                        content: [{
                            type: 'text',
                            text: `⚡ Speed changed to ${value}/10. Game interval: ${300 - (value * 25)}ms`,
                        }],
                    };
                }
                return {
                    content: [{
                        type: 'text',
                        text: '❌ Invalid speed value. Must be between 1 and 10.',
                    }],
                };

            case 'move_up':
            case 'move_down':
            case 'move_left':
            case 'move_right':
                const direction = action.replace('move_', '');
                const opposites = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' };
                
                if (this.gameState.direction !== opposites[direction]) {
                    this.gameState.direction = direction;
                    return {
                        content: [{
                            type: 'text',
                            text: `🐍 Snake direction changed to ${direction.toUpperCase()}`,
                        }],
                    };
                }
                return {
                    content: [{
                        type: 'text',
                        text: `❌ Cannot reverse direction from ${this.gameState.direction} to ${direction}`,
                    }],
                };

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    async getThemeInfo() {
        return {
            content: [
                {
                    type: 'text',
                    text: `🎨 Theme & Visual Features:

**Available Themes:**
• Dark Theme (Default) - Purple/blue gradient background
• Light Theme - Blue gradient with light elements

**Visual Effects:**
• Animated background particles
• Pulsing food animation
• Smooth snake movement
• Gradient snake body with eye details
• Particle effects when eating food
• Ripple effects on button clicks
• Score popup animations

**Responsive Features:**
• Adapts to mobile, tablet, and desktop
• Touch-optimized direction controls
• Scalable game canvas
• Flexible UI layout

**Color Schemes:**
Dark Theme:
- Primary: Purple to blue gradient
- Snake: Green (#28a745)
- Food: Red (#ff6b6b)
- Accent: Teal (#4ecdc4)

Light Theme:
- Primary: Light blue gradient
- Snake: Teal (#00b894)
- Food: Red (#ff6b6b)
- Accent: Green (#00b894)

**Animation Features:**
• 60fps smooth gameplay
• CSS transitions for all UI elements
• Particle system for visual feedback
• Theme switching animations`,
                },
            ],
        };
    }

    async run() {
        // For Railway deployment
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Snake Game MCP server running on stdio');
    }
}

// Express server for HTTP endpoints (Railway)
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Snake Game MCP Server',
        timestamp: new Date().toISOString()
    });
});

// Game state endpoint
app.get('game-state', (req, res) => {
    res.json({
        message: 'Snake Game MCP Server is running',
        capabilities: [
            'get_game_info',
            'get_game_state', 
            'get_game_statistics',
            'get_controls_guide',
            'simulate_game_action',
            'get_theme_info'
        ]
    });
});

const PORT = process.env.PORT || 3000;

// Start Express server
app.listen(PORT, () => {
    console.log(`Snake Game MCP Server HTTP endpoint running on port ${PORT}`);
});

// Start MCP server
const mcpServer = new SnakeGameMCPServer();
mcpServer.run().catch(console.error);
