## 授權
[姓名標示─非商業性 4.0 國際](https://creativecommons.org/licenses/by-nc/4.0/legalcode.zh-Hant?fbclid=IwAR2R5c7M58_3f4-HFnVCh2G_xMlsjqA_jPjt-520waLurasLLax_mRAZCTQ)

## 已改善項目
1. 以 JavaScript 重寫整隻 Bot：
   Discord.py 轉 Discord.js。
2. 支援多 OurSong 創作者：
   支援不同創作者，可指派對應身分組。
3. NFT 驗證時間降低：
   改善驗證 OurSong NFT 及指派身分組效率，由原本 60 秒降低為 1 秒，指派身分組時間改為驗證完立即指派。
4. 模組化：
   將各檔案及資料分類整理，降低維護難度。
5. 指令 panel 化，簡化使用者操作改善指令：
   不須再輸入指令，直接點擊按鈕即可使用原本各指令。
6. 引入 Torus 錢包：
   未填入錢包地址將自動套用 Torus 錢包做為預設地址。


## 待完成項目
1. 後台的前端網頁撰寫


## 已完成指令
`/verify_oursong`

`/user_config`

`/edit_user_config`

`/verify_school`


## 未完成指令
`/export_all_user`

`/export_excel`


## 資料夾
`index.js`
主程式

`btn`
面板按鈕相關程式

`commands`
機器人指令

`data`
存放資料

`others`
其他除錯用程式

`resident`
一些常駐程式


## 檔案
`btn/oursong.js`
處理 OurSong 驗證：
成員輸入正確地驗證碼按下`OurSong驗證`按鈕時，機器人會傳送 OurSong 的 OAuth2 網址。

`btn/form.js`
`btn/form_callback.js`
處理填寫資料：
成員按下`填寫資料`按鈕時，機器人會開啟內建的表單讓成員填寫資料。

`btn/school.js`
`btn/school_callback.js`
發送驗證信至學校信箱：
成員輸入正確地驗證碼按下`驗證學校`按鈕時，機器人會請求成員填入學校信箱，並傳送一封帶有驗證碼的 email 至該信箱。


`btn/code.js`
`btn/code_callback.js`
接收成員輸入的驗證碼：
成員輸入正確的驗證碼後，機器人會指派對應的學校身分組。


`commands/publish_panel.js`
部署帶有四個按鈕的面板。[權限鎖定: Xeift、dAb]


`data/creators_nfts.json`
此檔案由 `get_creator_created_nfts.js` 每 10 分鐘更新一次，讀取`nft_to_role.json`中的所有 NFT Creator 並取得 Creator 建立的 NFTs。


`data/nft_to_role.json`
紀錄 NFT 對應的身分組。


`data/school_data.json`
紀錄學校信箱對應的身分組。


`data/user_data.json`
紀錄使用者手動輸入的資料。


`data/verify_code.json`
暫存使用者收到的驗證碼。


`others/deploy_cmds.js`
更新 Discord Bot 指令 (開發測試用)。


`resident/get_creator_created_nfts.js`
每 10 分鐘自動取得資料並存入 creators_nfts.json。


`resident/site.js`
以 express 撰寫後端，接收 OurSong 的驗證結果。