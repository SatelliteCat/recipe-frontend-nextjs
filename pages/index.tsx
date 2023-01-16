import Head from 'next/head';
import {Inter} from '@next/font/google';
import styles from '../styles/Home.module.scss';
import {useRouter} from "next/router";
import {useEffect} from "react";

const inter = Inter({subsets: ['latin']})

const Home = () => {
    const router = useRouter();

    const handleSearch = (event: Event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        router.push({
            pathname: '/recipes',
            query: {
                search: data.get('search'),
            },
        });
    }

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
                    className={styles.search}
                    // method={'get'}
                    // action={'/recipes'}
                    onSubmit={handleSearch}
                >
                    <input
                        placeholder={'Найди, что поесть!'}
                        name={'search'}
                    />
                    <br/>
                    <div className={styles.buttons}>
                        <button>Найти</button>
                        <button>Мне повезёт!</button>
                    </div>
                </form>
                <div className={styles.favorite_recipe}>
                    <p>Популярные рецепты</p>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            hjk
                        </div>
                        <div className={styles.card}>
                            hjk ghjj hjvjhv jvtyuychvhj
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Home;
