import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { listFiles } from './listFiles.js';

// ------------------------------------------------------------------------------------------------
//
//  Fonction pour créer un sous-fichier dans un fichier parent, 
//  avec la possibilité de créer des sous-fichiers dans les sous-fichiers
//
// ------------------------------------------------------------------------------------------------

// Fonction pour afficher la structure des sous-fichiers
const displaySubFiles = (subFiles) => {
    for (const [key, value] of Object.entries(subFiles)) {
        console.log(chalk.green(`   └─ ${key}`));
        if (value.subFiles && Object.keys(value.subFiles).length > 0) { 
            for (const [subKey] of Object.entries(value.subFiles)) {
                console.log(chalk.green(`       └─ ${subKey}`));
            }
        }
    }
};

// Fonction pour trouver le fichier parent dans la structure
const findParentFile = (currentFile, targetTitle, currentPath = []) => {
    if (currentFile.metadata.title === targetTitle) {
        return { file: currentFile, path: currentPath };
    }

    if (currentFile.subFiles) {
        for (const [key, value] of Object.entries(currentFile.subFiles)) {
            const result = findParentFile(value, targetTitle, [...currentPath, key]);
            if (result) return result;
        }
    }
    return null;
};

export const createSubFile = async (rl) => {
    try {
        await listFiles();
        
        // Demander le titre du fichier parent
        const parentTitle = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le titre du fichier parent: '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Chercher le fichier parent par son titre
        const dataDir = path.join('src', 'data');
        const fileName = `${parentTitle}.json`;
        const parentFilePath = path.join(dataDir, fileName);

        // Vérifier si le fichier parent existe
        try {
            const content = await fs.readFile(parentFilePath, 'utf-8');
            const parentFileData = JSON.parse(content);

            // Afficher les sous-fichiers existants
            if (parentFileData.subFiles && Object.keys(parentFileData.subFiles).length > 0) {
                console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
                console.log(chalk.yellow(`Actuelle dans: ${parentTitle}`));
                console.log(chalk.gray.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n'));
                
                console.log(chalk.blue(`📁 ${parentTitle}`));
                console.log(chalk.gray(`   Créé le: ${new Date(parentFileData.createdAt).toLocaleString()}`));
                console.log(chalk.gray(`   Dernière modification: ${new Date(parentFileData.lastModified).toLocaleString()}`));
                console.log(chalk.gray(`   Contenu: ${parentFileData.content}\n`));
                
                console.log(chalk.yellow('   Sous-fichiers:'));
                displaySubFiles(parentFileData.subFiles);
            }

            // Demander si on veut créer un sous-fichier dans un sous-fichier existant
            let targetFile = parentFileData;
            let targetPath = [];

            if (parentFileData.subFiles && Object.keys(parentFileData.subFiles).length > 0) {
                const createInSubFile = await new Promise((resolve) => {
                    rl.question(chalk.blue('\nVoulez-vous créer un sous-fichier dans un sous-fichier existant ? (y/n): '), (answer) => {
                        resolve(answer.toLowerCase() === 'y');
                    });
                });

                if (createInSubFile) {
                    const subFileTitle = await new Promise((resolve) => {
                        rl.question(chalk.blue('\nEntrez le titre du sous-fichier parent: '), (answer) => {
                            resolve(answer.trim());
                        });
                    });

                    if (parentFileData.subFiles[subFileTitle]) {
                        targetFile = parentFileData.subFiles[subFileTitle];
                        targetPath = [subFileTitle];
                    } else {
                        console.log(chalk.red(`\nErreur: Aucun sous-fichier avec le titre "${subFileTitle}" n'a été trouvé !`));
                        return;
                    }
                }
            }

            // Demander le nom du nouveau sous-fichier
            const subFileName = await new Promise((resolve) => {
                rl.question(chalk.yellow('\nEntrez le nom du sous-fichier: '), (answer) => {
                    resolve(answer.trim());
                });
            });

            // Vérifier si le sous-fichier existe déjà
            if (targetFile.subFiles && targetFile.subFiles[subFileName]) {
                console.log(chalk.red(`\nErreur: Le sous-fichier "${subFileName}" existe déjà dans ce fichier !`));
                return;
            }

            // Demander le contenu du sous-fichier
            const subFileContent = await new Promise((resolve) => {
                rl.question(chalk.yellow('\nEntrez le contenu du sous-fichier: '), (answer) => {
                    resolve(answer.trim());
                });
            });

            // Créer la structure du sous-fichier sans metadata
            const subFileStructure = {
                title: subFileName,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                content: subFileContent,
                subFiles: {}
            };

            // Initialiser subFiles si nécessaire
            if (!targetFile.subFiles) {
                targetFile.subFiles = {};
            }

            // Ajouter le sous-fichier
            targetFile.subFiles[subFileName] = subFileStructure;
            // Mettre à jour la date de modification du parent
            targetFile.lastModified = new Date().toISOString();

            // Sauvegarder le fichier parent mis à jour
            await fs.writeFile(parentFilePath, JSON.stringify(parentFileData, null, 2));

            console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
            console.log(chalk.green(`\nSous-fichier créé avec succès !`));
            console.log(chalk.blue(`Titre: ${subFileName}`));
            if (targetPath.length > 0) {
                console.log(chalk.blue(`Chemin: ${parentTitle} > ${targetPath.join(' > ')}`));
            } else {
                console.log(chalk.blue(`Fichier parent: ${parentTitle}`));
            }
            console.log(chalk.gray.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));

        } catch (error) {
            console.log(chalk.red(`Le fichier "${parentTitle}.json" n'existe pas !`));
            return;
        }

    } catch (error) {
        console.error(chalk.red('Erreur lors de la création du sous-fichier:', error.message));
    }
};
