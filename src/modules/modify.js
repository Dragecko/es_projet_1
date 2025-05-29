import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { FileNavigator } from '../utils/FileNavigator.js';
import { FileModifier } from '../utils/FileModifier.js';
import { listFiles } from './listFiles.js';

// Fonction pour modifier le contenu et le titre
const modifyFileContent = async (rl, fileModifier, isRoot = false) => {
    const metadata = fileModifier.getMetadata();
    console.log(chalk.blue('\nContenu actuel: ') + fileModifier.data.content);
    console.log(chalk.blue('Titre actuel: ') + metadata.title);

    // Modifier le titre
    const newTitle = await new Promise((resolve) => {
        rl.question(chalk.yellow('Nouveau titre (laisser vide pour garder l\'actuel): '), (answer) => {
            resolve(answer.trim());
        });
    });

    // Modifier le contenu
    const newContent = await new Promise((resolve) => {
        rl.question(chalk.yellow('Nouveau contenu (laisser vide pour garder l\'actuel): '), (answer) => {
            resolve(answer.trim());
        });
    });

    // Appliquer les modifications
    const result = await fileModifier.updateFile(newTitle, newContent, isRoot);
    
    if (!result.success) {
        console.log(chalk.red(result.message));
        return { modified: false };
    }

    return { modified: true, newTitle, newFilePath: result.newFilePath };
};

// Fonction pour afficher les options de navigation
const displayOptions = (hasSubFiles) => {
    console.log(chalk.cyan.bold('\nOptions disponibles:'));
    console.log(chalk.gray('1. Modifier ce fichier'));
    if (hasSubFiles) {
        console.log(chalk.gray('2. Naviguer vers un sous-fichier'));
    }
    console.log(chalk.red('3. Retourner au menu principal'));
};

// Fonction principale de modification
export const modifyFile = async (rl) => {
    try {
        // Afficher la liste des fichiers disponibles
        await listFiles();

        // Demander quel fichier modifier
        const fileTitle = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le titre du fichier à modifier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        const dataDir = path.join('src', 'data');
        const fileName = `${fileTitle}.json`;
        const filePath = path.join(dataDir, fileName);

        try {
            // Lire le fichier
            const content = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(content);
            const navigator = new FileNavigator(jsonData);
            const fileModifier = new FileModifier(jsonData, filePath);
            let currentFilePath = filePath;

            while (true) {
                console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
                console.log(chalk.yellow(`Actuelle dans: ${navigator.getCurrentPath()}`));
                console.log(chalk.gray.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
                
                // Afficher le contenu actuel
                navigator.displayCurrentContent();
                
                // Afficher les options
                displayOptions(navigator.hasSubFiles());

                const choice = await new Promise((resolve) => {
                    rl.question(chalk.blue('\nVotre choix: '), (answer) => {
                        resolve(answer.trim());
                    });
                });

                switch (choice) {
                    case '1': // Modifier le fichier actuel
                        const isRoot = navigator.isAtRoot();
                        const result = await modifyFileContent(rl, fileModifier, isRoot);
                        
                        if (result.modified) {
                            if (result.newFilePath) {
                                currentFilePath = result.newFilePath;
                            }
                            console.log(chalk.green('Modifications enregistrées avec succès !'));
                        }
                        break;

                    case '2': // Naviguer vers un sous-fichier
                        if (navigator.hasSubFiles()) {
                            console.log(chalk.yellow('\nSous-fichiers disponibles:'));
                            const subFiles = Object.keys(jsonData.subFiles);
                            subFiles.forEach((file, index) => {
                                console.log(chalk.blue(`${index + 1}. ${file}`));
                            });

                            const subChoice = await new Promise((resolve) => {
                                rl.question(chalk.blue('\nChoisissez un sous-fichier (numéro): '), (answer) => {
                                    resolve(answer.trim());
                                });
                            });

                            const selectedIndex = parseInt(subChoice) - 1;
                            if (selectedIndex >= 0 && selectedIndex < subFiles.length) {
                                const navResult = navigator.navigateToSubFile(subFiles[selectedIndex]);
                                if (!navResult.success) {
                                    console.log(chalk.red(navResult.message));
                                }
                            } else {
                                console.log(chalk.red('Choix invalide.'));
                            }
                        } else {
                            console.log(chalk.yellow('Aucun sous-fichier disponible.'));
                        }
                        break;

                    case '3': // Retourner au menu principal
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
        console.error(chalk.red('Erreur lors de la modification:', error.message));
    }
};
