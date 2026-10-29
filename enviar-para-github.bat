@echo off
chcp 65001 >nul
echo ========================================================
echo   Enviando TATU FAZ COMPLETO para o GitHub
echo ========================================================
echo.
git add .
git commit -m "Atualizar TATU FAZ completo e gerar APK" >nul 2>&1
git push -u origin main --force
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Autenticando com a conta JoseVenancioNeto...
  cmdkey /delete:git:https://github.com >nul 2>&1
  git credential-manager erase https://github.com >nul 2>&1
  git push -u origin main --force
)
echo.
echo ========================================================
echo   Pronto! Agora aguarde ~2 minutos e baixe o APK direto em:
echo   https://github.com/JoseVenancioNeto/Tatu-Faz/releases
echo   (Acompanhe o progresso em: https://github.com/JoseVenancioNeto/Tatu-Faz/actions)
echo ========================================================
pause
