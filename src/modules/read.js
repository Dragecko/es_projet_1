// Fichier pour gérer les opérations de lecture
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { listFiles } from './listFiles.js';
import { FileNavigator } from '../utils/FileNavigator.js';

// Fonction pour afficher les options disponibles
const displayOptions = (currentPath, hasSubFiles) => {
    console.log(chalk.cyan.bold('\nOptions disponibles:'));
    console.log(chalk.gray('1. Naviguer vers un sous-fichier'));
    if (currentPath !== 'racine') {
        console.log(chalk.gray('2. Remonter d\'un niveau'));
    }
    console.log(chalk.red('3. Quitter'));
};

export const readFile = async (rl) => {
    try {
        // Afficher la structure des fichiers
        await listFiles();
        
        // Demander le fichier à lire
        const fileTitle = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrer le titre du fichier à lire: '), (answer) => {
                resolve(answer.trim());
            });
        });

        const dataDir = path.join('src', 'data');
        const fileName = `${fileTitle}.json`;
        const filePath = path.join(dataDir, fileName);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(content);
            const navigator = new FileNavigator(jsonData);

            while (true) {
                // Afficher le chemin actuel
                console.log(chalk.gray.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
                console.log(chalk.cyan.bold('🔗 Chemin actuel: ') + chalk.yellow(navigator.getCurrentPath()));
                console.log(chalk.gray.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
                
                
                // Afficher le contenu actuel
                navigator.displayCurrentContent();
                
                // Afficher les options
                displayOptions(navigator.getCurrentPath(), navigator.hasSubFiles());

                const choice = await new Promise((resolve) => {
                    rl.question(chalk.blue('\nVotre choix (1-3): '), (answer) => {
                        resolve(answer.trim());
                    });
                });

                switch (choice) {
                    case '1': // Naviguer vers un sous-fichier
                        if (navigator.hasSubFiles()) {
                            const subFileTitle = await new Promise((resolve) => {
                                rl.question(chalk.blue('Entrer le titre du sous-fichier: '), (answer) => {
                                    resolve(answer.trim());
                                });
                            });

                            const navResult = navigator.navigateToSubFile(subFileTitle);
                            if (!navResult.success) {
                                console.log(chalk.red(navResult.message));
                            }
                        } else {
                            console.log(chalk.yellow('Aucun sous-fichier disponible.'));
                        }
                        break;

                    case '2': // Remonter d'un niveau
                        const upResult = navigator.navigateUp();
                        if (!upResult.success) {
                            console.log(chalk.yellow(upResult.message));
                        }
                        break;

                    case '3': // Quitter
                        return;

                    default:
                        console.log(chalk.red('Option invalide.'));
                }
            }

        } catch (error) {
            console.log(chalk.red(`Le fichié "${fileTitle}.json" n'existe pas !`));
            return;
        }

    } catch (error) {
        console.error(chalk.red('Erreur lor de la lecture:', error.message));
    }
}; 