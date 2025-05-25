import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { listFiles } from './listFiles.js';

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
    console.log(chalk.gray('5. Quitter'));
};

// Fonction pour supprimer un fichier et ses sous-fichiers
const deleteFileFromDisk = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log(chalk.green(`\nLe fichier "${path.basename(filePath)}" a été supprimé avec succès.`));
    } catch (error) {
        console.error(chalk.red(`Erreur lors de la suppression du fichier: ${error.message}`));
    }
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
            let currentPath = 'racine';
            let currentData = jsonData;
            let parentData = null;
            let parentKey = null;

            while (true) {
                displayCurrentPath(currentPath);
                
                // Afficher le contenu actuel
                console.log(chalk.yellow(`\n📁 ${currentData.metadata ? currentData.metadata.title : currentData.title}`));
                console.log(chalk.gray(`   Créé le: ${new Date(currentData.createdAt).toLocaleString()}`));
                console.log(chalk.gray(`   Dernière modification: ${new Date(currentData.lastModified).toLocaleString()}`));
                console.log(chalk.blue(`   Contenu: ${currentData.content}`));

                if (currentData.subFiles && Object.keys(currentData.subFiles).length > 0) {
                    console.log(chalk.green('\n   Sous-fichiers:'));
                    for (const [key, value] of Object.entries(currentData.subFiles)) {
                        console.log(chalk.green(`   └─ ${key}`));
                    }
                }

                displayOptions(currentPath, currentData.subFiles && Object.keys(currentData.subFiles).length > 0);

                const choice = await new Promise((resolve) => {
                    rl.question(chalk.blue('\nVotre choix (1-5): '), (answer) => {
                        resolve(answer.trim());
                    });
                });

                switch (choice) {
                    case '1': // Naviguer vers un sous-fichier
                        if (currentData.subFiles && Object.keys(currentData.subFiles).length > 0) {
                            const subFileTitle = await new Promise((resolve) => {
                                rl.question(chalk.blue('Entrez le titre du sous-fichier: '), (answer) => {
                                    resolve(answer.trim());
                                });
                            });

                            if (currentData.subFiles[subFileTitle]) {
                                parentData = currentData;
                                parentKey = subFileTitle;
                                currentData = currentData.subFiles[subFileTitle];
                                currentPath = `${currentPath} > ${subFileTitle}`;
                            } else {
                                console.log(chalk.red(`Le sous-fichier "${subFileTitle}" n'existe pas.`));
                            }
                        } else {
                            console.log(chalk.yellow('Aucun sous-fichier disponible.'));
                        }
                        break;

                    case '2': // Remonter d'un niveau
                        if (currentPath !== 'racine') {
                            currentData = parentData;
                            currentPath = currentPath.split(' > ').slice(0, -1).join(' > ') || 'racine';
                            parentData = null;
                            parentKey = null;
                        } else {
                            console.log(chalk.yellow('Vous êtes déjà à la racine.'));
                        }
                        break;

                    case '3': // Supprimer un sous-fichier
                        if (currentData.subFiles && Object.keys(currentData.subFiles).length > 0) {
                            const subFileTitle = await new Promise((resolve) => {
                                rl.question(chalk.blue('Entrez le titre du sous-fichier à supprimer: '), (answer) => {
                                    resolve(answer.trim());
                                });
                            });

                            if (currentData.subFiles[subFileTitle]) {
                                delete currentData.subFiles[subFileTitle];
                                currentData.lastModified = new Date().toISOString();
                                await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
                                console.log(chalk.green(`Le sous-fichier "${subFileTitle}" a été supprimé.`));
                            } else {
                                console.log(chalk.red(`Le sous-fichier "${subFileTitle}" n'existe pas.`));
                            }
                        } else {
                            console.log(chalk.yellow('Aucun sous-fichier à supprimer.'));
                        }
                        break;

                    case '4': // Supprimer le fichier actuel
                        const confirm = await new Promise((resolve) => {
                            rl.question(chalk.red(`Êtes-vous sûr de vouloir supprimer ${currentPath === 'racine' ? 'ce fichier' : 'ce sous-fichier'} ? (oui/non): `), (answer) => {
                                resolve(answer.toLowerCase() === 'oui');
                            });
                        });

                        if (confirm) {
                            if (currentPath === 'racine') {
                                await deleteFileFromDisk(filePath);
                                return;
                            } else {
                                delete parentData.subFiles[parentKey];
                                parentData.lastModified = new Date().toISOString();
                                await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
                                console.log(chalk.green(`Le sous-fichier a été supprimé.`));
                                currentData = parentData;
                                currentPath = currentPath.split(' > ').slice(0, -1).join(' > ') || 'racine';
                                parentData = null;
                                parentKey = null;
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