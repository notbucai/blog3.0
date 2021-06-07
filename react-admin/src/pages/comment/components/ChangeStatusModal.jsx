import { message, Modal, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import useRequest from '../../../plugins/useRequest';


function ChangeStatusModal ({ data, type, visible, onConfirm, onCancel }) {

  const [status, setStatus] = useState(data ? data.status : 1);

  const { loading, run } = useRequest(({ id, type, status }) => {
    return {
      method: 'PUT',
      url: `/comment/${type}/${id}/status`,
      data: {
        status,
      }
    }
  }, {
    manual: true,
  });
  useEffect(() => {
    if (!data) return;
    let _status = data.status;
    if (data.status === 1) {
      _status = 2;
    }
    setStatus(_status);

    return () => {
    };
  }, [data]);

  const handleOk = async () => {
    await run({
      id: data._id,
      status: status,
      type
    });
    message.success("操作成功");
    onConfirm && onConfirm();
  }

  const handleCancel = () => {
    onCancel && onCancel();
  }

  const onChange = (e) => {
    setStatus(e.target.value);
  }
  if (!data) return null;
  return (
    <Modal
      title={`修改${data._id}的状态`}
      confirmLoading={loading}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Radio.Group value={status} onChange={onChange} defaultValue={2}>
        <Radio.Button value={2}>审核通过</Radio.Button>
        <Radio.Button value={3}>审核拒绝</Radio.Button>
      </Radio.Group>
    </Modal>
  );
}

export default ChangeStatusModal;
