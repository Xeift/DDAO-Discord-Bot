const fetch = require('node-fetch');
const qs = require('qs');
const express = require('express');
const app = express();
const fs = require('fs/promises');
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.API_KEY;
const REDIRECT_URI = process.env['REDIRECT_URI'];
const API_SECRET = process.env['API_SECRET'];

let creatorCreatedNfts;
let nftToRole;


module.exports = async function(client) {

    app.get('/', async (req, res) => {
        await fs.readFile('./data/creators_nfts.json')
            .then(data => {
                creatorCreatedNfts = JSON.parse(data);
            })
            .catch(err => {
                throw err;
            })
        
        await fs.readFile('./data/nft_to_role.json')
            .then(data => {
                nftToRole = JSON.parse(data);
            })
            .catch(err => {
                throw err;
            })
        
        const code = req.query.code;
        const state = req.query.state;
        let accessToken;

        if (code !== undefined) {
            accessToken = await getAccessToken(code);
            userId = await getUserId(accessToken);
            let userCollectedNfts = await getUserCollectedNfts(userId, accessToken);
            console.log(userCollectedNfts);
            console.log(creatorCreatedNfts);
            let isHolder = await checkHolder(userCollectedNfts, creatorCreatedNfts);
            console.log(isHolder);
            isAssigned = await assignRole(client, state, isHolder);
            console.log(isAssigned);

            if (isAssigned) {
                res.redirect('/is_holder');
            }
            else {
                res.redirect('/not_holder');
            }
        }
    });
    
    app.get('/is_holder', (requ, resp) => {
        resp.send('驗證成功，身分組已指派，請至 Discord 點擊頭像查看。<br>若有任何疑問可於 Discord 直接標記 @Xeift#1230');
    });
    
    app.get('/not_holder', (requ, resp) => {
        resp.send('驗證成功，但您並未持有寶博士 NFT，可於此處購買 https://www.oursong.com/@dAb。<br>若有任何疑問可於 Discord 直接標記 @Xeift#1230');
    });

    
    async function getAccessToken(code) {
        let result;

        const headers = {
            'Content-Type': 'application/json'
        }  
        
        const body = {
            'grant_type': 'authorization_code',
            'client_id': API_KEY,
            'client_secret': API_SECRET,
            'redirect_uri': REDIRECT_URI,
            'code': code
        };
          
        await fetch('https://www.oursong.com/oauth/token', 
        {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(json => result = json)
            .catch(error => console.error(error));
        
        return result['access_token'];
    }


    async function getUserId(accessToken) {
        let result;
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }

        await fetch(`https://www.oursong.com/api/open-api/auth-user?api_key=${API_KEY}`, {
            headers: headers
        })
            .then(res => res.json())
            .then(json => result = json)
            .catch(error => console.error(error));
        return result['user']['id'];
    }


    async function getUserCollectedNfts(userId, accessToken) {
        let userCollectedNfts = [];

        const headers = {
            'Contents-Type': 'application/json',
            'Authorization': 'Bearer '+ accessToken
        }

        for (let page = 1; page < 9999; page++) {
            let result;
            
            await fetch(`https://www.oursong.com/api/open-api/user/${userId}/collected-vibe-list?api_key=${API_KEY}&page=${page}&per_page=100`, {
                headers: headers
            })
                .then(res => res.json())
                .then(json => result = json)
                .catch(error => console.error(error));

            try {
                for (let i = 0; i < 100; i++) {
                    userCollectedNfts.push(result['list'][i]['id'])
                } 
            } catch (error) {
                break;
            }
        }
        return userCollectedNfts;
    }

    
    async function checkHolder(userCollectedNfts, creatorCreatedNfts) {
        let isHolder = [];
        for (const creatorId in creatorCreatedNfts) {
            for (const creatorNft in creatorCreatedNfts[creatorId]) {
                for (const userNft in userCollectedNfts) {
                    if (userCollectedNfts[userNft] === creatorCreatedNfts[creatorId][creatorNft]) {
                        isHolder.push(creatorId);
                    }
                }                    
            }
        }
        return isHolder;        
    }

    async function assignRole(client, state, isHolder) {
        console.log('assign role')

        if (isHolder.join() === [].join()) {// redir failed.html
            console.log('not holder');
            return false;
        }
        else {// assign role, redir success.html
            isHolder.forEach(async element => {
                const guild = await client.guilds.fetch('936236815545954384');
                const member = await guild.members.fetch(state);
                await member.roles.add(nftToRole[element]).catch(console.error);
                console.log('is holder');
            })
            return true;
        }        
    }

    app.listen(4444, () => {
        console.log(`Example app listening at http://localhost:4444`)
    })
}