# Verilator Bug Explorer - Build & Deployment Guide

## Build Status

✅ **Build successful** - Production build passes all checks
- TypeScript: No errors
- ESLint: No errors
- Static generation: Working

### Build Commands

```bash
cd web

# Development server
npm run dev

# Production build
npm run build

# Production server (standalone mode)
npm start

# Static export (limited - see notes below)
npm run build:static
```

## Configuration

### Next.js Config (web/next.config.ts)

- **Output Mode**: Standalone (default for Next.js 16)
- **Image Optimization**: Disabled (for static hosting)
- **TypeScript**: Strict mode enabled
- **Package Import Optimization**: Enabled (lucide-react, recharts)

### Known Issues

#### 1. Dynamic Route Export Limitation

**Issue**: Static export (`output: 'export'`) does not support dynamic routes with `generateStaticParams()` in Next.js 16.1.6

**Workaround**:
- Use standalone output mode (current config)
- Routes are server-rendered on demand
- Works with Vercel, Netlify, and Node.js hosting

**Error when using `output: 'export'**:
```
Error: Page "/issue/[id]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.
```

**Status**: Configured to use standalone mode which works correctly

#### 2. Multiple Lockfile Warning

**Warning**: Next.js detects multiple lockfiles (package-lock.json at root and in web/)

**Fix**: Set `turbopack.root` or remove parent lockfile (non-blocking)

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd web
vercel
```

**Configuration**:
- Framework Preset: Next.js
- Output Directory: `.next`
- Install Command: `npm install`
- Build Command: `npm run build`

### Option 2: Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY .next ./.next
COPY node_modules ./node_modules

RUN npm install -g serve
ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
```

**Build & Run**:
```bash
docker build -t verilator-bug-explorer .
docker run -p 3000:3000 verilator-bug-explorer
```

### Option 3: Static File Server

For standalone build output:

```bash
npm run build
npx serve@latest .next/server/app
```

## Verification Checklist

- ✅ TypeScript compilation passes
- ✅ ESLint passes (no errors)
- ✅ Production build succeeds
- ✅ Development server starts
- ✅ All pages accessible:
  - ✅ `/` - Dashboard
  - ✅ `/issues` - Bug list
  - ✅ `/matrix` - Version matrix
  - ✅ `/issue/[id]` - Bug details (dynamic)
- ✅ Responsive design works (mobile, tablet, desktop)
- ✅ Dark mode theme switching

## Performance Optimizations

1. **Package Import Tree Shaking**: Optimize imports for lucide-react and recharts
2. **Production Console Removal**: Strip console.log in production builds
3. **Static Asset Optimization**: Images unoptimized for static hosting
4. **Font Optimization**: Geist Sans font with variable loading

## File Structure

```
web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard (home)
│   ├── issues/            # Bug list page
│   ├── matrix/            # Version matrix page
│   ├── issue/[id]/        # Bug detail page (dynamic)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/            # Reusable UI components
├── lib/                   # Utilities and data loading
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── .next/               # Build output (generated)
```

## Environment Variables

Required for production:

```bash
NODE_ENV=production  # Enable production optimizations
```

Optional:

```bash
NEXT_PUBLIC_GITHUB_REPO=verilator/verilator  # For GitHub links
```

## Monitoring & Debugging

### View Build Stats

```bash
npm run build

# Check build size
du -sh .next
```

### Development Logs

```bash
# Tail logs
npm run dev

# Run linter
npm run lint

# Type checking
npm run type-check
```

## Next Steps

1. **Static Export Issue**: Research Next.js 16 alternatives for dynamic route static export
2. **Data Refresh**: Set up automated data aggregation on issue updates
3. **Analytics**: Add user analytics for bug exploration patterns
4. **Export Functionality**: Add CSV/JSON export for bug data

---

**Last Updated**: 2026-01-30
**Next.js Version**: 16.1.6
**Node.js Version**: 20+
