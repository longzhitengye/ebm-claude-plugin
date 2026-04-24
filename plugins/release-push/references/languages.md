# 支持的语言和版本号位置

## Node.js

- 标识文件：package.json
- 版本号字段：version

## flutter

- 标识文件：pubspec.yaml
- 版本号字段：version
- 额外修改（如果存在 ios/ 目录）：
  - ios/Runner.xcodeproj/project.pbxproj 中将 CURRENT_PROJECT_VERSION 更新为构建号（SemVer + 号后的部分，如 `1.5.0+12` 中的 `12`）
  - ios/Runner.xcodeproj/project.pbxproj 中将 MARKETING_VERSION 更新为版本号（SemVer + 号前的部分，如 `1.5.0+12` 中的 `1.5.0`）

## python/poetry

- 标识文件：pyproject.toml
- 版本号字段：version
