    var jsdom = require("jsdom");
    var fs = require("fs");
    var url = require("url");
    var qs = require("querystring");

    var file = __dirname + "/list.json";
    var list = [];

    try {
        list = JSON.parse(fs.readFileSync(file, {
            encoding: "utf8"
        }));
        console.log("File has been read");
    } catch (e) {
        console.log("Can't read file or file doesn't exist. New file will be created.");
    }

    var update = function () {
        jsdom.env({
            url: "http://dota2lounge.com/",
            scripts: ["http://code.jquery.com/jquery-2.1.0.min.js"],
            done: function (errors, window) {
                if (errors) {
                    console.log("Connection error.");
                    return;
                }
                var $ = window.$;
                var matches = $(".match.notaviable");
                matches.each(function (i, obj) {
                    var temp = $(obj).children().children().eq(0);
                    var matchID = qs.parse(url.parse(temp.attr("href")).query)["m"];
                    if (list.some(function (element) {
                        return (element.matchID == matchID);
                    }))
                        return;
                    temp = temp.children();
                    var winner, looser;
                    if (temp.eq(0).children().eq(0).children().eq(0).length != 0) {
                        winner = {
                            name: temp.eq(0).children().eq(1).find("b").eq(0).text(),
                            percent: temp.eq(0).children().eq(1).find("i").eq(0).text()
                        }
                        looser = {
                            name: temp.eq(2).children().eq(1).find("b").eq(0).text(),
                            percent: temp.eq(2).children().eq(1).find("i").eq(0).text()
                        }
                    } else if (temp.eq(2).children().eq(0).children().eq(0).length != 0) {
                        winner = {
                            name: temp.eq(2).children().eq(1).find("b").eq(0).text(),
                            percent: temp.eq(2).children().eq(1).find("i").eq(0).text()
                        }
                        looser = {
                            name: temp.eq(0).children().eq(1).find("b").eq(0).text(),
                            percent: temp.eq(0).children().eq(1).find("i").eq(0).text()
                        }
                    } else
                        return;
                    winner.percent = winner.percent.substring(0, winner.percent.length - 1);
                    looser.percent = looser.percent.substring(0, looser.percent.length - 1);
                    list.push({
                        matchID: matchID,
                        winner: winner,
                        looser: looser
                    });
                });
                fs.writeFile(file, JSON.stringify(list), function (err) {
                    if (err)
                        console.log("Can't write file.");
                    else
                        console.log("File has been written.")
                });
            }
        });
    }
    update();
    setInterval(update, 1000 * 60 * 30);