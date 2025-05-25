import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';


// Fichier pour gérer les opérations de création
export const createFile = async (rl) => {
    try {
        // Demander le titre du fichier
        const title = await new Promise((resolve) => {
            rl.question(chalk.blue('\nEntrez le titre du fichier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Vérifier si un fichier avec ce titre existe déjà
        const dataDir = path.join('src', 'data');
        const files = await fs.readdir(dataDir);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const jsonData = JSON.parse(content);
                
                if (jsonData.metadata.title === title) {
                    console.log(chalk.red(`Un fichier avec le titre "${title}" existe déjà !`));
                    return;
                }
            }
        }

        // Créer le nom du fichier à partir du titre
        const fileName = `${title}.json`;
        const filePath = path.join('src', 'data', fileName);

        // Demander le contenu du fichier
        const content = await new Promise((resolve) => {
            rl.question(chalk.yellow('\nEntrez le contenu du fichier: '), (answer) => {
                resolve(answer.trim());
            });
        });

        // Créer la structure JSON
        const fileStructure = {
            metadata: {
                title: title,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            content: content,
        }; 

        // Sauvegarder le fichier
        await fs.writeFile(filePath, JSON.stringify(fileStructure, null, 2));
        console.log(chalk.green(`\nFichier créé avec succès !`));
        console.log(chalk.blue(`Titre: ${title}`));
        console.log(chalk.blue(`Nom du fichier: ${fileName}`));
    } catch (error) {
        console.error(chalk.red('Erreur lors de la création du fichier:', error.message));
    }
};
