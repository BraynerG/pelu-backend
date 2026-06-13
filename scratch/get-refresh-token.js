const { google } = require('googleapis');
const http = require('http');
const url = require('url');

const clientId = process.argv[2];
const clientSecret = process.argv[3];

if (!clientId || !clientSecret) {
  process.stdout.write('Uso: node scratch/get-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>\n');
  process.exit(1);
}

const PORT = 8085;
const REDIRECT_URI = `http://localhost:${PORT}`;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/calendar'],
});

process.stdout.write(`\n=== INSTRUCCIONES ===\n`);
process.stdout.write(`1. Abre este enlace en tu navegador para autorizar la aplicación:\n\n`);
process.stdout.write(`${authUrl}\n\n`);
process.stdout.write(`=====================\n\n`);

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const q = parsedUrl.query;

    if (q.code) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>¡Autorización exitosa!</h1><p>Puedes cerrar esta pestaña y volver a la terminal.</p>');
      
      process.stdout.write('Obteniendo token...\n');
      const { tokens } = await oauth2Client.getToken(q.code);
      process.stdout.write('\n=== CONFIGURACIÓN .ENV ===\n');
      process.stdout.write(`GOOGLE_CLIENT_ID="${clientId}"\n`);
      process.stdout.write(`GOOGLE_CLIENT_SECRET="${clientSecret}"\n`);
      process.stdout.write(`GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"\n`);
      process.stdout.write('==========================\n\n');
      
      server.close();
      process.exit(0);
    } else {
      res.writeHead(404);
      res.end();
    }
  } catch (err) {
    process.stdout.write(`Error: ${err.message}\n`);
    res.writeHead(500);
    res.end('Error');
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  process.stdout.write(`Servidor de redirección local escuchando en http://localhost:${PORT}\n`);
});
