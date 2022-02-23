async function abortTrash(page, id) {
	try {
		await page.setRequestInterception(true);
		await page.on("request", (request) => {
			if (
				request.resourceType() === "image" ||
				request.resourceType() === "script" ||
				request.resourceType() === "xhr" ||
				request.resourceType() === "stylesheet"
			) {
				typeof id !== "undefined"
					? console.log("abortTrash " + id)
					: null;
				request.abort();
			} else request.continue(); // эта строка обьязательна
		});
	} catch (error) {
		console.log("abortTrash>>>" + error);
        	process.exit();
	}
}
module.exports.abortTrash = abortTrash;
