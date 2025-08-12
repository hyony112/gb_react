import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 쿠키에서 인증 상태 확인
    const checkAuthStatus = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => 
        cookie.trim().startsWith('gb_auth=')
      );
      
      if (authCookie && authCookie.includes('ok')) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (password) => {
    try {
      const response = await fetch('/.netlify/functions/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const result = process.env.NODE_ENV === 'development' 
        ? {success: true} // 개발 환경
        : await response.json(); // 운영 환경

      if (result.success) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error || '비밀번호가 틀렸습니다.' };
      }
    } catch (error) {
      return { success: false, error: '서버 오류가 발생했습니다.' };
    }
  };

  const logout = () => {
    // 쿠키 삭제
    document.cookie = 'gb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 