---
translations:
  zh-CN: README.zh-CN.md
---
# Zhipu Web Search

**English** | [简体中文](README.zh-CN.md)

> **Deprecated.** Use the [Web Search plugin](https://github.com/feitianbubu/new-api-plugin-search) (`feitianbubu_search`) instead. It serves the same Zhipu engines on the same `POST /v1/web_search`, adds `POST /v1/search` and more vendors, and is the one that gets updates. Switch this plugin off before switching that one on: both claim the Zhipu GLM channel type.

Searches the web with Zhipu's Web Search API and returns the results as JSON, for agents and retrieval pipelines.

## Channel setup

An existing Zhipu GLM channel works as it is: add the search engines to its models, and the plugin serves them with the channel's address and key.

A Task Plugin channel bound to this plugin works too. The key is a Zhipu API Key from the BigModel console, and the default API address is `https://open.bigmodel.cn`.

## Models and endpoints

A model is one of Zhipu's search engines.

| Endpoint | Models |
| --- | --- |
| `POST /v1/web_search` | `search_std`, `search_pro`, `search_pro_sogou`, `search_pro_quark` |
| `POST /api/paas/v4/web_search` | the same |

`POST /v1/web_search` takes vendor-neutral fields and returns a normalized result list:

| Field | Meaning |
| --- | --- |
| `model` | Search engine. Required |
| `query` | Search text. Required |
| `max_results` | Number of results |
| `include_domains` | Array of domains to search in. Zhipu filters on one domain, so only the first is used |
| `recency` | `oneDay`, `oneWeek`, `oneMonth`, `oneYear` or `noLimit` |
| `content_size` | `medium` or `high` |
| `search_intent` | Recognize the search intent first. Default `false` |
| `request_id`, `user_id` | Passed to Zhipu |

Any other field in the request goes to Zhipu as it is, so Zhipu's own parameters, such as `count` or `search_recency_filter`, work here too. A vendor-neutral field wins over the Zhipu field it maps to.

The reply has `id`, `created`, `request_id`, `provider`, `results` and, when Zhipu returns them, `intents`. Each result has `title`, `url`, `content`, `site`, `icon`, `refer` and `published_at`.

`POST /api/paas/v4/web_search` is Zhipu's own path. It takes Zhipu's own request, with the engine in `search_engine`, and returns Zhipu's reply unchanged, so Zhipu SDKs work with the gateway address.

Which options an engine supports is Zhipu's rule; see the [Web Search API reference](https://docs.bigmodel.cn/api-reference/%E5%B7%A5%E5%85%B7-api/%E7%BD%91%E7%BB%9C%E6%90%9C%E7%B4%A2).

## Billing

The price table has one field, the web search unit price, charged once per request.
Set a price for each engine. A search that Zhipu rejects is not charged.

## Example

```bash
curl https://gateway.example.com/v1/web_search \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{"model": "search_std", "query": "new-api plugin marketplace", "max_results": 5}'
```

## Limits

- Requests are synchronous. There is no task to query afterwards, and the gateway does not keep the results.
- Web search inside chat completions (`web_search_options`, the `web_search` tool) is not part of this plugin.
