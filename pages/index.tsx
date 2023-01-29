import Head from 'next/head';
import {Inter} from '@next/font/google';
import styles from '../styles/Home.module.scss';

const inter = Inter({subsets: ['latin']})

const Home = () => {
    return (
        <>
            <Head>
                <title>Food Load</title>
                <meta name="description" content="Recipe site"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                {/*<link rel="icon" href="/favicon.ico"/>*/}
            </Head>
            <h1>Hello</h1>
            <main className={styles.main}>
                <form
                    className={styles.search}
                    method={'get'}
                    action={'/recipes'}
                    // onSubmit={handleSearch}
                >
                    <input
                        placeholder='Найди, что поесть!'
                        name='search'
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
