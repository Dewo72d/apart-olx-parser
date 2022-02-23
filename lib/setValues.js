/**
 *  @param arrOfObj Array of objects [{}]
 *  @param values   Array of string [""]
 */

function setValues(arrOfObj, values) {
	try {
		if (arrOfObj.length !== values.length) {
			console.log("ERROR>>> length  { Info } and { links } not equal");
		}

		for (let i = 0; i < arrOfObj.length; i++) {
			arrOfObj[i].link = values[i];
		}

		return arrOfObj;
	} catch (error) {
		console.log("ERROR>>> " + error);
        process.exit();
	}
}

module.exports.setValues = setValues;
