//parser
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
//lib
const { abortTrash } = require("./lib/abortTrash");
const { setValues } = require("./lib/setValues");
const { difference } = require("./lib/difference");
const { parsDevider } = require("./lib/parsDevider");
const fs = require("fs");
//tg
const TelegramBot = require("node-telegram-bot-api");
const token = "123token:123token";
const users = [000000000]; 
const bot = new TelegramBot(token, { polling: true });

try {
	const compare = require("./compare.json");
	const userAgent =
		"Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Mobile Safari/537.36";
	const link =
		"https://www.olx.ua/nedvizhimost/kvartiry/dolgosrochnaya-arenda-kvartir/lutsk/?search%5Bfilter_float_price%3Ato%5D=5000";

	const mobileConfig = {
		width: Math.floor(Math.random() * (500 - 200) + 200),
		height: Math.floor(Math.random() * (800 - 500) + 800),
		deviceScaleFactor: 2.6,
		hasTouch: true,
		isMobile: true,
		isLandscape: false,
	};

	let search = async () => {
		try {
			puppeteer.use(pluginStealth());
			const browser = await puppeteer.launch({
				headless: true,
				args: ["--no-sandbox"],
			});
			const page = await browser.newPage();

			//-*-*-*Configs-*-*-
			await page.setUserAgent(userAgent);
			await page.setViewport(mobileConfig);
			await abortTrash(page);
			//-*-*-*-*-*-*-*-*-*

			await page.goto(link, { waitUntil: "networkidle0", timeout: 0 });

			try {
				/** @returns number */
				const amountPages = async () => {
					try {
						const list = await page.$$eval(
							"div > ul > li.pagination-item",
							(list) => list.map((el) => el.ariaLabel)
						);

						return +list[list.length - 1].replace(/[^0-9]/g, "");
					} catch (error) {
						console.log("ERROR>>> " + error);
						process.exit();
					}
				};
				/*-*-*-*-*Get links on apart-*-*/
				async function getAllLinks() {
					let result = [];
					for (let i = 0; i <= (await amountPages()); i++) {
						const paginationPage = await browser.newPage();
						await abortTrash(paginationPage);
						await paginationPage.goto(link + `&page=${i}`, {
							waitUntil: "networkidle2",
							timeout: 0,
						});
						await paginationPage.setViewport(mobileConfig);
						console.log("close");

						//data-id is id of apart,
						const links = await paginationPage.$$eval(
							"#offers_table [data-id] div > h3 > a",
							(item) => item.map((i) => i.href)
						);
						const info = await paginationPage.$$eval(
							"#offers_table [data-id]",
							(item) =>
								item.map((data) => {
									return {
										id: data.dataset.id,
										desc: data.innerText,
									};
								})
						);

						result = [
							...result,
							...(await setValues(await info, await links)),
						];

						await paginationPage.close();
					}
					return result;
				}
				//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

				//Check & and set
				const result = await getAllLinks();
				if (compare.length === 0) {
					console.log("write");
					fs.writeFileSync("./compare.json", JSON.stringify(result));
				}

				const dataToSend = parsDevider(difference(result, compare));

				//console.log("DIF " + difference(result, compare)[0][1]);

				for (let i = 0; i < dataToSend.length; i++) {
					for (let ii = 0; ii < users.length; ii++) {
						await bot.sendMessage(users[ii], dataToSend[i], {
							disable_web_page_preview: false,
						});
					}
				}

				fs.writeFileSync("./compare.json", JSON.stringify(result));
				console.log("send");
				process.exit(0);
			} catch (error) {
				console.log(error);
				process.exit(1);
			}
		} catch (error) {
			console.log("ERROR>>> " + error);
			process.exit(1);
		}
		return;
	};

	search();

	/* setTimeout(function () {
	process.exit();
}, 45000); */
} catch (error) {
	console.log(error);
	fs.writeFileSync("./compare.json", "[]");
	process.exit();
}
