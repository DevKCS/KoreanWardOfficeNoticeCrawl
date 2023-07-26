import { load } from 'cheerio';
import { default as axios } from 'axios';
import iconv from 'iconv-lite'
import urlencode from 'urlencode';
import * as https from "https";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
})

const searchPageNumber = 5;

/**
 * @description 서울특별시 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getSeoulAnno(keyword, count) {
    try {
        const url = 'https://www.seoul.go.kr/realmnews/in/list.do';
        let res = []

        const pages = [
            axios.post(url, `fetchStart=1&siteId=&detailChktxt=&sDate=&eDate=&searchWord=${keyword}`),
            axios.post(url, `fetchStart=2&siteId=&detailChktxt=&sDate=&eDate=&searchWord=${keyword}`),
            axios.post(url, `fetchStart=3&siteId=&detailChktxt=&sDate=&eDate=&searchWord=${keyword}`),
            axios.post(url, `fetchStart=4&siteId=&detailChktxt=&sDate=&eDate=&searchWord=${keyword}`),
            axios.post(url, `fetchStart=5&siteId=&detailChktxt=&sDate=&eDate=&searchWord=${keyword}`)
        ];

        await Promise.all(pages).then(resp => {
            resp.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#content > div.cate-wrap > div > div.news-lst > div'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("a").attr('href') == undefined) continue;
                    res.push({ "link": $(selectors[i]).find("a").attr('href'), "title": $(selectors[i]).find("a > span > em.subject").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim() })
                }
            })
        })

        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * @description 서울특별시 강남구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGangnamAnno(keyword, count) {
    try {
        const url = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            url.push(
                axios.get(`https://www.gangnam.go.kr/board/B_000001/list.do?mid=ID05_040101&pgno=${i}&deptField=BDM_DEPT_ID&deptId=&keyfield=bdm_main_title&keyword=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(url).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#contents-wrap > div.row > div > div > div > div:nth-child(1) > div > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.align-l.tit > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.gangnam.go.kr" + $(selectors[i]).find("td.align-l.tit > a").attr('href'), "title": $(selectors[i]).find("td.align-l.tit").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 강동구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGangdongAnno(keyword, count) {
    try {
        const url = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            url.push(
                axios.get(`https://www.gangdong.go.kr/web/newportal/notice/01?sc=&cp=${i}&sv=` + encodeURI(keyword))
            )
        }
        let res = []
        await Promise.all(url).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#content-area > article > div.table01.table-warp > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.tx-lt > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.gangdong.go.kr" + $(selectors[i]).find("td.tx-lt > a").attr('href'), "title": $(selectors[i]).find("td.tx-lt > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 강북구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGangbukAnno(keyword) {
    const url = [];
    for (let i = 1; i <= searchPageNumber; i++) {

    }
    let res = []
    await axios.get(url)
        .then(async function (response) {
            await axios.get('https://www.gangbuk.go.kr/www/boardList.do?post=0&boardSeq=41&key=285&category=&searchType=ALL&searchKeyword=' + encodeURI(keyword) + '&searchFile=&subContents=&mpart=&part=&item=', {
                headers: {
                    "Cookie": "sabFingerPrint=912,937,www.gangbuk.go.kr; sabSignature=" + response.data.slice(response.data.lastIndexOf(`cookie = '`) + 10, response.data.lastIndexOf(`cookie = '`) + 10 + ('sabSignature=e6RAkDF0p2c8BaU+0OhWrg=='.length))
                }
            })
                .then(function (response) {
                    const $ = load(response.data)
                    const selectors = Array.from($('#contents > div.tableA > table > tbody > tr'));
                    for (let i = 0; i < selectors.length; i++) {
                        if ($(selectors[i]).find("td.subject > a").attr('href') == undefined) continue;
                        res.push({ "link": "https://www.gangbuk.go.kr/www" + $(selectors[i]).find("td.subject > a").attr('href').substring(1), "title": $(selectors[i]).find("td.subject > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim() })
                    }
                })
        }).catch((e) => {

        })
    return res
}

/**
 * @description 서울특별시 강서구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGangseoAnno(keyword, count) {
    try {
        let url = 'https://www.gangseo.seoul.kr/gs040101'
        const list = [];
        let res = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(axios.post(url, `curPage=${i}&srchKey=sj&fieldTy=&srchStdg=&srchText=${encodeURI(keyword)}`))
        }
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#container > div.content-body > div > div.board-list-wrap > div.table-responsive > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.text-align.is-left > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.gangseo.seoul.kr" + $(selectors[i]).find("td.text-align.is-left > a").attr('href'), "title": $(selectors[i]).find("td.text-align.is-left > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 관악구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGwanakAnno(keyword, count) {
    try {
        const list = []
        let url = 'https://www.gwanak.go.kr/site/gwanak/ex/bbs/List.do?cbIdx=239'
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(axios.post(url, `pageIndex=${i}&mode=&cateTypeCd=&tgtTypeCd=SUB_CONT&searchKey=${encodeURI(keyword)}`))
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#boardDivId > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.title > a").attr('onclick') == undefined) continue;
                    let link = 'https://www.gwanak.go.kr/site/gwanak/ex/bbs/View.do?cbIdx=239'
                    let urlData = $(selectors[i]).find("td.title > a").attr('onclick').split(`,'`)
                    res.push({ "link": link + "&bcIdx=" + urlData[1].slice(0, urlData[1].length - 1), "title": $(selectors[i]).find("td.title > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * @description 서울특별시 광진구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGwangjinAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gwangjin.go.kr/portal/bbs/B0000001/list.do?pageIndex=${i}&menuNo=200190&deptId=&searchCnd=1&sdate=&edate=&searchWrd=${encodeURI(keyword)}`)
            )
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#content > div.bdList > ul > li'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("div > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.gwangjin.go.kr" + $(selectors[i]).find("div > a").attr('href'), "title": $(selectors[i]).find("div > a > span").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * @description 서울특별시 구로구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGuroAnno(keyword, count) {
    try {
        const list = []
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.guro.go.kr/www/selectBbsNttList.do?key=1790&pageIndex=${i}&bbsNo=662&integrDeptCode=&searchCtgry=&searchCnd=SJ&searchBbsStartDate=&searchBbsEndDate=&searchKrwd=${encodeURI(keyword)}`)
            )
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#board > div > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.p-subject > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.guro.go.kr/www" + $(selectors[i]).find("td.p-subject > a").attr('href').substring(1), "title": $(selectors[i]).find("td.p-subject > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * @description 서울특별시 금천구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getGeumcheonAnno(keyword, count) {
    try {
        const url = 'https://www.geumcheon.go.kr/portal/selectBbsNttList.do?key=293&bbsNo=4&integrDeptCode=&searchCtgry=&searchCnd=SJ&searchKrwd=' + encodeURI(keyword);
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.geumcheon.go.kr/portal/selectBbsNttList.do?key=293&id=&bbsNo=4&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&searchDeptCode=&pageIndex=${i}`)
            )
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#contents > div > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.p-subject > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.geumcheon.go.kr/portal" + $(selectors[i]).find("td.p-subject > a").attr('href').substring(1), "title": $(selectors[i]).find("td.p-subject > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 노원구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getNowonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.nowon.kr/www/user/bbs/BD_selectBbsList.do?q_bbsCode=1001&q_bbscttSn=&q_estnColumn1=11&q_rowPerPage=10&q_currPage=${i}&q_sortName=&q_sortOrder=&q_searchKeyTy=sj___1002&q_searchVal=${encodeURI(keyword)}`)
            )
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#printArea > div:nth-child(2) > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.cell-subject > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.nowon.kr/www/user/bbs/" + $(selectors[i]).find("td.cell-subject > a").attr('href') + "&q_estnColumn1=11&q_rowPerPage=10&q_currPage=1&q_sortName=&q_sortOrder=&q_searchKeyTy=sj___1002&q_searchVal=", "title": $(selectors[i]).find("td.cell-subject > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * @description 서울특별시 도봉구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getDobongAnno(keyword, count) {
    try {
        const url = 'https://www.dobong.go.kr/bbs.asp?code=10008769&strSearchType2=&strSearchType=&strSearchKeyword=' + encodeURI(keyword);
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.dobong.go.kr/bbs.asp?intPage=${i}&code=10008769&strSearchKeyword=${encodeURI(keyword)}`)
            )
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#mainCont > div.bbsList > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.al > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.dobong.go.kr" + $(selectors[i]).find("td.al > a").attr('href').substring(1), "title": $(selectors[i]).find("td.al > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim() })
                }
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 동대문구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getDdmAnno(keyword, count) {
    try {
        const url = 'https://www.ddm.go.kr/www/selectBbsNttList.do?key=198&bbsNo=38&searchCtgry=&integrDeptCode=&searchCnd=SJ&searchKrwd=' + encodeURI(keyword);
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ddm.go.kr/www/selectBbsNttList.do?key=198&bbsNo=38&searchCtgry=&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('#bbsNttForm > fieldset > table > tbody > tr'));
                for (let i = 0; i < selectors.length; i++) {
                    if ($(selectors[i]).find("td.p-subject > a").attr('href') == undefined) continue;
                    res.push({ "link": "https://www.ddm.go.kr/www" + $(selectors[i]).find("td.p-subject > a").attr('href').substring(1), "title": $(selectors[i]).find("td.p-subject > a").text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim() })
                }
            })
        });
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 동작구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getDongjakAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.dongjak.go.kr/portal/bbs/B0000022/list.do?menuNo=200641&sdate=&edate=&searchDeptId=&searchCnd=1&searchWrd=${encodeURI(keyword)}&pageIndex=${i}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($('div.bdList > table > tbody > tr > td > a'))
        //         for(let selector of selectors){
        //             res.push({
        //                 link : `https://www.dongjak.go.kr${selector.attribs.href}`,
        //                 title : $(selector).text().trim()
        //             })
        //         }
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    };
    return []
}

/**
 * @description 서울특별시 마포구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getMapoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.mapo.go.kr/site/main/board/notice/list?cp=${i}&sv=${encodeURI(keyword)}&sortOrder=BA_REGDATE&sortDirection=DESC&listType=list&bcId=notice&baNotice=false&baCommSelec=false&baOpenDay=false&baUse=true`)
            )
        }
        let res = []
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data)
                const selectors = Array.from($('div.bbs_list.bbs_list_type4by14 > table > tbody > tr > td.tal_l_i.val_m > a'));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.mapo.go.kr/${selec.attribs.href}`,
                        title: $(selec).text().trim().trim()
                    })
                })
            })
        }).catch((e) => {

        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 서대문구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getSdmAnno(keyword, count) {
    try {
        const url = 'https://www.sdm.go.kr/news/news/notice.do'
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios({
                    url: `https://www.sdm.go.kr/news/news/notice.do?keyword=${urlencode(keyword, 'euc-kr')}&keycol=title&cp=${i}`,
                    method: "GET",
                    responseType: "arraybuffer"
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(iconv.decode(response.data, 'euc-kr'));
                const selectors = Array.from($(`#frm > table > tbody > tr > td.aleft > a`));
                selectors.forEach(selector => {
                    res.push({
                        link: `https://www.sdm.go.kr/news/news/notice.do?sdmBoardSeq=${selector.attribs.href.split("'")[1]}`,
                        title: $(selector).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

async function getSeochoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.seocho.go.kr/site/seocho/ex/bbs/List.do?pageIndex=${i}&cbIdx=57&searchMedia=&bcIdx=0&searchCondition=subCont&searchKeyword=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.board-list > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.seocho.go.kr/${selec.attribs.href}`,
                        title: $(selec).text().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * @description 서울특별시 성동구 공지
 * @param {String} keyword 
 * @param {Number} count
 * @returns {Array}
 */
async function getSdAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.sd.go.kr/main/selectBbsNttList.do?bbsNo=183&&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&key=1472&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-warp.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.sd.go.kr/main${selec.attribs.href.substring(1)}`,
                        title: $(selec).text().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 서울특별시 성북구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSbAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.sb.go.kr/main/cop/bbs/selectSearchTotalList.do?category=BOARD&kwd=${encodeURI(keyword)}&reSrchFlag=false&pageNum=${i}&pageSize=12&detailSearch=false&srchFd=all&xwd=&sort=r&date=0&startDate=&endDate=&empPageNum=1&empPageSize=12&searchRange=&group_c=%EC%86%8C%EC%83%81&preKwd=%EC%86%8C%EC%83%81#`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.sub-page-container__wrap.float_wrap > ul.list-ul2 > li > a`))
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.sb.go.kr${selec.attribs.href}`,
                        title: $(selec).find(`div > p.tit`).text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 서울특별시 송파구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSongpaAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.songpa.go.kr/www/selectBbsNttList.do?bbsNo=92&&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&key=2775&searchAditfield4=&searchAditfield5=&viewBgnde=&searchAditfield1=&searchAditfield2=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-warp.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.songpa.go.kr/www${selec.attribs.href}`,
                        title: $(selec).text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * 서울특별시 양천구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYangcheonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.post(`https://www.yangcheon.go.kr/site/yangcheon/ex/bbs/List.do?cbIdx=254&pageIndex=${i}&searchKey=${encodeURI(keyword)}`,
                    { data: `<script>goSearch()</script>` })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`article.board-row > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    const regex = /\(([^)]+)\)/;
                    let oc = selec.attribs.onclick.split("(")[1].split(")")[0].split(",").map(x => x.replaceAll("'", ""));

                    res.push({
                        link: `https://www.yangcheon.go.kr/site/yangcheon/ex/bbs/View.do?cbIdx=254&bcIdx=${oc[1]}&parentSeq=${oc[3]}`,
                        title: $(selec).text().trim().replace(`document.write(wdigm_title('`, "").replace(`'));`, "")
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * 서울특별시 영등포구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYdpAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ydp.go.kr/www/selectBbsNttList.do?bbsNo=40&&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&key=2848&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-warp.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.ydp.go.kr/www${selec.attribs.href.substring(1)}`,
                        title: $(selec).text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * 서울특별시 용산구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYongsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yongsan.go.kr/portal/bbs/B0000041/list.do?menuNo=200228&sdate=&edate=&deptId=&searchCnd=1&searchWrd=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.bd-list > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yongsan.go.kr${selec.attribs.href}`,
                        title: $(selec).text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * 서울특별시 은평구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getEpAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.ep.go.kr/www/selectBbsNttList.do?key=744&bbsNo=42&searchCtgry=&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `${selec.attribs.href}`,
        //                 title : $(selec).text().replaceAll("\t","").replaceAll("\r","").replaceAll("\n","").trim().trim()
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    }
    return []
}

/**
 * 서울특별시 종로 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJongnoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jongno.go.kr/portal/bbs/selectBoardList.do?bbsId=BBSMSTR_000000000201&menuNo=1753&menuId=1753&searchWrd=${encodeURI(keyword)}&searchCnd=0&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.text_area > table > tbody > tr > td.output.tal.sj > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jongno.go.kr/portal/bbs/selectBoardArticle.do?bbsId=BBSMSTR_000000000201&menuNo=1753&menuId=1753&nttId=${selec.attribs.href.split("'")[1]}`,
                        title: $(selec).text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * 서울특별시 중구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJungguAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.junggu.seoul.kr/content.do?cmsid=14231&sf_dept=&searchValue=${encodeURI(keyword)}&searchField=all&page=${i}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`div.board_list > table > tbody > tr > td.tal > p > a`));
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `https://www.junggu.seoul.kr${selec.attribs.href}`,
        //                 title : $(selec).text().replaceAll("\t","").replaceAll("\r","").replaceAll("\n","").trim().trim()
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    }
    return []
}

/**
 * 서울특별시 중랑구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJungnangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jungnang.go.kr/portal/bbs/list/B0000002.do?searchCnd=1&searchWrd=${encodeURI(keyword)}&gubun=&delCode=0&useAt=&replyAt=&menuNo=200473&sdate=&edate=&deptId=&deptName=&popupYn=&dept=&dong=&option1=&viewType=&searchCnd2=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.table_type02.overflow > table > tbody > tr > td.tit > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jungnang.go.kr${selec.attribs.href}`,
                        title: $(selec).text().replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").trim().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    }
}

/**
 * 경기도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGgAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://gnews.gg.go.kr/briefing/brief_gongbo.do?page=${i}&BS_CODE=s017&period_1=&period_2=&search=1&keyword=${encodeURI(keyword)}&subject_Code=BO01`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.table > table > tbody > tr > td > a.txtLink`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://gnews.gg.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 고양시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGoyangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.goyang.go.kr/www/user/bbs/BD_selectBbsList.do?q_bbsCode=1030&q_currPage=${i}&q_pClCode=&q_clCode=&q_clNm=&q_searchKey=1000&q_searchVal=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`body > div > article > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.goyang.go.kr/www/user/bbs/BD_selectBbs.do?q_bbsCode=1030&q_bbscttSn=${selec.attribs.onclick.split("'")[3]}&q_currPage=1&q_pClCode=`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 고양시 덕양구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDyguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.goyang.go.kr/dygu/user/bbs/BD_selectBbsList.do?q_bbsCode=1030&q_currPage=${i}&q_pClCode=&q_clCode=&q_clNm=&q_searchKey=1000&q_searchVal=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`body > div > article > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.goyang.go.kr/dygu/user/bbs/BD_selectBbs.do?q_bbsCode=1030&q_bbscttSn=${selec.attribs.onclick.split("'")[3]}&q_currPage=1&q_pClCode=`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 고양시 일산동구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getIlseguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.goyang.go.kr/ilsegu/user/bbs/BD_selectBbsList.do?q_bbsCode=1030&q_currPage=${i}&q_pClCode=&q_clCode=&q_clNm=&q_searchKey=1000&q_searchVal=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`body > div > article > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.goyang.go.kr/ilsegu/user/bbs/BD_selectBbs.do?q_bbsCode=1030&q_bbscttSn=${selec.attribs.onclick.split("'")[3]}&q_currPage=1&q_pClCode=`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 고양시 일산서구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getIlswguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.goyang.go.kr/ilswgu/user/bbs/BD_selectBbsList.do?q_bbsCode=1030&q_currPage=${i}&q_pClCode=&q_clCode=&q_clNm=&q_searchKey=1000&q_searchVal=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`body > div > article > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.goyang.go.kr/ilswgu/user/bbs/BD_selectBbs.do?q_bbsCode=1030&q_bbscttSn=${selec.attribs.onclick.split("'")[3]}&q_currPage=1&q_pClCode=`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 과천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGccityAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gccity.go.kr/portal/bbs/list.do?ptIdx=111&mId=0301010000&page=${i}&searchTxt=${encodeURI(keyword)}&searchType=0`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selector = Array.from($(`div.clFix > section > div > form > table > tbody > tr > td.list_tit > a`))
                selector.forEach(selec => {
                    const oc = selec.attribs.onclick.split("'")
                    res.push({
                        link: `https://www.gccity.go.kr/portal/bbs/view.do?mId=0301010000&bIdx=${oc[3]}&ptIdx=${oc[5]}`,
                        title: $(selec).text().trim()
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 광명시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGmAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gm.go.kr/pt/user/bbs/BD_selectBbsList.do?q_bbsCode=2032&q_searchVal=${encodeURI(keyword)}&q_currPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.sub_content_cont_rt_cont > table > tbody > tr > td.td_lf > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gm.go.kr/pt/user/bbs/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 광주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGjcityAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gjcity.go.kr/portal/bbs/list.do?ptIdx=1&mId=0201010000&searchTxt=${encodeURI(keyword)}&page=${i}`, { httpsAgent: httpsAgent })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#list > div > table > tbody > tr > td.list_tit > a`));
                selectors.forEach(selec => {
                    const oc = selec.attribs.onclick.split("'");
                    res.push({
                        link: `https://www.gjcity.go.kr/portal/bbs/view.do?mId=${oc[7]}&bIdx=${oc[3]}&ptIdx=${oc[5]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 구리시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGuriAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.guri.go.kr/www/selectBbsNttList.do?key=380&bbsNo=36&searchCtgry=&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > form > fieldset > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    if ($(selec).text().trim() == "구리시 홈페이지 이용 시 권고 웹브라우저 안내(익스플로러 지원 종료)") return;
                    res.push({
                        link: `https://www.guri.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 군포시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGunpoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gunpo.go.kr/www/selectBbsNttList.do?key=3890&bbsNo=675&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gunpo.go.kr/www${selec.attribs.href.replace('./', '/')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 김포시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGimpoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gimpo.go.kr/portal/selectBbsNttList.do?key=999&bbsNo=292&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&deleteAt=N&pageUnit=10&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`main.colgroup > article > div > div > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gimpo.go.kr/portal/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 남양주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getNyjAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.nyj.go.kr/main/183?page=${i}&search_word=${encodeURI(keyword)}&page_size=10&search_field=TiCoEdFl`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.list > table > tbody > tr > td.txtleft > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.nyj.go.kr/main/183${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 동두천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDdcAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ddc.go.kr/ddc/selectBbsNttList.do?key=104&bbsNo=24&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`article > div > div > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.ddc.go.kr/ddc/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 부천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getBucheonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`http://www.bucheon.go.kr/site/program/board/basicboard/list?boardtypeid=26736&menuid=148002001001&searchenddate=&searchselect=boardtitle&searchstartdate=&searchword=${encodeURI(keyword)}&pagesize=10&currentpage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`form > table > tbody > tr > td.td-lf > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `http://www.bucheon.go.kr/site/program/board/basicboard/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 수정구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSujeongguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.sujeong-gu.go.kr/sub/content.asp?cIdx=53&fboard=board_notice&actionMode=&searchName=${encodeURI(keyword)}&page=${i}&searchOpt1=title`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.con_body > div > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.sujeong-gu.go.kr/sub/content.asp${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 성남시청 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSeongnamAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.seongnam.go.kr/city/1000052/30001/bbsList.do?currentPage=${i}&idx=&searchCategory=&searchSelect=title&searchWord=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.boardWrap > div > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.seongnam.go.kr/city/1000052/30001/bbsView.do?currentPage=2&searchSelect=title&searchWord=%EC%86%8C%EC%83%81&searchOrganDeptCd=&searchCategory=&subTabIdx=&idx=${selec.attribs.href.replace('#', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 중원구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJungwonguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jungwongu.go.kr:10008/sub/content.asp?cIdx=170&fboard=board_notice&fpage=${i}&searchOpt1=title&searchName=${encodeURI(keyword)}&orderby1=b_ref&orderby2=Desc&intPageSize=10`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content > div.con_body > div.fboard_body > table > tbody > tr > td.text-left.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jungwongu.go.kr:10008/sub/content.asp${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 붙당구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getBundangguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.bundang-gu.go.kr:10009/sub/content.asp?cIdx=23&fboard=board_notice&fpage=${i}&searchOpt1=title&searchName=${encodeURI(keyword)}&orderby1=b_ref&orderby2=Desc&intPageSize=10`,
                    {
                        httpsAgent: httpsAgent
                    })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.fboard_body > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.bundang-gu.go.kr:10009/sub/content.asp${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 수원시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSuwonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.suwon.go.kr/web/board/BD_board.list.do?seq=&bbsCd=1042&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=${i}&q_sortName=&q_sortOrder=&q_rowPerPage=10&q_searchKeyType=TITLE___1002&q_searchKey=&q_searchVal=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    const oc = selec.attribs.onclick.split("'")
                    res.push({
                        link: `https://www.suwon.go.kr/web/board/BD_board.view.do?seq=${oc[3]}&bbsCd=${oc[1]}&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=1&q_sortName=&q_sortOrder=&q_rowPerPage=10&q_searchKeyType=TITLE___1002&q_searchKey=&q_searchVal=`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 장안구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJanganAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://jangan.suwon.go.kr/bbsplus/list.asp?code=tbl_bbs_notice&block=1&page=${i}&strSearch_text=${encodeURI(keyword)}&strSearch_div=title#scroll_stop`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.board > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).find(`td.num`).text() == "공지") return;
                    res.push({
                        link: `https://jangan.suwon.go.kr/bbsplus/${$(selec).find(`td.subject > a`).attr('href')}`,
                        title: $(selec).find(`td.subject > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 권선구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getKsunAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://ksun.suwon.go.kr/bbsplus/lst.asp?code=tbl_bbs_hot&block=1&page=${i}&strSearch_text=${encodeURI(keyword)}&strSearch_div=title&bd_gubn=1&mnuflag=&skin_div=`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.board > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://ksun.suwon.go.kr/bbsplus/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 팔달구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getPaldalAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://paldal.suwon.go.kr/bbsplus/list.asp?strSearch_div=title&strSearch_text=${encodeURI(keyword)}&code=tbl_bbs_sub0101&bd_gubn=all&tag=search&mnuflag=&menuid=sub0101&dong_gubn=&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.board > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://paldal.suwon.go.kr/bbsplus/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 영통구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYtAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://yt.suwon.go.kr/_bbsplus/list.asp?code=an_e3_bbs&block=1&page=${i}&tag=search&kind=1&bd_chek=1&bd_gubn=1&searchstr=${encodeURI(keyword)}&mnuflag=`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.board > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://yt.suwon.go.kr/_bbsplus/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}

/**
 * 경기도 시흥시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSiheungAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.siheung.go.kr/main/bbs/list.do?ptIdx=46&mId=0401010000&searchType=b_title&searchTxt=${encodeURI(keyword)}&page=${i}`,
                    {
                        httpsAgent: httpsAgent
                    })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#list > table > tbody > tr > td.list_tit > a`));
                selectors.forEach(selec => {
                    const oc = selec.attribs.onclick.split("'");
                    res.push({
                        link: `https://www.siheung.go.kr/main/bbs/view.do?mId=${oc[7]}&bIdx=${oc[3]}&ptIdx=${oc[5]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 안산시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getAnsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ansan.go.kr/www/common/bbs/selectPageListBbs.do?key=260&bbs_code=B0214&bbs_seq=&sch_type=sj&sch_text=${encodeURI(keyword)}&currentPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > form > fieldset > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.ansan.go.kr/www/common/bbs/selectBbsDetail.do?key=260&bbs_code=B0214&bbs_seq=${selec.attribs.onclick.split(" ")[1]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 상록구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSangnokguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ansan.go.kr/sangnokgu/common/bbs/selectPageListBbs.do?key=1561&bbs_code=B0204&bbs_seq=&sch_type=sj&sch_text=${encodeURI(keyword)}&currentPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > form > fieldset > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes('공지')) return;
                    res.push({
                        link: `https://www.ansan.go.kr/sangnokgu/common/bbs/selectBbsDetail.do?key=1561&bbs_code=B0204&bbs_seq=${$(selec).find(`td.p-subject > a`).attr('onclick').split(' ')[1]}`,
                        title: $(selec).find(`td.p-subject > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 단원구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDanwonguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ansan.go.kr/danwongu/common/bbs/selectPageListBbs.do?key=880&bbs_code=B0217&bbs_seq=&sch_type=sj&sch_text=${encodeURI(keyword)}&currentPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > form > fieldset > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes('공지')) return;
                    res.push({
                        link: `https://www.ansan.go.kr/danwongu/common/bbs/selectBbsDetail.do?key=880&bbs_code=B0217&bbs_seq=${$(selec).find(`td.p-subject > a`).attr(`onclick`).split(" ")[1]}`,
                        title: $(selec).find(`td.p-subject > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 안성시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getAnseongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.anseong.go.kr/portal/bbs/list.do?ptIdx=16&mId=0401010000&searchTxt=${encodeURI(keyword)}&page=${i}&searchType=0`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#list > table > tbody > tr > td.list_tit.taL > a`));
                selectors.forEach(selec => {
                    const oc = selec.attribs.onclick.split("'")
                    res.push({
                        link: `https://www.anseong.go.kr/portal/bbs/view.do?mId=${oc[7]}&bIdx=${oc[3]}&ptIdx=${oc[5]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 안양시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getAnyangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.anyang.go.kr/main/selectBbsNttList.do?key=259&bbsNo=62&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.anyang.go.kr/main/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 만안구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getMananAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.anyang.go.kr/manan/selectBbsNttList.do?key=1022&bbsNo=144&integrDeptCode=&searchCtgry=&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.anyang.go.kr/manan/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 동안구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDonganAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.anyang.go.kr/dongan/selectBbsNttList.do?key=1234&bbsNo=213&integrDeptCode=&searchCtgry=&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.p-wrap.bbs.bbs__list > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.anyang.go.kr/dongan/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 양주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYangjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yangju.go.kr/www/selectBbsNttList.do?key=202&bbsNo=13&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`main.colgroup > article > div > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yangju.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 여주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYeojuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yeoju.go.kr/brd/board/277/L/menu/599?brdType=L&searchField=title&searchText=${encodeURI(keyword)}&thisPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.board_wrap_bbs.boardTop_txt > table > tbody > tr > td.txtL > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yeoju.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 오산시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getOsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.osan.go.kr/portal/bbs/list.do?ptIdx=111&mId=0301010000&searchTxt=${encodeURI(keyword)}&searchType=0&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div > form > table > tbody > tr > td.list_tit > a`));
                selectors.forEach(selec => {
                    const oc = selec.attribs.onclick.split("'")
                    res.push({
                        link: `https://www.osan.go.kr/portal/bbs/view.do?mId=${oc[7]}&bIdx=${oc[3]}&ptIdx=${oc[5]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 용인시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYonginAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yongin.go.kr/user/bbs/BD_selectBbsList.do?q_menu=&q_bbsType=&q_clCode=1&q_lwprtClCode=&q_searchKeyTy=sj___1002&q_searchVal=${encodeURI(keyword)}&q_category=&q_bbsCode=1001&q_bbscttSn=&q_currPage=${i}&q_sortName=&q_sortOrder=&`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.t_list > table > tbody > tr > td.td_al > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yongin.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 처인구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getCheoinguAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.cheoingu.go.kr/home/boardList.do?returl=/home/boardList.do&menu_no=969&brd_mgrno=256&brd_no=&keykind=ttl&keyword=${encodeURI(keyword)}&page_now=${i}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`div.scroll > table > tbody > tr > td.subject > p > a`));
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `https://www.cheoingu.go.kr/home/boardView.do?keykind=ttl&keyword=&page_now=&returl=%2Fhome%2FboardList.do&listurl=%2Fhome%2FboardList.do&brd_no=${selec.attribs.href.split("'")[1]}&brd_mgrno=256&menu_no=969&seq_no=undefined`,
        //                 title : $(selec).text().trim(),
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    };
    return []
}
/**
 * 경기도 기흥구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGiheungguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.giheunggu.go.kr/_lmth/03_board/board_0101.asp?block=1&page=${i}&SearchColumn=title&SearchWord=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.board > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.giheunggu.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 수지구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSujiguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios({
                    url: `https://www.sujigu.go.kr/lmth/03com01.asp?page=${i}&block=1&strSearch_div=title&strSearch_text=${urlencode(keyword, 'euc-kr')}`,
                    method: "GET",
                    responseType: "arraybuffer"
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(iconv.decode(response.data, 'euc-kr'));
                const selectors = Array.from($(`div.board > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.sujigu.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 의왕시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUiwangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.uiwang.go.kr/UWKORINFO0101?curPage=${i}&srchText=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.bbs-list > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.uiwang.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 의정부시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUi4uAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 이천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getIcheonAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.icheon.go.kr/portal/selectBbsNttList.do?key=1601&id=&bbsNo=14&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&searchDeptCode=&pageIndex=${i}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`div.p-wrap.bbs.bbs__list.bbs_normal.ic_board > table > tbody > tr > td.p-subject > a`));
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `${selec.attribs.href}`,
        //                 title : $(selec).text().trim(),
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    };
    return []
}
/**
 * 경기도 파주시 공고
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getPajuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.paju.go.kr/user/board/BD_board.list.do?q_currPage=${i}&bbsCd=2001&q_searchVal=${encodeURI(keyword)}&q_sortName=&q_sortOrder=&pageType=&delDesc=&q_parentCtgCd=&q_rowPerPage=8&seq=&q_ctgCd=&showSummaryYn=N&q_searchKeyType=&`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`ul.summary-list > li > div.summary-body > div.content-area > a`));
                selectors.forEach(selec => {
                    const oc = selec.attribs.onclick.split("'")
                    res.push({
                        link: `https://www.paju.go.kr/user/board/BD_board.view.do?seq=${oc[3]}&bbsCd=2001&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_parentCtgCd=&q_searchKeyType=&q_searchVal=&q_currPage=&q_sortName=&q_sortOrder=&q_rowPerPage=8`,
                        title: $(selec).find(`strong`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 평택시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getPyeongtaekAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 포천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getPocheonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.pocheon.go.kr/www/selectBbsNttList.do?bbsNo=18&key=3095&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`main.rowgroup > div > div > table > tbody > tr`));
                selectors.forEach(selec => {
                    const l = $(selec).find('td.subject > a').attr('href')
                    if ($(selec).text().includes('공지') || l == undefined) return;
                    res.push({
                        link: `https://www.pocheon.go.kr/www/${l.replace("./", "")}`,
                        title: $(selec).find('td.subject > a').text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 하남시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getHanamAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.hanam.go.kr/sosik/selectBbsNttList.do?key=10051&bbsNo=30&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > div > div.bbs_wrap > div.p-wrap.bbs.bbs__list > table > tbody > tr > td.text_left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.hanam.go.kr/sosik/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 화성시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getHscityAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.hscity.go.kr/www/user/bbs/BD_selectBbsList.do?q_bbsCode=1019&q_bbscttSn=&q_seachType=where&q_deptCodeSelect=1001&q_deptCode=&q_searchWhereTy=AND&q_searchVal=${encodeURI(keyword)}&q_currPage=${i}&q_sortName=&q_sortOrder=&`,
                    {
                        httpsAgent: httpsAgent
                    })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#dataForm > div.board_list.mt_20 > table > tbody > tr > td.ta_lft > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.hscity.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 연천군 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYeonchoenAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yeoncheon.go.kr/www/selectBbsNttList.do?key=3386&id=&bbsNo=8&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&searchDeptCode=&frstRegisterPnttmSdt=&frstRegisterPnttmEdt=&searchDeleteAt=N&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > div > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yeoncheon.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().split('\n')[0].trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 가평군 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGpAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gp.go.kr/portal/selectBbsNttList.do?key=501&bbsNo=150&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gp.go.kr/portal/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경기도 양평군 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYp21Anno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yp21.go.kr/www/selectBbsNttList.do?key=1111&bbsNo=1&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > div > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yp21.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getIncheonAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.incheon.go.kr/IC010101?curPage=${i}&srchKey=srchSj&srchSiteRealmCode=&srchWord=${encodeURI(keyword)}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`#content > div.content-body > div > div.board-data-list.board-has-sm-view > table > tbody > tr > td.board-list-subject.al.sm-view > a`));
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `https://www.incheon.go.kr${selec.attribs.href}`,
        //                 title : $(selec).text().trim(),
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    };
    return []
}
/**
 * 인천광역시 계양구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGyeyangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gyeyang.go.kr/open_content/main/bbs/bbsMsgList.do;jsessionid=D569BD6203EB6577119AEC56853F1F82?keyfield=title&keyword=${encodeURI(keyword)}&bcd=board_4&pgno=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#detail_con > div.general_board > table > tbody > tr > td.left.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gyeyang.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 연수구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYeonsuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yeonsu.go.kr/main/community/notify/notice.asp?gotopage=${i}&keyfield=title&keyword=${encodeURI(keyword)}&s_date=&e_date=&eminwon=&dept_idx=&head_idx=&se_dept_idx=&category=&head_idx_cateYN=&listCnt=15`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#detail_con > div.board_list > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yeonsu.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 남동구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getNamdongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.namdong.go.kr/main/bbs/bbsMsgList.do?keyfield=title&keyword=${encodeURI(keyword)}&bcd=notice&pgno=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#detail_con > div.board_list > ul > li > p > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.namdong.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 동구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDongguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.donggu.go.kr/dg/kor/article/newsNotice/?pageIndex=${i}&searchCondition=&searchKeyword=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.notice_list.div_newsNotice > ul > li > p.subject.align_left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.donggu.go.kr/dg/kor/article/newsNotice/${selec.attribs.onclick.split("'")[1]}?pageIndex=1&searchCondition=&searchKeyword=`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 미추홀구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getMichuholAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.michuhol.go.kr/main/board/list.do?page=${i}&board_code=board_1&srchCate=&srchKey=ABC&srchValue=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`body > div.wrap > div.sub-container > div > div.subr-content > div.subr-real-content > div.board-responsive > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.michuhol.go.kr/main/board/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 부평구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getIcbpAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.icbp.go.kr/main/bbs/bbsMsgList.do?keyfield=title&keyword=${encodeURI(keyword)}&bcd=notice&pgno=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#detail_con > div.board_list > ul > li > p > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.icbp.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 서구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSeoguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.seo.incheon.kr/open_content/main/bbs/bbsMsgList.do?keyfield=title&keyword=${encodeURI(keyword)}&listsz=10&bcd=notice&pgno=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#detail_con > div.board_list > table > tbody > tr > td.left.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.seo.incheon.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 중구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getIcjgAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.icjg.go.kr/krcm01b?curPage=${i}&srchKey=sj&srchText=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contentWrap > div > div > div.basic-board-list > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.icjg.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 강화군 공지 
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGanghwaAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ganghwa.go.kr/open_content/main/bbs/bbsMsgList.do?bcd=notice&listsz=10&symd=&eymd=&keyfield=title&keyword=${encodeURI(keyword)}&pgno=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#detail_con > div.board_list > table > tbody > tr > td.left.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.ganghwa.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 인천광역시 옹진군 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getOngjinAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ongjin.go.kr/open_content/main/bbs/bbsMsgList.do?keyfield=title&keyword=${encodeURI(keyword)}&listsz=10&bcd=notice&pgno=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#detail_con > div.board_list > table > tbody > tr > td.left.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.ongjin.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 강원도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGwdAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://state.gwd.go.kr/portal/bulletin/notice?searchKeyword=${encodeURI(keyword)}&searchCondition=TITLE&pageIndex=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content-bx > div:nth-child(3) > table > tbody > tr > td.skinTb-sbj > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://state.gwd.go.kr/portal/bulletin/notice?articleSeq=${selec.attribs.onclick.split('(')[1].split(')')[0]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 강원도 강릉시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGangneungAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`http://www.gangneung.go.kr/www/selectBbsNttList.do?key=258&bbsNo=12&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `http://www.gangneung.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 강원도 동해시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDhAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.dh.go.kr/www/selectBbsNttList.do?key=474&bbsNo=172&searchCtgry=&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#bbsNttForm > fieldset > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.dh.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 강원도 삼척시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSamcheokAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.samcheok.go.kr/media/00083/00089.web?sstring=${encodeURI(keyword)}&stype=title&gcode=1002&cpage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#listForm > div.list1f1t3i1.default.bbs-skin-default > ul > li > div > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.samcheok.go.kr/media/00083/00089.web${selec.attribs.href}`,
                        title: $(selec).find(`span > strong`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 강원도 속초시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSokchoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.sokcho.go.kr/portal/openinfo/sokchonews/notice?searchKeyword=${encodeURI(keyword)}&searchCondition=TITLE&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#A-Contents > div > table > tbody > tr > td.css-txa-left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.sokcho.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 강원도 원주시
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getWonjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.wonju.go.kr/www/selectBbsNttList.do?bbsNo=1&&key=211&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&aditfield1=www&aditfield2=%ED%96%89%EC%A0%95%ED%8F%AC%ED%84%B8%EC%83%88%EC%86%8C%EC%8B%9D&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > div > div > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.wonju.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상북도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGbAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gb.go.kr/Main/page.do?URL=/common/board/board.do&mnu_uid=6786&dept_code=&dept_name=&B_LEVEL=0&period=0&B_START=2023-05-06&B_END=2023-07-06&bdName=%EC%95%8C%EB%A6%BC%EB%A7%88%EB%8B%B9&BD_CODE=bbs_gongji&bbscode1=freebbs11&bbscodes=&deptcodes=&cmd=1&key=2&word=${encodeURI(keyword)}&p1=0&p2=0&Start=${i * 10 - 10}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contwrap > div > div.bodlist_wrap > table > tbody > tr > td.b_subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gb.go.kr/Main/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상북도 포항시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getPohangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.pohang.go.kr/pohang/with_pohang/notice.do?srchWrd=${encodeURI(keyword)}&srchColumn=sjCn&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > div > table > tbody > tr > td._artclTdTitle.subject.mobile_show > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.pohang.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상북도 포항시 남구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getPohangNamguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.pohang.go.kr/namgu/4613/subview.do?srchWrd=${encodeURI(keyword)}&srchColumn=sjCn&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > div > table > tbody > tr > td._artclTdTitle.subject.mobile_show > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.pohang.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상북도 포항시 북구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getPohangBukguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.pohang.go.kr/bukgu/5257/subview.do?srchWrd=${encodeURI(keyword)}&srchColumn=sjCn&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > div > table > tbody > tr > td._artclTdTitle.subject.mobile_show > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.pohang.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상북도 경주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGyeongjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gyeongju.go.kr/open_content/ko/page.do?pageNo=${i}&srchVoteType=-1&parm_mnu_uid=0&srchEnable=1&srchBgpUid=-1&srchKeyword=${encodeURI(keyword)}&srchSDate=1960-01-01&srchColumn=bod_title&srchEDate=9999-12-31&mnu_uid=416&`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content > div.board_list_v01 > table > tbody > tr > td.aL.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gyeongju.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상북도 김천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGimcheonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gc.go.kr/portal/bbs/list.do?ptIdx=1807&mId=1202090100&person=139573&searchTxt=${encodeURI(keyword)}&searchType=b_title&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#list > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes('공지')) return;
                    let oc = $(selec).find(`td.list_tit > a`).attr(`onclick`).split("'")
                    res.push({
                        link: `https://www.gc.go.kr/portal/bbs/view.do?bIdx=${oc[3]}&ptIdx=${oc[5]}&mId=${oc[7]}`,
                        title: $(selec).find(`td.list_tit > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상북도 안동시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getAndongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.andong.go.kr/portal/bbs/list.do?ptIdx=156&mId=0401010000&searchTxt=${encodeURI(keyword)}&searchType=b_title&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#list > table > tbody > tr > td.list_tit > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.andong.go.kr${selec.attribs['data-action']}&mId=0401010000`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGyeongnamAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gyeongnam.go.kr/board/list.gyeong?boardId=BBS_0000057&menuCd=DOM_000000135001001000&orderBy=REGISTER_DATE%20DESC&paging=ok&searchType=DATA_TITLE&searchOperation=AND&keyword=${encodeURI(keyword)}&startPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#subCnt > div.board`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gyeongnam.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 창원시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getChangwonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.changwon.go.kr/cwportal/10310/10429/10430.web?sstring=${encodeURI(keyword)}&stype=title&gcode=1009&cpage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#listForm > div.list2table1.rspnsv > table > tbody > tr > td.tal > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.changwon.go.kr/cwportal/10310/10429/10430.web${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 창원시 의창구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUichangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.changwon.go.kr/gu/bbs/list.do?ptIdx=101&mId=0102010000&searchType=b_title&page=${i}&searchTxt=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#list > table > tbody > tr > td.list_tit > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.changwon.go.kr${selec.attribs['data-action']}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 창원시 성산구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSungsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get()
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 창원시 마산합포구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getMasanhappoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 창원시 마산회원구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getMasanhwewonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 창원시 진해구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJinHaeAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 진주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJinjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jinju.go.kr/00130/02730/00136.web?extParam=notice&sstring=${encodeURI(keyword)}&stype=title&gcode=2144&cpage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`div.list1f1t3i1.notice.bbs-skin-notice > ul > li > div > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jinju.go.kr/00130/02730/00136.web${selec.attribs.href}`,
                        title: $(selec).find(`span > strong`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 경상남도 통영시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getTongyeongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.tongyeong.go.kr/00852/00853/00854.web?gcode=9001&amode=list&wmode=&cpage=${i}&stype=title&sstring=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#listForm > div.list1f1t3i1.default.bbs-skin-default > ul > li > div > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.tongyeong.go.kr/00852/00853/00854.web${selec.attribs.href}`,
                        title: $(selec).find(`span > strong`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 부산광역시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getBusanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.busan.go.kr/nbnews?curPage=${i}&srchText=${encodeURI(keyword)}&srchKey=sj`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > table > tbody > tr > td.pc_Y.ta_Y.mo_Y.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.busan.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 부상광역시 기장군 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGijangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gijang.go.kr/board/list.gijang?boardId=BBS_0000002&menuCd=DOM_000000101001001000&paging=ok&searchType=DATA_TITLE&searchOperation=OR&keyword=${encodeURI(keyword)}&startPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#conts > div.board_wrapper > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gijang.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 부산광역시 동래구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDongnaeAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.dongnae.go.kr/board/list.dongnae?boardId=BBS_0000012&listRow=10&listCel=1&menuCd=DOM_000000103001001000&searchType=DATA_TITLE&keyword=${encodeURI(keyword)}&startPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > table > tbody > tr > td > span > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.dongnae.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 부산광역시 부산진구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getBusanjinAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.busanjin.go.kr/board/list.busanjin?boardId=BBS_0000009&menuCd=DOM_000000110001001000&paging=ok&searchType=DATA_TITLE&searchOperation=AND&keyword=${encodeURI(keyword)}&startPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#sub_contentnw > div > div.board-list > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.busanjin.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 부상광역시 부산북구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getBsbukguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.bsbukgu.go.kr/board/list.bsbukgu?boardId=BBS_0000023&menuCd=DOM_000000105001001000&paging=ok&searchType=DATA_TITLE&searchOperation=OR&keyword=${encodeURI(keyword)}&startPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#conts > div.board-list-wrap > table > tbody > tr > td.l > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.bsbukgu.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 부상광역시 해운대구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getHaeundaeAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.haeundae.go.kr/councilk/board/list.do?boardId=BBS_0000038&menuCd=DOM_000000104001001000&paging=ok&searchType=DATA_TITLE&keyword=${encodeURI(keyword)}&startPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#font_size > div.table.respond > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.haeundae.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaeguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.daegu.go.kr/index.do?menu_id=00000854&menu_link=/icms/bbs/selectBoardList.do&bbsId=BBS_00029&searchWrd=${encodeURI(keyword)}&searchCnd=0&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#bbsList > tbody > tr > td.tal > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.daegu.go.kr/index.do?menu_id=00000854&menu_link=/icms/bbs/selectBoardArticle.do&bbsId=BBS_00029&nttId=${selec.attribs.onclick.split("'")[3]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 중구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaegujungguAnno(keyword, count) {
    try {
        const list = [];
        let res = []
        // for(let i = 1; i <= searchPageNumber; i++){
        //     const url = `https://www.jung.daegu.kr/new/pages/administration/page.html?mc=157&key=title&keyword=${encodeURI(keyword)}&kscale=10&category=&bbs_id=board_5&search_date_start=&search_date_end=&dongcode=&DEP_CODE=&mode=list&start=${i*10-10}`
        //     await axios.get(url).then(async response=>{
        //         await axios.get(url,{
        //             httpsAgent : new https.Agent({keepAlive: true}),
        //             headers:{
        //             "Cookie" : `sabFingerPrint=912,937,www.jung.daegu.kr; sabSignature=${response.data.slice(response.data.lastIndexOf(`cookie = '`)+10,response.data.lastIndexOf(`cookie = '`)+10+('sabSignature=Gtp99L0UuLGBJcn5+Vv9lA=='.length))}`
        //         }}).then(response=>{
        //             const $ = load(response.data);
        //             const selectors = Array.from($(`#moveForm > table > tbody > tr > td.tal.subject > a`));
        //             selectors.forEach(selec=>{
        //                 res.push({
        //                     link : `https://www.jung.daegu.kr${selec.attribs.href}`,
        //                     title : $(selec).text().trim(),
        //                 })
        //             })
        //         })
        //     })
        // }
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 동구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaeguDongguAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://dong.daegu.kr/main/page.htm?pageno=${i}&parm_mnu_uid=212&mnu_uid=212&se_key=0&se_text=${encodeURI(keyword)}&msg_ca_no=0&s_period=&e_period=&wztp=`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`#ctn > div.bod_wrap > table > tbody > tr > td.sL > a`));
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `https://dong.daegu.kr/main/${selec.attribs.href}`,
        //                 title : $(selec).text().trim(),
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    };
    return []
}
/**
 * 대구광역시 서구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaeguSeoguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.dgs.go.kr/dgs/commu/page.php?pageno=${i}&mnu_uid=987&se_key=0&se_text=${encodeURI(keyword)}&msg_ca_no=0&s_period=&e_period=&wztp=`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > div.bbs_list_default > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.dgs.go.kr/dgs/commu/page.php${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 남구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaueguNamguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.nam.daegu.kr/index.do?menu_link=icms/bbs/selectBoardList.do?searchWrd=${encodeURI(keyword)}&searchCnd=0&menu_id=00000848&bbsId=BBSMSTR_000000000591&bbsTyCode=BBST03&bbsAttrCode=BBSA03&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > table > tbody > tr > td.tal > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.nam.daegu.kr/index.do?menu_link=icms/bbs/selectBoardArticle.do?nttId=${selec.attribs.onclick.split("'")[3]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 북구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaegubukguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 수성구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaeguSuseongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.suseong.kr/icms/bbs/selectBoardList.do?searchCnd=0&searchWrd=${encodeURI(keyword)}&menu_id=0000063&bbsId=BBSMSTR_000000000015&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#bbsList > tbody > tr > td.tal > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.onclick}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 달서구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaegudalseoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대구광역시 달성군 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getdalseongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 울산광역시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUlsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ulsan.go.kr/u/rep/transfer/notice/list.ulsan?curPage=${i}&mId=001004002000000000&srchGubun=&srchType=srchSj&srchWord=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents_inner > div.content_box > table > tbody > tr > td.gosi > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.ulsan.go.kr/u/rep/transfer/notice/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 울산광역시 중구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUlsanJungguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($());
                selectors.forEach(selec => {
                    res.push({
                        link: `${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 울산광역시 남구
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUlsanNamguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.ulsannamgu.go.kr/cop/bbs/anonymous/selectBoardList.do?searchWrd=${encodeURI(keyword)}&searchCnd=0&pageIndex=${i}&bbsId=namguNews&nttId=0&bbsTyCode=BBST01&bbsAttrbCode=BBSA03&authFlag=Y`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content_field > table > tbody > tr > td.left.txt_ovf > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.ulsannamgu.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 울산광역시 동구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUlsanDongguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.donggu.ulsan.kr/cop/bbs/selectBoardList.do?bbsId=BBSMSTR_000000000323&nttId=0&bbsTyCode=BBST01&bbsAttrCode=BBSA03&authFlag=Y&pageIndex=${i}&searchCnd=0&searchWrd=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content_field > div.no-more-tables > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.donggu.ulsan.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 울산광역시 북구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getUlsanBukguAnno(keyword, count) {
    try {
        const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.bukgu.ulsan.kr/lay1/bbs/S1T62C83/A/1/list.do?cat=&article_seq=&condition=TITLE&keyword=${encodeURI(keyword)}&rows=10&cpage=${i}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`#sub > div.sub_contents > div.contentsBox > table > tbody > tr`));
        //         selectors.forEach(selec=>{
        //             if($(selec).find(`td > img`).attr('alt')=='공지') return
        //             res.push({
        //                 link : `https://www.bukgu.ulsan.kr/lay1/bbs/S1T62C83/A/1/${$(selec).find(`td.title > a`).attr('href')}`,
        //                 title : $(selec).find(`td.title > a`).text().trim(),
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    };
    return []
}
/**
 * 충청북도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getChungbukAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.chungbuk.go.kr/www/selectGosiPblancList.do?key=422&pageUnit=10&searchCnd=all&searchKrwd=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > div > div > table > tbody > tr > td.p-subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.chungbuk.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청북도 청주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getCheongjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheongju.go.kr/www/selectBbsNttList.do?key=279&bbsNo=40&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.cheongju.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청북도 청주시 상당구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSangdangAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheongju.go.kr/sangdang/selectBbsNttList.do?key=1018&bbsNo=511&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=000100186&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.cheongju.go.kr${selec.attribs.href.replace('..', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청북도 청주시 흥덕구
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getHeungdeokAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheongju.go.kr/heungdeok/selectBbsNttList.do?key=1889&bbsNo=512&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=000100230&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.cheongju.go.kr${selec.attribs.href.replace('..', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청북도 청주시 서원구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSeowonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheongju.go.kr/seowon/selectBbsNttList.do?key=1194&bbsNo=513&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=000100209&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.cheongju.go.kr${selec.attribs.href.replace('..', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청북도 청주시 청원구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getCheongwonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheongju.go.kr/cheongwon/selectBbsNttList.do?key=1309&bbsNo=514&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=000100251&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > form > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.cheongju.go.kr${selec.attribs.href.replace('..', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청북도 충주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getChungjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.chungju.go.kr/www/selectBbsNttList.do?key=506&bbsNo=5&searchCtgry=&pageUnit=10&searchCnd=&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.chungju.go.kr/www/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청북도 제천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJecheonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jecheon.go.kr/www/selectBbsNttList.do?key=114&id=&&bbsNo=11&searchCtgry=&pageUnit=10&searchCnd=SJ&searchKrwd=${encodeURI(keyword)}&integrDeptCode=&pageIndex=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > div.p-wrap.bbs.bbs__list > table > tbody > tr > td > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jecheon.go.kr/www/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청남도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getChungnamAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.chungnam.go.kr/cnnet/board.do?pageNo=${i}&pageGNo=0&showSplitNo=10&mnu_cd=CNNMENU02364&searchCnd=0&searchWrd=${encodeURI(keyword)}&srtdate=20180101&enddate=`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#count > tbody > tr > td.title_comm > a:nth-child(1)`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.chungnam.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청남도 천안시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getCheonanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheonan.go.kr/cop/bbs/BBSMSTR_000000000462/selectBoardList.do?searchWrd=${encodeURI(keyword)}&searchCnd=0&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#txt > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes('공지') || !$(selec).find(`td > div > span > a`).attr('href')) return;
                    res.push({
                        link: `https://www.cheonan.go.kr/cop/bbs/BBSMSTR_000000000462/selectBoardArticle.do?nttId=${$(selec).find(`td > div > span > a`).attr(`href`).split("'")[1]}`,
                        title: $(selec).find(`td > div > span > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청남도 천안시 동남구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDongnamAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheonan.go.kr/cop/bbs/BBSMSTR_000000000105/selectBoardList.do?searchWrd=${encodeURI(keyword)}&searchCnd=0&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#txt > table > tbody > tr > td.left > div > span.link > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.cheonan.go.kr/cop/bbs/BBSMSTR_000000000105/selectBoardArticle.do?nttId=${selec.attribs.href.split("'")[1]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청남도 천안시 서북구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSeobukAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.cheonan.go.kr/cop/bbs/BBSMSTR_000000000191/selectBoardList.do?searchWrd=${encodeURI(keyword)}&searchCnd=0&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#txt > table > tbody > tr > td.left > div > span.link > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.cheonan.go.kr/cop/bbs/BBSMSTR_000000000191/selectBoardArticle.do?nttId=${selec.attribs.href.split("'")[1]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청남도 아산시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getAsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.asan.go.kr/main/cms/?m_mode=list&tb_nm=city_news_notice&category=&PageNo=${i}&no=131&sltOption=all&txtKeyword=${encodeURI(keyword)}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#sub_page_area > div.page_content.pageContent > div > form > table > tbody > tr > td.title.alignLeft > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.asan.go.kr/main/cms/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청남도 공주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGongjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gongju.go.kr/bbs/BBSMSTR_000000000813/list.do?searchKeyword=${encodeURI(keyword)}&searchCondition=all&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#txt > div > div.no-more-tables > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes(`공지`)) return
                    res.push({
                        link: `https://www.gongju.go.kr/bbs/BBSMSTR_000000000813/view.do?nttId=${$(selec).find(`td.subject > a`).attr('onclick').split("'")[1]}`,
                        title: $(selec).find(`td.subject > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 충청남도 논산시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getNonsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://nonsan.go.kr/kor/html/sub03/030101.html?mode=L&skey=title&sval=${encodeURI(keyword)}&GotoPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#BBSLista6c88380ddf3027005db8a0779606d6a > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://nonsan.go.kr/kor/html/sub03/030101.html${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대전광역시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaejeonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.daejeon.go.kr/drh/board/boardNormalList.do?searchKeyword=${encodeURI(keyword)}&searchCondition=&pageIndex=${i}&boardId=normal_0096&menuSeq=1631`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#new_bbs > table > tbody > tr > td.al_left.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.daejeon.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대전광역시 중구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaejeonJungguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.djjunggu.go.kr/bbs/BBSMSTR_000000000136/list.do?searchKeyword=${encodeURI(keyword)}&pageIndex=${i}&searchCondition=all`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#txt > div > div.no-more-tables > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.djjunggu.go.kr/bbs/BBSMSTR_000000000136/view.do?nttId=${selec.attribs.onclick.split("'")[1]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대전광역시 동구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaejeondongguAnno(keyword, count) {
    try {
        // const list = [];
        // for(let i = 1; i <= searchPageNumber; i++){
        //     list.push(
        //         axios.get(`https://www.donggu.go.kr/dg/kor/article/newsNotice/?pageIndex=${i}&searchCondition=&searchKeyword=${encodeURI(keyword)}`)
        //     )
        // }
        // let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($(`#layoutContent > div.board > div.notice_list.div_newsNotice > ul > li > p.subject.align_left > a`));
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `https://www.donggu.go.kr/dg/kor/article/newsNotice/${selec.attribs.onclick.split("'")[1]}`,
        //                 title : $(selec).find('strong').text().trim(),
        //             })
        //         })
        //     })
        // })
        // return res.slice(0,count)
    } catch (e) {
        return []
    };
    return []
}
/**
 * 대전광역시 서구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaejeonseoguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.seogu.go.kr/bbs/BBSMSTR_000000000275/list.do?searchKeyword=${encodeURI(keyword)}&searchCondition=all&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#deleteForm > div > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes('공지') || $(selec).find(`td.subject > button`).attr('onclick') == undefined) return;
                    res.push({
                        link: `https://www.seogu.go.kr/bbs/BBSMSTR_000000000275/view.do?nttId=${$(selec).find(`td.subject > button`).attr('onclick').split("'")[1]}`,
                        title: $(selec).find(`td.subject > button > div > strong`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대정광역시 유성구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYuseongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yuseong.go.kr/bbs/BBSMSTR_000000000099/list.do?searchCondition=all&searchKeyword=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#deleteForm > div > table > tbody > tr > td.subject > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yuseong.go.kr/bbs/BBSMSTR_000000000099/view.do?nttId=${selec.attribs.onclick.split("'")[1]}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 대전광역시 대덕구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDaedeokAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.daedeok.go.kr/dpt/dpt04/DPT040101_cmmBoardList.do?searchCondition=&searchKeyword=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents > div.complaint > div > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.daedeok.go.kr${selec.attribs.href}`,
                        title: $(selec).text().split('|')[2].trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 세종특별자치시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSejongAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.sejong.go.kr/bbs/R0071/list.do?searchCondition=all&searchKeyword=${encodeURI(keyword)}&pageIndex=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#txt > div > div.no-more-tables > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes('공지')) return;
                    res.push({
                        link: `https://www.sejong.go.kr${$(selec).find(`td.subject > a`).attr('href')}`,
                        title: $(selec).find(`td.subject > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라북도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJeonbukAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jeonbuk.go.kr/board/list.jeonbuk?boardId=BBS_0000011&menuCd=DOM_000000103001001001&paging=ok&searchType=DATA_TITLE&keyword=${encodeURI(keyword)}&startPage=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content > div.bbs_skin2 > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jeonbuk.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라북도 전주시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJeonjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jeonju.go.kr/planweb/board/list.9is?page=${i}&boardUid=9be517a74f8dee91014f90e8502d0602&contentUid=9be517a769953e5f0169c1dfd63e01a7&layoutUid=&searchType=dataTitle&keyword=${encodeURI(keyword)}&categoryUid1=&categoryUid2=&cateogryUid3=`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#board > div > table > tbody > tr > td.tleft > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jeonju.go.kr/planweb/board/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라북도 전주시 완산구
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getWansanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://wansangu.jeonju.go.kr/planweb/board/list.9is?page=${i}&boardUid=9be517a74f72e96b014f823aabc601ce&contentUid=9be517a74f72e96b014f8273b763035a&layoutUid=&searchType=dataTitle&keyword=${encodeURI(keyword)}&categoryUid1=&categoryUid2=&cateogryUid3=`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content > div.s_con > table > tbody > tr > td.txt_left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://wansangu.jeonju.go.kr/planweb/board/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라북도 전주시 덕진구
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getDeokjinguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://deokjingu.jeonju.go.kr/planweb/board/list.9is?page=${i}&boardUid=9be517a74f72e96b014f8632a66117e2&contentUid=9be517a74f72e96b014f865cd380199d&layoutUid=&searchType=dataTitle&keyword=${encodeURI(keyword)}&categoryUid1=&categoryUid2=&cateogryUid3=`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content > table > tbody > tr > td.txt_left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://deokjingu.jeonju.go.kr/planweb/board/${selec.attribs.href.replace('./', '')}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라북도 익산시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getIksanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.iksan.go.kr/board/list.iksan?boardId=BBS_IKSAN_NEWS&menuCd=DOM_000002003008001000&orderBy=REGISTER_DATE%20DESC&searchType=DATA_TITLE&keyword=${encodeURI(keyword)}&startPage=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#s_con > div.bbs_skin > table > tbody > tr`));
                selectors.forEach(selec => {
                    if ($(selec).text().includes('공지')) return;
                    res.push({
                        link: `https://www.iksan.go.kr/${$(selec).find(`td.txt_left > a`).attr('href')}`.replace(/ /g, encodeURI(' ')),
                        title: $(selec).find(`td.txt_left > a`).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라북도 군산시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGunsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gunsan.go.kr/main/m140/list?s_word=${encodeURI(keyword)}&s_field=title&s_idx=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#containertab > div.bbs > table > tbody > tr > td.Tleft > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gunsan.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라남도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJeonnamAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jeonnam.go.kr/M7124/boardList.do?infoReturn=&pageIndex=${i}&menuId=jeonnam0201000000&searchType=0&searchText=${encodeURI(keyword)}&displayHeader=`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#frm > div.bbs_basic > table > tbody > tr > td.title.left.petition > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jeonnam.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라남도 목포시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getMokpoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.mokpo.go.kr/www/open_administration/city_news/notice?page=${i}&search_type=title&search_word=${encodeURI(keyword)}`, {
                    headers: {
                        'Accept-Encoding': '*'
                    }
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content > div > table > tbody > tr > td.align_l.title_wrap > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.mokpo.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라남도 여수시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getYeosuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.yeosu.go.kr/www/govt/news/notice?page=${i}&search_type=title&search_word=${encodeURI(keyword)}&page_scale=15&start_date=2020-07-07&finish_date=&search_date=y`, {
                    headers: {
                        'Accept-Encoding': '*'
                    }
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content > div > div > div > div.board_list > table > tbody > tr > td.align_left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.yeosu.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 전라남도 순천시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSuncheonAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.suncheon.go.kr/kr/news/0001/0001/?mode=list&boardId=BBS_0000000000000130&searchCondition=all&searchKeyword=${encodeURI(keyword)}&pageIdx=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#bbsForm > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.suncheon.go.kr/kr/news/0001/0001/${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 광주광역시 공지 [점검중]
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGwangjuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(

            )
        }
        let res = [];
        // await Promise.all(list).then(r=>{
        //     r.forEach(response=>{
        //         const $ = load(response.data);
        //         const selectors = Array.from($());
        //         selectors.forEach(selec=>{
        //             res.push({
        //                 link : `${selec.attribs.href}`,
        //                 title : $(selec).text().trim(),
        //             })
        //         })
        //     })
        // })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 광주광역시 동구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGwangjuDongguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.donggu.kr/board.es?mid=a10101010000&bid=0001&keyWord=${encodeURI(keyword)}&keyField=&npage=${i}&b_list=10&act=list#content`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#listView > ul > li.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.donggu.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 광주광역시 서구 공지지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGwangjuSeoguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.seogu.gwangju.kr/board.es?mid=a10311010100&bid=0034&keyWord=${encodeURI(keyword)}&keyField=T&nPage=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#contents_body > div.board_list > table > tbody > tr:nth-child(1) > td.txt_left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.seogu.gwangju.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 광주광역시 남구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGwangjuNamguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.namgu.gwangju.kr/board.es?mid=a10604010000&bid=0001&keyWord=${encodeURI(keyword)}&nPage=${i}&keyField=TITLE`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#content_detail > table > tbody > tr > td.txt_left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.namgu.gwangju.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 광주광역시 북구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGwangjuBukguAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://bukgu.gwangju.kr/board.es?mid=a10201010000&bid=0114&keyField=TITLE&keyWord=${encodeURI(keyword)}&nPage=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#listView > ul > li.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://bukgu.gwangju.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 광주광역시 광산구 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getGwangsanAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.gwangsan.go.kr/bb/bbBoard.php?movePage=${i}&action=list&pageID=gwangsan0201020000&boardID=NEWS_NEW&searchBoardTp=TM&searchBoard=${encodeURI(keyword)}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#con_body > div.con_real > div.boardArea > div.board_list > div > table > tbody > tr > th > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.gwangsan.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 *  제주특별자치도 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getJejuAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.jeju.go.kr/news/news/news.htm?qType=title&q=${encodeURI(keyword)}&page=${i}`, {
                    httpsAgent: httpsAgent
                })
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#sub-contents > div.iframe-responsive > div > div.defaultBoard > table > tbody > tr > td.title > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.jeju.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}
/**
 * 제주특별자치도 서귀포시 공지
 * @param {String} keyword 
 * @param {Number} count 
 * @returns {Array}
 */
async function getSeogwipoAnno(keyword, count) {
    try {
        const list = [];
        for (let i = 1; i <= searchPageNumber; i++) {
            list.push(
                axios.get(`https://www.seogwipo.go.kr/info/news/notice.htm?qType=title&q=${encodeURI(keyword)}&page=${i}`)
            )
        }
        let res = [];
        await Promise.all(list).then(r => {
            r.forEach(response => {
                const $ = load(response.data);
                const selectors = Array.from($(`#main-contents > div > div > div.board-list-wrap > table > tbody > tr > td.title.text-left > a`));
                selectors.forEach(selec => {
                    res.push({
                        link: `https://www.seogwipo.go.kr${selec.attribs.href}`,
                        title: $(selec).text().trim(),
                    })
                })
            })
        })
        return res.slice(0, count)
    } catch (e) {
        return []
    };
}




const koreaMetroAnno = {
    "Seoul": {
        Seoul: getSeoulAnno,
        Gangnam: getGangnamAnno,
        Gangdong: getGangdongAnno,
        Gangbuk: getGangbukAnno,
        Gangseo: getGangseoAnno,
        Gwanak: getGwanakAnno,
        Gwangjin: getGwangjinAnno,
        Guro: getGuroAnno,
        Geumcheon: getGeumcheonAnno,
        Nowon: getNowonAnno,
        Dobong: getDobongAnno,
        Ddm: getDdmAnno,
        Dongjak: getDongjakAnno,
        Mapo: getMapoAnno,
        Sdm: getSdmAnno,
        Seocho: getSeochoAnno,
        Sd: getSdAnno,
        Sb: getSbAnno,
        Songpa: getSongpaAnno,
        Yangcheon: getYangcheonAnno,
        Ydp: getYdpAnno,
        Yongsan: getYongsanAnno,
        Ep: getEpAnno,
        Jongno: getJongnoAnno,
        Junggu: getJungguAnno,
        Jungnang: getJungnangAnno,
    },
    "Gyeonggido": {
        Goyang: getGoyangAnno,
        Dygu: getDyguAnno,
        Ilsegu: getIlseguAnno,
        Ilswgu: getIlswguAnno,
        Gccity: getGccityAnno,
        Gm: getGmAnno,
        Gjcity: getGjcityAnno,
        Guri: getGuriAnno,
        Gunpo: getGunpoAnno,
        Gimpo: getGimpoAnno,
        Nyj: getNyjAnno,
        Ddc: getDdcAnno,
        Bucheon: getBucheonAnno,
        Seongnam: getSeongnamAnno,
        Sujeonggu: getSujeongguAnno,
        Jungwongu: getJungwonguAnno,
        Bundanggu: getBundangguAnno,
        Suwon: getSuwonAnno,
        Jangan: getJanganAnno,
        Ksun: getKsunAnno,
        Paldal: getPaldalAnno,
        Yt: getYtAnno,
        Siheung: getSiheungAnno,
        Ansan: getAnsanAnno,
        Sangnokgu: getSangnokguAnno,
        Danwongu: getDanwonguAnno,
        Anseong: getAnseongAnno,
        Anyang: getAnyangAnno,
        Manan: getMananAnno,
        Dongan: getDonganAnno,
        Yangju: getYangjuAnno,
        Yeoju: getYeojuAnno,
        Osan: getOsanAnno,
        Yongin: getYonginAnno,
        Cheoingu: getCheoinguAnno,
        Giheunggu: getGiheungguAnno,
        Sujigu: getSujiguAnno,
        Uiwang: getUiwangAnno,
        Ui4u: getUi4uAnno,
        Icheon: getIcheonAnno,
        Paju: getPajuAnno,
        Pyeongtaek: getPyeongtaekAnno,
        Pocheon: getPocheonAnno,
        Hanam: getHanamAnno,
        Hscity: getHscityAnno,
        Yeoncheon: getYeonchoenAnno,
        Gp: getGpAnno,
        Yp21: getYp21Anno
    },
    "Incheon": {
        Incheon: getIncheonAnno,
        Gyeyang: getGyeyangAnno,
        Yeonsu: getYeonsuAnno,
        Namdong: getNamdongAnno,
        Donggu: getDongguAnno,
        Michuhol: getMichuholAnno,
        Icbp: getIcbpAnno,
        Seogu: getSeoguAnno,
        Icjg: getIcjgAnno,
        Ganghwa: getGanghwaAnno,
        Ongjin: getOngjinAnno
    },
    "Gangwon": {
        Gwd: getGwdAnno,
        Gangneung: getGangneungAnno,
        Dh: getDhAnno,
        Samcheok: getSamcheokAnno,
        Sokcho: getSokchoAnno,
        Wonju: getWonjuAnno,
    },
    "Gyeongbuk": {
        Gb: getGbAnno,
        Pohang: getPohangAnno,
        PohangNamgu: getPohangNamguAnno,
        PohangBukgu: getPohangBukguAnno,
        Gyeongju: getGyeongjuAnno,
        Gimcheon: getGimcheonAnno,
        Andong: getAndongAnno
    },
    "Gyeongnam": {
        Gyeongnam: getGyeongnamAnno,
        Changwon: getChangwonAnno,
        Uichang: getUichangAnno,
        Sungsan: getSungsanAnno,
        Masanhappo: getMasanhappoAnno,
        Masanhwewon: getMasanhwewonAnno,
        Jinhae: getJinHaeAnno,
        Jinju: getJinjuAnno,
        Tongyeong: getTongyeongAnno
    },
    "Busan": {
        Busan: getBusanAnno,
        Gijang: getGijangAnno,
        Dongnae: getDongnaeAnno,
        Busanjin: getBusanjinAnno,
        Bsbukgu: getBsbukguAnno,
        Haeundae: getHaeundaeAnno,
    },
    "Daegu": {
        Daegu: getDaeguAnno,
        Junggu: getDaegujungguAnno,
        Donggu: getDaeguDongguAnno,
        Seogu: getDaeguSeoguAnno,
        Namgu: getDaueguNamguAnno,
        Bukgu: getDaegubukguAnno,
        Suseong: getDaeguSuseongAnno,
        Dalseo: getDaegudalseoAnno,
        Dalseong: getdalseongAnno,
    },
    "Ulsan": {
        Ulsan: getUlsanAnno,
        Junggu: getUlsanJungguAnno,
        Namgu: getUlsanNamguAnno,
        Donggu: getUlsanDongguAnno,
        Bukgu: getUlsanBukguAnno,
    },
    "Chungbuk": {
        Chungbuk: getChungbukAnno,
        Cheongju: getCheongjuAnno,
        Sangdang: getSangdangAnno,
        Heungdeok: getHeungdeokAnno,
        Seowon: getSeowonAnno,
        Cheongwon: getCheongwonAnno,
        Chungju: getChungjuAnno,
        Jecheon: getJecheonAnno,
    },
    "Chungnam": {
        Chungnam: getChungnamAnno,
        Cheonan: getCheonanAnno,
        Dongnam: getDongnamAnno,
        Seobuk: getSeobukAnno,
        Asan: getAsanAnno,
        Gongju: getGongjuAnno,
        Nonsan: getNonsanAnno,
    },
    "Daejeon": {
        Daejeon: getDaejeonAnno,
        Junggu: getDaejeonJungguAnno,
        Donggu: getDaejeondongguAnno,
        Seogu: getDaejeonseoguAnno,
        Yuseong: getYuseongAnno,
        Daedeok: getDaedeokAnno,
    },
    "Sejong": {
        Sejong: getSejongAnno
    },
    "Jeonbuk": {
        Jeonbuk: getJeonbukAnno,
        Jeonju: getJeonjuAnno,
        Wansan: getWansanAnno,
        Deokjingu: getDeokjinguAnno,
        Iksan: getIksanAnno,
        Gunsan: getGunsanAnno,
    },
    "Jeonnam": {
        Jeonnam: getJeonnamAnno,
        Mokpo: getMokpoAnno,
        Yeosu: getYeosuAnno,
        Suncheon: getSuncheonAnno
    },
    "Gwangju": {
        Gwangju: getGwangjuAnno,
        Donggu: getGwangjuDongguAnno,
        Seogu: getGwangjuSeoguAnno,
        Namgu: getGwangjuNamguAnno,
        Bukgu: getGwangjuBukguAnno,
        Gwangsan: getGwangsanAnno
    },
    "Jeju": {
        Jeju: getJejuAnno,
        Seogwipo: getSeogwipoAnno
    }
}

let e2k = {
    Seoul: "서울특별시",
    Gangnam: "강남구",
    Gangdong: "강동구",
    Gangseo: "강서구",
    Gangbuk: "강북구",
    Gwanak: "관악구",
    Gwangjin: "광진구",
    Guro: "구로구",
    Geumcheon: "금천구",
    Nowon: "노원구",
    Dobong: "도봉구",
    Ddm: "동대문구",
    Dongjak: "동작구",
    Mapo: "마포구",
    Sdm: "서대문구",
    Seocho: "서초구",
    Sd: "성동구",
    Sb: "성북구",
    Songpa: "송파구",
    Yangcheon: "양천구",
    Ydp: "영등포구",
    Yongsan: "용산구",
    Ep: "은평구",
    Jongno: "종로구",
    Junggu: "중구",
    Jungnang: "중랑구",
    Goyang: "고양시",
    DyguAnno: "덕양구",
    Ilsegu: "일산동구",
    Ilswgu: "일산서구",
    Gccity: "과천시",
    Gm: "광명시",
    Gjcity: "광주시",
    Guri: "구리시",
    Gunpo: "군포시",
    Gimpo: "김포시",
    Nyj: "남양주시",
    Ddc: "동두천시",
    Bucheon: "부천시",
    Seongnam: "성남시",
    Sujeonggu: "수정구",
    Jungwongu: "중원구",
    Bundanggu: "분당구",
    Suwon: "수원시",
    Jangan: "장안구",
    Ksun: "권선구",
    Paldal: "팔달구",
    Yt: "영통구",
    Siheung: "시흥시",
    Ansan: "안산시",
    Sangnokgu: "상록구",
    Danwongu: "단원구",
    Anseong: "안성시",
    Anyang: "안양시",
    Manan: "만안구",
    Dongan: "동안구",
    Yangju: "양주시",
    Yeoju: "여주시",
    Osan: "오산시",
    Yongin: "용인시",
    Cheoingu: "처인구",
    Giheunggu: "기흥구",
    Sujigu: "수지구",
    Uiwang: "의왕시",
    Ui4u: "의정부시",
    Icheon: "이천시",
    Paju: "파주시",
    Pyeongtaek: "평택시",
    Pocheon: "포천시",
    Hanam: "하남시",
    Hscity: "화성시",
    Yeoncheon: "연천군",
    Gp: "가평군",
    Yp21: "양평군",
    Incheon: "인천광역시",
    Gyeyang: "계양구",
    Yeonsu: "연수구",
    Namdong: "남동구",
    Donggu: "동구",
    Michuhol: "미추홀구",
    Icbp: "부평구",
    Seogu: "서구",
    Icjg: "중구",
    Ganghwa: "강화군",
    Ongjin: "웅진군",
    Gwd: "강원도",
    Gangneung: "강릉시",
    Dh: "동해시",
    Samcheok: "삼척시",
    Sokcho: "속초시",
    Wonju: "원주시",
    Gb: "경상북도",
    Pohang: "포항시",
    PohangNamgu: "포항 남구",
    PohangBukgu: "포항 북구",
    Gyeongju: "경주시",
    Gimcheon: "김천시",
    Andong: "안동시",
    Gyeongnam: "경상남도",
    Changwon: "창원시",
    Uichang: "의창구",
    Sungsan: "성산구",
    Masanhappo: "마산합포구",
    Masanhwewon: "마산회원구",
    Jinhae: "진해구",
    Jinju: "진주시",
    Tongyeong: "통영시",
    Busan: "부산광역시",
    Gijang: "기장군",
    Dongnae: "동래구",
    Busanjin: "부산진구",
    Bsbukgu: "부산북구",
    Haeundae: "해운대구",
    Daegu: "대구광역시",
    Junggu: "중구",
    Namgu: "남구",
    Bukgu: "북구",
    Suseong: "수성구",
    Dalseo: "달서구",
    Dalseong: "달성구",
    Ulsan: "울산광역시",
    Chungbuk: "충청북도",
    Cheongju: "청주시",
    Sangdang: "상당구",
    Heungdeok: "흥덕구",
    Seowon: "서원구",
    Cheongwon: "청원구",
    Chungju: "충주시",
    Jecheon: "제천시",
    Chungnam: "충청남도",
    Cheonan: "천안",
    Dongna: "동남구",
    Seobuk: "서북구",
    Asan: "아산시",
    Gongju: "공주시",
    Nonsan: "논산시",
    Daejeon: "대전광역시",
    Yuseong: "유성구",
    Daedeok: "대덕구",
    Sejong: "세종특별자치시",
    Jeonbuk: "전라북도",
    Jeonju: "전주시",
    Wansan: "완산군",
    Deokjingu: "덕진군",
    Iksan: "익산시",
    Gunsan: "군산시",
    Jeonnam: "전라남도",
    Mokpo: "목포시",
    Yeosu: "여수시",
    Suncheon: "순천시",
    Gwangju: "광주광역시",
    Gwangsan: "광산구",
    Jeju: "제주특별자치도",
    Seogwipo: "서귀포시"
}
import express, { json } from 'express';
import cors from 'cors'
import bodyParser from "body-parser";
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/getAnno', async (req, res) => {
    const { title, count } = req.query
    if (req.query.location == "서울특별시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Seoul).length
        let m = 0;
        Object.keys(koreaMetroAnno.Seoul).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Seoul[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "경기도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Gyeonggido).length
        let m = 0;
        Object.keys(koreaMetroAnno.Gyeonggido).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Gyeonggido[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "인천광역시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Incheon).length
        let m = 0;
        Object.keys(koreaMetroAnno.Incheon).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Incheon[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "강원도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Gangwon).length
        let m = 0;
        Object.keys(koreaMetroAnno.Gangwon).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Gangwon[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "경상북도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Gyeongbuk).length
        let m = 0;
        Object.keys(koreaMetroAnno.Gyeongbuk).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Gyeongbuk[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "경상남도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Gyeongnam).length
        let m = 0;
        Object.keys(koreaMetroAnno.Gyeongnam).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Gyeongnam[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "부산광역시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Busan).length
        let m = 0;
        Object.keys(koreaMetroAnno.Busan).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Busan[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "대구광역시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Daegu).length
        let m = 0;
        Object.keys(koreaMetroAnno.Daegu).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Daegu[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "울산광역시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Ulsan).length
        let m = 0;
        Object.keys(koreaMetroAnno.Ulsan).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Ulsan[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "충청북도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Chungbuk).length
        let m = 0;
        Object.keys(koreaMetroAnno.Chungbuk).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Chungbuk[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "충청남도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Chungnam).length
        let m = 0;
        Object.keys(koreaMetroAnno.Chungnam).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Chungnam[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "대전광역시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Daejeon).length
        let m = 0;
        Object.keys(koreaMetroAnno.Daejeon).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Daejeon[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "세종특별자치시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Sejong).length
        let m = 0;
        Object.keys(koreaMetroAnno.Sejong).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Sejong[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "전라북도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Jeonbuk).length
        let m = 0;
        Object.keys(koreaMetroAnno.Jeonbuk).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Jeonbuk[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "전라남도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Jeonnam).length
        let m = 0;
        Object.keys(koreaMetroAnno.Jeonnam).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Jeonnam[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "광주광역시") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Gwangju).length
        let m = 0;
        Object.keys(koreaMetroAnno.Gwangju).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Gwangju[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
    if (req.query.location == "제주특별자치도") {
        let promises = []
        let i = Object.keys(koreaMetroAnno.Jeju).length
        let m = 0;
        Object.keys(koreaMetroAnno.Jeju).forEach(async (e) => {
            let loc = e2k[e]
            let dat = await koreaMetroAnno.Jeju[e](title, count)
            promises.push({location: loc, data: dat})
            m++;
            if( i <= m) {
                const filteredArr = promises.filter((obj) => obj.data.length > 0);
                res.json(filteredArr)
            }
        })
    }
})

app.listen(3456)
