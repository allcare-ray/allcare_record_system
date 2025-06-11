import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Users, UserCheck, Clock, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { customers, employees } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 计算统计数据
  const stats = {
    totalCustomers: customers.length,
    totalEmployees: employees.length,
    totalHours: customers.reduce((sum, customer) => sum + (parseInt(customer.hours) || 0), 0),
    recentCustomers: customers.filter(customer => {
      const createdDate = new Date(customer.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length
  };

  // 最近添加的客户
  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // 最近添加的员工
  const recentEmployees = employees
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      primary: 'bg-primary-100 text-primary-600'
    };

    return (
      <div className="card">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = 'primary' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      primary: 'bg-primary-100 text-primary-600'
    };

    return (
      <button
        onClick={onClick}
        className="card hover:shadow-md transition-shadow duration-200 text-left w-full"
      >
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.primary}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* 欢迎信息 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          欢迎回来，{user?.username}！
        </h1>
        <p className="text-primary-100">
          今天是 {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="总客户数"
          value={stats.totalCustomers}
          subtitle="已注册客户"
          color="primary"
        />
        <StatCard
          icon={UserCheck}
          title="总员工数"
          value={stats.totalEmployees}
          subtitle="在职员工"
          color="green"
        />
        <StatCard
          icon={Clock}
          title="总服务时数"
          value={stats.totalHours}
          subtitle="累计服务时间"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          title="本周新增"
          value={stats.recentCustomers}
          subtitle="新客户数量"
          color="purple"
        />
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActionCard
          icon={Plus}
          title="添加新客户"
          description="快速录入新客户信息"
          onClick={() => navigate('/customers/new')}
          color="primary"
        />
        <QuickActionCard
          icon={Plus}
          title="添加新员工"
          description="快速录入新员工信息"
          onClick={() => navigate('/employees/new')}
          color="green"
        />
      </div>

      {/* 最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近客户 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近添加的客户</h2>
            <button
              onClick={() => navigate('/customers')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {recentCustomers.length > 0 ? (
              recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                    <p className="text-sm text-primary-600">{customer.hours || 0} 小时</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">暂无客户记录</p>
            )}
          </div>
        </div>

        {/* 最近员工 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近添加的员工</h2>
            <button
              onClick={() => navigate('/employees')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {recentEmployees.length > 0 ? (
              recentEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(employee.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                    <p className="text-sm text-green-600">{employee.city || '未设置'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">暂无员工记录</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
