import CreatePolicyComponent from "@/components/policy/CreatePolicy";
import usePaginationParams from "@/hooks/usePaginationParams";
import useSearchParamsHook from "@/hooks/useSearchParams";
import { DeletePolicy, GetPolicyList } from "@/services/policy";
import type { PolicyItem, PolicyListRequest } from "@/types/policy";
import { useRequest } from "ahooks";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { App, Button, Input, Select, Space, Tag, Tooltip } from "antd";
import { useState } from "react";
import UpdatePolicyComponent from "@/components/policy/UpdatePolicy";
import DynamicTable from "@/components/base/DynamicTable";
const { Search } = Input;
const PolicyPage = () => {
  const { modal, message } = App.useApp();
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

  const [upOpen, setUpOpen] = useState(false);
  const [upData, setUpDate] = useState<PolicyItem>({} as PolicyItem);

  const { run: delRun, loading: delLoad } = useRequest(DeletePolicy, {
    manual: true,
    debounceMaxWait: 500,
    onSuccess: () => {
      message.success("删除成功");
      refresh();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const column = [
    {
      title: "ID",
      dataIndex: "id",
      width: 150,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "路径",
      dataIndex: "path",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "方法",
      dataIndex: "method",
      width: 80,
      render: (text: string) => (
        <Tag color="geekblue">{text.toUpperCase()}</Tag>
      ),
    },
    {
      title: "描述",
      dataIndex: "describe",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "操作",
      dataIndex: "action",
      width: "100px",
      render: (_: unknown, record: PolicyItem) => (
        <Space>
          <Tooltip title="修改策略">
            <Button
              type="link"
              loading={false}
              icon={<EditOutlined />}
              onClick={() => {
                setUpDate(record);
                setUpOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="删除策略">
            <Button
              type="link"
              danger
              loading={delLoad}
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: "确认删除策略",
                  content: `确定要删除策略【${record.name}】吗？该操作不可恢复！`,
                  okText: "确定",
                  cancelText: "取消",
                  okType: "danger",
                  onOk: () => {
                    delRun(record.id.toString());
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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

  const [createPolicyOpen, setCreatePolicyOpen] = useState(false);
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
        <Button
          type="primary"
          onClick={() => {
            setCreatePolicyOpen(true);
          }}
        >
          创建策略
        </Button>
      </Space>

      <DynamicTable
        extraHeight={80}
        loading={loading}
        columns={column}
        dataSource={data?.items || []}
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
      <UpdatePolicyComponent
        data={upData}
        open={upOpen}
        onCancel={() => {
          setUpOpen(false);
        }}
        refresh={refresh}
      />
      <CreatePolicyComponent
        open={createPolicyOpen}
        onCancel={() => {
          setCreatePolicyOpen(false);
        }}
        refresh={refresh}
      />
    </div>
  );
};

export default PolicyPage;
