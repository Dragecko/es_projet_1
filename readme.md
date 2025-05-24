# MindMap - CLI MAPPING

Une application en ligne de commande pour gérer et organiser vos fichiers de manière structurée.

## 📋 Description

MindMap CLI est un outil de gestion de fichiers qui permet de :
- Créer des fichiers JSON structurés
- Visualiser la structure des fichiers de manière arborescente
- Gérer les métadonnées des fichiers (dates de création, modification)
- Organiser le contenu avec des sous-fichiers

## 🚀 Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
```

2. Installez les dépendances :
```bash
npm install
```

## 💻 Utilisation

Lancez l'application :
```bash
npm start
```

### Menu Principal
```
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
▰▰▰▰                ◀ Structure des fichiers ▶                ▰▰▰▰
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

Options disponibles :
1. Afficher la liste des fichiers
2. Créer un nouveau fichier
3. Modifier un fichier
4. Supprimer un fichier
5. Lister un fichier
```

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
    "nom_sous_fichier": "contenu_sous_fichier"
  }
}
```

## 📁 Structure du Projet

```
src/
├── data/           # Dossier contenant les fichiers JSON
└── modules/        # Modules de l'application
    ├── create.js   # Gestion de la création de fichiers
    └── listFiles.js # Affichage de la structure des fichiers
```

## 🛠️ Technologies Utilisées

- Node.js
- ES Modules
- Chalk (pour la coloration du CLI)

## 📝 Licence

ISC
