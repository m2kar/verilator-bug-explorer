# Verilator Bug Explorer - Web Dashboard

A modern, responsive web dashboard for exploring and analyzing Verilator bugs across different versions.

## Features

- 📊 **Dashboard**: Statistics overview of all bugs
- 📋 **Bug List**: Searchable, filterable list with pagination
- 📊 **Version Matrix**: Visual bug × version compatibility matrix
- 📝 **Bug Details**: Complete issue information with version test results
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: TypeScript 5.x
- **Theme**: next-themes (dark mode support)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

\`\`\`bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
\`\`\`

### Development

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

\`\`\`bash
npm run dev
\`\`\`

## Project Structure

\`\`\`
web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard (home)
│   ├── issues/            # Bug list page
│   ├── matrix/            # Version matrix page
│   ├── issue/[id]/        # Bug detail page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/            # Reusable UI components
├── lib/                  # Utilities and data loading
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── next.config.ts        # Next.js configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── vercel.json          # Vercel deployment config
\`\`\`

## Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:static # Build with static export (limited)
npm run start          # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run type-check    # Run TypeScript type checking
npm run clean         # Clean build artifacts
\`\`\`

## Deployment

### Vercel (Recommended)

This project is configured for Vercel deployment.

#### Using Vercel Website
1. Visit [vercel.com/new](https://vercel.com/new)
2. Choose "Continue with GitHub"
3. Authorize access to your repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: \`./\`
   - Build Command: \`npm run build\`
   - Output Directory: \`.next\`
   - Install Command: \`npm install\`
5. Click "Deploy"

#### Using Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
\`\`\`

### Docker

\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
\`\`\`

\`\`\`bash
docker build -t verilator-bug-explorer .
docker run -p 3000:3000 verilator-bug-explorer
\`\`\`

## Environment Variables

Required for production:

\`\`\`bash
NODE_ENV=production
\`\`\`

Optional:

\`\`\`bash
NEXT_PUBLIC_GITHUB_REPO=verilator/verilator
\`\`\`

## Performance

- **Package Imports**: Tree-shaking enabled for lucide-react and recharts
- **Production Console**: \`console.log\` statements removed
- **Static Assets**: Images optimized for web
- **Font Loading**: Geist Sans font with variable loading

## Known Limitations

1. **Static Export**: Next.js 16.1.6 cannot export dynamic routes with \`generateStaticParams()\`
   - Workaround: Using standalone output mode
   - Result: Dynamic routes are server-rendered on demand

2. **Dynamic Routes**: \`/issue/[id]\` requires server-side rendering
   - Cannot be pre-rendered as static HTML
   - Works correctly with Vercel and Node.js hosting

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions about the dashboard:
- Open an issue in the main repository
- Check the deployment guide at [DEPLOYMENT.md](./DEPLOYMENT.md)
