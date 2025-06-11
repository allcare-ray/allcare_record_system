import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 初始状态
const initialState = {
  customers: [],
  employees: [],
  customerPoints: [],
  employeePoints: [],
  customerPointRecords: [],
  employeePointRecords: [],
  loading: false,
  error: null
};

// 动作类型
const DATA_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_DATA: 'LOAD_DATA',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  ADD_CUSTOMER_POINT: 'ADD_CUSTOMER_POINT',
  UPDATE_CUSTOMER_POINT: 'UPDATE_CUSTOMER_POINT',
  DELETE_CUSTOMER_POINT: 'DELETE_CUSTOMER_POINT',
  ADD_EMPLOYEE_POINT: 'ADD_EMPLOYEE_POINT',
  UPDATE_EMPLOYEE_POINT: 'UPDATE_EMPLOYEE_POINT',
  DELETE_EMPLOYEE_POINT: 'DELETE_EMPLOYEE_POINT',
  ADD_CUSTOMER_POINT_RECORD: 'ADD_CUSTOMER_POINT_RECORD',
  ADD_EMPLOYEE_POINT_RECORD: 'ADD_EMPLOYEE_POINT_RECORD'
};

// 数据 reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case DATA_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case DATA_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case DATA_ACTIONS.LOAD_DATA:
      return {
        ...state,
        customers: action.payload.customers || [],
        employees: action.payload.employees || [],
        customerPoints: action.payload.customerPoints || [],
        employeePoints: action.payload.employeePoints || [],
        customerPointRecords: action.payload.customerPointRecords || [],
        employeePointRecords: action.payload.employeePointRecords || [],
        loading: false,
        error: null
      };
    case DATA_ACTIONS.ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload]
      };
    case DATA_ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        )
      };
    case DATA_ACTIONS.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload)
      };
    case DATA_ACTIONS.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload]
      };
    case DATA_ACTIONS.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(employee =>
          employee.id === action.payload.id ? action.payload : employee
        )
      };
    case DATA_ACTIONS.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(employee => employee.id !== action.payload)
      };
    case DATA_ACTIONS.ADD_CUSTOMER_POINT:
      return {
        ...state,
        customerPoints: [...state.customerPoints, action.payload]
      };
    case DATA_ACTIONS.UPDATE_CUSTOMER_POINT:
      return {
        ...state,
        customerPoints: state.customerPoints.map(point =>
          point.id === action.payload.id ? action.payload : point
        )
      };
    case DATA_ACTIONS.DELETE_CUSTOMER_POINT:
      return {
        ...state,
        customerPoints: state.customerPoints.filter(point => point.id !== action.payload)
      };
    case DATA_ACTIONS.ADD_EMPLOYEE_POINT:
      return {
        ...state,
        employeePoints: [...state.employeePoints, action.payload]
      };
    case DATA_ACTIONS.UPDATE_EMPLOYEE_POINT:
      return {
        ...state,
        employeePoints: state.employeePoints.map(point =>
          point.id === action.payload.id ? action.payload : point
        )
      };
    case DATA_ACTIONS.DELETE_EMPLOYEE_POINT:
      return {
        ...state,
        employeePoints: state.employeePoints.filter(point => point.id !== action.payload)
      };
    case DATA_ACTIONS.ADD_CUSTOMER_POINT_RECORD:
      return {
        ...state,
        customerPointRecords: [...state.customerPointRecords, action.payload]
      };
    case DATA_ACTIONS.ADD_EMPLOYEE_POINT_RECORD:
      return {
        ...state,
        employeePointRecords: [...state.employeePointRecords, action.payload]
      };
    default:
      return state;
  }
};

// 创建数据上下文
const DataContext = createContext();

// 数据提供者组件
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 保存数据到本地存储
  const saveData = (customers = state.customers, employees = state.employees, customerPoints = state.customerPoints, employeePoints = state.employeePoints, customerPointRecords = state.customerPointRecords, employeePointRecords = state.employeePointRecords) => {
    try {
      localStorage.setItem('customers', JSON.stringify(customers));
      localStorage.setItem('employees', JSON.stringify(employees));
      localStorage.setItem('customerPoints', JSON.stringify(customerPoints));
      localStorage.setItem('employeePoints', JSON.stringify(employeePoints));
      localStorage.setItem('customerPointRecords', JSON.stringify(customerPointRecords));
      localStorage.setItem('employeePointRecords', JSON.stringify(employeePointRecords));
    } catch (error) {
      console.error('保存数据失败:', error);
      dispatch({ type: DATA_ACTIONS.SET_ERROR, payload: '保存数据失败' });
    }
  };

  // 简化的保存函数
  const saveAllData = () => {
    saveData(state.customers, state.employees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);
  };

  // 从本地存储加载数据
  const loadData = () => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_LOADING, payload: true });

      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const customerPoints = JSON.parse(localStorage.getItem('customerPoints') || '[]');
      const employeePoints = JSON.parse(localStorage.getItem('employeePoints') || '[]');
      const customerPointRecords = JSON.parse(localStorage.getItem('customerPointRecords') || '[]');
      const employeePointRecords = JSON.parse(localStorage.getItem('employeePointRecords') || '[]');

      dispatch({
        type: DATA_ACTIONS.LOAD_DATA,
        payload: { customers, employees, customerPoints, employeePoints, customerPointRecords, employeePointRecords }
      });
    } catch (error) {
      console.error('加载数据失败:', error);
      dispatch({ type: DATA_ACTIONS.SET_ERROR, payload: '加载数据失败' });
    }
  };

  // 生成唯一ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // 客户管理函数
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_CUSTOMER, payload: newCustomer });

    // 使用更新后的数据保存
    const updatedCustomers = [...state.customers, newCustomer];
    saveData(updatedCustomers, state.employees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);

    return newCustomer;
  };

  const updateCustomer = (id, customerData) => {
    const updatedCustomer = {
      ...customerData,
      id,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.UPDATE_CUSTOMER, payload: updatedCustomer });

    // 使用更新后的数据保存
    const updatedCustomers = state.customers.map(customer =>
      customer.id === id ? updatedCustomer : customer
    );
    saveData(updatedCustomers, state.employees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);

    return updatedCustomer;
  };

  const deleteCustomer = (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_CUSTOMER, payload: id });

    // 使用更新后的数据保存
    const updatedCustomers = state.customers.filter(customer => customer.id !== id);
    saveData(updatedCustomers, state.employees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);
  };

  // 员工管理函数
  const addEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_EMPLOYEE, payload: newEmployee });

    // 使用更新后的数据保存
    const updatedEmployees = [...state.employees, newEmployee];
    saveData(state.customers, updatedEmployees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);

    return newEmployee;
  };

  const updateEmployee = (id, employeeData) => {
    const updatedEmployee = {
      ...employeeData,
      id,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.UPDATE_EMPLOYEE, payload: updatedEmployee });

    // 使用更新后的数据保存
    const updatedEmployees = state.employees.map(employee =>
      employee.id === id ? updatedEmployee : employee
    );
    saveData(state.customers, updatedEmployees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);

    return updatedEmployee;
  };

  const deleteEmployee = (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_EMPLOYEE, payload: id });

    // 使用更新后的数据保存
    const updatedEmployees = state.employees.filter(employee => employee.id !== id);
    saveData(state.customers, updatedEmployees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);
  };

  // 客户积分管理函数
  const addCustomerPoint = (pointData) => {
    const newPoint = {
      ...pointData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_CUSTOMER_POINT, payload: newPoint });
    saveAllData();

    return newPoint;
  };

  const updateCustomerPoint = (id, pointData, adjustmentReason = null, isEdit = false) => {
    const oldPoint = state.customerPoints.find(point => point.id === id);
    const updatedPoint = {
      ...pointData,
      id,
      updatedAt: new Date().toISOString()
    };

    // 如果积分发生变化，创建积分记录
    if (oldPoint && parseInt(pointData.points) !== parseInt(oldPoint.points)) {
      const pointChange = parseInt(pointData.points) - parseInt(oldPoint.points);
      let reason = adjustmentReason;

      if (!reason) {
        if (isEdit) {
          reason = '通过编辑修改积分';
        } else {
          reason = pointChange > 0 ? '积分增加' : '积分减少';
        }
      }

      const pointRecord = {
        id: generateId(),
        customerId: oldPoint.customerId,
        pointChange: pointChange,
        previousPoints: parseInt(oldPoint.points) || 0,
        newPoints: parseInt(pointData.points) || 0,
        currentPoints: parseInt(pointData.points) || 0,
        reason: reason,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toLocaleString('zh-CN')
      };

      dispatch({ type: DATA_ACTIONS.ADD_CUSTOMER_POINT_RECORD, payload: pointRecord });
    }

    dispatch({ type: DATA_ACTIONS.UPDATE_CUSTOMER_POINT, payload: updatedPoint });
    saveAllData();

    return updatedPoint;
  };

  const deleteCustomerPoint = (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_CUSTOMER_POINT, payload: id });
    saveAllData();
  };

  // 员工积分管理函数
  const addEmployeePoint = (pointData) => {
    const newPoint = {
      ...pointData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_EMPLOYEE_POINT, payload: newPoint });
    saveAllData();

    return newPoint;
  };

  const updateEmployeePoint = (id, pointData, adjustmentReason = null, isEdit = false) => {
    const oldPoint = state.employeePoints.find(point => point.id === id);
    const updatedPoint = {
      ...pointData,
      id,
      updatedAt: new Date().toISOString()
    };

    // 如果积分发生变化，创建积分记录
    if (oldPoint && parseInt(pointData.points) !== parseInt(oldPoint.points)) {
      const pointChange = parseInt(pointData.points) - parseInt(oldPoint.points);
      let reason = adjustmentReason;

      if (!reason) {
        if (isEdit) {
          reason = '通过编辑修改积分';
        } else {
          reason = pointChange > 0 ? '积分增加' : '积分减少';
        }
      }

      const pointRecord = {
        id: generateId(),
        employeeId: oldPoint.employeeId,
        pointChange: pointChange,
        previousPoints: parseInt(oldPoint.points) || 0,
        newPoints: parseInt(pointData.points) || 0,
        currentPoints: parseInt(pointData.points) || 0,
        reason: reason,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toLocaleString('zh-CN')
      };

      dispatch({ type: DATA_ACTIONS.ADD_EMPLOYEE_POINT_RECORD, payload: pointRecord });
    }

    dispatch({ type: DATA_ACTIONS.UPDATE_EMPLOYEE_POINT, payload: updatedPoint });
    saveAllData();

    return updatedPoint;
  };

  const deleteEmployeePoint = (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_EMPLOYEE_POINT, payload: id });
    saveAllData();
  };

  // 批量调整客户积分
  const batchUpdateCustomerPoints = (pointChange, reason = '批量积分调整') => {
    const timestamp = new Date().toLocaleString('zh-CN');
    const createdAt = new Date().toISOString();

    state.customerPoints.forEach(point => {
      const currentPoints = parseInt(point.points) || 0;
      const newPoints = Math.max(0, currentPoints + pointChange);

      // 更新积分
      const updatedPoint = {
        ...point,
        points: newPoints,
        updatedAt: createdAt
      };
      dispatch({ type: DATA_ACTIONS.UPDATE_CUSTOMER_POINT, payload: updatedPoint });

      // 创建积分记录
      if (pointChange !== 0) {
        const pointRecord = {
          id: generateId(),
          customerId: point.customerId,
          pointChange: pointChange,
          previousPoints: currentPoints,
          newPoints: newPoints,
          currentPoints: newPoints,
          reason: reason,
          createdAt: createdAt,
          timestamp: timestamp
        };
        dispatch({ type: DATA_ACTIONS.ADD_CUSTOMER_POINT_RECORD, payload: pointRecord });
      }
    });

    saveAllData();
  };

  // 批量调整员工积分
  const batchUpdateEmployeePoints = (pointChange, reason = '批量积分调整') => {
    const timestamp = new Date().toLocaleString('zh-CN');
    const createdAt = new Date().toISOString();

    state.employeePoints.forEach(point => {
      const currentPoints = parseInt(point.points) || 0;
      const newPoints = Math.max(0, currentPoints + pointChange);

      // 更新积分
      const updatedPoint = {
        ...point,
        points: newPoints,
        updatedAt: createdAt
      };
      dispatch({ type: DATA_ACTIONS.UPDATE_EMPLOYEE_POINT, payload: updatedPoint });

      // 创建积分记录
      if (pointChange !== 0) {
        const pointRecord = {
          id: generateId(),
          employeeId: point.employeeId,
          pointChange: pointChange,
          previousPoints: currentPoints,
          newPoints: newPoints,
          currentPoints: newPoints,
          reason: reason,
          createdAt: createdAt,
          timestamp: timestamp
        };
        dispatch({ type: DATA_ACTIONS.ADD_EMPLOYEE_POINT_RECORD, payload: pointRecord });
      }
    });

    saveAllData();
  };

  const value = {
    ...state,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addCustomerPoint,
    updateCustomerPoint,
    deleteCustomerPoint,
    addEmployeePoint,
    updateEmployeePoint,
    deleteEmployeePoint,
    batchUpdateCustomerPoints,
    batchUpdateEmployeePoints,
    loadData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// 使用数据上下文的 Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
