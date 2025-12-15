const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3002;

// Função para servir arquivos estáticos
function serveStaticFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        // Determinar tipo de conteúdo
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        
        if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'text/javascript';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.gif') contentType = 'image/gif';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Criar servidor HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${req.method} ${pathname}`);
    
    // Lidar com uploads
    if (req.method === 'POST' && pathname.startsWith('/upload/')) {
        const type = pathname.split('/')[2]; // logo ou background
        
        // Criar diretório uploads se não existir
        const uploadDir = './uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Gerar nome de arquivo único
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        const fileName = `${timestamp}-${random}.png`;
        const filePath = path.join(uploadDir, fileName);
        
        // Salvar arquivo
        const fileStream = fs.createWriteStream(filePath);
        req.pipe(fileStream);
        
        fileStream.on('finish', () => {
            const imageUrl = `/uploads/${fileName}`;
            console.log(`📁 ${type} uploaded: ${imageUrl}`);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                imageUrl: imageUrl,
                message: `${type} uploaded successfully`
            }));
        });
        
        fileStream.on('error', (err) => {
            console.error('Upload error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Upload failed'
            }));
        });
        
        return;
    }
    
    // Servir arquivos estáticos
    let filePath = '.' + pathname;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    serveStaticFile(res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Basic upload server running on http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${process.cwd()}`);
});