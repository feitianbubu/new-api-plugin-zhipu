export const meta = {
  apiVersion: 1,
  key: "feitianbubu_zhipu",
  name: "Zhipu Web Search (deprecated)",
  icon: "Zhipu.Color",
  description: {
    en: "Deprecated: use the Web Search plugin (feitianbubu_search), which serves the same Zhipu engines and more vendors",
    zh: "已废弃：请改用 Web Search 插件（feitianbubu_search），它提供相同的智谱引擎并支持更多厂商",
  },
  version: "1.0.1",
  author: { name: "feitianbubu", url: "https://github.com/feitianbubu" },
  website: "https://docs.bigmodel.cn/cn/guide/tools/web-search",
  baseUrl: "https://open.bigmodel.cn",
  // Zhipu GLM channels serve web search with the same address and key.
  channelTypes: [26],
  // Model names are Zhipu's search engine codes.
  models: ["search_std", "search_pro", "search_pro_sogou", "search_pro_quark"],
  fetchMode: "per_task",
  usageSchema: {
    search_count: {
      type: "number",
      unit: "count",
      unitLabel: { en: "search", zh: "次" },
      description: { en: "Web search unit price", zh: "联网搜索单价" },
    },
  },
  routes: [
    // Other vendors' plugins share this path, so only Zhipu's engines are taken here.
    {
      method: "POST",
      path: "/v1/web_search",
      type: "submit",
      decode: "decodeSearch",
      render: "renderSearch",
      models: ["search_std", "search_pro", "search_pro_sogou", "search_pro_quark"],
      retainResult: false,
    },
    { method: "POST", path: "/api/paas/v4/web_search", type: "submit", decode: "decodeVendor", render: "renderVendor", retainResult: false },
  ],
};

const SEARCH_PATH = "/api/paas/v4/web_search";
const RESULT_FIELDS = { title: "title", url: "link", content: "content", site: "media", icon: "icon", refer: "refer", published_at: "publish_date" };

function trimmed(value) {
  return String(value || "").trim();
}

function jsonObject(ctx) {
  if (!ctx.body || ctx.body.kind !== "json") throw new Error("JSON body required");
  return ctx.body.value || {};
}

function searchResult(item) {
  const result = {};
  for (const key of Object.keys(RESULT_FIELDS)) {
    const value = trimmed(item && item[RESULT_FIELDS[key]]);
    if (value) result[key] = value;
  }
  return result;
}

export function buildSubmitRequest(ctx) {
  return {
    url: ctx.baseUrl + SEARCH_PATH,
    method: "POST",
    headers: { Authorization: "Bearer " + ctx.apiKey, "Content-Type": "application/json" },
    body: Object.assign({}, ctx.requestBody, { search_engine: ctx.upstreamModel || ctx.model }),
  };
}

export function parseSubmitResponse(ctx, resp) {
  const body = resp.body || {};
  const failed = body.error || !Array.isArray(body.search_result);
  return {
    taskId: trimmed(body.id) || trimmed(body.request_id) || utils.uuid(),
    taskData: body,
    immediate: failed
      ? { status: "FAILURE", reason: trimmed(body.error && body.error.message) || "search failed" }
      : { status: "SUCCESS", progress: "100%" },
  };
}

export function extractUsage() {
  return { search_count: 1 };
}

// Without completion facts an immediate result settles at zero under expression pricing.
export const extractUsageOnComplete = extractUsage;

export function buildQueryRequest() {
  throw new Error("synchronous API has no task to query");
}

export function parseTaskResult() {
  return { status: "UNKNOWN", reason: "synchronous API has no task to query" };
}

export const native = {
  decodeSearch: function (ctx) {
    const body = jsonObject(ctx);
    // Every other member goes to Zhipu as it is.
    const requestBody = Object.assign({}, body);
    for (const key of ["model", "query", "max_results", "include_domains", "recency"]) delete requestBody[key];
    if (body.query != null) requestBody.search_query = body.query;
    if (!trimmed(requestBody.search_query)) throw new Error("query is required");
    if (requestBody.search_intent == null) requestBody.search_intent = false;
    if (body.max_results != null) requestBody.count = body.max_results;
    // Zhipu filters on one domain.
    const domain = trimmed((body.include_domains || [])[0]);
    if (domain) requestBody.search_domain_filter = domain;
    if (body.recency != null) requestBody.search_recency_filter = body.recency;
    return { kind: "submit", model: trimmed(body.model), action: "search", requestBody: requestBody };
  },
  decodeVendor: function (ctx) {
    const body = jsonObject(ctx);
    const model = trimmed(body.search_engine);
    if (!model) throw new Error("search_engine is required");
    return { kind: "submit", model: model, action: "search", requestBody: body };
  },
  renderSearch: function (ctx, task) {
    const data = task.data || {};
    const response = { id: trimmed(data.id), created: Number(data.created) || 0, request_id: trimmed(data.request_id), provider: "zhipu" };
    if (Array.isArray(data.search_intent) && data.search_intent.length) {
      response.intents = data.search_intent.map(function (item) {
        return { query: trimmed(item && item.query), intent: trimmed(item && item.intent), keywords: trimmed(item && item.keywords) };
      });
    }
    response.results = (data.search_result || []).map(searchResult);
    return response;
  },
  renderVendor: function (ctx, task) {
    return task.data || {};
  },
  error: function (ctx, error) {
    return { error: { code: error.code, message: error.message } };
  },
};
