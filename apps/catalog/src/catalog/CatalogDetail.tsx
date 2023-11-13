import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CatalogInput from "./CatalogInput";
import CatalogApis from "../api/catalogApis";
import useMyStore from "../store/store";
import { Alert } from "antd";
import { HTTPError } from "ky";
function CatalogDetail() {
    const { id } = useParams();
    const initialState = {
        title: "",
        subtitle: "",
        image: "",
        tag: [] as string[],
    };
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const isLoading = useMyStore((state) => state.isLoading);
    const setIsLoading = useMyStore((state) => state.setIsLoading);
    const editCatalog = useMyStore((state) => state.editCatalog);

    //Get Post with id
    useEffect(() => {
        const fetchOnePost = async () => {
            setIsLoading(true);
            try {
                const catalog = await CatalogApis.getOne(Number(id));
                setFormData(catalog);
            } catch (error: unknown) {
                if (error instanceof HTTPError) {
                    const res = await error.response.json();
                    setError(res.data)
                } else if (typeof error === 'string') {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    setError(error)
                } else {
                    setError('Unknown error')
                }
            }
            setIsLoading(false);
        }
        fetchOnePost();
    }, [id, setIsLoading]);

    const handleChange = (value: string | string[], fieldName: string) => {
        if (fieldName === "tag") {
            if (Array.isArray(value)) {
                setFormData({ ...formData, [fieldName]: value });
            } else {
                setFormData({ ...formData, [fieldName]: [value] });
            }
        } else {
            setFormData({ ...formData, [fieldName]: value });
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            editCatalog(Number(id), formData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
        }
    }

    if (error) {
        return <Alert message={error} type="error" />;
    }

    return (
        <>
            {formData && (
                <CatalogInput formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isLoading={isLoading} id={id} />
            )}
        </>
    );
}

export default CatalogDetail;
