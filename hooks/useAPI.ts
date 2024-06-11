import React, {useEffect} from "react";

const useAPI = () => {

    const [characters, setCharacters] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const res = await fetch(`https://rickandmortyapi.com/api/character`);

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();

                setCharacters(data.results);
            } catch (error) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }


        fetchData();

        return () => {

        }
    }, [])

    return { characters, loading, error}
}


export default useAPI;