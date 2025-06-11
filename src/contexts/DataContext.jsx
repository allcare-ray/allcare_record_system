import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getAllData, saveData, saveAllData } from '../utils/api';

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

  // 保存数据到服务器
  const saveDataToServer = async (customers = state.customers, employees = state.employees, customerPoints = state.customerPoints, employeePoints = state.employeePoints, customerPointRecords = state.customerPointRecords, employeePointRecords = state.employeePointRecords) => {
    try {
      const allData = {
        customers,
        employees,
        customerPoints,
        employeePoints,
        customerPointRecords,
        employeePointRecords
      };
      await saveAllData(allData);
    } catch (error) {
      console.error('保存数据失败:', error);
      dispatch({ type: DATA_ACTIONS.SET_ERROR, payload: '保存数据失败' });
    }
  };

  // 简化的保存函数
  const saveAllDataToServer = async () => {
    await saveDataToServer(state.customers, state.employees, state.customerPoints, state.employeePoints, state.customerPointRecords, state.employeePointRecords);
  };

  // 从服务器加载数据
  const loadData = async () => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_LOADING, payload: true });

      const data = await getAllData();

      dispatch({
        type: DATA_ACTIONS.LOAD_DATA,
        payload: {
          customers: data.customers || [],
          employees: data.employees || [],
          customerPoints: data.customerPoints || [],
          employeePoints: data.employeePoints || [],
          customerPointRecords: data.customerPointRecords || [],
          employeePointRecords: data.employeePointRecords || []
        }
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
  const addCustomer = async (customerData) => {
    const newCustomer = {
      ...customerData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_CUSTOMER, payload: newCustomer });
    await saveDataToServer();

    return newCustomer;
  };

  const updateCustomer = async (id, customerData) => {
    const updatedCustomer = {
      ...customerData,
      id,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.UPDATE_CUSTOMER, payload: updatedCustomer });
    await saveDataToServer();

    return updatedCustomer;
  };

  const deleteCustomer = async (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_CUSTOMER, payload: id });
    await saveDataToServer();
  };

  // 员工管理函数
  const addEmployee = async (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_EMPLOYEE, payload: newEmployee });
    await saveDataToServer();

    return newEmployee;
  };

  const updateEmployee = async (id, employeeData) => {
    const updatedEmployee = {
      ...employeeData,
      id,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.UPDATE_EMPLOYEE, payload: updatedEmployee });
    await saveDataToServer();

    return updatedEmployee;
  };

  const deleteEmployee = async (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_EMPLOYEE, payload: id });
    await saveDataToServer();
  };

  // 客户积分管理函数
  const addCustomerPoint = async (pointData) => {
    const newPoint = {
      ...pointData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_CUSTOMER_POINT, payload: newPoint });
    await saveDataToServer();

    return newPoint;
  };

  const updateCustomerPoint = async (id, pointData, adjustmentReason = null, isEdit = false) => {
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
    await saveDataToServer();

    return updatedPoint;
  };

  const deleteCustomerPoint = async (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_CUSTOMER_POINT, payload: id });
    await saveDataToServer();
  };

  // 员工积分管理函数
  const addEmployeePoint = async (pointData) => {
    const newPoint = {
      ...pointData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: DATA_ACTIONS.ADD_EMPLOYEE_POINT, payload: newPoint });
    await saveDataToServer();

    return newPoint;
  };

  const updateEmployeePoint = async (id, pointData, adjustmentReason = null, isEdit = false) => {
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
    await saveDataToServer();

    return updatedPoint;
  };

  const deleteEmployeePoint = async (id) => {
    dispatch({ type: DATA_ACTIONS.DELETE_EMPLOYEE_POINT, payload: id });
    await saveDataToServer();
  };

  // 批量调整客户积分
  const batchUpdateCustomerPoints = async (pointChange, reason = '批量积分调整') => {
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

    await saveDataToServer();
  };

  // 批量调整员工积分
  const batchUpdateEmployeePoints = async (pointChange, reason = '批量积分调整') => {
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

    await saveDataToServer();
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
