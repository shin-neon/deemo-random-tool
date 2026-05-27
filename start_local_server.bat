@echo off
chcp 65001 > nul

set PORT=8000

echo.
echo ================================
echo   DEEMO TOOL LOCAL SERVER
echo ================================
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address" /C:"IPv4 アドレス"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP: =%

echo PC IP:
echo   %IP%
echo.

echo Smartphone URL:
echo   http://%IP%:%PORT%/
echo.

echo Press Ctrl+C to stop server.
echo.

python -m http.server %PORT% --bind 0.0.0.0

pause