import MainLayout from "../../components/MainLayout";
import styles from "../../styles/MainLayout.module.scss"
import {GetStaticProps, InferGetStaticPropsType} from "next";
import Link from "next/link";

type Recipe = {
    id: number,
    name: string,
    uuid: string,
    ingredients: [],
    recipeIngredients: RecipeIngredient[],
    steps: [],
};

type RecipeIngredient = {
    ingredient_id: number,
    size_text: string,
};

export const getStaticPaths = async () => {
    const url = new URL('/api/v1/recipes', process.env.NEXT_PUBLIC_API_HOST);

    const response = await fetch(url);
    const data = await response.json();

    const paths = data.map(({uuid}: Recipe) => ({
        params: {
            uuid: uuid.toString()
        }
    }));

    return {
        paths,
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps<{ recipe: Recipe }> = async (context) => {
    const uuid = context.params?.uuid;
    const url = new URL(`/api/v1/recipes/${uuid}`, process.env.NEXT_PUBLIC_API_HOST);

    const response = await fetch(url);
    const recipe = await response.json();

    if (!recipe) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            recipe
        }
    };
}

const Recipe = ({recipe}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const ingredientSizes: { [ingredient_id: number]: { ingredient_id: number, size_text: string } } = recipe?.recipeIngredients
        && recipe?.recipeIngredients.reduce((a, v) => ({...a, [v?.ingredient_id]: v}), {});

    return (
        <MainLayout>
            <Link href='/'>
                <h1>Home</h1>
            </Link>
            <br/>
            <h1 className={styles.h1_layout}>{recipe?.name}</h1>
            <br/>
            <h2>Ingredients</h2>
            <ul>
                {
                    recipe?.ingredients && recipe.ingredients.map(({id, name, uuid}) => (
                        <li key={id}>
                            <Link href={`/ingredients/${uuid}`}>{name}</Link>
                            {ingredientSizes[id] && `, ${ingredientSizes[id]?.size_text}`}
                        </li>
                    ))
                }
            </ul>
            <br/>
            <h2>Instructions</h2>
            <ul>
                {
                    recipe?.steps && recipe.steps.map(({step, text}) => (
                        <li key={step}>
                            {step}: {text}
                        </li>
                    ))
                }
            </ul>
        </MainLayout>
    );
};

export default Recipe;
