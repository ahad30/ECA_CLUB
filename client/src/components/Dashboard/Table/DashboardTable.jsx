import React from "react";
import { Table} from "antd";
import Skeleton from "../Skeleton/Skeleton";


const DashboardTable = ({columns, data, loading }) => {
  if (loading ) {
    return <Skeleton></Skeleton>;
  }
 return (

    <Table
   className="overflow-x-scroll scrollbar-0"
    columns={columns}
    dataSource={data}
    pagination={true}
    bordered={true}
    loading={loading}
  />
 )
};
export default DashboardTable;
