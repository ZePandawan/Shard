# Structure de la base de données

## Nom de la base de données : shard

## Structure de la base de données :

- CHANNELS_C

- LOL_CHAMPIONS_LC
- LOL_SKINS_LS
- LOL_USERS_LU
- LOL_USER_SKINS_LUS

- PRONOS_P
- JOUEURS_PRONOS_JP

- CALENDRIER_C

- YOUTUBE_Y


## Table CHANNELS_C :
- C_ID : id du channel
- C_TYPE : type de notif pour le channel


## Table LOL_CHAMPIONS_LC :
- LC_ID : clé primaire : identifiant unique du champion
- LC_NAME : nom du champion
- LC_TITLE : titre du champion
- LC_LORE : histoire ou description du champion

## Table LOL_SKINS_LS :
- LS_ID : clé primaire : identifiant unique du skin
- LC_ID : clé étrangère : référence à l'identifiant du champion dans le table LOL_CHAMPIONS_LC
- LS_NAME : nom du skin
- LS_DESCRIPTION : description du skin
- LS_RARITY : rareté du skin
- LS_PRICE : prix en RP du skin 
- LS_RELEASE_DATE : date de sortie du skin

## Table LOL_USERS_LU :
- LU_ID : clé primaire : identifiant unique de l'utilisateur
- LU_DISCORD_ID : identifiant discord de l'utilisateur
- LU_USERNAME : son nom d'utilisateur (par défaut celui sur discord)

## Table LOL_USER_SKINS_LUS :
- LUS_ID : clé primaire : identifiant unique de l'entrée
- LU_ID : clé étrangère : référence à l'identifiant de l'utilisateur dans la table LOL_USERS_LU
- LS_ID : clé étrangère : référence à l'identifiant du skin dans la table LOL_SKINS_LS
- LUS_ACQUISITION_DATE : date à laquelle l'utilisateur a acquis le skin

## Table PRONOS_P :
## Table JOUEURS_PRONOS_JP :
## Table CALENDRIER_C :

## Table YOUTUBE_Y :
- Y_ID : clé primaire : identifiant unique de l'entrée
- Y_VIDEO_ID : identifiant unique de la vidéo sur YouTube
- Y_TITLE : titre de la vidéo
- Y_DESCRIPTION : description de la vidéo
- Y_PUBLISHED_AT : date et heure de sortie de la vidéo
- Y_THUMBNAIL_URL : URL de l'image miniature de la vidéo
- Y_CHANNEL_ID : identifiant de la chaine Youtube
- Y_CHANNEL_TITLE : titre de la chaine Youtube
- Y_VIDEO_DURATION : durée de la vidéo 