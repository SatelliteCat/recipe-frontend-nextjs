import MainLayout from "../../components/MainLayout";
import styles from "../../styles/MainLayout.module.scss"
import {GetStaticProps, InferGetStaticPropsType} from "next";
import Link from "next/link";

type Ingredient = {
    id: number,
    name: string,
    uuid: string,
};

export const getStaticPaths = async () => {
    const url = 'http://localhost:3000/api/v1/ingredients';

    const response = await fetch(url);
    const data = await response.json();

    const paths = data.map(({uuid}: Ingredient) => ({
        params: {
            uuid: uuid.toString()
        }
    }));

    return {
        paths,
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps<{ ingredient: Ingredient }> = async (context) => {
    const uuid = context.params?.uuid;
    const url = new URL(`/api/v1/ingredients/${uuid}`, process.env.NEXT_PUBLIC_API_HOST);

    const response = await fetch(url);
    const ingredient = await response.json();

    if (!ingredient) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            ingredient
        }
    };
}

const Recipe = ({ingredient}: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <MainLayout>
            <Link href='/'>
                <h1>Home</h1>
            </Link>
            <br/>
            <h1 className={styles.h1_layout}>{ingredient?.name}</h1>
            <br/>
            <p>
                {ingredient?.id} {ingredient?.name} {ingredient?.uuid}
            </p>
        </MainLayout>
    );
};

export default Recipe;
