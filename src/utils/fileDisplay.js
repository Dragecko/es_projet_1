import chalk from 'chalk';

export const display = {
    // Affiche les sous-fichiers de manière récursive avec un niveau de profondeur limité
    subFilesShort: (subFiles) => {
        for (const [key, value] of Object.entries(subFiles)) {
            console.log(chalk.green(`   └─ ${key}`));
            if (value.subFiles && Object.keys(value.subFiles).length > 0) { 
                for (const [subKey] of Object.entries(value.subFiles)) {
                    console.log(chalk.green(`       └─ ${subKey}`));
                }
            }
        }
    },

    // Affiche les informations principales d'un fichier
    fileInfo: (file) => {
        console.log(chalk.blue(`📁 ${file.metadata ? file.metadata.title : file.title}`));
        console.log(chalk.gray(`   Créé le: ${new Date(file.createdAt).toLocaleString()}`));
        console.log(chalk.gray(`   Dernière modification: ${new Date(file.lastModified).toLocaleString()}`));
        console.log(chalk.gray(`   Contenu: ${file.content}\n`));
    },

    // Affiche le cadre décoratif
    frame: (title) => {
        console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
        console.log(chalk.yellow(`Actuelle dans: ${title}`));
        console.log(chalk.gray.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n'));
    }
}; 