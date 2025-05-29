# MindMap - CLI MAPPING

Une application en ligne de commande pour gérer et structurée vos fichiers de manière organisée.

## 📋 Description

MindMap CLI est un outil de gestion de fichiers qui permet de :
- Créer des fichiers JSON structurés avec métadonnées
- Visualiser la structure des fichiers de manière arborescente
- Gérer les métadonnées des fichiers (dates de création, modification)
- Organiser le contenu avec des sous-fichiers
- Naviguer facilement dans la hierarchie des fichiers
- Modifier les fichiers et sous-fichiers dynamiquement
- Suprimer des fichiers ou sous-fichiers

## 🚀 Installation

1. Prérequis :
   - Node.js (version 14 ou superieur)
   - npm (version 6 ou supérieur)

2. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd mindmap-cli
```

3. Installez les dépendances :
```bash
npm install
```

## 💻 Utilisation

### Démarrage
Lancez l'application :
```bash
npm start
```

### Menu Principal
```
Options disponibles :
1. Afficher la liste des fichiers
2. Créer un nouveau fichier
3. Modifier un fichier
4. Suprimer un fichier
5. Lister un fichier
6. Quitter l'application
```

### Commandes de Navigation
- Utilisez les numéros pour sélectioner les options
- Appuyez sur 'Enter' pour valider votre choix
- Laissez vide et appuyez sur 'Enter' pour conserver les valeurs existantes

### Structure des Fichiers

Les fichiers sont stockés au format JSON avec la structure suivante :
```json
{
  "metadata": {
    "title": "nom_du_fichier",
    "createdAt": "2024-03-24T14:30:00.000Z",
    "lastModified": "2024-03-24T14:30:00.000Z"
  },
  "content": "Contenu du fichier",
  "subFiles": {
    "nom_sous_fichier": {
      "title": "nom_sous_fichier",
      "content": "contenu_sous_fichier",
      "createdAt": "2024-03-24T14:30:00.000Z",
      "lastModified": "2024-03-24T14:30:00.000Z",
      "subFiles": {}
    }
  }
}
```

## 📁 Structure du Projet

```
src/
├── data/           # Dossier contenant les fichiers JSON
├── modules/        # Modules de l'application
│   ├── create.js   # Gestion de la création de fichiers
│   ├── modify.js   # Modification des fichiers
│   ├── delete.js   # Supression des fichiers
│   ├── read.js     # Lecture des fichiers
│   └── listFiles.js # Affichage de la structure
└── utils/          # Utilitaires
    ├── FileNavigator.js  # Navigation dans les fichiers
    └── FileModifier.js   # Modification des fichiers
```

## 🔧 Fonctionnalités Détaillées

### Gestion des Fichiers
- Création de fichiers avec métadonnées
- Modification du contenu et des titres
- Support de sous-fichiers illimités
- Navigation intuitive dans l'arboressence
- Supression récursive des fichiers

### Interface Utilisateur
- Interface en ligne de commande colorée
- Retours visuels sur les actions
- Messages d'erreurs explicites
- Confirmation des actions importantes

### Gestion des Données
- Stockage en JSON
- Validation des données
- Maintient automatique des métadonnées
- Protection contre les conflits de noms

## 🛠️ Technologies Utilisées

- Node.js
- ES Modules
- Chalk (pour la coloration du CLI)
- fs/promises (pour les opérations fichiers asynchrones)
- readline (pour l'interface utilisateur)

## 🐛 Problèmes Connus

### Problèmes Actuels
- [x] Les caractères spéciaux dans les titres peuvent parfois posés problème
- [ ] La supression d'un fichier parent ne demande pas de confirmation pour les sous-fichiers
- [x] Certains messages d'erreurs pourraient être plus explicites

### Gestion des Dates
- [ ] Problème de gestion des dates dans certains cas :
  - [ ] Décalage possible avec le fuseau horraire
  - [x] Incohérence entre les dates affiché et stocké
  - [ ] Format de date pas toujours consistant

### Interface Utilisateur
- [ ] Manque de systématique dans les interactions utilisateur :
  - [x] Mélange entre choix numérique et saisie libre
  - [ ] Certaines actions manquent de confirmation
  - [ ] Pas de possibilité d'annulé une action

### Navigation
- [ ] Navigation parfois confuse :
  - [x] Retour à la racine pas toujours intuitif
  - [ ] Manque d'indication sur la position actuel
  - [ ] Impossibilité de navigué plusieurs niveaux d'un coup

### Performance
- [ ] Gestion de la mémoire :
  - [ ] Chargement complet de l'arboressence en mémoire
  - [x] Possible ralentissement avec beaucoup de sous-fichiers
  - [ ] Pas de nettoyage automatique des fichiers temporaire

### Interface
- [ ] Problèmes d'affichage :
  - [x] Certains messages sont tronqués sur petit écrans
  - [ ] Couleurs pas toujours visible selon le theme du terminal
  - [ ] Absence de racourcis clavier

### Limitations Techniques
- [ ] Contraintes techniques :
  - [ ] Pas de support pour les fichiers voluminneux
  - [x] Absence de recherche dans le contenu
  - [ ] Pas de gestion des conflits en cas d'accès simultané

> Note: Les cases cochées [x] indiquent les problèmes en cours de résolution ou partiellement résolus.

## 📝 Licence

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📚 Documentation Additionelle

Pour plus d'informations sur l'utilisation et le développement :
https://github.com/CPNV-ES/2025_Code_Entretien

