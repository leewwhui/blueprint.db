# blueprint.db client

一个基于 React + TypeScript 的可视化数据库建模工具前端。

你可以在画布上创建数据表、建立外键关系、编辑字段约束，并在 MySQL / PostgreSQL / SQLite 三种方言之间导入导出 SQL。

## 核心功能

- 可视化 ER 风格编辑：拖拽表节点、连线创建关系
- 表设计：新增/删除表、编辑字段、字段类型与约束配置
- 关系管理：创建关系、编辑关系 cardinality 与 on update / on delete
- SQL 导入：将 SQL 解析为内部 schema（表 + 关系）
- SQL 导出：按数据库方言生成并预览 SQL，支持下载
- 命令栈：支持 undo / redo（表创建、位置移动等）
- 侧边栏搜索：支持 table 和 relationship 的防抖搜索

## 技术栈

- React 19
- TypeScript 5
- Vite 8
- Redux Toolkit + React Redux
- React Flow (`@xyflow/react`)
- React Hook Form + Zod
- Tailwind CSS 4 + shadcn/ui
- Vitest
- node-sql-parser

## 项目结构

```text
src/
  adapter/        # 多方言 SQL 生成器（MySQL/PostgreSQL/SQLite）
  commands/       # 命令模式与历史栈（undo/redo）
  components/     # 业务组件与 UI 组件
  hooks/          # 业务 hooks（生成 SQL、关系校验、历史操作等）
  lib/            # 纯函数工具（SQL 解析、关系命名、校验）
  store/          # Redux 状态管理（schema/ui）
  tests/          # 单元测试
```

## 本地开发

### 1. 安装依赖

```bash
yarn
```

### 2. 启动开发环境

```bash
yarn dev
```

默认会启动 Vite 开发服务器。

### 3. 运行测试

```bash
yarn test --run
```

### 4. 代码检查

```bash
yarn lint
```

### 5. 构建生产包

```bash
yarn build
```

## SQL 能力说明

### 导入

- 支持解析 `CREATE TABLE` 与 `ALTER TABLE ... FOREIGN KEY`
- 支持识别常见字段类型、主键、唯一、可空、引用动作（ON DELETE / ON UPDATE）

### 导出

- 支持方言：MySQL、PostgreSQL、SQLite
- 会根据方言自动映射字段类型和引用标识符

## 测试覆盖（当前）

已包含以下模块的单元测试：

- HistoryStack
- Schema reducer
- Table validation
- Relation validation
- SQL parser
- MySQL / PostgreSQL / SQLite Adapter

## 未来计划

- 优化打包体积（代码分割）
- 增强 lint 规则并清理现有 warnings/errors
- 增加 e2e 测试（例如 Playwright）
- 支持更多 SQL 语法与数据库方言

## License

当前仓库未声明 License，如需开源发布建议补充 LICENSE 文件。
