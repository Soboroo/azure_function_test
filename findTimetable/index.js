const axios = require("axios");
const convert = require("xml-js");

module.exports = async function (context, req) {
    let response = await axios.get(
        "https://api.everytime.kr/find/timetable/table/friend?identifier=" +
        req.query.identifier +
        "&friendInfo=true"
        , { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' } })

    if (req.query.format === "json") {
        const xmlToJson = convert.xml2json(response.data, { compact: true, spaces: 4 });
        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: { "Content-Type": "application/json" },
            body: xmlToJson
        };
    } else {
        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: { "Content-Type": "application/xml" },
            body: response.data
        };
    }
}