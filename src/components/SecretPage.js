import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './SecretPage.css';

const SecretPage = () => {
  const { logout } = useAuth();
  const [ddayCount, setDdayCount] = useState(0);
  const [videoData, setVideoData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSceneModal, setShowSceneModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    ['A팀', '효은', '성현', '성빈', '다혜', '효원', 'D팀'],
    ['B팀', '수정', '유성', '용수', '가영', '민석', 'C팀'],
    ['C팀', '진경', '용현', '성빈', '다혜', '효원', 'B팀'],
    ['D팀', '은진', '지섭', '용수', '가영', '민석', 'A팀']
  ];

  const headers = ['', '순희', '유령', '영수', '순영', '나상모', '멀티'];

  const subCharacterData = [
    ['Prologue', '', '', '컴퍼니댄서', '컴퍼니댄서', ''],
    ['1', '환상직원3', '진상손님1', '환상직원1', '환상직원2, 진상손님2', '옆집할아버지'],
    ['6', '', '일꾼1', '일꾼2', '', ''],
    ['7', '손님2', '', '', '손님1', ''],
    ['9', '상모직원2', '', '상모직원1', 'VIP', ''],
    ['11', '손님1', '손님2', '손님4', '손님3', '인쇄소주인'],
    ['12', '', '', '구청직원', '', ''],
    ['14', '', '', '상모직원', '', ''],
    ['16', '손님1', '손님2', '손님3', '손님4', ''],
    ['17', '환상직원3', '', '환상직원1', '환상직원2', '옆집할아버지'],
    ['20', '', '', '', '', '옆집할아버지'],
    ['21', '', '', '구청직원', '', ''],
  ];

  const subCharacterHeaders = ['SCENE', '순희', '유령', '영수', '순영', '상모'];

  // 슬라이더 관련 함수들
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 6);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 6) % 6);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 각 슬라이드별 테이블 데이터 생성
  const getSlideData = (slideIndex) => {
    if (slideIndex === 0) {
      // 전체 테이블
      return {
        headers: subCharacterHeaders,
        data: subCharacterData
      };
    } else {
      // 1열 + 해당 열만
      const columnIndex = slideIndex;
      return {
        headers: [subCharacterHeaders[0], subCharacterHeaders[columnIndex]],
        data: subCharacterData.map(row => [row[0], row[columnIndex]])
      };
    }
  };

  const slideTitles = [
    '전체 부캐',
    '순희 부캐',
    '유령 부캐', 
    '영수 부캐',
    '순영 부캐',
    '상모 부캐'
  ];

  const sceneData = [
    ['PROLOGUE - 버려진 가게', '#1. PROLOGUE - 컴퍼니(off-stage)', '#1. Prologue: 시간의 춤'],
    ['S1 - 환상 속 순희의 베이커리 / 나상모 과자점', '#2. "어서오세요!" / "참아!" (Opening Sequence)', '#2. Opening: "어서오세요!" / "참아!" / "최고의 베이커"'],
    ['S2 - 순희 / 순영네 집', '#3. 한 사람 - 순희, 순영', '#3. 한 사람'],  
    ['S3 - 버려진 가게', '#4. The Ghost Song - 유령', '#4. Ghost Song'],
    ['S4 - 가게 앞 길', '', ''],
    ['S5 - 가게 안', '#4A. "참아!" Reprise (순희 Excerpt) - 순희\n#4B. Ghost Song Rep. - 유령', ''],
    ['S6 - 가게 안, 다음 날', '#5. 이상한 동업자 - 유령, 순희', '#5. 이상한 동업자'],
    ['S7 - 고스트 베이커리 안', '', ''],
    ['S8 - 가게 안 / 가게 앞 거리', '#6. "어서오세요!" Reprise 1 (영수 Ver.) - 영수, 순희, 유령, 순영', '#6 "어서 오세요" Rep. 1 (영수 Ver.)'],
    ['S9 - 나상모 과자점', '#6A. "Sang Mo Tastes the Past" - 나상모', ''],
    ['S10 - 고스트 베이커리', '', ''],
    ['S11 - 서울, 1946년', '#7. FLASHBACK - 유령, 나상모, 앙상블', '#7. 회상 (1946년 서울)'],
    ['S12 - 가게 안', '', ''],
    ['S13 - 순희 / 순영의 집', '#8. 한 사람 Reprise (순희 Ver.) - 순희\n#9. 이상한 동업자 Reprise (크리스마스 케이크 Ver.) - 순희, 유령', '#8. 한 사람 Rep. 1\n#9. 이상한 동업자 Rep.: 크리스마스 케이크'],
    ['S14 - 가게 안', '#10. 프렌치 LP - 컴퍼니', '#10. 불란서 레코드: "겨울이좋아졌어요 (그댈 만난 이후로)"'],
    ['S14A - 가게 앞', '', ''],
    ['S15 - 가게 안', '#11. 나 같은 사람 - 영수', '#11. 나 같은 사람'],
    ['S16 - 가게 안, 밖', '#12. 나 혼자만 슬픈 크리스마스 - 유령, 앙상블', '#12. 나 혼자만 슬픈 크리스마스'],
    ['S17 - 가게 안', '#13. DANCE / PROLOGUE Reprise - 컴퍼니(off-stage), 영수', '#13. 바보같은 짓 / 시간의 춤'],
    ['S17A - 서울 거리 위', '#13A. 앙순이 케이크 - 앙상블', ''],
    ['S18 - 가게 안', '', ''],
    ['S19 - 순희 / 순영의 집', '#14. 한 사람 Reprise #2 (순영 Ver.) - 순영', '#14. 한 사람 Rep. 2(순영 Ver.)'],
    ['S20 - 가게 안', '#14B. FLASHBACK Reprise (나상모 Ver.) - 나상모', ''],
    ['S21 - 가게 안', '#15. "어서오세요!" Reprise 2 - 영수, 순영, 구청 직원\n#16. 유령의 독백 - 유령', '#15. "어서오세요!" Rep. 2: 새 계약서'],
    ['S22 - 가게 안', '#17. 안녕, 하기 전에 - 순희', '#17. 안녕, 하기 전에'],
    ['S23 - 가게 안', '#18. Morning at Ghost Bakery - 앙상블', '#18. Finale: 고스트 베이커리의 아침']
  ];

  const sceneHeaders = ['장면', '대본 넘버', '실황 넘버'];

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

  const SceneModal = () => {
    if (!showSceneModal) return null;

    return (
      <div className="scene-modal-overlay" onClick={() => setShowSceneModal(false)}>
        <div className="scene-modal" onClick={(e) => e.stopPropagation()}>
          <div className="scene-modal-header">
            <h3>🎭 장면 정보</h3>
            <button 
              className="close-button" 
              onClick={() => setShowSceneModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="scene-table-container">
            <table className="scene-table">
              <thead>
                <tr>
                  {sceneHeaders.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sceneData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={cellIndex === 1 ? 'number-cell' : ''}>
                        {cell.split('\n').map((line, lineIndex) => (
                          <div key={lineIndex}>{line}</div>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ImageModal = () => {
    if (!showImageModal) return null;

    return (
      <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
        <div className="image-modal" onClick={(e) => e.stopPropagation()}>
          <div className="image-modal-header">
            <h3>📋 출연 정보</h3>
            <button 
              className="close-button" 
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="image-container">
            <img 
              src="/sinfo.png" 
              alt="출연 정보" 
              className="info-image"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="secret-page">
      <button 
        className="hamburger-button"
        onClick={() => setShowSceneModal(true)}
        title="장면 정보 보기"
      >
        ☰
      </button>

      <header className="dday-container">
        <div className="dday-title">🎯 공연까지</div>
        <div className="dday-count">D-{ddayCount}</div>
        <div className="dday-date">2025년 11월 8일</div>
      </header>

      <div className="content">

        <div className="links-container">
          <h2 className="links-title">🔗 유용한 링크</h2>
          <div className="links-list">
            <a 
              href="https://www.test.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-item"
            >
              <span className="link-label">소품시트</span>
              <span className="link-url">https://docs.google.com/spreadsheets/d/1Jp5vA-GDanr-umpRi1UX2vycB9Nbsl-Xgiq4wa_KRNY/edit?usp=sharing</span>
            </a>
            <a 
              href="https://www.test2.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-item"
            >
              <span className="link-label">MR시트</span>
              <span className="link-url">https://docs.google.com/spreadsheets/d/1vIL9utcKE14U36NhJuxhUghD3hiYLG89obkPkCQweps/htmlview</span>
            </a>
          </div>
        </div>

        <div className="pairs-container">
          <div className="pairs-title-container">
            <h2 className="pairs-title">페어 리스트</h2>
            <button 
              className="info-button"
              onClick={() => setShowImageModal(true)}
              title="페어 정보 보기"
            >
              ℹ️
            </button>
          </div>
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

        <div className="pairs-container">
          <h2 className="pairs-title">부캐 리스트</h2>
          <div className="sub-character-slider">
            <button onClick={prevSlide}>&lt;</button>
            <div className="slide-container">
              {slideTitles.map((title, index) => (
                <div
                  key={index}
                  className={`slide ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                >
                  {title}
                </div>
              ))}
            </div>
            <button onClick={nextSlide}>&gt;</button>
          </div>
          <div className="sub-character-table-container">
            <table className="sub-character-table">
              <thead>
                <tr>
                  {getSlideData(currentSlide).headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getSlideData(currentSlide).data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="recording-container">
          <h2 className="recording-title">🎙️ 녹음 TODO 목록</h2>
          <ul className="recording-list">
            <li>#1. Prologue - 컴퍼니</li>
            <li>S2. 조카1, 조카2 목소리</li>
            <li>#13. DANCE / PROLOGUE Reprise - 컴퍼니(off-stage), 영수</li>
          </ul>
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
      <SceneModal />
      <ImageModal />
    </div>
  );
};

export default SecretPage; 
