import chalk from 'chalk';

// ------------------------------------------------------------
// classe pour naviguer dans les fichiers, permet de naviguer entre les fichiers 
// et de modifier le contenu des fichiers, et de supprimer des sous-fichiers, 
// et de naviguer vers le parent, et de vérifier si on est à la racine, 
// et de récupérer les informations du parent.  
//
// ------------------------------------------------------------
// Utilisation:
//
// const navigator = new FileNavigator(jsonData);
// navigator.getCurrentPath();
// navigator.getCurrentData();
// navigator.hasSubFiles();
// navigator.displayCurrentContent();
// navigator.navigateToSubFile(subFileTitle);
// navigator.navigateUp();
// navigator.deleteSubFile(subFileTitle);
// navigator.isAtRoot();
// navigator.getParentInfo();
//
// P.S. Utilisation de la fonction d'autocomplétion pour les commentaires
// ------------------------------------------------------------

export class FileNavigator {
    constructor(jsonData) {
        this.currentPath = jsonData.metadata.title ;    // utilise le titre du fichier comme chemin par défaut
        this.currentData = jsonData;                    // données du fichier actuel, par défaut jsonData
        this.parentData = null;                         // données du parent, par défaut null, car on est à la racine
        this.parentKey = null;                          // clé du parent, par défaut null, car on est à la racine
    }


    // ------------------------------------------------------------
    // récupérer le chemin du fichier
    // ------------------------------------------------------------

    getCurrentPath() {
        return this.currentPath;        // retourne le chemin du fichier actuel
    }


    // ------------------------------------------------------------
    // récupérer les données du fichier
    // ------------------------------------------------------------

    getCurrentData() {
        return this.currentData;        // retourne les données du fichier actuel
    }


    // ------------------------------------------------------------
    // vérifier si le fichier a des sous-fichiers   
    // ------------------------------------------------------------

    hasSubFiles() {
        return this.currentData.subFiles && Object.keys( 
            this.currentData.subFiles).length > 0;
    }


    // ------------------------------------------------------------
    // afficher le contenu du fichier
    // ------------------------------------------------------------

    displayCurrentContent() {
        console.log(chalk.yellow(`\n📁 ${this.currentData.metadata ? this.currentData.metadata.title : this.currentData.title}`));
        console.log(chalk.gray(`   Créé le: ${new Date(this.currentData.createdAt).toLocaleString()}`));
        console.log(chalk.gray(`   Dernière modification: ${new Date(this.currentData.lastModified).toLocaleString()}`));
        console.log(chalk.blue(`   Contenu: ${this.currentData.content}`));

        if (this.hasSubFiles()) {
            console.log(chalk.green('\n   Sous-fichiers:'));
            for (const [key] of Object.entries(this.currentData.subFiles)) {
                console.log(chalk.green(`   └─ ${key}`));
            }
        }
        console.log(chalk.gray(`  ──────────────────────────────────────────────────────────────`));
    }


    // ------------------------------------------------------------
    // naviguer vers un sous-fichier
    // ------------------------------------------------------------

    navigateToSubFile(subFileTitle) {
        if (!this.hasSubFiles()) {
            return { success: false, message: 'Aucun sous-fichier disponible.' };
        }

        if (this.currentData.subFiles[subFileTitle]) {
            this.parentData = this.currentData;
            this.parentKey = subFileTitle;
            this.currentData = this.currentData.subFiles[subFileTitle];
            this.currentPath = `${this.currentPath} > ${subFileTitle}`;
            return { success: true };
        }

        return { success: false, message: `Le sous-fichier "${subFileTitle}" n'existe pas.` };
    }


    // ------------------------------------------------------------
    // naviguer vers le parent
    // ------------------------------------------------------------

    navigateUp() {
        if (this.currentPath === this.currentData.metadata.title) {
            return { success: false, message: 'Vous êtes déjà à la racine.' };
        }

        this.currentData = this.parentData;
        this.currentPath = this.currentPath.split(' > ').slice(0, -1).join(' > ');
        this.parentData = null;
        this.parentKey = null;
        return { success: true };
    }


    // ------------------------------------------------------------
    // supprimer un sous-fichier
    // ------------------------------------------------------------

    deleteSubFile(subFileTitle) {
        if (!this.hasSubFiles()) {
            return { success: false, message: 'Aucun sous-fichier à supprimer.' };
        }

        if (this.currentData.subFiles[subFileTitle]) {
            delete this.currentData.subFiles[subFileTitle];
            this.currentData.lastModified = new Date().toISOString();
            return { success: true };
        }

        return { success: false, message: `Le sous-fichier "${subFileTitle}" n'existe pas.` };
    }


    // ------------------------------------------------------------
    // vérifier si on est à la racine
    // ------------------------------------------------------------

    isAtRoot() {
        return this.currentPath === this.currentData.metadata.title;
    }


    // ------------------------------------------------------------
    // récupérer les informations du parent
    // ------------------------------------------------------------

    getParentInfo() {
        return {
            parentData: this.parentData,
            parentKey: this.parentKey
        };
    }
} 