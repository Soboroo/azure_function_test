const Table = require("../table.js");
const Ical = require("../ical.js");

module.exports = async function (context, req) {
    if (!req.query.identifier || !req.query.startDate || !req.query.endDate) {
        context.res = {
            status: 400,
            body: "Please pass a identifier, startDate, and endDate on the query string"
        };
        return;
    }
    const table = await new Table(req.query.identifier, req.query.startDate, req.query.endDate);
    const ical = new Ical(table);
    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: { "Content-Type": "text/calendar" },
        body: ical.icalFromTable()
    };
}