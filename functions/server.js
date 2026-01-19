// functions/server.js
import { EdgeKV } from './edge-kv-helper'; // 如果有封装，或者是全局对象直接使用

async function handleRequest(request) {
  const url = new URL(request.url);

  // 路由 1: 获取数据 (GET /api/cards)
  if (url.pathname === '/api/cards' && request.method === 'GET') {
    try {
      // 初始化 KV，注意 namespace 要和控制台创建的一致
      const edgeKV = new EdgeKV({ namespace: "edge_persona_db" }); [cite: 651]
      // 读取数据
      let value = await edgeKV.get("all_cards", { type: "json" }); [cite: 653]
      return new Response(JSON.stringify(value || []), { status: 200 });
    } catch (e) {
      return new Response("Error: " + e, { status: 500 });
    }
  }

  // 路由 2: 保存数据 (POST /api/cards)
  if (url.pathname === '/api/cards' && request.method === 'POST') {
    try {
      const body = await request.json();
      const edgeKV = new EdgeKV({ namespace: "edge_persona_db" });
      // 写入数据
      await edgeKV.put("all_cards", JSON.stringify(body)); [cite: 754]
      return new Response("Saved", { status: 200 });
    } catch (e) {
      return new Response("Error: " + e, { status: 500 });
    }
  }

  // 默认情况：如果不匹配 API，这通常交给 Pages 处理静态资源
  // 但在单一入口模式下，这里可能需要返回 404 或透传
  return new Response("Not Found", { status: 404 });
}

export default {
  fetch(request) {
    return handleRequest(request);
  }
};
