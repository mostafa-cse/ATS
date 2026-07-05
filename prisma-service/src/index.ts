import 'dotenv/config';
import { createServer } from 'node:http';
import { prisma } from './client.js';

async function start() {
  await prisma.$connect();

  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');

    if (url.pathname === '/health') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    if (url.pathname === '/catalog-summary') {
      const [products, users, orders] = await Promise.all([
        prisma.product.count(),
        prisma.appUser.count(),
        prisma.order.count(),
      ]);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ products, users, orders }));
      return;
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not Found' }));
  });

  const port = Number(process.env.PORT ?? 4001);

  server.listen(port, () => {
    console.log(`Prisma service listening on http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close();
    await prisma.$disconnect();
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

start().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});