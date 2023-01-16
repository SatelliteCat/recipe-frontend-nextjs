import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

const Recipes = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get('search');

    const [recipes, setRecipes] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch('http://127.0.0.1:3001/api/v1/recipe?search=' + search)
                .then((res) => res.json())
                .then((data) => {
                    setRecipes(data);
                })
                .catch((r) => {
                });
        };

        fetchRecipes();
    }, []);

    return (
        <>
            Hello
            <br/>
            <pre>
                {search}
            </pre>
            <br/>
            {
                recipes && recipes.map(({Id, Name, Url}) => (
                    <div key={Id}>
                        <a href={Url}>{Id} : {Name}</a>
                    </div>
                ))
            }
        </>
    );
};

export default Recipes;
