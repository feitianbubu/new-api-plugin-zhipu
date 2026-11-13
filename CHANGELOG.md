---
changelogVersion: 1
plugin: "feitianbubu_zhipu"
version: "1.0.0"
locale: "en"
translations:
  zh-CN: CHANGELOG.zh-CN.md
---
# Changelog

## [1.0.0]

### Added

- Search the web with `search_std`, `search_pro`, `search_pro_sogou` and `search_pro_quark` through `POST /v1/web_search`, with vendor-neutral request fields and a normalized result list.
- Call Zhipu's own `POST /api/paas/v4/web_search` through the gateway and get Zhipu's reply unchanged.
- Charge each request once through the "Web search unit price" field. Set a price for each engine before enabling it for users.
