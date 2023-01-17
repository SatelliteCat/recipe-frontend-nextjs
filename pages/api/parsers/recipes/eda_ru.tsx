import puppeteer, {Browser, Page} from "puppeteer";
import {NextApiHandler} from "next";
import {Model, Optional} from "sequelize";
import Recipe from "../_pgsql/_models/Recipe";

const MAIN_DOMAIN: string = 'https://eda.ru';

const Handler: NextApiHandler = async (req, res) => {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/108.0.0.0 ' +
        'Safari/537.36'
    );

//     max page 714 (11.01.2023)
    for (let pageNumber = 0; pageNumber < 3; pageNumber++) {
        const pageUrl = MAIN_DOMAIN + `/recepty?page=${pageNumber + 1}`;
        // const pageUrl = MAIN_DOMAIN + `/recepty?page=${714}`;

        console.log(pageUrl);

        await page.goto(pageUrl, {timeout: 5000}).catch(r => console.log(r));
        await page.waitForSelector('main', {timeout: 2000}).catch(r => console.log(r));

        const urls: (string | null | undefined)[] = await page.$$eval('body main a span[title]', getRecipeUrls);

        await processingUrlsFromList(browser, urls);

        await new Promise(r => setTimeout(r, 2000));
    }

    await browser.close();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send(null);
};

export default Handler;

// Получение списка ссылок на рецепты со страницы рецептов
const getRecipeUrls = (elements: HTMLElement[]) => {
    return elements
        .filter(item => {
            const href = item?.parentElement?.getAttribute('href');

            return href?.match(/\d+/g) && href.includes('recepty') && !href.includes('ingredienty');
        })
        .map(item => item?.parentElement?.getAttribute('href'));
}

// Получение данных рецептов с одной страницы списка рецептов
const processingUrlsFromList = async (browser: Browser, urls: (string | null | undefined)[]) => {
    await Promise.all(
        urls.map(
            async url => getRecipeDataAndSave(await browser.newPage(), url || '')
        )
    );
}

// Получение и сохранение данных одного рецепта
const getRecipeDataAndSave = async (page: Page, url: string) => {
    const pageUrl = MAIN_DOMAIN + url;

    await page.goto(pageUrl, {timeout: 5_000}).catch(r => console.log(r));
    await page.waitForSelector('main', {timeout: 2_000}).catch(r => console.log(r));

    const title = await page
        .$eval('span[itemprop="name"]', el => el?.textContent)
        .catch(r => console.log(r));

    await saveRecipeDataToDb({
        source_url: url,
        source_id: 2,
        name: (await page
                .$eval('span[itemprop="name"]', el => el?.textContent)
                .catch(r => console.log(r))
            || '').replace(/[ ]/g, ' '),
    });

    await page.close();
}

// Сохранение данных рецепта
const saveRecipeDataToDb = async (data: Optional<any, string>) => {
    let recipe: Model<any, any> | null = null;

    try {
        recipe = await Recipe.findOne({
            where: {
                source_url: data.source_url,
            },
        });
    } catch (e: any) {
        console.log(e.message);
    }

    if (recipe) {
        return;
    }

    recipe = Recipe.build(data);
    await recipe.save();
}
