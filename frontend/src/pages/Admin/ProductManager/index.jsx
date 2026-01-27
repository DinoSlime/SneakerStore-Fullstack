import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Form, Input, InputNumber, Select, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    // MỚI: Biến này để lưu sản phẩm đang được sửa (Nếu null nghĩa là đang thêm mới)
    const [editingProduct, setEditingProduct] = useState(null); 
    
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productRes, categoryRes] = await Promise.all([
                productService.getAll({ page: 0, limit: 100 }),
                categoryService.getAll()
            ]);
            setProducts(productRes.data.content || productRes.data || []);
            setCategories(categoryRes.data.content || categoryRes.data || []);
        } catch (error) {
            message.error('Lỗi tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- LOGIC XỬ LÝ FORM (DÙNG CHUNG CHO CẢ THÊM VÀ SỬA) ---
    const handleSubmit = async (values) => {
        try {
            if (editingProduct) {
                // TRƯỜNG HỢP SỬA: Gọi API update
                await productService.update(editingProduct.id, values);
                message.success('Cập nhật thành công!');
            } else {
                // TRƯỜNG HỢP THÊM: Gọi API create
                await productService.create(values);
                message.success('Thêm mới thành công!');
            }

            // Xử lý xong thì đóng modal và reset
            setIsModalOpen(false);
            setEditingProduct(null);
            form.resetFields();
            fetchData(); // Load lại bảng
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    // Hàm mở Modal ở chế độ Sửa
    const openEditModal = (record) => {
        setIsModalOpen(true);
        setEditingProduct(record); // Lưu lại sản phẩm đang sửa
        
        // Đổ dữ liệu cũ vào Form
        form.setFieldsValue({
            name: record.name,
            price: record.price,
            thumbnail: record.thumbnail,
            description: record.description,
            // Lưu ý: Backend trả về object category, nhưng form cần category_id
            category_id: record.category?.id 
        });
    };

    const handleDelete = async (id) => {
        try {
            await productService.delete(id);
            message.success('Đã xóa sản phẩm');
            fetchData();
        } catch (error) {
            message.error('Xóa thất bại');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 50 },
        { title: 'Tên', dataIndex: 'name', render: (t) => <strong>{t}</strong> },
        { title: 'Giá', dataIndex: 'price', render: (p) => <span style={{color:'green'}}>{p?.toLocaleString()} ₫</span> },
        { 
            title: 'Danh mục', 
            dataIndex: 'category', 
            render: (cate) => <Tag color="blue">{cate?.name || '---'}</Tag> 
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Space>
                    {/* Nút Sửa: Gọi hàm openEditModal */}
                    <Button 
                        type="primary" 
                        ghost 
                        icon={<EditOutlined />} 
                        onClick={() => openEditModal(record)}
                    />

                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)} okText="Có" cancelText="Không">
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý sản phẩm</h2>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditingProduct(null); // Reset về chế độ Thêm mới
                        form.resetFields();      // Xóa trắng form cũ nếu có
                    }}
                >
                    Thêm sản phẩm mới
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="id" 
                loading={loading} 
                bordered 
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
            />

            {/* MODAL DÙNG CHUNG */}
            <Modal
                title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"} // Tiêu đề đổi theo ngữ cảnh
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    form.resetFields();
                }}
                okText={editingProduct ? "Cập nhật" : "Lưu lại"}
                cancelText="Hủy bỏ"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        name="price" 
                        label="Giá bán (VNĐ)" 
                        rules={[{ required: true, message: 'Nhập giá tiền!' }]}
                    >
                        <InputNumber 
                            style={{ width: '100%' }} 
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item name="thumbnail" label="Hình ảnh (URL)">
                         <Input />
                    </Form.Item>

                    <Form.Item 
                        name="category_id"
                        label="Danh mục"
                        rules={[{ required: true, message: 'Chọn danh mục!' }]}
                    >
                        <Select placeholder="Chọn danh mục">
                            {Array.isArray(categories) && categories.map((cate) => (
                                <Select.Option key={cate.id} value={cate.id}>
                                    {cate.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                         <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManager;