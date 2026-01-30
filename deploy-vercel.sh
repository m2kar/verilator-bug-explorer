#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

WEB_DIR="/home/zhiqing/edazz/verilator-history-bugs/web"

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Verilator Bug Explorer - Vercel Deployment${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI not found${NC}"
    echo "Please install it first: npm i -g vercel"
    exit 1
fi

VERCEL_VERSION=$(vercel --version 2>&1 | grep -oP '50\.[0-9]' || echo "50.9.5")
echo -e "${YELLOW}Checking Vercel CLI version: ${NC}${VERCEL_VERSION}"
echo ""

if vercel whoami &> /dev/null 2>&1; then
    VERCEL_USER=$(vercel whoami 2>&1)
    echo -e "Logged in as: ${GREEN}${VERCEL_USER}${NC}"
else
    echo -e "${RED}Not logged in${NC}"
    echo ""
    echo -e "${YELLOW}Please run: ${NC}vercel login"
    echo -e "${YELLOW}Then run this script again${NC}"
    exit 1
fi

if [ ! -d "$WEB_DIR" ]; then
    echo -e "${RED}Error: Directory not found: ${WEB_DIR}${NC}"
    exit 1
fi

echo -e "${YELLOW}Changing to web directory...${NC}"
cd "$WEB_DIR" || exit 1
echo -e "Current directory: ${GREEN}$(pwd)${NC}"
echo ""

if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Building production bundle...${NC}"
npm run build
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}Error: Build failed with exit code ${BUILD_EXIT_CODE}${NC}"
    exit 1
fi
echo -e "${GREEN}Build successful!${NC}"
echo ""

echo -e "${YELLOW}Deploying to Vercel...${NC}"

vercel --prod --yes 2>&1 | tee /tmp/vercel-deploy.log
DEPLOY_EXIT_CODE=${PIPESTATUS[0]}

echo ""
if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}=====================================${NC}"
    echo -e "${GREEN}Deployment Successful!${NC}"
    echo -e "${GREEN}=====================================${NC}"
    echo ""
    echo -e "${YELLOW}Deployment log saved to: /tmp/vercel-deploy.log${NC}"
    echo ""
    echo -e "${YELLOW}To view deployments:${NC}"
    echo "   vercel ls"
    echo ""
    echo -e "${YELLOW}To inspect project:${NC}"
    echo "   vercel inspect"
    echo ""
    echo -e "${YELLOW}To open in browser:${NC}"
    echo "   vercel open"
else
    echo -e "${RED}=====================================${NC}"
    echo -e "${RED}Deployment Failed!${NC}"
    echo -e "${RED}=====================================${NC}"
    echo ""
    echo -e "${YELLOW}Check the deployment log: /tmp/vercel-deploy.log${NC}"
    echo ""
    echo -e "${YELLOW}Common issues:${NC}"
    echo "  1. Not logged in to Vercel (run: vercel login)"
    echo "  2. Build failed (check build output above)"
    echo "  3. Network issues"
    echo ""
    echo -e "${YELLOW}To try again:${NC}"
    echo "  1. Login: vercel login"
    echo "  2. Run this script again"
    exit 1
fi
