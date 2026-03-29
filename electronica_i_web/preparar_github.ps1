# Script de Apoyo para Subir a GitHub
# Este script te ayuda a inicializar Git para subirlo a tu cuenta

cd "C:\Users\Sargas-PC\Desktop\Proyectos\Sistema_SEN\electronica_i_web"

# 1. Inicializar Repositorio
git init
Write-Host "Repositorio inicializado localmente." -ForegroundColor Cyan

# 2. Agregar Archivos
git add .
git commit -m "Lanzamiento inicial del Hub de Electronica I: Version Multi-Page con PWA y Branding"
Write-Host "Archivos preparados para subir." -ForegroundColor Green

Write-Host "--------------------------------------------------------"
Write-Host "PASOS FINALES PARA TI EN GITHUB.COM:" -ForegroundColor Yellow
Write-Host "1. Crea un nuevo repositorio llamado 'electronica-hub' en tu GitHub."
Write-Host "2. Copia la URL del repositorio (https://github.com/sargas1717-bit/electronica-hub.git)."
Write-Host "3. En esta terminal, escribe los siguientes comandos:"
Write-Host "   git remote add origin https://github.com/sargas1717-bit/electronica-hub.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host "4. ¡Listo! Luego ve a Settings > Pages en GitHub y elige 'main' como fuente."
Write-Host "--------------------------------------------------------"
