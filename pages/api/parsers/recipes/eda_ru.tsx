import puppeteer, {Browser, Page} from "puppeteer";
import {NextApiHandler} from "next";
import {Model, Optional} from "sequelize";
import Recipe from "../_pgsql/_models/Recipe";
import Ingredient from "../_pgsql/_models/Ingredient";
import RecipeIngredient from "../_pgsql/_models/RecipeIngredient";
import RecipeStep from "../_pgsql/_models/RecipeStep";
import * as fs from "fs";

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

    const startPageNumber = parseInt(req.query['startPageNumber'] || '0');
    const pagesCount = parseInt(req.query['pagesCount'] || '0');

    logging(`from ${startPageNumber}, ${pagesCount} pages`);

//     max page 714 (11.01.2023)
    for (let pageNumber = startPageNumber; pageNumber < startPageNumber + pagesCount; pageNumber++) {
        const pageUrl = MAIN_DOMAIN + `/recepty?page=${pageNumber}`;

        logging('===================');
        logging(pageUrl);

        try {
            await page.goto(pageUrl, {waitUntil: 'domcontentloaded', timeout: 60_000});
            await page.waitForSelector('main', {timeout: 20_000});
        } catch (e: any) {
            logging('recipe list page not loaded ' + pageUrl);
            logging(e.message);

            await new Promise(r => setTimeout(r, 1_000));

            --pageNumber;
            continue;
        }

        const urls: (string | null)[] = await page.$$eval('body main a span[title]', getRecipeUrls);

        await processingUrlsFromList(browser, urls);

        await new Promise(r => setTimeout(r, 5_000));
    }

    await browser.close();

    logging('Done!');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send(null);
};

export default Handler;

// Получение списка ссылок на рецепты со страницы рецептов
const getRecipeUrls = (elements: HTMLElement[]): (string | null)[] => {
    return elements
        .filter(item => {
            const href = item?.parentElement?.getAttribute('href');

            return href?.match(/\d+/g) && href.includes('recepty') && !href.includes('ingredienty');
        })
        .map(item => item?.parentElement?.getAttribute('href') || null);
}

// Получение данных рецептов с одной страницы списка рецептов
const processingUrlsFromList = async (browser: Browser, urls: (string | null | undefined)[]) => {
    await Promise.all(
        urls.map(
            async url => url ? getRecipeDataAndSave(await browser.newPage(), url) : null
        )
    );
}

// Получение и сохранение данных одного рецепта
const getRecipeDataAndSave = async (page: Page, url: string) => {
    await new Promise(r => setTimeout(r, Math.floor((Math.random() * 5 + 1) * 1_000)));

    const pageUrl = MAIN_DOMAIN + url;

    try {
        await page.goto(pageUrl, {waitUntil: 'domcontentloaded', timeout: 60_000});
        await page.waitForSelector('main', {timeout: 20_000});
    } catch (e: any) {
        logging('page not loaded ' + pageUrl);
        logging(e.message);
        return;
    }

    const recipeName = (await page
            .$eval('span[itemprop="name"]', el => el?.textContent)
            .catch(r => logging(r.message))
        || '').replace(/[ ]/g, ' ');

    if (!recipeName) {
        logging('recipe not loaded ' + pageUrl);
        return;
    }

    const ingredients = await getIngredientsData(page);
    const steps = await getStepsData(page);

    if (ingredients.length < 1) {
        logging('recipe ingredients not loaded ' + pageUrl);
        return;
    }

    if (steps.length < 1) {
        logging('recipe steps not loaded ' + pageUrl);
        return;
    }

    await page.close();

    await saveRecipeDataToDb({
        source_url: url,
        source_id: 2,
        name: recipeName,
        ingredients: ingredients,
        steps: steps,
    });
}

// Сбор данных по ингредиентам
const getIngredientsData = async (page: Page) => {
    return page.$$eval(
        'main span[itemprop="recipeIngredient"]',
        elements => elements.map(el => {
            const name = el.textContent;

            if (name) {
                return {
                    name: name,
                    size: el?.parentNode?.parentNode?.parentNode?.lastElementChild?.textContent || null,
                }
            }
        })
    );
}

// Сбор данных по шагам рецепта
const getStepsData = async (page: Page) => {
    let steps = [];
    const elements = await page.$$('main div[itemprop="recipeInstructions"]');

    for (const element of elements) {
        const stepNumber = await element.$eval(
            'span[id]',
            el => el.getAttribute('id')?.replace('step', '')
        );
        const stepText = await element.$eval(
            'span[itemprop="text"]',
            el => el.textContent?.replace(/[ ]/g, ' ')
        );

        steps.push({
            step: stepNumber,
            text: stepText,
        });
    }

    return steps;
}

// Сохранение данных рецепта
const saveRecipeDataToDb = async (data: Optional<any, string>) => {
    await new Promise(r => setTimeout(r, Math.floor((Math.random() + 1) * 500)));

    let recipe: Model<any, any> | null = null;

    try {
        recipe = await Recipe.findOne({
            where: {
                source_url: data.source_url,
            },
        });

        if (!recipe) {
            recipe = Recipe.build(data);
            await recipe.save();

            await Promise.all([
                saveRecipeStepsToDb(recipe.id, data.steps),
                saveIngredientsToDb(recipe.id, data.ingredients)
            ]);
        }
    } catch (e: any) {
        logging('recipe error: ' + e.message);
        logging('recipe trace: ' + e.trace);
    }
}

// Сохранение ингредиентов и привязка их к рецепту
const saveIngredientsToDb = async (recipeId: number, data: Optional<any, string>[]) => {
    await new Promise(r => setTimeout(r, Math.floor((Math.random() + 1) * 500)));

    for (const ingredientData of data) {
        let ingredient: Model<any, any> | null = null;

        try {
            ingredient = await Ingredient.findOne({
                where: {
                    name: ingredientData.name,
                },
            });

            if (!ingredient) {
                ingredient = Ingredient.build({
                    name: ingredientData.name,
                });
                await ingredient.save();
            }

            let recipeIngredient = RecipeIngredient.build({
                recipe_id: recipeId,
                ingredient_id: ingredient.id,
                size_text: ingredientData.size,
            });
            await recipeIngredient.save();
        } catch (e: any) {
            logging('ingredient error: ' + e.message);
            logging('ingredient trace: ' + e.trace);
        }
    }
}

// Сохранение шагов рецепта и привязка их к рецепту
const saveRecipeStepsToDb = async (recipeId: number, data: Optional<any, string>[]) => {
    await new Promise(r => setTimeout(r, Math.floor((Math.random() + 1) * 500)));

    for (const stepData of data) {
        stepData.recipe_id = recipeId;
        stepData.step = parseInt(stepData.step);

        try {
            let step = RecipeStep.build(stepData);
            await step.save();
        } catch (e: any) {
            logging('step error: ' + e.message);
            logging('step trace: ' + e.trace);
        }
    }
}

const logging = (data: any) => {
    fs.writeFileSync(
        'public/log.log',
        `[${new Date().toJSON()}] ` + data.toString() + "\n",
        {flag: 'a+'}
    );
}
