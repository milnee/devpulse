/**
 * Caching layer — two-tier strategy:
 *
 *  1. In-memory LRU-style map (always active, fast, process-local).
 *     Suitable for dev and low-traffic deployments.
 *
 *  2. Optional PlanetScale / MySQL persistent cache.
 *     Enabled when DATABASE_URL env var is set.
 *     Keeps cache warm across serverless cold-starts and multiple instances.
 *
 * TTL: 6 hours — balances freshness with rate-limit safety.
 */

import type { DashboardData } from "./types";

// ── Configuration ─────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// ── In-memory cache ───────────────────────────────────────────────────────────

interface CacheEntry {
  data: DashboardData;
  expiresAt: number;
}

// Module-level singleton — persists across requests in the same Node.js process.
// On serverless runtimes this is per-instance, so we still get warm hits within
// the same function instance lifetime.
const memCache = new Map<string, CacheEntry>();

function memGet(key: string): DashboardData | null {
  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memCache.delete(key);
    return null;
  }
  return entry.data;
}

function memSet(key: string, data: DashboardData): void {
  // Evict oldest entry when cache grows large (simple LRU approximation)
  if (memCache.size > 200) {
    const firstKey = memCache.keys().next().value;
    if (firstKey) memCache.delete(firstKey);
  }
  memCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ── Database cache (optional) ─────────────────────────────────────────────────
//
// To enable: set DATABASE_URL in your .env.local to a MySQL connection string.
// Schema (run once):
//
//   CREATE TABLE github_cache (
//     username    VARCHAR(39)  NOT NULL PRIMARY KEY,
//     data        MEDIUMTEXT   NOT NULL,
//     cached_at   DATETIME     NOT NULL,
//     expires_at  DATETIME     NOT NULL
//   );
//
// We use a lazy import so that the mysql2 package is only loaded when
// DATABASE_URL is present — avoids import errors in environments without it.

async function dbGet(username: string): Promise<DashboardData | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mysql = require("mysql2/promise") as typeof import("mysql2/promise");
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    const [rows] = await conn.execute<import("mysql2").RowDataPacket[]>(
      "SELECT data FROM github_cache WHERE username = ? AND expires_at > NOW()",
      [username.toLowerCase()]
    );
    await conn.end();
    if (rows.length === 0) return null;
    return JSON.parse((rows[0] as { data: string }).data) as DashboardData;
  } catch (e) {
    console.warn("[cache] DB read failed, falling back to memory:", e);
    return null;
  }
}

async function dbSet(username: string, data: DashboardData): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mysql = require("mysql2/promise") as typeof import("mysql2/promise");
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    await conn.execute(
      `INSERT INTO github_cache (username, data, cached_at, expires_at)
       VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 6 HOUR))
       ON DUPLICATE KEY UPDATE
         data = VALUES(data),
         cached_at = NOW(),
         expires_at = DATE_ADD(NOW(), INTERVAL 6 HOUR)`,
      [username.toLowerCase(), JSON.stringify(data)]
    );
    await conn.end();
  } catch (e) {
    console.warn("[cache] DB write failed:", e);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function cacheGet(username: string): Promise<DashboardData | null> {
  // Check memory first (fastest), then DB
  const mem = memGet(username.toLowerCase());
  if (mem) return mem;

  const db = await dbGet(username);
  if (db) {
    // Warm up memory cache from DB hit
    memSet(username.toLowerCase(), db);
    return db;
  }

  return null;
}

export async function cacheSet(username: string, data: DashboardData): Promise<void> {
  const key = username.toLowerCase();
  memSet(key, data);
  await dbSet(key, data);
}
