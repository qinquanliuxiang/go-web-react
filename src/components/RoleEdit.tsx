import { useRequest } from "ahooks";
import {
  Button,
  Descriptions,
  Skeleton,
  Table,
  Tag,
  Space,
  Modal,
  Select,
} from "antd";
import { RoleAddPolices, RoleQuery, RoleRemovePolices } from "@/services/role";
import { useEffect, useMemo, useState } from "react";
import useApp from "antd/es/app/useApp";
import { GetPolicyList } from "@/services/policy";

interface RoleEditComponentProps {
  open: boolean;
  id: string;
  onCancel: () => void;
}

const RoleDetailPage = ({ id, open, onCancel }: RoleEditComponentProps) => {
  const { modal, message } = useApp();
  const [selectedPolciyId, setSelectedPolciyId] = useState<string[]>([]);
  useEffect(() => {
    if (open) {
      roleRun(id);
      listPolicesRun();
    }
  }, [open]);

  // 获取角色详情（带权限）
  const {
    run: roleRun,
    data: roleData,
    loading: roleLoad,
    refresh: roleRefresh,
  } = useRequest(RoleQuery, {
    manual: true,
    onError: (err) => {
      message.error(err.message);
    },
  });

  // 处理权限更新
  // const { run: updatePolicies } = useRequest(UpdateRolePolicies, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success("权限更新成功");
  //     refresh();
  //     setFormVisible(false);
  //   },
  //   onError: (err) => message.error(`更新失败: ${err.message}`),
  // });

  // 处理权限删除
  const { run: roleRemovPoliyc, loading: roleRemovPoliycLoad } = useRequest(
    RoleRemovePolices,
    {
      manual: true,
      onSuccess: () => {
        message.success("权限删除成功");
        roleRefresh();
      },
      onError: (err) => message.error(`删除失败: ${err.message}`),
    }
  );

  const { run: listPolicesRun, data: listPolicesData } = useRequest(
    () => GetPolicyList({ page: -1, pageSize: -1 }),
    {
      manual: true,
      onSuccess: (res) => {
        console.log(res);
      },
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

  const { run: roleAddPolces, loading: roleAddPolcesLoad } = useRequest(
    RoleAddPolices,
    {
      manual: true,
      onSuccess: () => {
        message.success("权限添加成功");
        roleRefresh();
      },
      onError: (err) => message.error(`添加失败: ${err.message}`),
    }
  );

  // 权限表格列配置
  const policyColumns = [
    {
      title: "策略名称",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "路径",
      dataIndex: "path",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "方法",
      dataIndex: "method",
      render: (text: string) => (
        <Tag color="geekblue">{text.toUpperCase()}</Tag>
      ),
    },
    {
      title: "描述",
      dataIndex: "describe",
    },
  ];

  // 当前需要删除策略
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  return (
    <div className="px-4 w-full">
      <Modal
        width={800}
        open={open}
        onCancel={() => {
          onCancel();
          setSelectedPolciyId([]);
          setSelectedRowKeys([]);
        }}
        title="角色详情"
        footer={null}
      >
        <Skeleton active loading={roleLoad}>
          <div className="space-y-4 mt-4">
            <div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="名称">
                  {roleData?.name}
                </Descriptions.Item>
                <Descriptions.Item label="描述">
                  {roleData?.description}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Space>
              <Select
                className="min-w-2xs"
                mode="multiple"
                placeholder="请选择角色"
                options={policyOptions}
                value={selectedPolciyId}
                onChange={(value) => setSelectedPolciyId(value)}
                // 修改 filterOption 属性的类型定义
                filterOption={(input, option) => {
                  if (!option) return false;
                  return (
                    option.rawData.name
                      .toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option.rawData.path
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  );
                }}
              />
              <Button
                type="primary"
                loading={roleAddPolcesLoad}
                onClick={() => {
                  if (selectedPolciyId) {
                    modal.confirm({
                      title: "确认添加角色？",
                      content: "确定要添加该角色吗？",
                      okText: "确认",
                      okType: "danger",
                      cancelText: "取消",
                      onOk: () => {
                        console.log(selectedPolciyId);
                        roleAddPolces(id, { policyIds: selectedPolciyId });
                      },
                    });
                  }
                }}
              >
                添加角色
              </Button>
              <Button
                danger
                loading={roleRemovPoliycLoad}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  modal.confirm({
                    title: "确认删除角色？",
                    content: "确定要删除该角色吗？",
                    okText: "确认",
                    okType: "danger",
                    cancelText: "取消",
                    onOk: () => {
                      roleRemovPoliyc(id, { policyIds: selectedRowKeys });
                    },
                  });
                }}
              >
                批量删除选中策略
              </Button>
            </Space>

            <div>
              <Table
                title={() => (
                  <span className="text-lg font-medium">权限列表</span>
                )}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (_, selectedRows) => {
                    const ids = selectedRows.map((row) => row.id);
                    setSelectedRowKeys(ids);
                  },
                }}
                rowKey="id"
                columns={policyColumns}
                dataSource={roleData?.policys}
                pagination={false}
                bordered
              />
            </div>
          </div>
        </Skeleton>
      </Modal>
    </div>
  );
};

export default RoleDetailPage;
