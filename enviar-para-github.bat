@echo off
chcp 65001 >nul
echo ========================================================
echo   Enviando TATU FAZ para o GitHub (JoseVenancioNeto)
echo ========================================================
echo.
echo Removendo sessao antiga (engacai) para autenticar com JoseVenancioNeto...
cmdkey /delete:git:https://github.com >nul 2>&1
git credential-manager erase https://github.com >nul 2>&1
echo.
echo Uma janela do navegador (ou login do GitHub) vai abrir.
echo Entre com a conta: JoseVenancioNeto
echo.
git add .
git commit -m "Atualizar TATU FAZ e gerar APK" >nul 2>&1
git push -u origin main
echo.
echo ========================================================
echo   Pronto! Agora aguarde ~2 minutos e baixe o APK direto em:
echo   https://github.com/JoseVenancioNeto/Tatu-Faz/releases
echo   (Acompanhe o progresso em: https://github.com/JoseVenancioNeto/Tatu-Faz/actions)
echo ========================================================
pause
