class Ical {
	constructor(table) {
		this.table = table;
	}
	createIcalURL() {
		const icalText = this.icalFromTable();
		var blob = new Blob([icalText], {
			type: "text/calendar;charset=utf-8",
		});
		var url = URL.createObjectURL(blob);
		return url;
	}
	icalFromTable() {
		let icalText =
			"BEGIN:VCALENDAR\r\n" +
			"VERSION:2.0\r\n" +
			"PRODID:-//everyTable//everytime timetable maker//KO\r\n";

		const day = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
		let until = new Date(this.table.endDate);
		until.setDate(until.getDate() + 1);
		const untilString = this.getDateString(until, 0, 3);
		for (let item of this.table.items) {
			let start = new Date(this.table.startDate);
			start.setDate(start.getDate() + ((item.day - start.getDay() + 8) % 7));
			const startString = this.getDateString(start, 0, 3);

			let event = "BEGIN:VEVENT\r\n";
			event += "SUMMARY:" + item.title + "\r\n";
			event += "DTSTART:" + startString + "T" + this.timecodeToString(item.start) + "\r\n";
			event += "DTEND:" + startString + "T" + this.timecodeToString(item.end) + "\r\n";
			event += "RRULE:FREQ=WEEKLY;BYDAY=" + day[item.day] + ";UNTIL=" + untilString + "T000000\r\n";
			event += "LOCATION:" + item.location + "\r\n";
			event += "UID:" + this.getUUID() + "\r\n";
			event += "DTSTAMP:" + this.getDateString(new Date(), 0, 3) + "T" + this.getDateString(new Date(), 3, 6) + "\r\n";
			event += "END:VEVENT\r\n";

			icalText += event;
		}
		icalText += "END:VCALENDAR";
		//console.log(icalText);

		return icalText;
	}

	timecodeToString(timecode) {
		let hour = Math.floor(timecode / 12).toString();
		let minute = ((timecode % 12) * 5).toString();

		if (hour.length == 1) {
			hour = "0" + hour;
		}
		if (minute.length == 1) {
			minute = "0" + minute;
		}
		return hour + minute + "00";
	}

	getUUID() {
		// UUID v4 generator in JavaScript (RFC4122 compliant)
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c) {
				var r = (Math.random() * 16) | 0,
					v = c == "x" ? r : (r & 3) | 8;
				return v.toString(16);
			}
		);
	}
	// 출처: https://goni9071.tistory.com/209 [고니의꿈]

	getDateString(time, start, end) {
		let format = [];

		format.push(time.getFullYear());
		format.push(("0" + (time.getMonth() + 1)).slice(-2));
		format.push(("0" + time.getDate()).slice(-2));
		format.push(("0" + time.getHours()).slice(-2));
		format.push(("0" + time.getMinutes()).slice(-2));
		format.push(("0" + time.getSeconds()).slice(-2));

		return format.slice(start, end).join("");
	}
}

module.exports = Ical;