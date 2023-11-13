import { useState } from "react";
import CatalogInput from "./CatalogInput";
import useMyStore from "../store/store";

function CatalogNew() {
    const initialState = {
        title: "",
        subtitle: "",
        image: "",
        tag: [] as string[],
    };

    const [formData, setFormData] = useState(initialState);
    const isLoading = useMyStore((state) => state.isLoading);
    const addCatalog = useMyStore((state) => state.addCatalog);

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
            addCatalog(formData);
            setFormData(initialState);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
        }
    }

    return (
        <>
            <CatalogInput formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isLoading={isLoading} id={undefined} />
        </>
    );
}

export default CatalogNew;
