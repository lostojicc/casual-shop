import { useEffect, useState } from "react";
import { getAllCategories } from "../api/categories";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getAllCategories()
        .then(data => {
            if (isMounted) setCategories(data);
        })
        .catch(err => {
            if (isMounted) setError(err);
        })
        .finally(() => {
            if (isMounted) setLoading(false);
        });
        return () => { isMounted = false; };
    }, []);

    return { categories, loading, error };
};