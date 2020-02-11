// 使用 Nightmare 執行爬蟲
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true, width: 1280, height: 800 });
const moment = require('moment');
const util = require('util');
const fs = require('fs');

// 將 MySQL 連線物件的 query 與 end 方法非同步化
const pool = require('../../modules/db_104');
pool.query = util.promisify(pool.query);
pool.end = util.promisify(pool.end);

// 將 fs 相關功能非同步化 (可以使用 await)
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// 引入 jQuery 機制
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const $ = require('jquery')(window);

// 關鍵字
let strKeyword = 'gopro';

// 放置爬蟲資訊的全域變數 (陣列)
var arrLink = [];

// 給定網頁原址
let pageUrl = 'https://tw.buy.yahoo.com/search/product';

// 跳頁時，給定 page 資訊，方便知道現在頁面
let nowPage = '';

// 瀏覽器標頭，讓對方得知我們是人類，而非機器人 (爬蟲)
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
};

//進行檢索
async function searchKeyword() {
    console.log('Ready to search...');

    // 到指定網頁後輸入關鍵字，再按下搜尋
    await nightmare
        .goto('https://tw.buy.yahoo.com/', headers)
        .type('div.UhSearchBox__mod___1lNSz.UhSearchBox__sas___3MwYx > input[type=search]', strKeyword) //輸入關鍵字
        .wait(2000) //等待數秒…
        .click('div.UhSearchBox__mod___1lNSz.UhSearchBox__sas___3MwYx > a') //按下「搜尋」
        .wait(2000) //等待數秒...
        .catch(error => {
            console.error('Search failed: ', error)
        });
}

// 跳下一頁使用
async function gotoNextPage(page) {
    await nightmare
        .goto(pageUrl + page, headers) //原網址 + page 資訊, 並置入 headers
        .wait(2000) //等待數秒
        .catch(error => {
            //如果有錯誤就顯示
            console.error('Search failed: ', error)
        });
}

//滾動頁面，將動態資料逐一顯示出來
async function scrollPage() {
    console.log('Ready to scroll...');

    let currentHeight = 0; //目前的高度
    let offset = 0; //總偏移量

    //不斷地 scroll down，直到沒有辦法再往下捲動
    while (offset <= currentHeight) {
        currentHeight = await nightmare.evaluate(() => {
            return document.documentElement.scrollHeight;
        });
        offset += 500;
        await nightmare.scrollTo(offset, 0).wait(200);
    }
}

//分析、整理、收集重要資訊
async function parseHtml() {
    console.log('Ready to parse metadata/elements ...');

    // 取得滾動後，得到動態產生結果的 html 元素，這裡很重要，因為裡面有需要的元素，例如歌名、播放長度等資訊
    let html = await nightmare.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    // 將爬蟲資訊放到陣列中；
    $(html)
        .find('.BaseGridItem__grid___2wuJ7')
        .each((index, element) => {
            let obj = {}; // 暫時儲放爬蟲資訊的物件

            // 將網頁元素的資訊帶入變數
            let name = $(element).find('.BaseGridItem__title___2HWui').text();
            let price = $(element).find('.BaseGridItem__price___31jkj').text();
            let herf = $(element).find('.BaseGridItem__content___3LORP').attr('href');

            // 將變數值帶入物件屬性當中
            obj.name = name;
            obj.price = price;
            obj.herf = herf;

            // 收集、整理各個擷取到的元素資訊，到整理資料用的陣列變數中
            arrLink.push(obj);
        });

    // 找是否有下一頁的網址
    let nextPage = $(html).find('.Pagination__icoArrowRight___2KprV').attr('href');
    // 判斷是否有下一頁
    if (nextPage && nextPage.indexOf('pg=1') == -1 && nextPage != nowPage) {
        // 將 nowPage 改成 nextPage 
        nowPage = nextPage;
        // 跳到下一頁
        await gotoNextPage(nextPage);
        // 滾動頁面到底
        await scrollPage();
        // 執行爬蟲，取得想要的資訊
        await parseHtml();
        // 寫入 json 檔案之中儲存
        await writeJson();
    }
}

// 取得全部商品網址後，再從 json 檔中讀取每一頁網址，並且一個一個進入取得商品頁的其他詳細資訊
async function getData() {
    console.log('strat to read file...');
    //讀取 json 檔
    let data = JSON.parse(await readFile('output/' + strKeyword + '.json'));

    //針對每一筆資料執行迴圈
    for (let i = 0; i < data.length; i++) {

        // 針對每一筆商品的頁面取得關鍵資訊後，存到 data2 中
        const data2 = await parseDetail(data[i].herf);

        //分別把多張商品圖片網址、商品分類資訊、商品規格寫入到 data 
        data[i]['pics'] = data2.pics;
        data[i]['categoryString'] = data2.categoryString;
        data[i]['productSpec'] = data2.productSpec;

        //每讀取 1/100 存檔一次，避免檔案太大做白工
        if (i % parseInt(data.length / 100) === 0) {
            await writeJson();
        }
    }

    //最後再存一次，確保資料完整性
    await writeJson();
}

// 爬取商品資訊頁的詳細資料
async function parseDetail(url) {
    let allData = {};
    let picsArray = [];
    console.log('Ready to parse metadata/elements ...');

    //前往商品頁
    await nightmare
        .goto(url, headers)
        .wait(1000);

    // 得到動態產生結果的 html 元素
    let html = await nightmare.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    // 先確定所有商品圖片數量有多少
    let totalPics = $(html).find('div.ImageHover__thumbnailList___2NTr5 > span').length;
    console.log('totalPics=' + totalPics);

    // 用迴圈取得所有圖片網址
    for (let i = 1; i <= totalPics; i++) {
        // mouseover 後，取得新的 html2，才能得到正確的圖片網址
        await nightmare.mouseover('div.ImageHover__thumbnailList___2NTr5 > span:nth-child(' + i + ')').wait(1000);

        // 將現在頁面 html 賦值給一個新的 html2
        let html2 = await nightmare.evaluate(() => {
            return document.documentElement.innerHTML;
        });

        // 如果 html2 裡面有 classname = .LensImage__img___1dSJa 的話，則取得 img 的 src 值
        if ($(html2).find('.LensImage__img___1dSJa').attr('src') != undefined) {
            picsArray.push($(html2).find('.LensImage__img___1dSJa').attr('src'));
        }
    }

    // 將圖片網址存在 allData 裡
    allData['pics'] = picsArray;

    // [開始取得商品分類文字] //
    // 儲存分類文字用的字串
    let categoryString = '';
    // 取得網頁內的分類
    let allCategoryThing = $(html).find('li.CategoryBreadCrumb__breadCrumbListItem___36uwc > a');

    // 針對每一個分類文字做整合，使用 '>' 隔開，最後加到 categoryString。
    allCategoryThing.each(function (index, element) {
        categoryString += $(this).text();
        if (index !== allCategoryThing.length - 1) {
            categoryString += '>';
        }
    })
    //得到最終分類字串 categoryString，存到 allData 裡
    allData['categoryString'] = categoryString;

    // [開始取得商品規格文字] //

    //必須先捲動頁面到底部
    await scrollPage();

    // 重新取得目前的 html 
    html = await nightmare.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    // 準備一個 productSpec，負責接收商品規格資訊
    let productSpec = {};

    // 取得網頁裡的商品資訊表格內容
    let allProductSpec = $(html).find('#detail > div > div:nth-child(3) > div > table > tbody > tr');

    //針對表格內每一個 tr 內執行，將 th 的內容設定為 key，td 的內容設為 value 儲存在 productSpec
    allProductSpec.each(function (index, element) {
        productSpec[$(this).find('th').text()] = $(this).find('td').text();
    });

    //取得最終商品規格 productSpec 存到 allData 裡
    allData['productSpec'] = productSpec;

    //回傳 allData
    return allData;
}

//寫入 json 資料
async function writeJson() {
    //建立資料夾
    if (!fs.existsSync('output')) {
        await mkdir('output', { recursive: true });
    }

    //將物件轉成 json 格存，儲存檔案，檔名設定為 '關鍵字.json'
    await writeFile('output/' + strKeyword + '.json', JSON.stringify(arrLink, null, 2));
}

//關閉
async function close() {
    //因為我們已經將相關資訊儲存到資料庫，所以可以在這裡先關閉瀏覽器
    await nightmare.end((err) => {
        if (err) throw err;
        console.log('Nightmare is close.');
    });
}

//照順序執行各個函式
async function asyncArray(functionsList) {
    for (let func of functionsList) {
        await func();
    }
}

//主程式區域
try {
    asyncArray([searchKeyword, scrollPage, parseHtml, getData, close]).then(async () => {
        console.log('Done');
    });
} catch (err) {
    console.log('try-catch: ');
    console.dir(err, { depth: null });
}
