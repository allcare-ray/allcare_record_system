import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, MessageCircle, FileText } from 'lucide-react';

// FormField 组件移到外部避免重新渲染问题
const FormField = ({ label, name, type = 'text', icon: Icon, placeholder, required = false, multiline = false, value, onChange, errors }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={`input-field ${Icon ? 'pl-10' : ''} ${errors[name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${Icon ? 'pl-10' : ''} ${errors[name] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
      )}
    </div>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
    )}
  </div>
);

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, addEmployee, updateEmployee } = useData();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    wechat: '',
    email: '',
    address: '',
    city: '',
    notes: '',
    status: '咨询'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 如果是编辑模式，加载现有数据
  useEffect(() => {
    if (isEdit && id) {
      const employee = employees.find(e => e.id === id);
      if (employee) {
        setFormData({
          name: employee.name || '',
          age: employee.age || '',
          phone: employee.phone || '',
          wechat: employee.wechat || '',
          email: employee.email || '',
          address: employee.address || '',
          city: employee.city || '',
          notes: employee.notes || ''
        });
      } else {
        navigate('/employees');
      }
    }
  }, [isEdit, id, employees, navigate]);

  // 格式化电话号码
  const formatPhoneNumber = (value) => {
    // 移除所有非数字字符
    const phoneNumber = value.replace(/\D/g, '');

    // 限制最多10位数字
    const limitedPhoneNumber = phoneNumber.slice(0, 10);

    // 格式化为 (XXX) XXX-XXXX
    if (limitedPhoneNumber.length >= 6) {
      return `(${limitedPhoneNumber.slice(0, 3)}) ${limitedPhoneNumber.slice(3, 6)}-${limitedPhoneNumber.slice(6)}`;
    } else if (limitedPhoneNumber.length >= 3) {
      return `(${limitedPhoneNumber.slice(0, 3)}) ${limitedPhoneNumber.slice(3)}`;
    } else if (limitedPhoneNumber.length > 0) {
      return `(${limitedPhoneNumber}`;
    }
    return limitedPhoneNumber;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '电话不能为空';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码格式: (XXX) XXX-XXXX';
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 0 || formData.age > 150)) {
      newErrors.age = '请输入有效的年龄';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        updateEmployee(id, formData);
      } else {
        addEmployee(formData);
      }
      navigate('/employees');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/employees')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? '编辑员工' : '添加员工'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? '修改员工信息' : '录入新员工信息'}
          </p>
        </div>
      </div>

      {/* 表单 */}
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="姓名"
              name="name"
              icon={User}
              placeholder="请输入员工姓名"
              required
              value={formData.name}
              onChange={handleChange}
              errors={errors}
            />
            <FormField
              label="年龄"
              name="age"
              type="number"
              placeholder="请输入年龄"
              value={formData.age}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          {/* 状态选择 */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              状态 <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="咨询">咨询</option>
              <option value="注册中">注册中</option>
              <option value="在职">在职</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          {/* 联系方式 */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              联系方式
            </h3>

            <FormField
              label="电话"
              name="phone"
              type="tel"
              icon={Phone}
              placeholder="(XXX) XXX-XXXX"
              required
              value={formData.phone}
              onChange={handleChange}
              errors={errors}
            />

            <FormField
              label="微信"
              name="wechat"
              icon={MessageCircle}
              placeholder="请输入微信号"
              value={formData.wechat}
              onChange={handleChange}
              errors={errors}
            />

            <FormField
              label="邮箱"
              name="email"
              type="email"
              icon={Mail}
              placeholder="请输入邮箱地址"
              value={formData.email}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          {/* 地址信息 */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              地址信息
            </h3>

            <FormField
              label="城市"
              name="city"
              icon={MapPin}
              placeholder="请输入所在城市"
              value={formData.city}
              onChange={handleChange}
              errors={errors}
            />

            <FormField
              label="详细地址"
              name="address"
              placeholder="请输入详细地址"
              value={formData.address}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          {/* 备注 */}
          <FormField
            label="备注"
            name="notes"
            icon={FileText}
            placeholder="请输入备注信息"
            multiline
            value={formData.notes}
            onChange={handleChange}
            errors={errors}
          />

          {/* 提交按钮 */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  保存中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Save className="w-5 h-5 mr-2" />
                  {isEdit ? '更新' : '保存'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
