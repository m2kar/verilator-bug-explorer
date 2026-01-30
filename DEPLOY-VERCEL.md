# Vercel 部署指南

## 前提条件

1. ✅ **Vercel CLI 已安装** - 版本 50.9.5
2. ✅ **Git 仓库已推送** - 仓库: `m2kar/verilator-bug-explorer`
3. ✅ **代码已提交** - 所有文件已推送

---

## 部署方法

### 方法 1：通过 Vercel 网页（推荐，最简单）

#### 步骤 1：登录 Vercel

```bash
# 在本地终端运行（会打开浏览器窗口）
vercel login
```

这会：
1. 打开浏览器
2. 提示您授权 Vercel 访问 GitHub
3. 授权后，显示登录成功

#### 步骤 2：部署网站

登录成功后，在 web 目录运行：

```bash
cd /home/zhiqing/edazz/verilator-history-bugs/web

# 部署到生产环境
./deploy-vercel.sh
```

脚本会自动：
1. 检查依赖
2. 构建生产版本
3. 部署到 Vercel
4. 显示部署结果

#### 步骤 3：验证部署

部署成功后，访问以下地址验证：

**网站地址**: `https://verilator-bug-explorer.vercel.app`

---

### 方法 2：通过 Vercel CLI 手动部署（高级）

#### 步骤 1：登录

```bash
vercel login
```

#### 步骤 2：首次部署（会提示配置）

```bash
cd /home/zhiqing/edazz/verilator-history-bugs/web
vercel --prod
```

**首次部署时的配置**：
- **Set up and deploy**: 选择 `Yes`
- **Which scope**: 选择您的账户
- **Link to existing project**: 选择 `No`
- **Project name**: 输入 `verilator-bug-explorer`
- **In which directory is your code located**: 输入 `web`
- **Want to override settings**: 选择 `Yes`
- **What's your Build Command**: `npm run build`
- **What's your Output Directory**: `.next`
- **Install Command**: `npm install`

#### 步骤 3：后续部署（使用脚本）

```bash
./deploy-vercel.sh
```

---

### 部署脚本说明

**位置**: `/home/zhiqing/edazz/verilator-history-bugs/web/deploy-vercel.sh`

**功能**:
- ✅ 自动检查 Vercel CLI 安装
- ✅ 验证登录状态
- ✅ 运行生产构建
- ✅ 部署到 Vercel
- ✅ 显示部署结果和日志

**使用方法**:
```bash
cd /home/zhiqing/edazz/verilator-history-bugs/web
./deploy-vercel.sh
```

**命令参数**:
- 无参数：自动执行所有步骤
- `--debug`：显示详细调试信息

---

### 常见问题

#### Q1: 提示 "No existing credentials found"？

**原因**: Vercel CLI 没有保存登录信息

**解决方法**:
1. 运行 `vercel login` 登录
2. 登录成功后，再次运行部署脚本

#### Q2: 部署后无法访问网站？

**可能原因**:
- DNS 传播延迟（通常需要 5-10 分钟）
- Vercel 边缘节点缓存
- 浏览器缓存

**解决方法**:
1. 等待 5-10 分钟后刷新
2. 清除浏览器缓存（Ctrl + F5）
3. 检查 Vercel Dashboard 上的部署状态

#### Q3: 构建失败？

**可能原因**:
- Node.js 版本不兼容
- 依赖安装不完整

**解决方法**:
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 重新运行部署脚本
./deploy-vercel.sh
```

#### Q4: 如何更新已部署的网站？

**方法**: 推送到主仓库后
```bash
cd /home/zhiqing/edazz/verilator-history-bugs/web
git add .
git commit -m "Update web dashboard"
git push origin main
```

Vercel 会自动检测到 GitHub 推送并触发重新部署。

---

### 验证部署成功

部署成功后，您应该能够访问：

1. **主页**: https://verilator-bug-explorer.vercel.app/
2. **Bug 列表**: https://verilator-bug-explorer.vercel.app/issues
3. **版本矩阵**: https://verilator-bug-explorer.vercel.app/matrix
4. **Bug 详情**: https://verilator-bug-explorer.vercel.app/issue/1234

检查以下功能：
- ✅ Dashboard 页面加载
- ✅ Bug 统计数据正确显示
- ✅ 深色/浅色主题切换
- ✅ 移动端/平板/桌面端响应式布局

---

### Vercel 管理命令

部署成功后，可以使用以下命令：

```bash
# 查看部署列表
vercel ls

# 查看项目详情
vercel inspect

# 查看部署日志
vercel logs

# 在浏览器中打开
vercel open

# 重新部署到生产环境
vercel --prod

# 删除部署
vercel rm [deployment-id]
```

---

## 部署配置文件说明

**文件**: `/home/zhiqing/edazz/verilator-history-bugs/web/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

这个文件告诉 Vercel 如何构建和部署项目。

---

## 环境变量（如需要）

如果部署时需要环境变量（例如 GitHub API Token）：

1. **通过 Vercel Dashboard 添加**:
   - 访问 https://vercel.com/dashboard
   - 选择项目：verilator-bug-explorer
   - Settings → Environment Variables
   - 添加变量

2. **通过 CLI 添加**:
   ```bash
   vercel env add NEXT_PUBLIC_GITHUB_TOKEN "your-token-here" --prod
   ```

---

## 下一步

部署完成后，您可以考虑：

1. **设置自定义域名**（如果购买了域名）
2. **配置自动化 CI/CD**（GitHub Actions）
3. **添加分析工具**（Google Analytics, Vercel Analytics）
4. **监控网站性能和错误**

---

## 获取帮助

如果遇到问题，可以访问：

- **Vercel 文档**: https://vercel.com/docs
- **Vercel CLI 帮助**: `vercel help`
- **Next.js 文档**: https://nextjs.org/docs

---

**最后更新**: 2026-01-30
**Vercel CLI 版本**: 50.9.5
