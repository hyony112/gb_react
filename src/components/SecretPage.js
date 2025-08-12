import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './SecretPage.css';

const SecretPage = () => {
  const { logout } = useAuth();
  const [ddayCount, setDdayCount] = useState(0);
  const [videoData, setVideoData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // D-day 계산
  useEffect(() => {
    const targetDate = new Date('2025-11-08');
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDdayCount(diffDays);
  }, []);

  // video.json 데이터 로드
  useEffect(() => {
    fetch('/video.json')
      .then(response => response.json())
      .then(data => setVideoData(data))
      .catch(error => console.error('Error loading video data:', error));
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

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (day) => {
    const dateString = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (videoData[dateString]) {
      setSelectedDate(dateString);
      setShowVideoModal(true);
    }
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
      const dateString = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const hasVideo = videoData[dateString];
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${hasVideo ? 'has-video' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {hasVideo && <div className="video-indicator">🎥</div>}
        </div>
      );
    }
    
    return days;
  };

  const pairsData = [
    ['효은', '성현', '지섭', '다혜', '효원/민석', '', ''],
    ['수정', '유성', '성빈', '다혜/아인', '효원/민석', '', ''],
    ['진경', '용현', '성빈', '다혜/아인', '효원/민석', '', ''],
    ['은진', '유성/용현', '지섭', '가영', '효원/민석', '', '']
  ];

  const headers = ['순희', '유령', '영수', '순영', '나상모', '멀티(남)', '멀티(여)'];

  const VideoModal = () => {
    if (!showVideoModal || !selectedDate) return null;

    const videos = videoData[selectedDate];
    const dateObj = new Date(selectedDate);
    const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;

    return (
      <div className="video-modal-overlay" onClick={() => setShowVideoModal(false)}>
        <div className="video-modal" onClick={(e) => e.stopPropagation()}>
          <div className="video-modal-header">
            <h3>{formattedDate} 연습 영상</h3>
            <button 
              className="close-button" 
              onClick={() => setShowVideoModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="video-list">
            {videos.map((video, index) => (
              <a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-link"
              >
                {video.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="secret-page">
      <header className="dday-container">
        <div className="dday-title">🎯 공연까지</div>
        <div className="dday-count">D-{ddayCount}</div>
        <div className="dday-date">2025년 11월 8일</div>
      </header>

      <div className="content">

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
      <VideoModal />
    </div>
  );
};

export default SecretPage; 