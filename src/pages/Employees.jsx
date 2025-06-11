import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  UserCheck,
  Grid3X3,
  List,
  X,
  Eye,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const Employees = () => {
  const { employees, deleteEmployee } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'card' or 'list'
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  // 过滤和排序员工
  const filteredAndSortedEmployees = employees
    .filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      let aValue, bValue;

      switch (sortField) {
        case 'status':
          aValue = a.status || '咨询';
          bValue = b.status || '咨询';
          break;
        default:
          return 0;
      }

      // 字符串排序
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const filteredEmployees = filteredAndSortedEmployees;

  // 分页计算
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

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
    deleteEmployee(id);
    setDeleteConfirm(null);
  };

  const EmployeeCard = ({ employee }) => (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {employee.name}
          </h3>
          <p className="text-sm text-gray-600">
            年龄: {employee.age} 岁
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/employees/edit/${employee.id}`)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirm(employee.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* 联系方式 */}
        <div className="flex items-center text-sm">
          <Phone className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-900">{employee.phone}</span>
        </div>

        {employee.wechat && (
          <div className="flex items-center text-sm">
            <MessageCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-gray-900">{employee.wechat}</span>
          </div>
        )}

        {employee.email && (
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-900">{employee.email}</span>
          </div>
        )}

        {/* 地址信息 */}
        {(employee.city || employee.address) && (
          <div className="flex items-start text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
            <div>
              {employee.city && (
                <div className="text-gray-900">{employee.city}</div>
              )}
              {employee.address && (
                <div className="text-gray-600">{employee.address}</div>
              )}
            </div>
          </div>
        )}

        {/* 备注 */}
        {employee.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{employee.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          创建时间: {new Date(employee.createdAt).toLocaleDateString('zh-CN')}
        </p>
      </div>
    </div>
  );

  // 员工列表视图组件
  const EmployeeListView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                员工信息
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
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEmployee(employee)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">年龄: {employee.age || '未填写'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.status === '咨询'
                      ? 'bg-yellow-100 text-yellow-800'
                      : employee.status === '注册中'
                      ? 'bg-blue-100 text-blue-800'
                      : employee.status === '在职'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status || '咨询'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      {employee.phone || '未填写'}
                    </div>
                    {employee.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {employee.email}
                      </div>
                    )}
                    {employee.wechat && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageCircle className="w-4 h-4 text-gray-400 mr-2" />
                        {employee.wechat}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.city && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {employee.city}
                      </div>
                    )}
                    {employee.address && (
                      <div className="text-xs text-gray-500 mt-1">
                        {employee.address}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(employee.createdAt).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(employee);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/employees/edit/${employee.id}`);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(employee.id);
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
          <h1 className="text-2xl font-bold text-gray-900">员工管理</h1>
          <p className="text-gray-600">管理所有员工信息</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 视图切换按钮 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-green-600 shadow-sm'
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
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="卡片视图"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => navigate('/employees/new')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加员工
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
          placeholder="搜索员工姓名、电话、邮箱或城市..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* 统计信息 */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600">总员工数</p>
            <p className="text-2xl font-bold text-green-700">{employees.length}</p>
          </div>
          <div>
            <p className="text-sm text-green-600">搜索结果</p>
            <p className="text-2xl font-bold text-green-700">{filteredEmployees.length}</p>
          </div>
        </div>
      </div>

      {/* 员工列表 */}
      {filteredEmployees.length > 0 ? (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </div>
          ) : (
            <EmployeeListView />
          )}

          {/* 分页组件 */}
          {filteredEmployees.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEmployees.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? '未找到匹配的员工' : '暂无员工'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? '请尝试其他搜索条件' : '开始添加您的第一个员工'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/employees/new')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              添加员工
            </button>
          )}
        </div>
      )}

      {/* 员工详情模态框 */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                员工详情
              </h3>
              <button
                onClick={() => setSelectedEmployee(null)}
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
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">年龄</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.age || '未填写'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">状态</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedEmployee.status === '咨询'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedEmployee.status === '注册中'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedEmployee.status === '在职'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedEmployee.status || '咨询'}
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
                    <span className="text-sm text-gray-900">{selectedEmployee.phone || '未填写'}</span>
                  </div>
                  {selectedEmployee.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{selectedEmployee.email}</span>
                    </div>
                  )}
                  {selectedEmployee.wechat && (
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{selectedEmployee.wechat}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 地址信息 */}
              {(selectedEmployee.city || selectedEmployee.address) && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">地址信息</h4>
                  <div className="space-y-2">
                    {selectedEmployee.city && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{selectedEmployee.city}</span>
                      </div>
                    )}
                    {selectedEmployee.address && (
                      <p className="text-sm text-gray-600 ml-7">{selectedEmployee.address}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 备注 */}
              {selectedEmployee.notes && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">备注</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedEmployee.notes}</p>
                  </div>
                </div>
              )}

              {/* 创建时间 */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">其他信息</h4>
                <p className="text-sm text-gray-500">
                  创建时间: {new Date(selectedEmployee.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="btn-secondary"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  navigate(`/employees/edit/${selectedEmployee.id}`);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                编辑员工
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
              您确定要删除这个员工吗？此操作无法撤销。
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

export default Employees;
