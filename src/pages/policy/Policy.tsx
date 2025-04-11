import usePaginationParams from "@/hooks/usePaginationParams";
import useSearchParamsHook from "@/hooks/useSearchParams";
import { GetPolicyList } from "@/services/policy";
import type { PolicyListRequest } from "@/types/policy";
import { useRequest } from "ahooks";
import { Button, Input, Select, Space, Table } from "antd";
import { useState } from "react";
const { Search } = Input;
const PolicyPage = () => {
  const { pageNum, pageSizeNum, statusNum, setPagination } =
    usePaginationParams({
      defaultStatus: 1,
    });
  const { keyword, value, setSearch, clearSearch } = useSearchParamsHook({
    defaultKeyword: "name",
    defaultValue: "",
  });
  const [status, setStatus] = useState<number>(statusNum);
  const [searchValue, setSearchValue] = useState(value);
  const [searchKeyword, setSearchKeyword] = useState(keyword);

  const getQueryParams = (): PolicyListRequest => {
    const params: PolicyListRequest = {
      page: pageNum,
      pageSize: pageSizeNum,
    };

    // 只有当 value 有值时，才添加 keyword 和 value
    if (searchValue) {
      params.keyword = keyword;
      params.value = searchValue;
    }

    return params;
  };
  const { data, loading, refresh } = useRequest(
    () => GetPolicyList(getQueryParams()),
    {
      refreshDeps: [pageNum, pageSizeNum, statusNum, value],
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    }
  );

  // 搜索处理（点击搜索按钮时触发）
  const handleSearch = () => {
    setPagination(1, pageSizeNum, statusNum);
    setSearch(searchKeyword, searchValue);
    refresh();
  };

  // 分页变化处理
  const handlePageChange = (page: number, size: number) => {
    setPagination(page, size, statusNum);
  };

  return (
    <div className="px-4">
      <Space className="mb-4" wrap size={16}>
        <Select
          value={status}
          onChange={(val) => setStatus(val)}
          onSelect={(val) => setPagination(pageNum, pageSizeNum, val)}
          placeholder="用户状态"
        >
          <Select.Option value={1}>正常状态</Select.Option>
        </Select>
        <Search
          placeholder={`按${keyword === "name" && "姓名"}前缀搜索`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          onClear={clearSearch}
          allowClear
          addonBefore={
            <Select
              value={searchKeyword}
              onChange={(val) => {
                setSearchKeyword(val);
              }}
              style={{ width: 100 }}
            >
              <Select.Option value="name">名称</Select.Option>
            </Select>
          }
        />
        <Button type="primary" onClick={() => {}}>
          创建策略
        </Button>
      </Space>

      <Table
        size="middle"
        rowKey="id"
        loading={loading}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "名称",
            dataIndex: "name",
          },
          {
            title: "描述",
            dataIndex: "describe",
          },
        ]}
        dataSource={data?.items || []}
        scroll={{ y: `calc(100vh - 280px)` }}
        pagination={{
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} 条，共 ${total} 条数据`,
          current: pageNum,
          pageSize: pageSizeNum,
          total: data?.total || 0,
          showSizeChanger: true,
          onChange: handlePageChange,
          locale: {
            items_per_page: "条/页",
            jump_to: "跳至",
            page: "页",
          },
        }}
        bordered
      />
    </div>
  );
};

export default PolicyPage;
