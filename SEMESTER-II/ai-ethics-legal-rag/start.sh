#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────
# Sağlık YZ Etik — Tek Komut Başlatma (Linux/macOS)
# ────────────────────────────────────────────────────────────

set -e

cd "$(dirname "$0")"

# Renkli çıktı
BLUE="\033[1;34m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║   Sağlık YZ Etik — Değerlendirme Platformu                ║${RESET}"
echo -e "${BLUE}║   YZM 714 · İzmir Bakırçay Üniversitesi                   ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠  Docker yüklü değil.${RESET}"
    echo "   Lütfen Docker Desktop'u indirin: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${YELLOW}⚠  Docker daemon çalışmıyor.${RESET}"
    echo "   Lütfen Docker Desktop uygulamasını başlatın."
    exit 1
fi

echo -e "${GREEN}✓${RESET} Docker hazır"
echo ""
echo -e "${BLUE}İlk başlatma 10–15 dakika sürer (image build + Llama 3.2 indirme).${RESET}"
echo -e "${BLUE}Sonraki başlatmalar ~30 saniyedir.${RESET}"
echo ""
echo -e "${YELLOW}Hazır olduğunda tarayıcıda açın: ${GREEN}http://localhost:3002${RESET}"
echo ""

# Compose başlat
docker compose up
