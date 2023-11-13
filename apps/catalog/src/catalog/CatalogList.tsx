/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import useMyStore, { CatalogItem } from "../store/store";
import { Button, Modal, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
// import { useEffect } from "react";
import { Link } from "react-router-dom";

export const CatalogList = () => {
    // const { catalogs } = useMyStore();
    const catalogs = useMyStore((state) => state.catalogs);
    const isLoading = useMyStore((state) => state.isLoading);
    const deleteCatalog = useMyStore((state) => state.deleteCatalog);
    const canWrite = (window as any).yayCatalogData.auth.canWrite;

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

    const columns: ColumnsType<CatalogItem> = [
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'SubTitle',
            dataIndex: 'subtitle',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            ellipsis: {
                showTitle: false,
            },
            render: (image) => (
                <Tooltip placement="topLeft" title={image}>
                    {image}
                </Tooltip>
            ),
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            render: (tags) => (
                <>
                    {tags.map((tag: any) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <>
                    {canWrite ? (
                        <Link to={`/catalog/${record.key}`}>
                            <Button type="primary" style={{ backgroundColor: "orange", borderColor: "orange" }}>
                                <EditOutlined />
                                Edit
                            </Button>
                        </Link>
                    ) : "Feel free to watch these catalogs"}

                    <span style={{ marginLeft: "8px" }}></span>

                    {canWrite && (
                        <a onClick={() => handleDeleteClick(Number(record.key))}>
                            <Button type="primary" danger>
                                <DeleteOutlined />
                                Delete
                            </Button>
                        </a>
                    )}
                </>
            ),
        },
    ];

    return (
        <div>
            <h1>Catalogs:</h1>
            {canWrite && (
                <Link to="/catalog/new">
                    <Button style={{ marginBottom: "10px" }}>
                        <PlusOutlined />
                        Add new
                    </Button>
                </Link>
            )}
            {catalogs && columns && (
                <Table dataSource={catalogs} columns={columns} bordered loading={isLoading}
                    style={{ marginRight: "10px" }} />
            )}
        </div>
    );
}

export default CatalogList;

//route Catalog: thêm antd Table, load data từ zustand