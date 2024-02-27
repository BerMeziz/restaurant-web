import { Form, Input, Modal, message, Upload, Button } from 'antd';
import React, { useState } from 'react';
import ButtonConfirm from '../buttons/buttonConfirm';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Image from 'next/image'; // Import Image from next/image
import ConfirmCreateMenuModal from './ConfirmCreateMenuModal';

interface AddMenuModalProps {
  visible: boolean;
  menuName: string;
  onClose: () => void;
}

const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const AddMenuModal: React.FC<AddMenuModalProps> = ({ visible, menuName, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageUploaded, setImageUploaded] = useState(false); // State to track whether an image has been uploaded

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    onClose();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const base64String = await getBase64(file);
        setImageUrl(base64String);
        setImageUploaded(true); // Set the state to true when image is uploaded
      } catch (error) {
        console.error('Error converting file to base64:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const uploadButton = (
    <label
      htmlFor="upload-input"
      style={{
        border: '2px solid #A93F3F',
        background: imageUploaded ? 'none' : '#D9D9D9', // Set the background color to red
        cursor: 'pointer',
        height: '201px',
        width: '201px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {!imageUploaded ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div style={{ marginTop: 8, color: '#A93F3F' }} className='text-[40px] font-bold'>เพิ่มรูป</div>
        </div>
      ) : (
        <img src={imageUrl || undefined} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <input
        type="file"
        id="upload-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </label>
  );

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // console.log('handleCancel');
    
  };
  
  const handleSubmit = () => {
    setIsModalVisible(false);
    // console.log('handleSubmit');

  };


  return (
    <>
      <Modal
        closeIcon={false}
        visible={visible}
        onCancel={onClose}
        footer={null}
        centered
        width={728}
        style={{ height: '451px', padding: 0 }}
        className="no-border-radius-modal"
      >
        <div className='text-center p-[30px] flex flex-col justify-center items-center'>
          <Form form={form} onFinish={onFinish}>
            <div className="flex justify-center items-center text-[#FDD77D] text-[40px] font-bold">
              <span>เพิ่มเมนู</span>
            </div>
            <div className="flex my-[40px] gap-[30px] items-center">
              <Form.Item className='p-0 m-0'>
                {uploadButton}
              </Form.Item>
              <div className="flex flex-col justify-between items-between gap-[16px]">
                <Form.Item className='p-0 m-0'>
                  <div className="flex gap-[50px] justify-between items-center">
                    <span className='w-fit text-[18px] text-[#A93F3F] font-bold'>ชื่อสินค้า</span>
                    <Input style={{ width: '124px', height: '44px' }} className='border-2 border-[#A93F3F] rounded-none' />
                  </div>
                </Form.Item>
                <Form.Item className='p-0 m-0'>
                  <div className="flex gap-[50px] justify-between items-center">
                    <span className='w-fit text-[18px] text-[#A93F3F] font-bold'>ราคาขาย</span>
                    <Input style={{ width: '124px', height: '44px' }} className='border-2 border-[#A93F3F] rounded-none' />
                  </div>
                </Form.Item>
              </div>
            </div>
            <ButtonConfirm buttonType="submit" textButton="เพิ่มเมนู" onClick={() => setIsModalVisible(true)} />
          </Form>
        </div>
      </Modal>
      {/* Modal for the selected table name */}
      <Modal
        closeIcon={false}
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        footer={null}
        width={440}
        style={{ height: '180px' }}
      >
        {/* Modal content goes here */}
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <p className='text-[40px] font-bold text-[#FDD77D]'>ยืนยันการเพิ่ม</p>
          <div style={{ height: '30px' }}></div>
          <div className='flex justify-center'>
            <Button
              key="close"
              onClick={handleCancel}
              style={{
                width: '66px',
                height: '42px',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #C60000',
                transition: 'background-color 0.3s ease', // Add transition for smooth hover effect
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(254 226 226)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#C60000' }}>ยกเลิก</span>
            </Button>
            <div style={{ width: '30px' }}></div>
            <Button
              key="confirm"
              onClick={handleSubmit}
              style={{
                width: '66px',
                height: '42px',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #00BE2A',
                transition: 'background-color 0.3s ease', // Add transition for smooth hover effect
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(240 253 244)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#00BE2A' }}>ยืนยัน</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddMenuModal;
