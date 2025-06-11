import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { secureStore, secureRetrieve, secureRemove } from '../utils/encryption';

// 默认管理员账户
const DEFAULT_ADMIN = {
  username: 'gaorui',
  password: '154145',
  role: 'admin'
};

// 认证状态
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true
};

// 认证动作类型
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING'
};

// 认证 reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 检查是否已登录
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = secureRetrieve('currentUser');
      const loginTime = secureRetrieve('loginTime');
      
      // 检查登录是否过期（24小时）
      if (savedUser && loginTime) {
        const now = new Date().getTime();
        const timeDiff = now - loginTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: savedUser
          });
        } else {
          // 登录过期，清除数据
          secureRemove('currentUser');
          secureRemove('loginTime');
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // 登录函数
  const login = (username, password) => {
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const user = {
        username: DEFAULT_ADMIN.username,
        role: DEFAULT_ADMIN.role,
        loginTime: new Date().toISOString()
      };
      
      // 保存用户信息和登录时间
      secureStore('currentUser', user);
      secureStore('loginTime', new Date().getTime());
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: user
      });
      
      return { success: true };
    } else {
      return { success: false, message: '用户名或密码错误' };
    }
  };

  // 登出函数
  const logout = () => {
    secureRemove('currentUser');
    secureRemove('loginTime');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // 检查是否为管理员
  const isAdmin = () => {
    return state.user && state.user.role === 'admin';
  };

  const value = {
    ...state,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
