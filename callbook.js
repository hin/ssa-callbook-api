var request = require('request');
var cheerio = require('cheerio');
var querystring = require('querystring');

var exports = module.exports = {}

exports.lookup = function (query, result_handler) {
    var url = 'http://www.ssa.se/smcb/index.php'

    for(key in query) {
        url += '?' + key + '=' + querystring.escape(query[key]);
    }

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var specialcalls = [];
            var maincalls = [];

            /* Extract a list of matching calls */
            $('.result_box p').each(function() {
                switch ($(this).children().first().text()) {
                case 'Specialsignaler':
                    $(this).next().find('tr').each(function() {
                        info = [];
                        info.push($(this).attr('href'));
                        $(this).find('td').each(function() {
                            info.push($(this).text());
                        });
                        specialcalls.push(info);
                    });
                    break;
                case 'Huvudsignaler':
                    $(this).next().find('tr').each(function() {
                        info = [];
                        info.push($(this).attr('href'));
                        $(this).find('td').each(function() {
                            info.push($(this).text());
                        });
                        maincalls.push(info);
                    });
                    break;
                case 'Tips:':
                case 'Nytt:':
                case 'Fritidsadresser:':
                case 'Medlem (inloggning)':
                    /* ignore */
                    break;
                default:
                    console.log('Unknown data: ' + $(this).children().first().text());
                    break;
                }
            });

            /* Extract information about a main call */
            var calldata = {};
            if (specialcalls.length == 0 & maincalls == 0) {
                $('.result_box').each(function(index, element) {
                    calldata['maincall'] = $('strong').first().text();
                    calldata['member'] = $('span').first().text();
                    calldata['name'] = $(this).contents()[6].data.replace(/^\n/g, '');
                    calldata['addr1'] = $(this).contents()[8].data.replace(/^\n/g, '');
                    calldata['addr2'] = $(this).contents()[10].data.replace(/^\n/g, '');
                });
            }

            result = {
                maincalls: maincalls,
                specialcalls: specialcalls,
                calldata, calldata
            }
            result_handler(result);
        }
    });
}
