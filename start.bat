@echo off
@echo Je vous invite a ne pas utiliser Le CMD pour lancer le programme, Faites le plutard avec un IDE, ça rends le tout plus simple a lire a cause des couleurs
timeout /t 5 /nobreak
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installé 
    pause
    exit /b
)

:: Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo Installation des dépendances...
    npm install
)

npm start

pause 