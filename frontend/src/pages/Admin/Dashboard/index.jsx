import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { ArrowUpOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const Dashboard = () => {
    return (
        <div>
            <h2>📊 Báo cáo nhanh</h2>
            <br />
            <Row gutter={16}>
                <Col span={8}>
                    <Card bordered={false} style={{ background: '#e6f7ff' }}>
                        <Statistic
                            title="Doanh thu tháng này"
                            value={112893000}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                            suffix="₫"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ background: '#fff7e6' }}>
                        <Statistic
                            title="Đơn hàng mới"
                            value={93}
                            precision={0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ShoppingCartOutlined />}
                            suffix="đơn"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ background: '#f9f0ff' }}>
                        <Statistic
                            title="Tăng trưởng"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: '#2f54eb' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 20 }}>
                <h3>Chào mừng trở lại!</h3>
                <p>Hệ thống hoạt động bình thường. Chúc bạn một ngày làm việc hiệu quả.</p>
            </div>
        </div>
    );
};

export default Dashboard;