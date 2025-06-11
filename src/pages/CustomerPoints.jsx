import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Calendar,
  Gift,
  FileText,
  Users,
  ArrowLeft,
  X,
  Calculator,
  Receipt
} from 'lucide-react';

const CustomerPoints = () => {
  const { customers, customerPoints, customerPointRecords, addCustomerPoint, updateCustomerPoint, deleteCustomerPoint, batchUpdateCustomerPoints } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showRecords, setShowRecords] = useState(null);
  const [showExchangeRecords, setShowExchangeRecords] = useState(null);

  // 积分记录详情的分页和搜索
  const [recordsSearchTerm, setRecordsSearchTerm] = useState('');
  const [recordsCurrentPage, setRecordsCurrentPage] = useState(1);
  const [recordsItemsPerPage, setRecordsItemsPerPage] = useState(10);

  // 兑换记录详情的分页和搜索
  const [exchangeSearchTerm, setExchangeSearchTerm] = useState('');
  const [exchangeCurrentPage, setExchangeCurrentPage] = useState(1);
  const [exchangeItemsPerPage, setExchangeItemsPerPage] = useState(10);
  const [showPointsForm, setShowPointsForm] = useState(null);
  const [showExchangeForm, setShowExchangeForm] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showBatchPointsForm, setShowBatchPointsForm] = useState(false);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [pointsFormData, setPointsFormData] = useState({
    pointChange: '',
    changeType: 'increase',
    reason: ''
  });
  const [batchPointsFormData, setBatchPointsFormData] = useState({
    pointChange: '',
    changeType: 'increase',
    reason: ''
  });
  const [exchangeFormData, setExchangeFormData] = useState({
    exchangeDate: '',
    exchangeContent: '',
    pointsUsed: '',
    operator: ''
  });
  const [formData, setFormData] = useState({
    customerId: '',
    points: '',
    startDate: '',
    exchangeRecord: '',
    notes: ''
  });

  // 使用ref来跟踪已处理的客户
  const processedCustomersRef = useRef(new Set());

  // 自动为每个客户创建积分记录（如果不存在）
  React.useEffect(() => {
    const customersNeedingPoints = customers.filter(customer =>
      !customerPoints.find(point => point.customerId === customer.id) &&
      !processedCustomersRef.current.has(customer.id)
    );

    customersNeedingPoints.forEach(customer => {
      processedCustomersRef.current.add(customer.id);
      addCustomerPoint({
        customerId: customer.id,
        points: 0,
        startDate: '',
        exchangeRecord: '',
        notes: ''
      });
    });
  }, [customers, customerPoints, addCustomerPoint]);

  // 过滤积分记录
  const filteredPoints = customerPoints.filter(point => {
    const customer = customers.find(c => c.id === point.customerId);
    const customerName = customer ? customer.name : '';
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           point.exchangeRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
           point.notes.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 分页计算
  const totalPages = Math.ceil(filteredPoints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPoints = filteredPoints.slice(startIndex, endIndex);

  // 处理分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // 重置到第一页
  };

  // 搜索时重置到第一页
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 积分记录搜索时重置到第一页
  React.useEffect(() => {
    setRecordsCurrentPage(1);
  }, [recordsSearchTerm]);

  // 兑换记录搜索时重置到第一页
  React.useEffect(() => {
    setExchangeCurrentPage(1);
  }, [exchangeSearchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPoint) {
      updateCustomerPoint(editingPoint.id, formData, null, true); // 标记为编辑操作
    } else {
      addCustomerPoint({
        ...formData,
        points: parseInt(formData.points) || 0,
        createdAt: new Date().toISOString()
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      points: '',
      startDate: '',
      exchangeRecord: '',
      notes: ''
    });
    setShowForm(false);
    setEditingPoint(null);
  };

  const handleEdit = (point) => {
    setFormData({
      customerId: point.customerId,
      points: point.points.toString(),
      startDate: point.startDate,
      exchangeRecord: point.exchangeRecord,
      notes: point.notes
    });
    setEditingPoint(point);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteCustomerPoint(id);
    setDeleteConfirm(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePointsChange = (e) => {
    const { name, value } = e.target;
    setPointsFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExchangeChange = (e) => {
    const { name, value } = e.target;
    setExchangeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBatchPointsChange = (e) => {
    const { name, value } = e.target;
    setBatchPointsFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBatchPointsSubmit = (e) => {
    e.preventDefault();
    if (batchPointsFormData.pointChange) {
      let pointChange = parseInt(batchPointsFormData.pointChange);

      // 如果是减少，将数值转为负数
      if (batchPointsFormData.changeType === 'decrease') {
        pointChange = -Math.abs(pointChange);
      }

      // 使用批量调整函数
      batchUpdateCustomerPoints(pointChange, batchPointsFormData.reason || '批量积分调整');

      // 重置表单
      setBatchPointsFormData({ pointChange: '', changeType: 'increase', reason: '' });
      setShowBatchPointsForm(false);
    }
  };

  const handlePointsSubmit = (e) => {
    e.preventDefault();
    const point = customerPoints.find(p => p.customerId === showPointsForm);
    if (point && pointsFormData.pointChange) {
      const currentPoints = parseInt(point.points) || 0;
      let pointChange = parseInt(pointsFormData.pointChange);

      // 如果是减少，将数值转为负数
      if (pointsFormData.changeType === 'decrease') {
        pointChange = -Math.abs(pointChange);
      }

      const newPoints = currentPoints + pointChange;

      updateCustomerPoint(point.id, {
        ...point,
        points: Math.max(0, newPoints) // 确保积分不为负数
      }, pointsFormData.reason || '积分调整');

      // 重置表单
      setPointsFormData({ pointChange: '', changeType: 'increase', reason: '' });
      setShowPointsForm(null);
    }
  };

  const handleExchangeSubmit = (e) => {
    e.preventDefault();
    const point = customerPoints.find(p => p.customerId === showExchangeForm);
    const customer = customers.find(c => c.id === showExchangeForm);
    if (point && customer) {
      const pointsUsed = parseInt(exchangeFormData.pointsUsed) || 0;
      const currentPoints = parseInt(point.points) || 0;

      // 检查积分是否足够
      if (pointsUsed > currentPoints) {
        alert('积分不足，无法完成兑换！');
        return;
      }

      const currentExchange = point.exchangeRecord || '';
      // 创建完整的时间戳（YYYY/MM/DD HH:MM:SS）
      const exchangeDateTime = `${exchangeFormData.exchangeDate} ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`;
      // 格式：兑换时间|兑换物品|兑换人|减少积分|经办人
      const newExchangeEntry = `${exchangeDateTime}|${exchangeFormData.exchangeContent}|${customer.name}|${pointsUsed}|${exchangeFormData.operator}`;
      const newExchange = currentExchange
        ? `${currentExchange}\n${newExchangeEntry}`
        : newExchangeEntry;

      // 更新积分记录和减少积分
      const newPoints = currentPoints - pointsUsed;
      updateCustomerPoint(point.id, {
        ...point,
        points: newPoints,
        exchangeRecord: newExchange
      }, `兑换商品：${exchangeFormData.exchangeContent}`);

      // 重置表单
      setExchangeFormData({ exchangeDate: '', exchangeContent: '', pointsUsed: '', operator: '' });
      setShowExchangeForm(null);
    }
  };

  const openPointsForm = (customerId) => {
    setShowPointsForm(customerId);
    setPointsFormData({
      pointChange: '',
      changeType: 'increase',
      reason: '积分调整'
    });
  };

  const openExchangeForm = (customerId) => {
    setShowExchangeForm(customerId);
    setExchangeFormData({
      exchangeDate: new Date().toISOString().split('T')[0],
      exchangeContent: '',
      pointsUsed: '',
      operator: ''
    });
    setActiveDropdown(null);
  };

  const toggleDropdown = (pointId, type) => {
    const dropdownId = `${pointId}-${type}`;
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleDropdownAction = (action, point) => {
    setActiveDropdown(null);
    action(point);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.relative')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">客户积分管理</h1>
            <p className="text-gray-600">管理客户积分和兑换记录</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBatchPointsForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <Users className="w-5 h-5 mr-2" />
            批量调整积分
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加积分记录
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="搜索客户姓名、兑换记录或备注..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* 统计信息 */}
      <div className="bg-primary-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600">总积分记录</p>
            <p className="text-2xl font-bold text-primary-700">{customerPoints.length}</p>
          </div>
          <div>
            <p className="text-sm text-primary-600">搜索结果</p>
            <p className="text-2xl font-bold text-primary-700">{filteredPoints.length}</p>
          </div>
          <div>
            <p className="text-sm text-primary-600">总积分</p>
            <p className="text-2xl font-bold text-primary-700">
              {customerPoints.reduce((sum, point) => sum + (parseInt(point.points) || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* 积分列表 */}
      {filteredPoints.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    积分
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    开始日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    备注
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPoints.map((point) => {
                  const customer = customers.find(c => c.id === point.customerId);
                  return (
                    <tr key={point.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            {customer ? customer.name : '未知客户'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-sm font-medium text-yellow-600">
                            {point.points} 分
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {point.startDate || '未设置'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {point.notes || '无'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* 积分管理下拉菜单 */}
                          <div className="relative">
                            <button
                              onClick={() => toggleDropdown(point.id, 'points')}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="积分管理"
                            >
                              <Calculator className="w-4 h-4" />
                            </button>
                            {activeDropdown === `${point.id}-points` && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                <div className="py-2">
                                  <button
                                    onClick={() => handleDropdownAction(() => openPointsForm(point.customerId), point)}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <Calculator className="w-4 h-4 text-blue-500" />
                                    <span>调整积分</span>
                                  </button>
                                  <button
                                    onClick={() => handleDropdownAction(() => setShowRecords(point.customerId), point)}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <FileText className="w-4 h-4 text-green-500" />
                                    <span>积分记录</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 兑换管理下拉菜单 */}
                          <div className="relative">
                            <button
                              onClick={() => toggleDropdown(point.id, 'exchange')}
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                              title="兑换管理"
                            >
                              <Gift className="w-4 h-4" />
                            </button>
                            {activeDropdown === `${point.id}-exchange` && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                <div className="py-2">
                                  <button
                                    onClick={() => handleDropdownAction(() => openExchangeForm(point.customerId), point)}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <Gift className="w-4 h-4 text-purple-500" />
                                    <span>添加兑换</span>
                                  </button>
                                  <button
                                    onClick={() => handleDropdownAction(() => setShowExchangeRecords(point.customerId), point)}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <Receipt className="w-4 h-4 text-orange-500" />
                                    <span>兑换记录</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 编辑按钮 */}
                          <button
                            onClick={() => handleEdit(point)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* 删除按钮 */}
                          <button
                            onClick={() => setDeleteConfirm(point.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 分页组件 */}
          {filteredPoints.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPoints.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? '未找到匹配的积分记录' : '暂无积分记录'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? '请尝试其他搜索条件' : '开始添加第一个积分记录'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              添加积分记录
            </button>
          )}
        </div>
      )}

      {/* 添加/编辑积分表单 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPoint ? '编辑积分记录' : '添加积分记录'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客户 <span className="text-red-500">*</span>
                </label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">请选择客户</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  积分 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  placeholder="请输入积分"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  开始日期
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  兑换记录
                </label>
                <textarea
                  name="exchangeRecord"
                  value={formData.exchangeRecord}
                  onChange={handleChange}
                  placeholder="请输入兑换记录"
                  rows={3}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="请输入备注"
                  rows={3}
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingPoint ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              确认删除
            </h3>
            <p className="text-gray-600 mb-6">
              您确定要删除这个积分记录吗？此操作无法撤销。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 积分记录详情模态框 */}
      {showRecords && (() => {
        const allRecords = customerPointRecords
          .filter(record => record.customerId === showRecords)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const filteredRecords = allRecords.filter(record =>
          record.reason?.toLowerCase().includes(recordsSearchTerm.toLowerCase()) ||
          record.pointChange?.toString().includes(recordsSearchTerm) ||
          record.timestamp?.toLowerCase().includes(recordsSearchTerm.toLowerCase())
        );

        const recordsTotalPages = Math.ceil(filteredRecords.length / recordsItemsPerPage);
        const recordsStartIndex = (recordsCurrentPage - 1) * recordsItemsPerPage;
        const paginatedRecords = filteredRecords.slice(recordsStartIndex, recordsStartIndex + recordsItemsPerPage);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  积分记录详情
                </h3>
                <button
                  onClick={() => {
                    setShowRecords(null);
                    setRecordsSearchTerm('');
                    setRecordsCurrentPage(1);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 搜索栏 */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索调整原因、积分变化或时间..."
                  value={recordsSearchTerm}
                  onChange={(e) => setRecordsSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {paginatedRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          record.pointChange > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium text-gray-900">
                          {record.pointChange > 0 ? '积分增加' : '积分减少'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {record.timestamp || new Date(record.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">积分变化: </span>
                        <span className={`font-medium ${
                          record.pointChange > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {record.pointChange > 0 ? '+' : ''}{record.pointChange}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">当前积分: </span>
                        <span className="font-medium text-blue-600">{record.currentPoints || record.newPoints}</span>
                      </div>
                    </div>
                    {record.reason && (
                      <div className="text-sm">
                        <span className="text-gray-600">调整原因: </span>
                        <span className="text-gray-900">{record.reason}</span>
                      </div>
                    )}
                  </div>
                ))}

                {filteredRecords.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {recordsSearchTerm ? '未找到匹配的积分记录' : '暂无积分记录'}
                    </p>
                  </div>
                )}
              </div>

              {/* 分页组件 */}
              {filteredRecords.length > 0 && (
                <Pagination
                  currentPage={recordsCurrentPage}
                  totalPages={recordsTotalPages}
                  totalItems={filteredRecords.length}
                  itemsPerPage={recordsItemsPerPage}
                  onPageChange={setRecordsCurrentPage}
                  onItemsPerPageChange={setRecordsItemsPerPage}
                />
              )}

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowRecords(null);
                    setRecordsSearchTerm('');
                    setRecordsCurrentPage(1);
                  }}
                  className="btn-secondary"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 兑换记录详情 */}
      {showExchangeRecords && (() => {
        const point = customerPoints.find(p => p.customerId === showExchangeRecords);
        const customer = customers.find(c => c.id === showExchangeRecords);
        const exchangeRecord = point?.exchangeRecord;

        if (!exchangeRecord) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">兑换记录详情</h3>
                  <button
                    onClick={() => setShowExchangeRecords(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无兑换记录</p>
                </div>
              </div>
            </div>
          );
        }

        const allRecords = exchangeRecord.split('\n').filter(record => record.trim());

        const filteredExchangeRecords = allRecords.filter(record => {
          const searchLower = exchangeSearchTerm.toLowerCase();
          if (record.includes('|')) {
            const parts = record.split('|');
            const date = parts[0] || '';
            const content = parts[1] || '';
            const exchangePerson = parts[2] || '';
            const pointsUsed = parts[3] || '';
            return date.toLowerCase().includes(searchLower) ||
                   content.toLowerCase().includes(searchLower) ||
                   exchangePerson.toLowerCase().includes(searchLower) ||
                   pointsUsed.includes(exchangeSearchTerm);
          } else {
            return record.toLowerCase().includes(searchLower);
          }
        });

        const exchangeTotalPages = Math.ceil(filteredExchangeRecords.length / exchangeItemsPerPage);
        const exchangeStartIndex = (exchangeCurrentPage - 1) * exchangeItemsPerPage;
        const paginatedExchangeRecords = filteredExchangeRecords.slice(exchangeStartIndex, exchangeStartIndex + exchangeItemsPerPage);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">兑换记录详情</h3>
                <button
                  onClick={() => {
                    setShowExchangeRecords(null);
                    setExchangeSearchTerm('');
                    setExchangeCurrentPage(1);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 搜索栏 */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索兑换时间、物品、兑换人或积分..."
                  value={exchangeSearchTerm}
                  onChange={(e) => setExchangeSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">客户信息</h4>
                    <p className="text-blue-700">{customer?.name} - {customer?.phone}</p>
                  </div>

                  {paginatedExchangeRecords.map((record, index) => {
                      // 新格式：兑换时间|兑换物品|兑换人|减少积分|经办人
                      // 旧格式：兑换时间: 兑换内容
                      let date, content, exchangePerson, pointsUsed, operator;

                      if (record.includes('|')) {
                        // 新格式
                        const parts = record.split('|');
                        date = parts[0];
                        content = parts[1];
                        exchangePerson = parts[2];
                        pointsUsed = parts[3] || '0';
                        operator = parts[4] || '未知';
                      } else {
                        // 旧格式兼容
                        const [oldDate, ...contentParts] = record.split(': ');
                        date = oldDate;
                        content = contentParts.join(': ');
                        exchangePerson = '未知';
                        pointsUsed = '0';
                        operator = '未知';
                      }

                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-purple-500 mr-3" />
                              <span className="font-medium text-gray-900">兑换时间</span>
                            </div>
                            <span className="text-sm text-gray-500">{date}</span>
                          </div>
                          <div className="ml-6 space-y-2">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 w-20">兑换物品:</span>
                              <span className="text-sm text-gray-900">{content}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 w-20">兑换人:</span>
                              <span className="text-sm text-gray-900">{exchangePerson}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 w-20">减少积分:</span>
                              <span className="text-sm font-medium text-red-600">-{pointsUsed} 分</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 w-20">经办人:</span>
                              <span className="text-sm text-gray-900">{operator}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredExchangeRecords.length === 0 && (
                      <div className="text-center py-8">
                        <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          {exchangeSearchTerm ? '未找到匹配的兑换记录' : '暂无兑换记录'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 分页组件 */}
                {filteredExchangeRecords.length > 0 && (
                  <Pagination
                    currentPage={exchangeCurrentPage}
                    totalPages={exchangeTotalPages}
                    totalItems={filteredExchangeRecords.length}
                    itemsPerPage={exchangeItemsPerPage}
                    onPageChange={setExchangeCurrentPage}
                    onItemsPerPageChange={setExchangeItemsPerPage}
                  />
                )}

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowExchangeRecords(null);
                      setExchangeSearchTerm('');
                      setExchangeCurrentPage(1);
                    }}
                    className="btn-secondary"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* 积分调整表单 */}
      {showPointsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              积分调整
            </h3>
            <form onSubmit={handlePointsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  调整类型 <span className="text-red-500">*</span>
                </label>
                <select
                  name="changeType"
                  value={pointsFormData.changeType}
                  onChange={handlePointsChange}
                  className="input-field"
                  required
                >
                  <option value="increase">增加积分</option>
                  <option value="decrease">减少积分</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  积分数量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pointChange"
                  value={pointsFormData.pointChange}
                  onChange={handlePointsChange}
                  placeholder="请输入积分数量"
                  min="1"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  调整原因
                </label>
                <input
                  type="text"
                  name="reason"
                  value={pointsFormData.reason}
                  onChange={handlePointsChange}
                  placeholder="请输入调整原因"
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPointsForm(null);
                    setPointsFormData({ pointChange: '', changeType: 'increase', reason: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex-1"
                >
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 添加兑换记录表单 */}
      {showExchangeForm && (() => {
        const customer = customers.find(c => c.id === showExchangeForm);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                添加兑换记录
              </h3>
              {/* 小标题显示当前选中的客户 */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">当前客户：</span>{customer?.name || '未知客户'}
                </p>
              </div>
              <form onSubmit={handleExchangeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  兑换时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="exchangeDate"
                  value={exchangeFormData.exchangeDate}
                  onChange={handleExchangeChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  兑换内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="exchangeContent"
                  value={exchangeFormData.exchangeContent}
                  onChange={handleExchangeChange}
                  placeholder="请输入兑换内容"
                  rows={3}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  减少积分 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pointsUsed"
                  value={exchangeFormData.pointsUsed}
                  onChange={handleExchangeChange}
                  placeholder="请输入要减少的积分"
                  min="0"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  经办人 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="operator"
                  value={exchangeFormData.operator}
                  onChange={handleExchangeChange}
                  placeholder="请输入经办人姓名"
                  required
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowExchangeForm(null);
                    setExchangeFormData({ exchangeDate: '', exchangeContent: '', pointsUsed: '', operator: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex-1"
                >
                  添加
                </button>
              </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* 批量积分调整表单 */}
      {showBatchPointsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              批量调整客户积分
            </h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-orange-800">
                <strong>注意：</strong>此操作将对所有客户的积分进行调整。请谨慎操作。
              </p>
            </div>
            <form onSubmit={handleBatchPointsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  调整类型 <span className="text-red-500">*</span>
                </label>
                <select
                  name="changeType"
                  value={batchPointsFormData.changeType}
                  onChange={handleBatchPointsChange}
                  className="input-field"
                  required
                >
                  <option value="increase">增加积分</option>
                  <option value="decrease">减少积分</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  积分数量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pointChange"
                  value={batchPointsFormData.pointChange}
                  onChange={handleBatchPointsChange}
                  placeholder="请输入积分数量"
                  min="1"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  调整原因
                </label>
                <input
                  type="text"
                  name="reason"
                  value={batchPointsFormData.reason}
                  onChange={handleBatchPointsChange}
                  placeholder="请输入调整原因"
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBatchPointsForm(false);
                    setBatchPointsFormData({ pointChange: '', changeType: 'increase', reason: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex-1"
                >
                  确认调整
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPoints;
