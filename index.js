import readline from 'readline';
import chalk from 'chalk';
import { createFile } from './src/modules/create.js';
import { listFiles } from './src/modules/listFiles.js';
import { createSubFile } from './src/modules/createSub.js';
import { deleteFile } from './src/modules/delete.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Titre de l'application


// Fonction pour afficher le menu principal
function mainMenu() {
    console.log(chalk.cyan.bold('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
    console.log(chalk.cyan.bold('▰▰▰▰                ') + chalk.yellow('◀  MindMap - CLI MAPPING ▶') + chalk.cyan('                ▰▰▰▰'));
    console.log(chalk.cyan.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
    console.log(chalk.blue('▰▰                                                              ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.green('  ▶  Option Principal:') + chalk.blue('                                        ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.yellow('  1.') +' Afficher la liste des fichiers'+ chalk.blue('                           ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.yellow('  2.') +' Créé un neaveau fichier'+ chalk.blue('                                  ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.yellow('  3.') +' Créé un neaveau sous fichier'+ chalk.blue('                             ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.yellow('  4.') +' Modifier un fichier'+ chalk.blue('                                      ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.yellow('  5.') +' Supprimer un fichier'+ chalk.blue('                                     ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.yellow('  6.') +' Lister un fichier'+ chalk.blue('                                        ▰▰'));
    console.log(chalk.blue('▰▰                                                              ▰▰'));
    console.log(chalk.blue('▰▰▰▰                                                          ▰▰▰▰'));
    console.log(chalk.blue('▰▰                                                              ▰▰'));
    console.log(chalk.blue('▰▰') + chalk.red('  Stop') + ' pour Quitter' + chalk.blue('                                           ▰▰'));
    console.log(chalk.blue('▰▰                                                              ▰▰'));
    console.log(chalk.cyan.bold('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));

    // Demande à l'utilisateur de choisir une option    
    rl.question(chalk.yellow('\nChoisissez une option (1-5) ou' + chalk.red(' Stop') +  ' pour quitter : '), async (answer) => {
        switch(answer) {
            case '1':
                await listFiles();
                mainMenu();
                break;
            case '2':
                await createFile(rl);
                mainMenu();
                break;
            case '3':
                await createSubFile(rl);
                mainMenu();
                break;
            

            case '5':
                await deleteFile(rl);
                mainMenu();
                break;

            case 'Stop':
                console.log(chalk.red('Merci et à bientô, Des bisous :p'));
                rl.close();
                break;
            default:
                console.log(chalk.red('Option invalide, veuillez réessayer'));
                mainMenu();
        }
    });
}

mainMenu(); 