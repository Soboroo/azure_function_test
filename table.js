const axios = require("axios");
const convert = require("xml-js");

class Table {
	constructor(tableId, startDate, endDate) {
		return (async () => {
			let requestURL =
				"https://api.everytime.kr/find/timetable/table/friend?identifier=" + tableId;

			let response = await axios.get(
				requestURL
				, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' } })
			let rawText = response.data;
			
			let xmlToJson = convert.xml2json(rawText, { compact: true, spaces: 4 });
			let parsedJson = JSON.parse(xmlToJson).response.table;
			this.year = parsedJson._attributes.year;
			this.semester = parsedJson._attributes.semester;
			this.startDate = startDate;
			this.endDate = endDate;

			this.items = [];
			const events = parsedJson.subject;
			for (let event of events) {
				let times = event.time.data;
				if (times[0] == undefined)
					times = [times];
				for (let time of times) {
					this.items.push({
						title: event.name._attributes.value,
						credit: event.credit._attributes.value,
						day: time._attributes.day,
						start: time._attributes.starttime,
						end: time._attributes.endtime,
						location: time._attributes.place,
					});
				}
			}

			return this;
		})();
	}
};

module.exports = Table