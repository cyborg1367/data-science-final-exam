/**
 * Storage for gradebook, attempt caps, and rate limits.
 *
 * Mode A — REST (Upstash / legacy Vercel KV):
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *   KV_REST_API_URL + KV_REST_API_TOKEN
 *
 * Mode B — native Redis URL (Redis Cloud, Upstash redis:// URL from Vercel):
 *   REDIS_URL=redis://default:password@host:port
 *
 * If nothing is configured, all functions are safe no-ops.
 */
const SUBMISSIONS_KEY = 'exam:submissions';

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const REDIS_URL = (process.env.REDIS_URL || '').trim();

let redisClient = null;
let redisReady = null;

function restEnabled() {
  return Boolean(REST_URL && REST_TOKEN);
}

function nativeEnabled() {
  return Boolean(REDIS_URL);
}

function enabled() {
  return restEnabled() || nativeEnabled();
}

async function getNativeClient() {
  if (!nativeEnabled()) return null;
  if (redisClient && redisClient.isOpen) return redisClient;
  if (!redisReady) {
    redisReady = (async function () {
      const { createClient } = require('redis');
      const client = createClient({ url: REDIS_URL });
      client.on('error', function (err) {
        console.error('Redis client error:', err);
      });
      await client.connect();
      redisClient = client;
      return client;
    })();
  }
  return redisReady;
}

async function restCmd(args) {
  const res = await fetch(REST_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + REST_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });
  if (!res.ok) {
    throw new Error('Redis REST error ' + res.status);
  }
  const data = await res.json();
  return data.result;
}

async function cmd(args) {
  if (!enabled()) return null;

  if (restEnabled()) {
    return restCmd(args);
  }

  const client = await getNativeClient();
  const op = args[0];
  const key = args[1];

  switch (op) {
    case 'GET':
      return client.get(key);
    case 'INCR':
      return client.incr(key);
    case 'EXPIRE':
      return client.expire(key, args[2]);
    case 'RPUSH':
      return client.rPush(key, args[2]);
    case 'LRANGE':
      return client.lRange(key, args[2], args[3]);
    default:
      throw new Error('Unsupported Redis command: ' + op);
  }
}

/** INCR a counter and set its TTL the first time it is created. Returns the count. */
async function incrWithTtl(key, ttlSeconds) {
  const n = await cmd(['INCR', key]);
  if (n === 1 && ttlSeconds) {
    await cmd(['EXPIRE', key, ttlSeconds]);
  }
  return n;
}

async function getAttempts(nameKey) {
  const v = await cmd(['GET', 'exam:attempts:' + nameKey]);
  return Number(v) || 0;
}

async function bumpAttempts(nameKey) {
  return cmd(['INCR', 'exam:attempts:' + nameKey]);
}

async function saveSubmission(record) {
  return cmd(['RPUSH', SUBMISSIONS_KEY, JSON.stringify(record)]);
}

async function listSubmissions() {
  const arr = await cmd(['LRANGE', SUBMISSIONS_KEY, 0, -1]);
  if (!Array.isArray(arr)) return [];
  return arr
    .map(function (s) {
      try { return JSON.parse(s); } catch (e) { return null; }
    })
    .filter(Boolean);
}

/** Normalize a student name for use as a per-student key (case/space-insensitive). */
function nameKeyOf(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

module.exports = {
  enabled,
  incrWithTtl,
  getAttempts,
  bumpAttempts,
  saveSubmission,
  listSubmissions,
  nameKeyOf
};
