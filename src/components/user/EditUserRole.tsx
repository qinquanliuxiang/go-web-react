import { RoleList } from "@/services/role";
import { userAddRole, userQuery, userRemoveRole } from "@/services/user";
import { Options } from "@/types";
import { openNewWindow } from "@/utils/openWindowns";
import { useRequest } from "ahooks";
import { Descriptions, Image, Button, Select, Space, Divider } from "antd";
import useApp from "antd/es/app/useApp";
import { useState, useEffect, useRef } from "react";
import ModalComponent from "../base/Modal";
import DynamicTable from "../base/DynamicTable";

interface EditUserRolePageProps {
  open: boolean;
  id: string;
  onCancel: () => void;
  onOk?: () => void;
}

const EditUserRolePage = ({ open, id, onCancel }: EditUserRolePageProps) => {
  const { modal, message } = useApp();
  // 获取用户数据
  const {
    data: userData,
    loading: userLoad,
    run: userRun,
    refresh: refreshUser,
  } = useRequest(userQuery, {
    manual: true,
    onError: (error) => {
      message.error(error.message);
    },
  });

  const allRoles = useRef<string[]>([]);

  const [rolesOptions, setRolesOptions] = useState<Options[]>([]);
  // 获取所有角色
  const { run: roleRun } = useRequest(RoleList, {
    manual: true,
    onSuccess(data) {
      const _allRoles = data.items.map((role) => {
        return role.name;
      });
      allRoles.current = _allRoles;
    },
    onError(error) {
      message.error(error.message);
    },
  });

  useEffect(() => {
    if (open === true) {
      userRun(id, "roles");
      roleRun({ page: -1, pageSize: -1 });
    }
  }, [open]);

  useEffect(() => {
    let opt: Options[] = [];
    if (!userData?.roles && allRoles.current) {
      opt = allRoles.current.map((role) => ({
        label: role,
        value: role,
      }));
    }

    if (userData?.roles && allRoles.current) {
      opt = allRoles.current
        .filter((role) => !userData.roles.find((r) => r.name === role)) // 过滤掉相同的角色
        .map((role) => ({
          label: role,
          value: role,
        }));
    }
    setRolesOptions(opt);
  }, [userData?.roles, allRoles.current]);

  // 选中的新角色
  const [selectedRoleId, setSelectedRoleId] = useState<string[]>();

  // 添加角色
  const { run: userAddRoleRun, loading: userAddRoleLoad } = useRequest(
    userAddRole,
    {
      manual: true,
      onSuccess: () => {
        message.success("角色添加成功");
        refreshUser();
        setSelectedRoleId(undefined);
      },
      onError: (error) => {
        message.error(error.message);
      },
    }
  );

  // 当前需要删除角色
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 删除角色http请求
  const { run: handleDelete, loading: removeLoad } = useRequest(
    userRemoveRole,
    {
      manual: true,
      onSuccess: () => {
        message.success("角色删除成功");
        setSelectedRowKeys([]);
        refreshUser();
      },
      onError: (error) => {
        message.error(error.message);
      },
    }
  );

  return (
    <ModalComponent
      title="编辑用户角色"
      width={800}
      open={open}
      handleCancel={() => {
        onCancel();
        setSelectedRoleId(undefined);
      }}
      confirmLoading={userLoad}
      footer={null}
      maskClosable={false}
    >
      {/* 用户信息展示 */}
      <Descriptions bordered column={1}>
        <Descriptions.Item label="头像">
          <Image src={userData?.avatar} width={64} />
        </Descriptions.Item>
        <Descriptions.Item label="名称">{userData?.name}</Descriptions.Item>
        <Descriptions.Item label="昵称">{userData?.nickName}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{userData?.email}</Descriptions.Item>
        <Descriptions.Item label="手机号">{userData?.mobile}</Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* 角色管理 */}
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Select
            className="min-w-2xs"
            mode="multiple"
            placeholder="请选择角色"
            options={rolesOptions ? rolesOptions : []}
            value={selectedRoleId}
            onChange={(value) => setSelectedRoleId(value)}
          />
          <Button
            type="primary"
            loading={userAddRoleLoad}
            onClick={() => {
              if (selectedRoleId && userData) {
                modal.confirm({
                  title: `确认添加 ${selectedRoleId} 角色？`,
                  content: "确定要添加该角色吗？",
                  okText: "确认",
                  okType: "danger",
                  cancelText: "取消",
                  onOk: () => {
                    userAddRoleRun(userData.id, selectedRoleId);
                  },
                });
              }
            }}
          >
            添加角色
          </Button>
          <Button
            danger
            loading={removeLoad}
            disabled={selectedRowKeys.length === 0}
            onClick={() => {
              modal.confirm({
                title: `确认删除 ${selectedRowKeys} 角色？`,
                content: "确定要删除该角色吗？",
                okText: "确认",
                okType: "danger",
                cancelText: "取消",
                onOk: () => {
                  if (userData) {
                    handleDelete(userData.id, selectedRowKeys);
                  }
                },
              });
            }}
          >
            批量删除选中角色
          </Button>
        </Space>

        <DynamicTable
          extraHeight={260}
          loading={userLoad}
          columns={[
            { title: "角色ID", dataIndex: "id", width: 140 },
            {
              title: "角色名称",
              dataIndex: "name",
              width: 140,
              render: (_, record) => {
                return (
                  <a
                    onClick={() => {
                      openNewWindow(
                        `/workspace/ram/role?page=1&pageSize=10&status=1&keyword=name&value=${record.name}`
                      );
                    }}
                  >
                    {record.name}
                  </a>
                );
              },
            },
            { title: "角色描述", dataIndex: "description" },
          ]}
          dataSource={userData?.roles || []}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange: (_, selectedRows) => {
              const names = selectedRows.map((row) => row.name);
              setSelectedRowKeys(names);
            },
          }}
        />
      </Space>
    </ModalComponent>
  );
};

export default EditUserRolePage;
