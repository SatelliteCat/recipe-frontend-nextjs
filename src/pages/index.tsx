import {Inter} from '@next/font/google';
import {GetStaticProps, InferGetServerSidePropsType} from "next";
import {useEffect, useState} from "react";
import Head from "next/head";
import styles from "@/components/screens/home/Home.module.scss";
import Link from "next/link";

const inter = Inter({subsets: ['latin']})

type Recipe = {
    id: number;
    name: string;
    uuid: string;
}

const HomePage = ({recipes}: InferGetServerSidePropsType<typeof getStaticProps>) => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadedRecipes, setLoadedRecipes] = useState(recipes);

    const loadMore = async () => {
        if (!hasMore || loading) {
            return;
        }

        setLoading(true);

        let data = [];

        try {
            const url = new URL('/api/v1/recipes', process.env.NEXT_PUBLIC_API_HOST);
            url.searchParams.append('page', String(page + 1));

            console.log(url)

            const response = await fetch(url);
            data = await response.json();
        } catch (e) {
            console.error('Network error');
        }

        setLoadedRecipes([...(loadedRecipes || []), ...data]);
        setPage(page + 1);
        setLoading(false);
        setHasMore(data.length > 0);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = (document.documentElement && document.documentElement.scrollTop)
                || document.body.scrollTop;
            const scrollHeight = (document.documentElement && document.documentElement.scrollHeight)
                || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

            if (scrolledToBottom) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, loading, page]);

    return (
        <>
            <Head>
                <title>Food Load</title>
                <meta name="description" content="Recipe site"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                {/*<link rel="icon" href="/favicon.ico"/>*/}
            </Head>
            <main className={styles.main}>
                <form
                    className={`${styles.search} row g-4`}
                    method={'get'}
                    action={'/recipes'}
                    // onSubmit={handleSearch}
                >
                    <div className="col-6">
                        <input
                            className='form-control'
                            placeholder='Найди, что поесть!'
                            name='search'
                        />
                    </div>
                    <div className="col-2">
                        <button className='btn btn-primary mb-3' type='submit'>Найти</button>
                    </div>
                    <div className="col-4">
                        <button className='btn btn-primary mb-3' type='submit'>Мне повезёт!</button>
                    </div>
                </form>

                {loadedRecipes && loadedRecipes.map((recipe: Recipe) => {
                    return (
                        <Link href={`recipes/${recipe.uuid}`} key={recipe.id}>
                            <div className='card'>
                                <div className='card-body'>
                                    <h2 className='card-title'>{recipe.name}</h2>
                                    <p className='card-text'>sdjhfwoen</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </main>
        </>
    );
};

export const getStaticProps: GetStaticProps<{ recipes: Recipe[] }> = async () => {
    const url = new URL('/api/v1/recipes', process.env.NEXT_PUBLIC_API_HOST);

    let recipes = [];

    try {
        const res = await fetch(url);
        recipes = await res.json();
    } catch (e) {
        console.error('Network error');
    }

    return {
        props: {
            recipes,
        },
        revalidate: 2 * 60,
    };
};

export default HomePage;
