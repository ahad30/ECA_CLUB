import { Table, Empty } from 'antd';

const DashboardTable = ({ columns, data, loading }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total, range) =>
          `${range[0]}–${range[1]} of ${total} records`,
        style: { padding: '12px 16px' },
      }}
      bordered={false}
      size="middle"
      scroll={{ x: 'max-content' }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No records found"
            style={{ padding: '40px 0' }}
          />
        ),
      }}
    />
  );
};

export default DashboardTable;
