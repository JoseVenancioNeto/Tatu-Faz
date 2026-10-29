@echo off
chcp 65001 >nul
echo ========================================================
echo   TATU FAZ - Gerando Link HTTPS e QR Code para Celular
echo ========================================================
echo.
echo Conectando ao tunel HTTPS... Aguarde aparecer o link https://....lhr.life
echo (Voce tambem pode escanear o QR Code que vai aparecer abaixo!)
echo.
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:127.0.0.1:5173 nokey@localhost.run
pause
