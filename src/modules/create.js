import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { createSubFile } from './createSub.js';

// Fichier pour gérer les opérations de création
export const createFile = async (rl) => {
    try {
        // Demander le nom du fichier
        const fileName = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le nom du fichier (sans extension): '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Vérifier si le fichier existe déjà
        const filePath = path.join('src', 'data', `${fileName}.json`);
        try {
            await fs.access(filePath);
            console.log(chalk.red(`Le fichier ${fileName}.json existe déjà !`));
            return;
        } catch {
            // Le fichier n'existe pas, on peut continuer
        }

        // Demander le contenu du fichier
        const content = await new Promise((resolve) => {
            rl.question(chalk.yellow('\nEntrez le contenu du fichier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Créer la structure JSON
        const subFiles = {"NoSubFiles": ""};
        const fileStructure = {
            metadata: {
                title: fileName,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            content: content,
            subFiles: subFiles
        };

        // Sauvegarder le fichier
        await fs.writeFile(filePath, JSON.stringify(fileStructure, null, 2));
        console.log(chalk.green(`\nFichier ${fileName}.json créé avec succès !`));
    } catch (error) {
        console.error(chalk.red('Erreur lors de la création du fichier:', error.message));
    }
};

// Fonction pour créer les sous-fichiers
const createSubFiles = async (rl) => {
    const content = {};
    const subFiles = {NoSubFiles: "NoSubFiles"};
    
    while (true) {
        const subFileName = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le nom du sous-fichier (ou "fin" pour terminer): '), (answer) => {
                resolve(answer.trim());
            });
        });

        if (subFileName.toLowerCase() === 'fin') {
            break;
        }

        const subFileContent = await new Promise((resolve) => {
            rl.question(chalk.yellow('Entrez le contenu du sous-fichier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        content[subFileName] = subFileContent;
    }

    return content;
}; 