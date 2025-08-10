// api/game-state.js (Vercel Serverless Function)
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        res.status(200).json({
            status: 'ready',
            gameState: {
                isRunning: false,
                isPaused: false,
                score: 0,
                highScore: 0,
                speed: 5,
                theme: 'dark'
            },
            instructions: 'This endpoint provides game state information for the Snake Game MCP integration'
        });
    } else if (req.method === 'POST') {
        const { action, value } = req.body;
        
        // Simulate game actions
        let response = { success: true, message: '' };
        
        switch (action) {
            case 'start':
                response.message = 'Game started successfully';
                break;
            case 'pause':
                response.message = 'Game paused/resumed';
                break;
            case 'restart':
                response.message = 'Game restarted';
                break;
            case 'change_speed':
                if (value >= 1 && value <= 10) {
                    response.message = `Speed changed to ${value}`;
                } else {
                    response.success = false;
                    response.message = 'Invalid speed value';
                }
                break;
            default:
                response.success = false;
                response.message = 'Unknown action';
        }
        
        res.status(200).json(response);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
