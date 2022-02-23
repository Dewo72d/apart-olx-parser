/**
 *
 * @param {Array} frashArr [{}]
 * @param {Array} compareArr [{}]
 * @returns {Array} [{}]
 */
function difference(frashArr, compareArr) {
	try {        
		const result = frashArr.filter((elF) => {
			return compareArr.every((elC) => {
				return elF.id !== elC.id;
			});
		});
		return result;
	} catch (error) {
		console.log(error);
		process.exit();
	}
}

module.exports.difference = difference;
