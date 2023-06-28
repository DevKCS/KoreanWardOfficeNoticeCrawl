import {load} from 'cheerio';
import { default as axios } from 'axios';

async function getSeoulAnno(keyword, count) {
    const url = 'https://www.seoul.go.kr/realmnews/in/list.do';
    
    axios.post(url, "fetchStart=1&siteId=&detailChktxt=&sDate=&eDate=&searchWord="+encodeURI(keyword))
        .then(function (response) {
            const $ = load(response.data)
            const selectors = Array.from($('#content > div.cate-wrap > div > div.news-lst > div'));
            for (let i = 0; i < selectors.length; i++) {
                console.log($(selectors[i]).find("a").attr('href'))
            }
        })

}

await getSeoulAnno('벤처')