import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

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

export const updateFile = async (rl) => {
    try {
        const dataDir = path.join('src', 'data');
        const files = await fs.readdir(dataDir);
        
        if (files.length === 0) {
            console.log(chalk.yellow('Aucun fichier trouvé dans le répertoire data.'));
            return;
        }

        console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
        console.log(chalk.cyan.bold('▰▰▰▰                ◀ Structure des fichiers ▶                ▰▰▰▰'));
        console.log(chalk.cyan.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n'));

        // Afficher la liste des fichiers disponibles
        console.log(chalk.blue('Fichiers disponibles :'));
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const jsonData = JSON.parse(content);
                console.log(chalk.yellow(`- ${jsonData.metadata.title}`));
            }
        }

        // Demander quel fichier modifier
        const fileTitle = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le titre du fichier à modifier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Chercher le fichier
        const fileName = `${fileTitle}.json`;
        const filePath = path.join(dataDir, fileName);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(content);

            console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
            console.log(chalk.cyan.bold('▰▰▰▰                ◀ Structure du fichier ▶                ▰▰▰▰'));
            console.log(chalk.cyan.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n'));

            // Afficher la structure complète du fichier
            displayStructure(jsonData);

            // TODO: Ajouter les options de modification ici

        } catch (error) {
            console.log(chalk.red(`Le fichier "${fileTitle}.json" n'existe pas !`));
            return;
        }

    } catch (error) {
        console.error(chalk.red('Erreur lors de la lecture des fichiers:', error.message));
    }
}; 