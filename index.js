import readline from 'readline';
import chalk from 'chalk';
import { createFile } from './src/modules/create.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Titre de l'application
console.log(chalk.cyan('///////////////////////////'));
console.log(chalk.cyan('//') + chalk.yellow(' MindMap - CLI MAPPING ') + chalk.cyan('//'));
console.log(chalk.cyan('///////////////////////////'));

// Fonction pour afficher le menu principal
function mainMenu() {
    console.log(chalk.blue('//'));
    console.log(chalk.blue('//') + chalk.green(' Option Principal:'));
    console.log(chalk.blue('//') + chalk.yellow(' 1.') +' Afficher la liste des fichiers');
    console.log(chalk.blue('//') + chalk.yellow(' 2.') +' Créé un neaveau fichier');
    console.log(chalk.blue('//') + chalk.yellow(' 3.') +' Modifier un fichier');
    console.log(chalk.blue('//') + chalk.yellow(' 4.') +' Supprimer un fichier');
    console.log(chalk.blue('//') + chalk.yellow(' 5.') +' Lister un fichier');
    console.log(chalk.blue('//'));
    console.log(chalk.blue('//') + chalk.red(' Stop') + ' Quitter');

    // Demande à l'utilisateur de choisir une option    
    rl.question(chalk.yellow('\nChoisissez une option (1-5) ou' + chalk.red(' Stop') +  ' pour quitter : '), async (answer) => {
        switch(answer) {
            case '1':
                console.log(chalk.green('Vous avez choisi l\'option 1'));
                mainMenu();
                break;
            case '2':
                await createFile(rl);
                mainMenu();
                break;
            case '3':
                console.log(chalk.red('Au revoir!'));
                rl.close();
                break;
            default:
                console.log(chalk.red('Option invalide, veuillez réessayer'));
                mainMenu();
        }
    });
}

mainMenu(); 