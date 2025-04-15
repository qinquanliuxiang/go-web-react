import { useRequest } from "ahooks";
import { Button, Descriptions, Skeleton, Tag, Space, Select } from "antd";
import { RoleAddPolices, RoleQuery, RoleRemovePolices } from "@/services/role";
import { useEffect, useMemo, useState } from "react";
import useApp from "antd/es/app/useApp";
import { openNewWindow } from "@/utils/openWindowns";
import type { PolicyItem } from "@/types/policy";
import { PolicyOptions } from "@/types";
import ModalComponent from "../base/Modal";
import DynamicTable from "../base/DynamicTable";

interface RoleEditComponentProps {
  policyOptions: PolicyOptions[] | undefined;
  open: boolean;
  id: string;
  onCancel: () => void;
}

const RoleDetailPage = ({
  id,
  open,
  onCancel,
  policyOptions,
}: RoleEditComponentProps) => {
  const { modal, message } = useApp();
  const [selectedPolciyId, setSelectedPolciyId] = useState<string[]>([]);
  useEffect(() => {
    if (open) {
      roleRun(id);
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

  const filteredOptions = useMemo(() => {
    return (
      policyOptions?.filter(
        (option) =>
          !roleData?.policys?.some((policy) => policy.id === option.value)
      ) || []
    );
  }, [policyOptions, roleData?.policys]);

  // 处理权限删除
  const { run: roleRemovPoliyc, loading: roleRemovPoliycLoad } = useRequest(
    RoleRemovePolices,
    {
      manual: true,
      onSuccess: () => {
        message.success("权限删除成功");
        setSelectedRowKeys([]);
        roleRefresh();
      },
      onError: (err) => message.error(`删除失败: ${err.message}`),
    }
  );

  const { run: roleAddPolces, loading: roleAddPolcesLoad } = useRequest(
    RoleAddPolices,
    {
      manual: true,
      onSuccess: () => {
        message.success("权限添加成功");
        setSelectedPolciyId([]);
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
      render: (text: string, record: PolicyItem) => {
        return (
          <a
            onClick={() => {
              openNewWindow(
                `/workspace/ram/policy?page=1&pageSize=10&status=1&keyword=name&value=${record.name}`
              );
            }}
          >
            {text}
          </a>
        );
      },
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
  const handleCancel = () => {
    onCancel();
    setSelectedPolciyId([]);
    setSelectedRowKeys([]);
  };
  return (
    <div className="px-4 w-full">
      <ModalComponent
        open={open}
        handleCancel={handleCancel}
        confirmLoading={false}
        width={800}
        title="角色详情"
        footer={null}
        closable
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
                options={filteredOptions}
                value={selectedPolciyId}
                onChange={(value) => setSelectedPolciyId(value)}
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
                disabled={selectedPolciyId.length === 0}
                loading={roleAddPolcesLoad}
                onClick={() => {
                  modal.confirm({
                    title: `确认添加策略？`,
                    okText: "确认",
                    okType: "danger",
                    cancelText: "取消",
                    onOk: () => {
                      roleAddPolces(id, { policyIds: selectedPolciyId });
                    },
                  });
                }}
              >
                添加策略
              </Button>
              <Button
                danger
                loading={roleRemovPoliycLoad}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  modal.confirm({
                    title: "确认删除策略？",
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

            <DynamicTable
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
              columns={policyColumns}
              dataSource={roleData?.policys}
              pagination={false}
              bordered
              extraHeight={260}
            />
          </div>
        </Skeleton>
      </ModalComponent>
    </div>
  );
};

export default RoleDetailPage;
