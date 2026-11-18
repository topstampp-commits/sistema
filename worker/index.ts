/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const SYSTEM_DATA_ID = 1;

async function ensureSystemDataTable(db: D1Database) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS system_data (
      id INTEGER PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

async function handleSystemData(request: Request, db: D1Database) {
  try {
    await ensureSystemDataTable(db);

    if (request.method === "GET") {
      const record = await db.prepare(
        "SELECT payload, updated_at AS updatedAt FROM system_data WHERE id = ?",
      )
        .bind(SYSTEM_DATA_ID)
        .first<{ payload: string; updatedAt: string }>();

      return Response.json({
        data: record ? JSON.parse(record.payload) : null,
        updatedAt: record?.updatedAt ?? null,
      });
    }

    if (request.method === "PUT") {
      const data = await request.json();
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return Response.json({ error: "Dados inválidos." }, { status: 400 });
      }

      const updatedAt = new Date().toISOString();
      await db.prepare(`
        INSERT INTO system_data (id, payload, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          payload = excluded.payload,
          updated_at = excluded.updated_at
      `)
        .bind(SYSTEM_DATA_ID, JSON.stringify(data), updatedAt)
        .run();

      return Response.json({ ok: true, updatedAt });
    }

    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, PUT" },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Falha na sincronização." },
      { status: 500 },
    );
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/system-data") {
      return handleSystemData(request, env.DB);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
