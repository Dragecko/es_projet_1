import fs from 'fs/promises';
import path from 'path';


// ------------------------------------------------------------ 
// classe pour modifier les fichiers
//
// Utilisation:
// const fileModifier = new FileModifier(jsonData, filePath);
// fileModifier.updateContent(newContent);
// fileModifier.updateTitle(newTitle);
// fileModifier.saveChanges();
//
// P.S. Utilisation de la fonction d'autocomplétion pour les commentaires
// ------------------------------------------------------------

export class FileModifier {
    constructor(jsonData, filePath) {
        this.data = jsonData;
        this.filePath = filePath;
        this.dataDir = path.dirname(filePath);
    }


    // ------------------------------------------------------------
    // Mise à jour du contenu
    // ------------------------------------------------------------
    
    async updateContent(content, isRoot = false) {
        if (!content) return false;

        if (isRoot) {
            this.data.content = content;
        } else {
            this.data.content = content;
        }
        await this.updateModificationDate(isRoot);
        return true;
    }


    // ------------------------------------------------------------
    // Mise à jour du titre
    // ------------------------------------------------------------

    async updateTitle(newTitle, isRoot = false) {
        if (!newTitle) return { success: false, message: 'Titre vide' };

        // Vérifier si le nouveau titre est différent de l'ancien
        const currentTitle = isRoot ? this.data.metadata.title : this.data.title;
        if (currentTitle === newTitle) {
            return { success: false, message: 'Même titre' };
        }

        if (isRoot) {
            // Pour un fichier racine, vérifier si le nouveau nom de fichier existe déjà
            const newFilePath = path.join(this.dataDir, `${newTitle}.json`);
            try {
                await fs.access(newFilePath);
                return { success: false, message: 'Un fichier avec ce titre existe déjà' };
            } catch {
                // Le fichier n'existe pas, on peut procéder
                this.data.metadata.title = newTitle;
                await fs.rename(this.filePath, newFilePath);
                this.filePath = newFilePath;
            }
        } else {
            this.data.title = newTitle;
        }

        await this.updateModificationDate(isRoot);
        return { success: true, newFilePath: this.filePath };
    }


    // ------------------------------------------------------------
    // Mise à jour de la date de modification
    // ------------------------------------------------------------

    async updateModificationDate(isRoot = false) {
        const newDate = new Date().toISOString();
        if (isRoot) {
            this.data.metadata.lastModified = newDate;
        } else {
            this.data.lastModified = newDate;
        }
    }


    // ------------------------------------------------------------
    // Sauvegarde des modifications
    // ------------------------------------------------------------

    async saveChanges() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
            return { success: true };
        } catch (error) {
            return { success: false, message: `Erreur lors de la sauvegarde: ${error.message}` };
        }
    }


    // ------------------------------------------------------------
    // Vérification du type de fichier
    // ------------------------------------------------------------

    isRootFile() {
        return !!this.data.metadata;
    }


    // ------------------------------------------------------------
    // Récupération des métadonnées
    // ------------------------------------------------------------

    getMetadata() {
        if (this.isRootFile()) {
            return {
                title: this.data.metadata.title,
                createdAt: this.data.metadata.createdAt,
                lastModified: this.data.metadata.lastModified
            };
        }
        return {
            title: this.data.title,
            createdAt: this.data.createdAt,
            lastModified: this.data.lastModified
        };
    }


    // ------------------------------------------------------------
    // Mise à jour complète (titre et contenu)
    // ------------------------------------------------------------

    async updateFile(newTitle, newContent, isRoot = false) {
        let modified = false;
        let result = { success: true };

        if (newContent) {
            modified = await this.updateContent(newContent, isRoot) || modified;
        }

        if (newTitle) {
            const titleResult = await this.updateTitle(newTitle, isRoot);
            if (!titleResult.success) {
                return titleResult;
            }
            modified = true;
            result = titleResult;
        }

        if (modified) {
            const saveResult = await this.saveChanges();
            if (!saveResult.success) {
                return saveResult;
            }
        }

        return result;
    }
} 