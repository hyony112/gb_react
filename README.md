# GhostBakery React

비밀번호 인증이 필요한 비공개 정보를 관리하는 React 애플리케이션입니다.

## 기능

- 🔐 비밀번호 인증 시스템
- 📅 D-day 카운트다운
- 👥 페어 리스트 관리
- 📆 인터랙티브 달력
- 🎨 모던한 UI/UX

## 기술 스택

- **Frontend**: React 19, React Router DOM
- **Backend**: Netlify Functions
- **Styling**: CSS3 with modern design
- **Deployment**: Netlify

## 설치 및 실행

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build

# Netlify Functions 테스트
netlify dev
```

## 프로젝트 구조

```
ghostbakery-react/
├── src/
│   ├── components/
│   │   ├── LoginPage.js          # 로그인 페이지
│   │   ├── LoginPage.css
│   │   ├── SecretPage.js         # 비밀 페이지
│   │   └── SecretPage.css
│   ├── context/
│   │   └── AuthContext.js        # 인증 상태 관리
│   ├── App.js                    # 메인 앱 컴포넌트
│   └── index.js
├── functions/                    # Netlify Functions
│   └── verify-password.js        # 비밀번호 검증
├── public/
└── package.json
```

## 환경 변수

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```
ACCESS_PASSWORD=your_secret_password
```

## 배포

1. Netlify에 프로젝트를 연결
2. 빌드 명령어: `npm run build`
3. 배포 디렉토리: `build`
4. Functions 디렉토리: `functions`

## 주요 컴포넌트

### LoginPage
- 비밀번호 입력 폼
- 실시간 유효성 검사
- 에러 메시지 표시

### SecretPage
- D-day 카운트다운
- 페어 리스트 테이블
- 인터랙티브 달력
- 로그아웃 기능

### AuthContext
- 전역 인증 상태 관리
- 쿠키 기반 인증
- 자동 로그인 상태 확인

## 라우팅

- `/` - 로그인 페이지
- `/secret` - 비밀 페이지 (인증 필요)

## 보안

- HttpOnly 쿠키 사용
- 서버 사이드 비밀번호 검증
- 클라이언트 사이드 라우트 보호
