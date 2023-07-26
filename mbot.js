const count = 1;
const words = ["소상공인", "특례보증","지원금"]
const lkw = {
    "전국":[
        "서울특별시",
        "경기도",
        "인천광역시",
        "강원도",
        "경상북도",
        "경상남도",
        "부산광역시",
        "대구광역시",
        "울산광역시",
        "충청북도",
        "충청남도",
        "대전광역시",
        "세종특별자치시",
        "전라북도",
        "전라남도",
        "광주광역시",
        "제주특별자치도"
    ],
    "서울": [
        "서울특별시"
    ],
    "경기": [
        "경기도"
    ],
    "인천": [
        "인천광역시"
    ],
    "강원": [
        "강원도"
    ],
    "경상": [
        "경상남도",
        "경상북도"
    ],
    "부산": [
        "부산광역시"
    ],
    "대구": [
        "대구광역시"
    ],
    "울산": [
        "울산광역시"
    ],
    "충청": [
        "충청북도",
        "충청남도"
    ],
    "대전": [
        "대전광역시"
    ],
    "세종": [
        "세종특별자치시"
    ],
    "전라": [
        "전라남도",
        "전라북도"
    ],
    "광주": [
        "광주광엯시"
    ],
    "제주": [
        "제주특별자치도"
    ]
}


let ip = "http://34.22.72.47:3456"
const Jsoup = org.jsoup.Jsoup;

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg.startsWith("!") && msg.endsWith("지자체소식")) {
        let location = msg.replace("!","").replace("지자체소식","")
        if(detectPrefix(location)) {
            let locList = lkw[location]
            let fullText = "";
            fullText += "🔅 최신 지자체 공지 🔅"
            let KList = {}
            for (var i of locList) {
                KList[i] = {}
                for (var f of words) {
                    let data = JSON.parse(Jsoup.connect(ip+"/getAnno?location="+i+"&title="+f+"&count="+count).timeout(20000000).ignoreContentType(true).get().text());
                    for (var k of data) {
                        if(KList[i][k.location] == undefined) KList[i][k.location] = []
                        let cDump = 0
                        k.data = k.data.slice(0,count)
                        for (var j of k.data) {
                            if(cDump == count) break;
                            j.keyword = f
                            KList[i][k.location].push(j)
                            cDump++;
                        }
                    }
                }
            }
            
            for (var i of Object.keys(KList)) {
                fullText += "\n\n\n✅ "+i+" 공지"
                for (var k of Object.keys(KList[i])) {
                    let n = 1
                    for(var j of KList[i][k]) {
                        if(n == 1) fullText += "\n\n\n✅ '"+i +" "+ k +"'에 대한 공지"
                        fullText += "\n\n\n【"+n+"번】 '"+j.keyword+"' 키워드\n\n🔔 "+j.title+"\n◾"+short(j.link)+"\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯"
                        n++
                    }
                }
            }

            replier.reply(fullText)
        } else {
            replier.reply("올바른 지역명이 아닙니다.")
        }
    }
}

function detectPrefix(str) {
    for (var key in lkw) {
        if (str.startsWith(key)) {
            return key;
        }
    }
    return null;
}

//단축링크 생성 함수
function short(n) {
    let urls = "https://lov6005.mycafe24.com/short.php";
    var data = org.jsoup.Jsoup.connect(urls)
        //.header("accept", "application/json")            
        //.header("Content-Type", "application/json")
        .data({
            "urls": String(n)
        })
        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .post()
        .select("body").text()

    let data2 = JSON.parse(data)
    return data2.result.url
}
