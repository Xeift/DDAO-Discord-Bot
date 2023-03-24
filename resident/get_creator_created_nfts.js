const cron = require('node-cron');
const fs = require('fs/promises');
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.API_KEY;

module.exports = async function() {
    
    cron.schedule('*/10 * * * *', async() => {
        
        let creatorCreatedNfts = {};
        let creators;
        
        await fs.readFile('./data/nft_to_role.json')
            .then(data => {
                creators = JSON.parse(data);
            })
            .catch(err => {
                throw err;
            });

        for (const creatorId in creators) {
        
            let singleCreatorCreatedNfts = [];
            
            const headers = {
                'Contents-Type': 'application/json'
            }
            
            for (let page = 1; page < 9999; page++) {
                let result;
                
                await fetch(`https://www.oursong.com/api/open-api/user/${creatorId}/created-vibe-list?api_key=${API_KEY}&page=${page}&per_page=100`, {
                    headers: headers
                })
                    .then(res => res.json())
                    .then(json => result = json)
                    .catch(error => console.error(error));
            
                try {
                    for (let i = 0; i < 100; i++) {
                        singleCreatorCreatedNfts.push(result['list'][i]['id'])
                    } 
                } catch (error) {
                    break;
                }
            }

            console.log(Object.keys(singleCreatorCreatedNfts).length);
            creatorCreatedNfts[creatorId] = singleCreatorCreatedNfts;
        }
        await fs.writeFile('./data/creators_nfts.json', JSON.stringify(creatorCreatedNfts), 'utf8')
        console.log('Running every 10 minutes');
    });
}