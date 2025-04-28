const { youtubeApiKey } = require("../../Config/config.json");
const mariadb = require("./mariadb");
const { google } = require("googleapis");

const youtube = google.youtube({
    version: "v3",
    auth: youtubeApiKey
});

async function checkForNewVideos(){
    const conn = await mariadb.connectToDatabase();
    await console.log(conn);
}

async function getLastVideoInDb(){

}

async function getLastVideo(){
    try{
        const response = await youtube.channels.list({
            part: 'contentDetails',
            id: ''
        });

        const uploadsPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;

        const videosResponse = await youtube.plyalistItems.list({
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




module.exports = { checkForNewVideos };