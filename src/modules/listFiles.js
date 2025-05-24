import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export const listFiles = async () => {
    try {
        const dataDir = path.join('src', 'data');
        
        // Lire tous les fichiers du dossier data
        const files = await fs.readdir(dataDir);
        
        console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
        console.log(chalk.cyan.bold('▰▰▰▰                ◀ Structure des fichiers ▶                ▰▰▰▰'));
        console.log(chalk.cyan.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n'));
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const jsonData = JSON.parse(content);
                
                // Afficher le titre du fichier
                console.log(chalk.yellow(`📁 ${jsonData.metadata.title}`));
                console.log(chalk.gray(`   Créé le: ${new Date(jsonData.metadata.createdAt).toLocaleString()}`));
                console.log(chalk.gray(`   Dernière modification: ${new Date(jsonData.metadata.lastModified).toLocaleString()}`));
                
                // Afficher le contenu
                console.log(chalk.blue(`   Contenu: ${jsonData.content}`));
                
                // Afficher les sous-fichiers seulement s'il n'y a pas de NoSubFiles
                if (jsonData.subFiles && Object.keys(jsonData.subFiles).length > 0) {
                    console.log(chalk.green('   Sous-fichiers:'));
                    for (const [key, value] of Object.entries(jsonData.subFiles)) {
                        // Ne pas afficher NoSubFiles
                        if (key !== 'NoSubFiles') {
                            console.log(chalk.green(`      └─ ${key}: ${value.content}`));
                            console.log(chalk.gray(`         Créé le: ${new Date(value.createdAt).toLocaleString()}`));
                            console.log(chalk.gray(`         Dernière modification: ${new Date(value.lastModified).toLocaleString()}`));
                        }
                    }
                }
                
                console.log(chalk.gray('   ──────────────────────────────────────────────────────────────'));
            }
        }
    } catch (error) {
        console.error(chalk.red('Erreur lors de la lecture des fichiers:', error.message));
    }
}; 