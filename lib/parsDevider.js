/**
 * @param {Array} data [{}]
 * @returns {Array} [{}]
 */

const compare = require("../compare.json");
function parsDevider(data) {
	try {
		let size = 10;
		let chanks = [];

		// [ [{}], [{}] ]
		for (let i = 0; i < Math.ceil(data.length / size); i++) {
			chanks.push(compare.slice(i * size, i * size + size));
		}
		//[ ["",""], ["", ""] ]
		const rawData = chanks.map((chank) => {
			return chank.map(
				(element) =>
					`${element.desc.replaceAll("\n", "")}\n ${element.link.replaceAll("\n", "")}\n \t\n___________________________\n\n`
			);
		});

		const result = rawData.map((el) => el.join().replaceAll(",", "")); // Я хз откуда ","

		//console.log(result);
		return  result;
	} catch (error) {
		console.log(error);
		process.exit();
	}
}
//parsDevider(compare);

module.exports.parsDevider = parsDevider;
