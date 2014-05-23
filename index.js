var request = require('request'),
	cheerio = require('cheerio'),
	fs = require('fs'),
	moment = require('moment');

var categories = ["動物", "FUN", "瘋啥", "搜奇", "正妹", "體育", "臉團", "娛樂", "時尚", "生活", "社會", "國際", "財經", "地產", "政治", "論壇"],
	data = [], check = [],
	appledaily,
	format = {
                "category":"",
                "news_count": 0,
                "news":[
                ]
        	},
    news =  {
                "title":"",
                "url":"",
                "time":"",
                "video": false
            };


for (var i = 0; i < categories.length; i++) {
	var f = JSON.parse(JSON.stringify(format));
	f.category = categories[i];
	data.push(f);
}

// console.log(data[0]);
// appledaily = JSON.stringify(data);
// console.log(appledaily[0]);
var flag = [];
for (var i = 0; i < 5; i++) flag.push(false);
function req(i) {
	var url = 'http://www.appledaily.com.tw/realtimenews/section/new/' + i.toString();
	request(url, function (error, response, body) {
		if (error || response.statusCode !== 200) {
	    	return;
	  	}
		$ = cheerio.load(body);
		$('.rtddt').each(function(iter, elem) {
			var n = JSON.parse(JSON.stringify(news));
			for (var j = 0; j < categories.length; j++) {
				if ($(this).find('h2').text() === categories[j]) {
					data[j].news_count++;
					n.title = $(this).find('h1').text();
					n.url = $(this).find('a').attr('href');
					n.time = $(this).find('time').text();
					n.video = $(this).hasClass('hsv');
					data[j].news.push(n);
					flag[i] = true;
					break;
				}
			}
		});
		if (check.length === 4) 
			result();
		else 
			check.push(true);
	});
}

function result(){
	var max = 0;
	for (var i = 0; i < categories.length; i++) {
		if (data[max].news_count < data[i].news_count) max = i;
	}

	console.log(moment().format('LLL') + " - 新聞數量最多的分類為為 [" + data[max].category + "] ，共有 " + data[max].news_count + " 則新聞");
	
	appledaily = JSON.stringify(data, null, "\t");
	fs.writeFileSync('appledaily.json', appledaily);
}

for (var i = 1; i <= 5; i++) {
	req(i);
}