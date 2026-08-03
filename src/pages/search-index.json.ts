import type { APIRoute } from 'astro';
import { buildIndex } from '../lib/searchIndex';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildIndex('vi')), {
    headers: { 'Content-Type': 'application/json' },
  });
