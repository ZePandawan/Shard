const { youtubeApiKey } = require("../../Config/config.json");
const mariadb = require("./mariadb");
const { google } = require("googleapis");
const { EmbedBuilder } = require('discord.js');

const youtube = google.youtube({
    version: "v3",
    auth: youtubeApiKey
});

async function checkForNewVideos(client){
    const latestVideoYoutube = await getLastVideo();

    const latestVideoDB = await getVideoInDb(latestVideoYoutube.resourceId.videoId);

    if(latestVideoDB.length === 0){
        const result = await writeNewRowInDb(latestVideoYoutube);
        if(result){
            const conn = await mariadb.connectToDatabase();
            const channelId = await mariadb.getChannelNotif(conn,'youtube');
            
            const channelInfo = await getChannelInfo(latestVideoYoutube.channelId);
            const channelIconUrl = channelInfo.snippet.thumbnails.default.url;

            const youtubeEmbed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setAuthor({ name: `${latestVideoYoutube.channelTitle}`, iconURL: `${channelIconUrl}`, url: `https://youtube.com/@NexxusEsports` })
                            .setTitle(`${latestVideoYoutube.title}`)
                            .setURL(`https://www.youtube.com/watch?v=${latestVideoYoutube.resourceId.videoId}`)
                            .setImage(`${latestVideoYoutube.thumbnails.standard.url}`)
                            .setTimestamp()
                            .setFooter({text: 'Shard', url: 'https://github.com/ZePandawan/Shard'});
            const channel = client.channels.cache.get(channelId);
            await channel.send({embeds: [youtubeEmbed]});



            await mariadb.disconnectFromDatabase(conn);
        }
    }
}

async function getVideoInDb(videoId){
    const conn = await mariadb.connectToDatabase();
    const latestVideoDB = await mariadb.selectRows(conn, "YOUTUBE_Y", ["*"], `Y_VIDEO_ID = '${videoId}'`);
    mariadb.disconnectFromDatabase(conn);
    return latestVideoDB;
}

async function getLastVideo(){
    try{
        const response = await youtube.channels.list({
            part: 'contentDetails',
            id: 'UClfszKtJqWVAm1L3PytjBeA'
        });

        const uploadsPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;

        const videosResponse = await youtube.playlistItems.list({
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults: 1
        });

        const latestVideo = videosResponse.data.items[0].snippet;
        return latestVideo;
    } catch (error){
        console.error('Erreur lors de la vérification des nouvelles vidéos :', error);
    }
        
}

async function writeNewRowInDb(latestVideoYoutube){
    try {
        const conn = await mariadb.connectToDatabase();
        const publishedAt = new Date(latestVideoYoutube.publishedAt).toISOString().slice(0, 19).replace('T', ' ');

        const newRowData = {
            Y_VIDEO_ID: latestVideoYoutube.resourceId.videoId,
            Y_TITLE: latestVideoYoutube.title,
            Y_DESCRIPTION: latestVideoYoutube.description,
            Y_PUBLISHED_AT: publishedAt,
            Y_THUMBNAIL_URL: latestVideoYoutube.thumbnails.standard.url,
            Y_CHANNEL_ID: latestVideoYoutube.channelId,
            Y_CHANNEL_TITLE: latestVideoYoutube.channelTitle
        };

        const resultWrite = await mariadb.createRow(conn, "YOUTUBE_Y", newRowData);
        await mariadb.disconnectFromDatabase(conn);
        console.log('ok');
        return true;
    } catch (error) {
        console.error("[DB ERROR] Erreur lors de l'écriture d'une nouvelle ligne", error);
        return false;
    }
}

async function getChannelInfo(channelId) {
    try {
        const response = await youtube.channels.list({
            part: 'snippet',
            id: channelId
        });
        return response.data.items[0];
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de la chaîne :', error);
        throw error;
    }
}




module.exports = { checkForNewVideos };