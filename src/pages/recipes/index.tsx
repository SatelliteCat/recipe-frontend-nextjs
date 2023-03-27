import Link from "next/link";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";

export const getServerSideProps: GetServerSideProps<{ recipes: [] }> = async (context) => {
    const url = new URL('/api/v1/recipes', process.env.NEXT_PUBLIC_API_HOST);
    const search = context.query?.search || '';
    let recipes: [] = [];

    if (search && typeof search === "string") {
        url.searchParams.append('search', search);
    }

    try {
        const response = await fetch(url);
        recipes = await response.json();
    } catch (e) {
    }

    return {
        props: {
            recipes
        }
    }
}

const Recipes = ({recipes}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <Link href='/'>
                <h1>Home</h1>
            </Link>
            <br/>
            <h1>Recipes</h1>
            <br/>
            <br/>
            {
                recipes && Array.isArray(recipes) && recipes.map(({id, name, uuid}) => (
                    <div key={id}>
                        <Link href={`recipes/${uuid}`}>
                            {id} : {name}
                        </Link>
                    </div>
                ))
            }
        </>
    );
};

export default Recipes;
