import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { FileNavigator } from '../utils/FileNavigator.js';

const UI_BORDERS = {
    HEADER: chalk.cyan.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'),
    SECTION: chalk.gray('──────────────────────────────────────────────────────────────')
};

const UI_HEADERS = {
    FILE_STRUCTURE: '◀ Structure des fichiers ▶',
    FILE_CONTENT: '◀ Structure du fichier ▶'
};

const FILE_ICONS = {
    FOLDER: '📁',
    SUBFOLDER: '└─'
};

// Fonction pour afficher la structure des fichiers de manière navigable
const displayStructure = (data, level = 0, prefix = '') => {
    const indent = '  '.repeat(level);
    
    // Afficher les métadonnées du fichier
    console.log(chalk.yellow(`${indent}📁 ${data.metadata.title}`));
    console.log(chalk.gray(`${indent}   Créé le: ${new Date(data.metadata.createdAt).toLocaleString()}`));
    console.log(chalk.gray(`${indent}   Dernière modification: ${new Date(data.metadata.lastModified).toLocaleString()}`));
    console.log(chalk.blue(`${indent}   Contenu: ${data.content}`));

    // Afficher les sous-fichiers s'ils existent
    if (data.subFiles && Object.keys(data.subFiles).length > 0) {
        console.log(chalk.green(`${indent}   Sous-fichiers:`));
        for (const [key, value] of Object.entries(data.subFiles)) {
            console.log(chalk.green(`${indent}   └─ ${key}`));
            console.log(chalk.gray(`${indent}      Créé le: ${new Date(value.createdAt).toLocaleString()}`));
            console.log(chalk.gray(`${indent}      Dernière modification: ${new Date(value.lastModified).toLocaleString()}`));
            console.log(chalk.blue(`${indent}      Contenu: ${value.content}`));

            // Afficher les sous-sous-fichiers s'ils existent
            if (value.subFiles && Object.keys(value.subFiles).length > 0) {
                console.log(chalk.green(`${indent}      Sous-fichiers:`));
                for (const [subKey, subValue] of Object.entries(value.subFiles)) {
                    console.log(chalk.green(`${indent}      └─ ${subKey}`));
                    console.log(chalk.gray(`${indent}         Créé le: ${new Date(subValue.createdAt).toLocaleString()}`));
                    console.log(chalk.gray(`${indent}         Dernière modification: ${new Date(subValue.lastModified).toLocaleString()}`));
                    console.log(chalk.blue(`${indent}         Contenu: ${subValue.content}`));
                }
            }
        }
    }
    console.log(chalk.gray(`${indent}   ──────────────────────────────────────────────────────────────`));
};

// Fonction pour afficher la liste des fichiers disponibles
const displayAvailableFiles = async (dataDir) => {
    const files = await fs.readdir(dataDir);
    if (files.length === 0) {
        console.log(chalk.yellow('Aucun fichier trouvé dans le répertoire data.'));
        return false;
    }

    console.log(chalk.blue('Fichiers disponibles :'));
    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(dataDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(content);
            console.log(chalk.yellow(`${FILE_ICONS.FOLDER} ${jsonData.metadata.title}`));
        }
    }
    return true;
};

// Fonction pour afficher l'en-tête
const displayHeader = (title) => {
    console.log(UI_BORDERS.HEADER);
    console.log(chalk.cyan.bold(`▰▰▰▰                ${title}                ▰▰▰▰`));
    console.log(chalk.cyan.bold(`${UI_BORDERS.HEADER}\n`));
};

// Fonction pour afficher les options disponibles
const displayOptions = (navigator) => {
    console.log(chalk.cyan.bold('\nOptions disponibles:'));
    console.log(chalk.gray('1. Modifier le contenu'));
    console.log(chalk.gray('2. Naviguer vers un sous-fichier'));
    if (navigator.getCurrentPath() !== 'racine') {
        console.log(chalk.gray('3. Remonter d\'un niveau'));
    }
    console.log(chalk.gray('4. Quitter'));
};

// Fonction pour modifier le contenu
const modifyContent = async (rl, navigator) => {
    const currentData = navigator.getCurrentData();
    console.log(chalk.blue('\nContenu actuel: ') + currentData.content);
    
    const newContent = await new Promise((resolve) => {
        rl.question(chalk.blue('Nouveau contenu: '), (answer) => {
            resolve(answer.trim());
        });
    });

    currentData.content = newContent;
    currentData.lastModified = new Date().toISOString();
    return true;
};

export const modifyFile = async (rl) => {
    try {
        const dataDir = path.join('src', 'data');
        
        // Afficher l'en-tête et la liste des fichiers
        displayHeader(UI_HEADERS.FILE_STRUCTURE);
        if (!await displayAvailableFiles(dataDir)) {
            return;
        }

        // Demander quel fichier modifier
        const fileTitle = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le titre du fichier à modifier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        const fileName = `${fileTitle}.json`;
        const filePath = path.join(dataDir, fileName);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(content);
            const navigator = new FileNavigator(jsonData);

            displayHeader(UI_HEADERS.FILE_CONTENT);

            while (true) {
                // Afficher le contenu actuel
                navigator.displayCurrentContent();
                displayOptions(navigator);

                const choice = await new Promise((resolve) => {
                    rl.question(chalk.blue('\nVotre choix: '), (answer) => {
                        resolve(answer.trim());
                    });
                });

                switch (choice) {
                    case '1': // Modifier le contenu
                        if (await modifyContent(rl, navigator)) {
                            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
                            console.log(chalk.green('Contenu modifié avec succès !'));
                        }
                        break;

                    case '2': // Naviguer vers un sous-fichier
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

                    case '3': // Remonter d'un niveau
                        if (navigator.getCurrentPath() !== 'racine') {
                            const upResult = navigator.navigateUp();
                            if (!upResult.success) {
                                console.log(chalk.yellow(upResult.message));
                            }
                        }
                        break;

                    case '4': // Quitter
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