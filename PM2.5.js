var request = require('sync-request')
var cheerio = require('cheerio')

// ES6 定义一个类
class City {
    constructor() {
        this.concentration = ''
        this.city = ''
        this.state = ''
        this.ranking = 0
    }
}

var cityStore = []

var log = function() {
    console.log.apply(console, arguments)
}

var cityFromDiv = function(div) {
    var e = cheerio.load(div)

    // 创建一个电影类的实例并且获取数据
    // 这些数据都是从 html 结构里面人工分析出来的
    // this.concentration = ''
    // this.city = ''
    // this.state = ''
    // this.ranking = 0
    var city = new City()
    city.concentration = e('.pjadt_pm25').text()
    city.city = e('.pjadt_sheng').text() + '-' + e('.pjadt_location').text()
    city.state = e('.pjadt_quality').find('em').text()
    city.ranking = e('.pjadt_ranknum').text()
    return city
}

var cityFromUrl = function(url) {
    // 用 GET 方法获取 url 链接的内容
    // 相当于你在浏览器地址栏输入 url 按回车后得到的 HTML 内容
    var r = request('GET', url)
    // utf-8 是网页文件的文本编码
    var body = r.getBody('utf-8')
    // cheerio.load 用来把 HTML 文本解析为一个可以操作的 DOM
    var e = cheerio.load(body)
    //
    // 一共有 25 个 .item
    var cityDivs = e('.pj_area_data_details.rrank_box').find('li')
    // 循环处理 25 个 .item
    var citys = []
    for (var i = 0; i < cityDivs.length; i++) {
        var div = cityDivs[i]
        // 获取到 div 的 html 内容
        // 然后扔给 cityFromDiv 函数来获取到一个 city 对象
        var d = e(div).html()
        var m = cityFromDiv(d)
        citys.push(m)
        cityStore.push(m)
    }
    return citys
}

var savecity = function(citys) {
    var s = 'var cityStore = ' + JSON.stringify(citys, null, 2)
    // 把 json 格式字符串写入到 文件 中
    var fs = require('fs')
    var path = 'PM2.5.json'
    fs.writeFileSync(path, s)
}

var __main = function() {
    // 主函数
    var url = 'http://www.pm25.com/rank.html'
    var citys = cityFromUrl(url)
    savecity(citys)
}


__main()
