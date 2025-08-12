import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './SecretPage.css';

const SecretPage = () => {
  const { logout } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ddayCount, setDdayCount] = useState(0);

  // D-day 계산
  useEffect(() => {
    const targetDate = new Date('2025-11-08');
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDdayCount(diffDays);
  }, []);

  // 달력 관련 상태
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    
    // 이전 달의 마지막 날들
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className="calendar-day">
          {day}
        </div>
      );
    }
    
    return days;
  };

  const pairsData = [
    ['효은', '성현', '지섭', '다혜', '효원', '', ''],
    ['수정', '유성', '성빈', '다혜/아인', '효원', '', ''],
    ['진경', '용현', '성빈', '다혜/아인', '효원', '', ''],
    ['은진', '유성/용현', '지섭', '가영', '효원', '', '']
  ];

  const headers = ['순희', '유령', '영수', '순영', '나상모', '멀티(남)', '멀티(여)'];

  return (
    <div className="secret-page">
      <header className="dday-container">
        <div className="dday-title">🎯 공연까지</div>
        <div className="dday-count">{ddayCount}일</div>
        <div className="dday-date">2025년 11월 8일</div>
      </header>

      <div className="content">
        <h1>🎉 여기까지 오셨군요!</h1>
        <p>이 페이지는 선택된 사람만 볼 수 있습니다.</p>

        <div className="pairs-container">
          <h2 className="pairs-title">페어 리스트</h2>
          <table className="pairs-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pairsData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={goToPreviousMonth}>&lt;</button>
            <div className="calendar-month">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </div>
            <button onClick={goToNextMonth}>&gt;</button>
          </div>
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div>일</div>
              <div>월</div>
              <div>화</div>
              <div>수</div>
              <div>목</div>
              <div>금</div>
              <div>토</div>
            </div>
            <div className="calendar-days">
              {renderCalendar()}
            </div>
          </div>
        </div>

        <button className="logout-button" onClick={logout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default SecretPage; 