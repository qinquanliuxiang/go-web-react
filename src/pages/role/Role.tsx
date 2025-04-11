import usePaginationParams from "@/hooks/usePaginationParams";
import useSearchParamsHook from "@/hooks/useSearchParams";
import { RoleList } from "@/services/role";
import { RoleItem, roleListRequest } from "@/types/role";
import { useRequest } from "ahooks";
import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import RoleDetailPage from "@/components/role/RoleEdit";
import { GetPolicyList } from "@/services/policy";
import useApp from "antd/es/app/useApp";
const { Search } = Input;
const RolePage = () => {
  const { message } = useApp();
  // 分页参数管理
  const { pageNum, pageSizeNum, statusNum, setPagination } =
    usePaginationParams({
      defaultStatus: 1,
    });
  const { keyword, value, setSearch, clearSearch } = useSearchParamsHook({
    defaultKeyword: "name",
    defaultValue: "",
  });
  const [searchValue, setSearchValue] = useState(value);
  const [searchKeyword, setSearchKeyword] = useState(keyword);

  const getQueryParams = (): roleListRequest => {
    const params: roleListRequest = {
      page: pageNum,
      pageSize: pageSizeNum,
      status: statusNum,
    };

    // 只有当 value 有值时，才添加 keyword 和 value
    if (searchValue) {
      params.keyword = keyword;
      params.value = searchValue;
    }

    return params;
  };

  const {
    data: roleData,
    loading: roleLoad,
    refresh,
  } = useRequest(() => RoleList(getQueryParams()), {
    refreshDeps: [pageNum, pageSizeNum, value],
  });

  const [roleId, setRoleId] = useState("");
  const [roleEdit, setRoleEdit] = useState(false);
  const columns = [
    { title: "角色ID", dataIndex: "id" },
    { title: "角色名称", dataIndex: "name" },
    { title: "角色描述", dataIndex: "description" },
    {
      title: "操作",
      width: 100,
      render: (_: unknown, record: RoleItem) => (
        <>
          <Tooltip title="编辑角色">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => {
                listPolicesRun();
                setRoleId(record.id.toString());
                setRoleEdit(true);
              }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  // 分页变化处理
  const handlePageChange = (page: number, size: number) => {
    setPagination(page, size, 1);
  };

  // 搜索处理（点击搜索按钮时触发）
  const handleSearch = () => {
    setPagination(1, pageSizeNum, 1);
    setSearch(searchKeyword, searchValue);
    refresh();
  };

  const { run: listPolicesRun, data: listPolicesData } = useRequest(
    () => GetPolicyList({ page: -1, pageSize: -1 }),
    {
      manual: true,
      onError: (err) => message.error(`${err.message}`),
    }
  );

  const policyOptions = useMemo(() => {
    if (listPolicesData) {
      return (
        listPolicesData.items.map((policy) => ({
          label: `${policy.name} (${policy.method.toUpperCase()} ${
            policy.path
          })`,
          value: policy.id,
          rawData: policy,
        })) || []
      );
    }
  }, [listPolicesData]);

  return (
    <div className="px-4">
      <Space className="mb-4" wrap size={16}>
        <Search
          placeholder={`按${keyword === "name" ? "姓名" : "邮箱"}前缀搜索`}
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
          创建角色
        </Button>
      </Space>

      <Table
        size="middle"
        rowKey="id"
        loading={roleLoad}
        columns={columns}
        dataSource={roleData?.items || []}
        scroll={{ y: `calc(100vh - 280px)` }}
        pagination={{
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} 条，共 ${total} 条数据`,
          current: pageNum,
          pageSize: pageSizeNum,
          total: roleData?.total || 0,
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
      <RoleDetailPage
        policyOptions={policyOptions}
        open={roleEdit}
        id={roleId}
        onCancel={() => {
          setRoleEdit(false);
          setRoleId("");
        }}
      />
    </div>
  );
};

export default RolePage;
