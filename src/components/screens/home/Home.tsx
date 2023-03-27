import Head from "next/head";
import styles from "@/components/screens/home/Home.module.scss";
import {FC} from "react";

type Recipe = {
    id: number;
    name: string;
    uuid: string;
}

const Home: FC<any> = ({recipes}) => (
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
            <div className={styles.favorite_recipe}>
                <p>Популярные рецепты</p>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        hjk
                    </div>
                    <div className={styles.card}>
                        hjk ghjj hjvjhv jvtyuychvhj
                    </div>
                    {recipes && recipes.map((recipe: Recipe) => {
                        return (
                            <>
                                <h2>{recipe.name}</h2>
                                <h2>{recipe.uuid}</h2>
                            </>
                        );
                    })}
                </div>
            </div>
        </main>
    </>
);

export default Home;
