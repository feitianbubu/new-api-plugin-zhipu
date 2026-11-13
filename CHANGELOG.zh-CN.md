---
changelogVersion: 1
plugin: "feitianbubu_zhipu"
version: "1.0.0"
locale: "zh-CN"
---
# Changelog

## [1.0.0]

### Added

- 通过 `POST /v1/web_search` 使用 `search_std`、`search_pro`、`search_pro_sogou`、`search_pro_quark` 联网搜索，请求字段厂商中立，返回归一化的结果列表。
- 通过网关调用智谱自己的 `POST /api/paas/v4/web_search`，原样返回智谱的响应。
- 每次请求按“联网搜索单价”收一次费。给用户启用前先为每个引擎设置价格。
