@echo off
REM ────────────────────────────────────────────────────────────
REM Sağlık YZ Etik — Tek Komut Başlatma (Windows)
REM ────────────────────────────────────────────────────────────

cd /d "%~dp0"

echo.
echo ============================================================
echo   Saglik YZ Etik - Degerlendirme Platformu
echo   YZM 714 . Izmir Bakircay Universitesi
echo ============================================================
echo.

REM Docker kontrolu
where docker >nul 2>nul
if errorlevel 1 (
    echo [!] Docker yuklu degil.
    echo     Lutfen Docker Desktop'u indirin: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
    echo [!] Docker daemon calismiyor.
    echo     Lutfen Docker Desktop uygulamasini baslatin.
    pause
    exit /b 1
)

echo [OK] Docker hazir
echo.
echo Ilk baslatma 10-15 dakika surer (image build + Llama 3.2 indirme).
echo Sonraki baslatmalar ~30 saniyedir.
echo.
echo Hazir oldugunda tarayicida acin: http://localhost:3002
echo.

REM Compose baslat
docker compose up
