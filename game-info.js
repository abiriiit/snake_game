// api/game-info.js (Vercel Serverless Function)
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        res.status(200).json({
            game: 'Enhanced Snake Game',
            description: 'A modern implementation of the classic Snake game with enhanced features',
            features: [
                'Responsive design',
                'Adjustable speed levels',
                'Dark/Light themes',
                'Touch controls',
                'Particle effects',
                'Score tracking',
                'Local storage support'
            ],
            controls: {
                movement: ['Arrow Keys', 'On-screen buttons'],
                actions: ['Start', 'Pause', 'Restart'],
                shortcuts: ['Space (pause)', 'R (restart)']
            },
            configuration: {
                canvas: '600x400 pixels',
                cellSize: '20x20 pixels',
                speedRange: '1-10 levels',
                scoring: 'Points = Food × Speed Level'
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
