---
changelogVersion: 1
plugin: "feitianbubu_zhipu"
version: "1.0.1"
locale: "zh-CN"
---
# Changelog

## [1.0.1]

### Deprecated

- 本插件已废弃。请改用 [Web Search 插件](https://github.com/feitianbubu/new-api-plugin-search)（`feitianbubu_search`）：它在 `POST /v1/web_search` 上提供相同的智谱引擎，并新增 `POST /v1/search` 和更多厂商。启用新插件前请先停用本插件。

### Fixed

- 用计费表达式定价的搜索现在会正常扣费。1.0.0 中这类请求按 0 结算；按次价格不受影响。
