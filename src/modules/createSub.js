import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export const createSubFile = async (rl) => {
    try {
        // Demander le nom du fichier parent
        const parentFileName = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le nom du fichier parent (sans extension): '), (answer) => {
                resolve(answer.trim());
            });
        });

        const parentFilePath = path.join('src', 'data', `${parentFileName}.json`);

        // Vérifier si le fichier parent existe
        try {
            await fs.access(parentFilePath);
        } catch {
            console.log(chalk.red(`Le fichier ${parentFileName}.json n'existe pas !`));
            return;
        }

        // Lire le fichier parent
        const parentContent = await fs.readFile(parentFilePath, 'utf-8');
        const parentData = JSON.parse(parentContent);

        // Supprimer complètement NoSubFiles et réinitialiser subFiles
        if (parentData.subFiles) {
            const newSubFiles = {};
            for (const [key, value] of Object.entries(parentData.subFiles)) {
                if (key !== 'NoSubFiles') {
                    newSubFiles[key] = value;
                }
            }
            parentData.subFiles = newSubFiles;
            console.log(chalk.yellow('"NoSubFiles" a été complètement supprimé du fichier.'));
        }

        // Demander le nom du sous-fichier
        const subFileName = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le nom du sous-fichier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Demander le contenu du sous-fichier
        const subFileContent = await new Promise((resolve) => {
            rl.question(chalk.yellow('Entrez le contenu du sous-fichier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Créer la structure du sous-fichier
        const subFileStructure = {
            title: subFileName,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            content: subFileContent
        };

        // Initialiser subFiles si nécessaire
        if (!parentData.subFiles) {
            parentData.subFiles = {};
        }

        // Vérifier s'il y a déjà des sous-fichiers
        if (Object.keys(parentData.subFiles).length > 0) {
            const addToExisting = await new Promise((resolve) => {
                console.log(chalk.yellow('\nSous-fichiers existants :'));
                Object.keys(parentData.subFiles).forEach(key => {
                    console.log(chalk.blue(`- ${key}`));
                });
                rl.question(chalk.yellow('\nVoulez-vous ajouter ce sous-fichier à un sous-fichier existant ? (oui/non): '), (answer) => {
                    resolve(answer.toLowerCase() === 'oui');
                });
            });

            if (addToExisting) {
                const targetSubFile = await new Promise((resolve) => {
                    rl.question(chalk.blue('Entrez le nom du sous-fichier cible: '), (answer) => {
                        resolve(answer.trim());
                    });
                });

                if (parentData.subFiles[targetSubFile]) {
                    // Initialiser subFiles dans le sous-fichier cible si nécessaire
                    if (!parentData.subFiles[targetSubFile].subFiles) {
                        parentData.subFiles[targetSubFile].subFiles = {};
                    }
                    parentData.subFiles[targetSubFile].subFiles[subFileName] = subFileStructure;
                    parentData.subFiles[targetSubFile].lastModified = new Date().toISOString();
                } else {
                    console.log(chalk.red(`Le sous-fichier "${targetSubFile}" n'existe pas !`));
                    return;
                }
            } else {
                // Ajouter comme nouveau sous-fichier au niveau principal
                parentData.subFiles[subFileName] = subFileStructure;
            }
        } else {
            // Premier sous-fichier
            parentData.subFiles[subFileName] = subFileStructure;
        }

        // Mettre à jour la date de modification du fichier parent
        parentData.metadata.lastModified = new Date().toISOString();

        // Sauvegarder le fichier parent mis à jour
        await fs.writeFile(parentFilePath, JSON.stringify(parentData, null, 2));
        console.log(chalk.green(`\nSous-fichier "${subFileName}" ajouté avec succès !`));

    } catch (error) {
        console.error(chalk.red('Erreur lors de la création du sous-fichier:', error.message));
    }
};
