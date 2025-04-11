import { useRequest } from "ahooks";
import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { useState } from "react";
import { UserDelete, UserEnable, UserList } from "@/services/user";
import CreateUserModal from "@/components/user/CreateUserModal";
import usePaginationParams from "@/hooks/usePaginationParams";
import type { userListRequest, UserListResponseItem } from "@/types/user";
import useSearchParamsHook from "@/hooks/useSearchParams";
import EditUserRolePage from "@/components/user/EditUserRole";
import { EditOutlined, StopOutlined, CheckOutlined } from "@ant-design/icons";
import EnableUserComponent from "@/components/user/EnableUser";
import useApp from "antd/es/app/useApp";
const { Search } = Input;
const UserPage = () => {
  const { modal, message } = useApp();
  // 分页参数管理
  const { pageNum, pageSizeNum, statusNum, setPagination } =
    usePaginationParams({
      defaultStatus: 1,
    });

  // 搜索参数管理（设置默认搜索字段为 name）
  const { keyword, value, setSearch, clearSearch } = useSearchParamsHook({
    defaultKeyword: "name",
    defaultValue: "",
  });

  // 组件状态
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [userStatus, setUserStatus] = useState<number>(statusNum);

  const getQueryParams = (): userListRequest => {
    const params: userListRequest = {
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

  // 数据请求（自动依赖分页参数）
  const { data, loading, refresh } = useRequest(
    () => UserList(getQueryParams()),
    {
      refreshDeps: [pageNum, pageSizeNum, statusNum, value],
      onError: (error) => {
        message.error(error.message);
      },
    }
  );

  const { run: delUserRun, loading: delUserLoad } = useRequest(UserDelete, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  // 用户启用
  const [enableUser, setEnableUser] = useState({
    open: false,
    name: "",
    id: "",
    password: "",
  });
  const { run: enableUserRun, loading: enableUserLoad } = useRequest(
    UserEnable,
    {
      manual: true,
      onSuccess: () => {
        message.success("启用成功");
        setEnableUser({
          open: false,
          name: "",
          id: "",
          password: "",
        });
        refresh();
      },
      onError: (error) => {
        message.error(error.message);
      },
    }
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  // 表格列配置
  const columns = [
    { title: "ID", dataIndex: "id", width: "15%" },
    { title: "名称", dataIndex: "name", width: "15%" },
    { title: "邮箱", dataIndex: "email", width: "15%" },
    { title: "昵称", dataIndex: "nickName" },
    { title: "手机号", dataIndex: "mobile" },
    {
      title: "状态",
      dataIndex: "status",
      render: (status: number) => {
        return status === 1 ? "正常" : "禁用";
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_: string, record: UserListResponseItem) => {
        return (
          <Space size="middle">
            {record.status === 1 && (
              <>
                <Tooltip title="编辑角色">
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setIsEditOpen(true);
                      setEditId(record.id.toString());
                    }}
                  />
                </Tooltip>
                <Tooltip title="禁用用户">
                  <Button
                    type="link"
                    danger
                    loading={delUserLoad}
                    icon={<StopOutlined />}
                    onClick={() => {
                      modal.confirm({
                        title: `确认禁用${record.name}用户?`,
                        content:
                          "禁用后用户将无法登录系统，确定要执行此操作吗？",
                        okText: "确认",
                        okType: "danger",
                        cancelText: "取消",
                        onOk: () => delUserRun(record.id),
                      });
                    }}
                  />
                </Tooltip>
              </>
            )}

            {record.status === 2 && (
              <Tooltip title="启用用户">
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() =>
                    setEnableUser((prev) => {
                      return {
                        ...prev,
                        open: true,
                        name: record.name,
                        id: record.id.toString(),
                        password: "",
                      };
                    })
                  }
                  loading={enableUserLoad}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  // 分页变化处理
  const handlePageChange = (page: number, size: number) => {
    setPagination(page, size, statusNum);
  };

  // 搜索处理（点击搜索按钮时触发）
  const handleSearch = () => {
    setPagination(1, pageSizeNum, statusNum);
    setSearch(searchKeyword, searchValue);
    refresh();
  };

  return (
    <div className="px-4">
      <Space className="mb-4" wrap size={16}>
        <Select
          value={userStatus}
          onChange={(val) => setUserStatus(val)}
          onSelect={(val) => setPagination(pageNum, pageSizeNum, val)}
          placeholder="用户状态"
        >
          <Select.Option value={-1}>全部状态</Select.Option>
          <Select.Option value={1}>正常状态</Select.Option>
          <Select.Option value={2}>禁用状态</Select.Option>
        </Select>
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
              <Select.Option value="name">姓名</Select.Option>
              <Select.Option value="email">邮箱</Select.Option>
            </Select>
          }
        />
        <Button type="primary" onClick={() => setCreateModalOpen(true)}>
          创建用户
        </Button>
      </Space>

      <Table
        size="middle"
        rowKey="id"
        loading={loading}
        columns={columns}
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

      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        refresh={refresh}
      />
      <EnableUserComponent
        loading={enableUserLoad}
        enableUser={enableUser}
        setEnableUser={setEnableUser}
        enableUserRun={enableUserRun}
      />
      <EditUserRolePage
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
          setEditId("");
        }}
        id={editId}
      />
    </div>
  );
};

export default UserPage;
