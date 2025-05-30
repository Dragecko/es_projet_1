import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { listFiles } from './listFiles.js';
import { FileNavigator } from '../utils/FileNavigator.js';
import { display } from '../utils/fileDisplay.js';    

// Fonction pour afficher le chemin actuel
const displayCurrentPath = (path) => {
    console.log(chalk.cyan.bold('\nChemin actuel: ') + chalk.yellow(path));
};

// Fonction pour afficher les options disponibles
const displayOptions = (currentPath, hasSubFiles) => {
    console.log(chalk.cyan.bold('\nOptions disponibles:'));
    console.log(chalk.gray('1. Naviguer vers un sous-fichier'));
    if (currentPath !== 'racine') {
        console.log(chalk.gray('2. Remonter d\'un niveau'));
    }
    if (hasSubFiles) {
        console.log(chalk.gray('3. Supprimer un sous-fichier'));
    }
    console.log(chalk.gray('4. Supprimer le fichier actuel'));
    console.log(chalk.red('5. Quitter'));
};

// Fonction pour supprimer un fichier complet du disque
const deleteFileFromDisk = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log(chalk.green(`\nLe fichier "${path.basename(filePath)}" a été supprimé avec succès.`));
    } catch (error) {
        console.error(chalk.red(`Erreur lors de la suppression du fichier: ${error.message}`));
    }
};

// Fonction pour supprimer un sous-fichier spécifique
const deleteSubFileAtPath = (data, pathParts) => {
    if (pathParts.length === 1) {
        // Supprimer directement dans le niveau actuel
        if (data.subFiles && data.subFiles[pathParts[0]]) {
            delete data.subFiles[pathParts[0]];
            return true;
        }
        return false;
    }

    // Naviguer dans l'arborescence
    const currentPart = pathParts[0];
    if (data.subFiles && data.subFiles[currentPart]) {
        return deleteSubFileAtPath(data.subFiles[currentPart], pathParts.slice(1));
    }
    return false;
};

export const deleteFile = async (rl) => {
    try {
        // Afficher la structure des fichiers
        await listFiles();
        
        // Demander le fichier à modifier
        const fileTitle = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le titre du fichier à supprimer: '), (answer) => {
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
                display.frame(navigator.getCurrentPath());
                navigator.displayCurrentContent();
                displayOptions(navigator.getCurrentPath(), navigator.hasSubFiles());

                const choice = await new Promise((resolve) => {
                    rl.question(chalk.blue('\nVotre choix (1-5): '), (answer) => {
                        resolve(answer.trim());
                    });
                });

                switch (choice) {
                    case '1': // Naviguer vers un sous-fichier
                        if (navigator.hasSubFiles()) {
                            const subFileTitle = await new Promise((resolve) => {
                                rl.question(chalk.blue('Entrez le titre du sous-fichier: '), (answer) => {
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

                    case '3': // Supprimer un sous-fichier
                        if (navigator.hasSubFiles()) {
                            const subFileToDelete = await new Promise((resolve) => {
                                rl.question(chalk.blue('Entrez le titre du sous-fichier à supprimer: '), (answer) => {
                                    resolve(answer.trim());
                                });
                            });

                            // Obtenir le chemin complet du sous-fichier à supprimer
                            const currentPath = navigator.getCurrentPath().split(' > ');
                            currentPath.push(subFileToDelete);
                            
                            // Supprimer le sous-fichier
                            if (deleteSubFileAtPath(jsonData, currentPath.slice(1))) {
                                await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
                                console.log(chalk.green(`Le sous-fichier "${subFileToDelete}" a été supprimé.`));
                            } else {
                                console.log(chalk.red(`Erreur: Impossible de trouver le sous-fichier "${subFileToDelete}"`));
                            }
                        } else {
                            console.log(chalk.yellow('Aucun sous-fichier à supprimer.'));
                        }
                        break;

                    case '4': // Supprimer le fichier actuel
                        const confirm = await new Promise((resolve) => {
                            rl.question(chalk.red(`Êtes-vous sûr de vouloir supprimer ${navigator.isAtRoot() ? 'ce fichier' : 'ce sous-fichier'} ? (oui/non): `), (answer) => {
                                resolve(answer.toLowerCase() === 'oui');
                            });
                        });

                        if (confirm) {
                            if (navigator.isAtRoot()) {
                                // Supprimer le fichier complet
                                await deleteFileFromDisk(filePath);
                                return;
                            } else {
                                // Supprimer le sous-fichier actuel
                                const currentPath = navigator.getCurrentPath().split(' > ');
                                if (deleteSubFileAtPath(jsonData, currentPath.slice(1))) {
                                    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
                                    console.log(chalk.green(`Le sous-fichier actuel a été supprimé.`));
                                    // Remonter d'un niveau après la suppression
                                    navigator.navigateUp();
                                } else {
                                    console.log(chalk.red('Erreur: Impossible de supprimer le sous-fichier actuel.'));
                                }
                            }
                        }
                        break;

                    case '5': // Quitter
                        return;

                    default:
                        console.log(chalk.red('Option invalide.'));
                }
            }

        } catch (error) {
            console.log(chalk.red(`Le fichier "${fileTitle}.json" n'existe pas !`));
            return;
        }

    } catch (error) {
        console.error(chalk.red('Erreur lors de la suppression:', error.message));
    }
}; 