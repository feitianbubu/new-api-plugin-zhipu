---
changelogVersion: 1
plugin: "feitianbubu_zhipu"
version: "1.0.1"
locale: "en"
translations:
  zh-CN: CHANGELOG.zh-CN.md
---
# Changelog

## [1.0.1]

### Deprecated

- This plugin is deprecated. Use the [Web Search plugin](https://github.com/feitianbubu/new-api-plugin-search) (`feitianbubu_search`) instead: it serves the same Zhipu engines on `POST /v1/web_search`, adds `POST /v1/search` and more vendors. Switch this plugin off before switching that one on.

### Fixed

- A search priced with a billing expression is now charged. In 1.0.0 it settled at zero; per-call prices were not affected.
