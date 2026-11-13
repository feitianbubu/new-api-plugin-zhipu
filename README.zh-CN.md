---
locale: zh-CN
---
# 智谱联网搜索

调用智谱 Web Search API 搜索网页，以 JSON 返回结果，供智能体和检索流程使用。

## 渠道设置

现有的智谱 GLM 渠道可以直接用：把搜索引擎加进渠道的模型列表，插件会用该渠道的地址和密钥提供服务。

也可以新建任务插件类型的渠道并绑定本插件。密钥填智谱开放平台的 API Key，默认 API 地址是 `https://open.bigmodel.cn`。

## 模型与接口

模型名就是智谱的搜索引擎。

| 接口 | 模型 |
| --- | --- |
| `POST /v1/web_search` | `search_std`、`search_pro`、`search_pro_sogou`、`search_pro_quark` |
| `POST /api/paas/v4/web_search` | 同上 |

`POST /v1/web_search` 使用厂商中立的字段，返回归一化的结果列表：

| 字段 | 含义 |
| --- | --- |
| `model` | 搜索引擎，必填 |
| `query` | 搜索内容，必填 |
| `max_results` | 返回条数 |
| `include_domains` | 限定搜索的域名数组。智谱只支持一个域名，所以只用第一个 |
| `recency` | `oneDay`、`oneWeek`、`oneMonth`、`oneYear` 或 `noLimit` |
| `content_size` | `medium` 或 `high` |
| `search_intent` | 是否先做搜索意图识别，默认 `false` |
| `request_id`、`user_id` | 透传给智谱 |

请求里的其他字段会原样转给智谱，所以智谱自己的参数（如 `count`、`search_recency_filter`）在这里也能用。统一字段和它对应的智谱字段同时出现时，以统一字段为准。

返回包含 `id`、`created`、`request_id`、`provider`、`results`，智谱返回意图识别结果时还有 `intents`。每条结果有 `title`、`url`、`content`、`site`、`icon`、`refer`、`published_at`。

`POST /api/paas/v4/web_search` 是智谱自己的路径，请求用智谱自己的格式（引擎放在 `search_engine`），原样返回智谱的响应，所以智谱 SDK 把地址指向网关就能用。

各引擎支持哪些参数以智谱为准，见 [Web Search API 文档](https://docs.bigmodel.cn/api-reference/%E5%B7%A5%E5%85%B7-api/%E7%BD%91%E7%BB%9C%E6%90%9C%E7%B4%A2)。

## 计费

价格表只有一个字段：联网搜索单价，每次请求收一次。
每个引擎单独定价。被智谱拒绝的搜索不收费。

## 示例

```bash
curl https://gateway.example.com/v1/web_search \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{"model": "search_std", "query": "new-api plugin marketplace", "max_results": 5}'
```

## 限制

- 请求是同步的，之后没有可查询的任务，网关也不保存搜索结果。
- 对话接口里的联网搜索（`web_search_options`、`web_search` 工具）不在本插件范围内。
