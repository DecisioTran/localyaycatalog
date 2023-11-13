import { DeleteOutlined, RollbackOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import useMyStore, { CatalogItem } from "../store/store";
import { Link } from "react-router-dom";

interface CatalogInputProps {
    formData: Omit<CatalogItem, "key">;
    // handleChange: (
    //     e: ChangeEvent<HTMLInputElement>,
    //     fieldName: string
    // ) => void;
    handleChange: (value: string | string[], fieldName: string) => void,
    handleSubmit: (e: {
        preventDefault: () => void;
    }) => void,
    isLoading: boolean,
    id: string | undefined;
}

function CatalogInput({ formData, handleChange, handleSubmit, isLoading, id }: CatalogInputProps) {
    const [form] = Form.useForm();
    const deleteCatalog = useMyStore((state) => state.deleteCatalog);

    useEffect(() => {
        form.setFieldsValue(formData)
    }, [form, formData])

    const handleDeleteClick = (id: number) => {
        Modal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                deleteCatalog(Number(id));
            },
            onCancel: () => {
                // Do nothing if user cancels the deletion
            },
        });

    };

    const SubmitButton = ({ form }: { form: FormInstance }) => {
        const [submittable, setSubmittable] = useState(false);

        // Watch all values
        const values = Form.useWatch([], form);

        useEffect(() => {
            form.validateFields({ validateOnly: true }).then(
                () => {
                    setSubmittable(true);
                },
                () => {
                    setSubmittable(false);
                },
            );
        }, [form, values]);

        return (
            <Button
                type="primary"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isLoading || !submittable}
                style={{ marginTop: "10px", marginLeft: "5px", minWidth: "120px" }}
            >
                <SaveOutlined />
                Save
            </Button>
        );
    };

    return (
        <Form
            form={form}
            name="basic"
            wrapperCol={{ span: 16 }}
            layout="vertical"
            style={{ marginTop: "10px", maxWidth: "600px" }}
            initialValues={formData}
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please input your title catalog!' }]}
            >
                <Input
                    placeholder="Title Catalog"
                    prefix={<UserOutlined />}
                    value={formData.title}
                    onChange={(e) => handleChange(e.target.value, "title")}
                    disabled={isLoading}
                />
            </Form.Item>
            <Form.Item
                label="Subtitle"
                name="subtitle"
                rules={[{ required: true, message: 'Please input your subtitle catalog!' }]}
            >
                <Input
                    placeholder="Subtitle Catalog"
                    prefix={<UserOutlined />}
                    value={formData.subtitle}
                    onChange={(e) => handleChange(e.target.value, "subtitle")}
                    disabled={isLoading}
                />
            </Form.Item>
            <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Please input your image catalog!' }]}
            >
                <Input
                    placeholder="Image Catalog"
                    prefix={<UserOutlined />}
                    value={formData.image}
                    onChange={(e) => handleChange(e.target.value, "image")}
                    disabled={isLoading}

                />
            </Form.Item>
            <Form.Item
                label="Tag"
                name="tag"
                rules={[{ required: true, message: 'Please input your tag catalog!' }]}
            >
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Tags Catalog"
                    value={formData.tag}
                    disabled={isLoading}
                    onChange={(value) => handleChange(value, "tag")}
                />
            </Form.Item>

            <Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button style={{ backgroundColor: "green", borderColor: "green", color: "white", marginTop: "10px" }}>
                        <RollbackOutlined style={{ marginRight: "5px" }} />
                        <Link to="/">Back</Link>
                    </Button>
                    <div >
                        {id ? (
                            <a onClick={() => handleDeleteClick(Number(id))}>
                                <Button type="primary" danger style={{ minWidth: "120px" }}>
                                    <DeleteOutlined />
                                    Delete
                                </Button>
                            </a>
                        ) : null}
                        <SubmitButton form={form} />
                    </div>
                </div>
            </Form.Item>
        </Form>
    )
}

export default CatalogInput;