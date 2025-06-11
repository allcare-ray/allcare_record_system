import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Pagination from '../components/Pagination';
import {
  Search,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Users,
  Grid3X3,
  List,
  X,
  Eye,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const Customers = () => {
  const { customers, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'card' or 'list'
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 排序状态
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // 排序函数
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 过滤和排序客户
  const filteredAndSortedCustomers = customers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      let aValue, bValue;

      switch (sortField) {
        case 'status':
          aValue = a.status || '咨询';
          bValue = b.status || '咨询';
          break;
        case 'hours':
          aValue = parseInt(a.hours) || 0;
          bValue = parseInt(b.hours) || 0;
          break;
        default:
          return 0;
      }

      if (sortField === 'hours') {
        // 数字排序
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // 字符串排序
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });

  const filteredCustomers = filteredAndSortedCustomers;

  // 分页计算
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

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

  const handleDelete = (id) => {
    deleteCustomer(id);
    setDeleteConfirm(null);
  };

  const CustomerCard = ({ customer }) => (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {customer.name}
          </h3>
          <p className="text-sm text-gray-600">
            年龄: {customer.age} 岁
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setDeleteConfirm(customer.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* 服务时数 */}
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 text-primary-600 mr-2" />
          <span className="text-gray-600">服务时数:</span>
          <span className="ml-1 font-medium text-primary-600">
            {customer.hours || 0} 小时
          </span>
        </div>

        {/* 联系方式 */}
        <div className="flex items-center text-sm">
          <Phone className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-900">{customer.phone}</span>
        </div>

        {customer.wechat && (
          <div className="flex items-center text-sm">
            <MessageCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-gray-900">{customer.wechat}</span>
          </div>
        )}

        {customer.email && (
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-900">{customer.email}</span>
          </div>
        )}

        {/* 地址信息 */}
        {(customer.city || customer.address) && (
          <div className="flex items-start text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
            <div>
              {customer.city && (
                <div className="text-gray-900">{customer.city}</div>
              )}
              {customer.address && (
                <div className="text-gray-600">{customer.address}</div>
              )}
            </div>
          </div>
        )}

        {/* 备注 */}
        {customer.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{customer.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          创建时间: {new Date(customer.createdAt).toLocaleDateString('zh-CN')}
        </p>
      </div>
    </div>
  );

  // 客户列表视图组件
  const CustomerListView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                客户信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>状态</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                联系方式
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('hours')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>服务时数</span>
                  {sortField === 'hours' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                地址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">年龄: {customer.age || '未填写'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.status === '咨询'
                      ? 'bg-yellow-100 text-yellow-800'
                      : customer.status === '注册中'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status || '咨询'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      {customer.phone || '未填写'}
                    </div>
                    {customer.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {customer.email}
                      </div>
                    )}
                    {customer.wechat && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageCircle className="w-4 h-4 text-gray-400 mr-2" />
                        {customer.wechat}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-primary-600 mr-2" />
                    <span className="font-medium text-primary-600">
                      {customer.hours || 0} 小时
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.city && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {customer.city}
                      </div>
                    )}
                    {customer.address && (
                      <div className="text-xs text-gray-500 mt-1">
                        {customer.address}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(customer);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(customer.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户管理</h1>
          <p className="text-gray-600">管理所有客户信息</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 视图切换按钮 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="列表视图"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="卡片视图"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="搜索客户姓名、电话、邮箱或城市..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* 统计信息 */}
      <div className="bg-primary-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600">总客户数</p>
            <p className="text-2xl font-bold text-primary-700">{customers.length}</p>
          </div>
          <div>
            <p className="text-sm text-primary-600">搜索结果</p>
            <p className="text-2xl font-bold text-primary-700">{filteredCustomers.length}</p>
          </div>
          <div>
            <p className="text-sm text-primary-600">总服务时数</p>
            <p className="text-2xl font-bold text-primary-700">
              {customers.reduce((sum, customer) => sum + (parseInt(customer.hours) || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* 客户列表 */}
      {filteredCustomers.length > 0 ? (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          ) : (
            <CustomerListView />
          )}

          {/* 分页组件 */}
          {filteredCustomers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? '未找到匹配的客户' : '暂无客户'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? '请尝试其他搜索条件' : '暂无客户数据'}
          </p>
        </div>
      )}

      {/* 客户详情模态框 */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                客户详情
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">基本信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">姓名</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">年龄</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.age || '未填写'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">服务时数</label>
                    <p className="mt-1 text-sm text-primary-600 font-medium">{selectedCustomer.hours || 0} 小时</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">状态</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedCustomer.status === '咨询'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedCustomer.status === '注册中'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCustomer.status || '咨询'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 联系方式 */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">联系方式</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{selectedCustomer.phone || '未填写'}</span>
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{selectedCustomer.email}</span>
                    </div>
                  )}
                  {selectedCustomer.wechat && (
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{selectedCustomer.wechat}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 地址信息 */}
              {(selectedCustomer.city || selectedCustomer.address) && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">地址信息</h4>
                  <div className="space-y-2">
                    {selectedCustomer.city && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{selectedCustomer.city}</span>
                      </div>
                    )}
                    {selectedCustomer.address && (
                      <p className="text-sm text-gray-600 ml-7">{selectedCustomer.address}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 备注 */}
              {selectedCustomer.notes && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">备注</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedCustomer.notes}</p>
                  </div>
                </div>
              )}

              {/* 创建时间 */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">其他信息</h4>
                <p className="text-sm text-gray-500">
                  创建时间: {new Date(selectedCustomer.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-primary"
              >
                关闭
              </button>
            </div>
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
              您确定要删除这个客户吗？此操作无法撤销。
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
    </div>
  );
};

export default Customers;
