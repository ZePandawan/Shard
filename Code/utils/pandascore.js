const {pandascoreApiKey} = require("../../Config/config.json") 

function connectToApi(){
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    let result;
    fetch(`https://api.pandascore.co/lol/tournaments/running?filter[region][0]=EEU&token=${pandascoreApiKey}`, options)
    .then(res => res.json())
    .then(res => console.log(res))
    .then(res => result = res)
    .catch(err => console.error(err));

    //console.log(result);
}


module.exports = {
    connectToApi
};