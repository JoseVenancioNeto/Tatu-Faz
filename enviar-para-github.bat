@echo off
chcp 65001 >nul
echo ========================================================
echo   Enviando TATU FAZ para o GitHub para gerar o APK
echo ========================================================
echo.
git add .
git commit -m "Atualizar TATU FAZ e gerar APK" 2>nul
git push -u origin main
echo.
echo ========================================================
echo   Pronto! Agora acesse:
echo   https://github.com/JoseVenancioNeto/Tatu-Faz/actions
echo   Aguarde 2 minutos ate ficar verde e baixe o APK em:
echo   https://github.com/JoseVenancioNeto/Tatu-Faz/releases
echo ========================================================
pause
