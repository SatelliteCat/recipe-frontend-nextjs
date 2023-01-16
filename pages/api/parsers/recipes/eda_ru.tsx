import puppeteer, {Browser, Page} from "puppeteer";
import {NextApiHandler} from "next";
import {deserialize, serialize} from "v8";
import {Sequelize} from "sequelize";
import Recipe from "../_pgsql/_models/Recipe";
import fs from "fs";

const Handler: NextApiHandler = async (req, res) => {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();
    const url: string = 'https://eda.ru';

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/108.0.0.0 ' +
        'Safari/537.36'
    );

//     max page 714 (11.01.2023)

    // for (let pageNumber = 0; pageNumber < 714; pageNumber++) {
    await page.goto(url + `/recepty?page=${714}`);
    // await page.goto(url + `/recepty?page=${pageNumber}`);
    await page.waitForSelector('main', {
        timeout: 2000
    });

    // await parseRecipeList(page);

    const urls: (string | null | undefined)[] = await page.$$eval('body main a span[title]', getRecipeUrls);

    await processUrls(await browser, urls);
    // urls.forEach(url => await getRecipeData(await browser.newPage(), url));

    // fs.writeFileSync('public/href2.json', JSON.stringify(urls));
    // fs.writeFileSync('public/href.json', JSON.stringify(urls));
    // }

    await browser.close();

    // const recipe = await Recipe.findByPk(1).catch(r => console.log(r));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send(null);
};

export default Handler;

const parseRecipeList = (page: Page) => {
    const urls = page.$$eval('body main a span[title]', getRecipeUrls);

    fs.writeFileSync('public/href2.json', JSON.stringify(urls));
}

const getRecipeUrls = (elements: HTMLElement[]) => {
    return elements
        .filter(item => {
            const href = item?.parentElement?.getAttribute('href');

            return href?.match(/\d+/g) && href.includes('recepty') && !href.includes('ingredienty');
        })
        .map(item => item?.parentElement?.getAttribute('href'));
}

const processUrls = async (browser: Browser, urls: (string | null | undefined)[]) => {
    fs.writeFileSync('public/href.json', JSON.stringify(urls));
    const domain: string = 'https://eda.ru';

    for (const url of urls) {
        url && await getRecipeData(await browser.newPage(), domain + url);
    }
}

const getRecipeData = async (page: Page, url: string) => {
    console.log(url);

    await page.goto(url);
    await page.waitForSelector('main', {timeout: 2_000}).catch(r => null);

    const title = await page
        .$eval('span[itemprop="name"]', el => el?.textContent)
        .catch(r => console.log(r));

    fs.writeFileSync('public/href2.json', JSON.stringify({
        'url': url,
        'title': title,
    }));

    await page.close();
}
