# Vue3 MSA Frontend 공통 뼈대

MSA(Microservices Architecture) 환경에서 구동되는 Vue3 기반 프론트엔드 공통 뼈대입니다.

## 🚀 주요 기능

- **JWT 기반 인증 시스템** (자동 토큰 갱신)
- **MSA 환경 최적화** (도메인별 API 모듈화)
- **전역 모달 시스템** (Alert, Confirm, Error, Success)
- **페이지네이션 & 검색** (URL 쿼리 동기화)
- **유효성 검사 시스템** (실시간 검증)
- **네비게이션 헬퍼** (권한 기반 라우팅)
- **쿠폰 발급 시스템** (선착순 기능 지원)
- **상품 관리 시스템** (장바구니 기능)

## 🏗️ 아키텍처 개요

### 서비스 구성 (MSA)
- **User Service** (포트 8080): 인증, 회원가입, 사용자 관리
- **Product Service** (포트 8081): 상품 조회, 관리
- **Coupon Service** (포트 8082): 쿠폰 발급, 관리
- **Order Service** (포트 8083): 주문 처리, 결제

### 인증 방식
- **AccessToken**: JWT Bearer Token (Header 주입)
- **RefreshToken**: HttpOnly Cookie
- **자동 갱신**: 401 에러 시 자동 토큰 갱신 및 재시도

## 📁 프로젝트 구조

```
src/
├── api/                    # API 모듈 (MSA 서비스별)
│   ├── client.js          # Axios 클라이언트 설정
│   ├── interceptors.js    # 요청/응답 인터셉터
│   ├── auth.js           # 사용자 서비스 API
│   ├── product.js        # 상품 서비스 API
│   ├── coupon.js         # 쿠폰 서비스 API
│   └── order.js          # 주문 서비스 API
├── components/           # 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   │   ├── BaseButton.vue       # 기본 버튼
│   │   ├── BaseInput.vue        # 기본 입력
│   │   ├── CommonModal.vue      # 전역 모달
│   │   └── modals/              # 모달 컴포넌트들
│   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── DefaultLayout.vue    # 기본 레이아웃
│   │   ├── AuthLayout.vue       # 인증 레이아웃
│   │   ├── TopNavigation.vue    # 상단 네비게이션
│   │   └── SideMenu.vue         # 사이드 메뉴
│   └── main/             # 메인 페이지 컴포넌트
│       ├── MainNavigation.vue   # 메인 네비게이션
│       ├── HeroBanner.vue       # 히어로 배너
│       ├── ProductGrid.vue      # 상품 그리드
│       └── ProductCard.vue      # 상품 카드
├── views/                # 페이지 컴포넌트
│   ├── Home.vue          # 메인 페이지
│   ├── Login.vue         # 로그인 페이지
│   ├── Register.vue      # 회원가입 페이지
│   ├── CouponPage.vue    # 쿠폰 발급 페이지
│   └── ErrorPage.vue     # 에러 페이지
├── composables/          # 재사용 가능한 로직
│   ├── useAuth.js        # 인증 관련
│   ├── useModal.js       # 모달 관리
│   ├── useApi.js         # API 호출 헬퍼
│   ├── useList.js        # 목록/페이지네이션
│   ├── useNavigation.js  # 네비게이션 헬퍼
│   └── useValidation.js  # 유효성 검사 헬퍼
├── store/                # Pinia 스토어
│   ├── auth.js           # 인증 상태 관리
│   ├── modal.js          # 모달 상태 관리
│   └── cart.js           # 장바구니 상태 관리
├── utils/                # 유틸리티 함수들
│   ├── navigation.js     # 네비게이션 헬퍼
│   ├── helpers.js        # 공통 헬퍼 함수들
│   └── validation.js     # 유효성 검사 함수들
├── constants/            # 상수 정의
│   └── apiCodes.js       # API 응답 코드 상수
├── assets/               # 정적 자원
│   ├── styles/           # CSS 파일들
│   │   ├── components/   # 컴포넌트별 CSS
│   │   └── pages/        # 페이지별 CSS
│   └── images/           # 이미지 파일들
├── layouts/              # 레이아웃 컴포넌트
├── router/               # 라우터 설정
└── main.js              # 앱 진입점
```

## 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 🎯 핵심 기능

### 1. 쿠폰 발급 시스템

**선착순 쿠폰 지원**
```javascript
// 쿠폰 목록 조회
const coupons = await couponAPI.getAvailableTemplates()

// 쿠폰 발급 (로그인 필요)
await couponAPI.issueCoupon(templateId)
```

**주요 특징**
- 발급 기간 기반 버튼 상태 (발급 예정/다운로드/발급 마감)
- 선착순 수량 표시 (`선착순: 100명`)
- 로그인 전 사용자 안내 메시지
- 실시간 발급 상태 확인

### 2. 상품 관리 시스템

**상품 목록 & 검색**
```javascript
// 상품 목록 조회 (페이지네이션)
const products = await productAPI.getProducts({ page: 0, size: 20 })

// 상품 검색
const results = await productAPI.searchProducts({ 
  keyword: '스마트폰',
  minPrice: 100000,
  maxPrice: 2000000
})
```

**장바구니 기능**
```javascript
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()

// 상품 추가
cartStore.addItem(product, quantity)

// 수량 변경
cartStore.updateQuantity(productId, newQuantity)
```

### 3. Axios 인터셉터 (자동 인증 처리)

**Request 인터셉터**
- Pinia의 `authStore`에서 AccessToken을 자동으로 가져와 헤더에 주입
- 모든 요청에 `withCredentials: true` 설정 (RefreshToken 쿠키 전송)

**Response 인터셉터**
- 401 에러 + `C0002` 코드 시 자동 토큰 갱신
- 갱신 성공 시 원래 요청 재시도
- 갱신 실패 시 로그아웃 처리 및 로그인 페이지 리다이렉트
- 기타 에러 시 전역 팝업으로 에러 메시지 표시

### 2. 전역 모달 시스템

**사용법**
```javascript
import { useModal } from '@/composables/useModal'

const { alert, confirm, error, success, custom } = useModal()

// 기본 모달들
await alert('알림 메시지')
const result = await confirm('확인하시겠습니까?')
error('에러 메시지')
success('성공 메시지')

// 커스텀 모달
custom('CustomComponent', { prop1: 'value' }, { closable: false })
```

### 3. API 호출 패턴

**도메인별 API 모듈**
```javascript
import { authAPI } from '@/api/auth'
import { productAPI } from '@/api/product'

// 로그인
const response = await authAPI.login({ loginId, password })

// 상품 목록 조회
const products = await productAPI.getProducts({ page: 1, size: 10 })
```

**useApi Composable 활용**
```javascript
import { useApi } from '@/composables/useApi'

const { execute, loading, data } = useApi()

await execute(
  () => productAPI.getProducts(),
  {
    onSuccess: (data) => console.log('성공:', data),
    onError: (message) => console.log('실패:', message)
  }
)
```

### 5. 네비게이션 헬퍼

**기본 사용법**
```javascript
import { useNavigation } from '@/composables/useNavigation'

const { goPage, goAuthPage, goAdminPage, goPageWithConfirm, navigation } = useNavigation()

// 기본 페이지 이동
goPage('/products')

// 인증 필요한 페이지 (미인증 시 로그인 페이지로)
goAuthPage('/profile')

// 관리자 권한 필요한 페이지
goAdminPage('/admin')

// 확인 후 이동
await goPageWithConfirm('정말 이동하시겠습니까?', '/orders')

// 편의 함수 사용
navigation.home()     // 홈으로 이동
navigation.login()    // 로그인 페이지로 이동
```

### 6. 유효성 검사 시스템

**useValidation Composable**
```javascript
import { useValidation } from '@/composables/useValidation'
import { required, email, minLength } from '@/utils/validation'

const { 
  form, 
  errors, 
  isValid, 
  validateForm, 
  handleFieldInput, 
  getFieldError 
} = useValidation(
  // 초기 데이터
  { email: '', password: '' },
  // 검사 규칙
  {
    email: [required, email],
    password: [required, (value) => minLength(value, 8)]
  }
)

// 템플릿에서 사용
// <BaseInput :model-value="form.email" @update:model-value="(v) => handleFieldInput('email', v)" />
```

### 7. 공통 헬퍼 함수들

**포맷팅 함수들**
```javascript
import { formatNumber, formatDate, formatFileSize, formatPhone } from '@/utils/helpers'

formatNumber(1234567)        // "1,234,567"
formatDate('2025-01-09')     // "2025-01-09"
formatFileSize(1024)         // "1 KB"
formatPhone('01012345678')   // "010-1234-5678"
```

**유틸리티 함수들**
```javascript
import { debounce, throttle, storage, deepClone } from '@/utils/helpers'

// 디바운스 (검색 등에 유용)
const debouncedSearch = debounce(searchFunction, 300)

// 로컬 스토리지
storage.set('key', { data: 'value' })
const data = storage.get('key')

// 객체 깊은 복사
const cloned = deepClone(originalObject)
```

**useAuth Composable**
```javascript
import { useAuth } from '@/composables/useAuth'

const { 
  isAuthenticated, 
  isAdmin, 
  user, 
  login, 
  logout, 
  requireAuth 
} = useAuth()

// 로그인
await login({ loginId: 'user', password: 'pass' })

// 권한 체크
if (requireAuth()) {
  // 인증된 사용자만 접근 가능한 로직
}
```

## 환경 변수

### .env.development
```
VITE_API_BASE_URL=http://localhost:8080
VITE_ENV=development
```

### .env.production
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENV=production
```

## 📋 API 응답 형식

### 성공 응답
```json
{
  "code": "C0000",
  "message": "성공",
  "data": {},
  "timestamp": "2025-01-07T10:30:00"
}
```

### 에러 응답
```json
{
  "code": "C0002",
  "message": "인증 실패",
  "data": null,
  "timestamp": "2025-01-07T10:30:00"
}
```

## 에러 코드 관리

### API 응답 코드 상수
```javascript
import { API_CODES, isSuccess, getErrorMessage } from '@/constants/apiCodes'

// 응답 코드 체크
if (isSuccess(response.data.code)) {
  // 성공 처리
}

// 에러 메시지 가져오기 (서버 메시지 우선)
const errorMessage = getErrorMessage(response.data.code, response.data.message)

// 특정 에러 코드 체크
if (response.data.code === API_CODES.USER.DUPLICATE_LOGIN_ID) {
  // 중복 아이디 처리
}
```

### 에러 코드 목록

### 공통 에러
- `C0000`: 성공
- `C0001`: 잘못된 요청 파라미터
- `C0002`: 인증 실패 (토큰 갱신 트리거)
- `C0003`: 권한 없음
- `C0004`: 리소스를 찾을 수 없음
- `C0005`: 서버 내부 오류

### 서비스별 에러
- **사용자**: L0001~L0003
- **상품**: P0001~P0003
- **쿠폰**: CP0001~CP1009
- **주문**: O0001~O0004

## 주요 특징

1. **MSA 최적화**: 도메인별 API 모듈화 및 서비스 분리
2. **자동 인증**: 토큰 갱신 및 재시도 로직 내장
3. **전역 상태 관리**: Pinia 기반 중앙집중식 상태 관리
4. **재사용성**: Composables 패턴으로 로직 재사용
5. **타입 안전성**: Vue3 Composition API 활용
6. **사용자 경험**: 로딩 상태, 에러 처리, 모달 시스템

## 확장 가이드

### 새로운 API 모듈 추가
1. `src/api/` 폴더에 도메인별 파일 생성
2. `apiClient`를 import하여 API 함수 정의
3. 필요시 새로운 Composable 생성

### 새로운 모달 컴포넌트 추가
1. `src/components/common/modals/` 폴더에 컴포넌트 생성
2. `CommonModal.vue`의 `componentMap`에 등록
3. `useModal`에서 편의 메서드 추가

### 새로운 스토어 추가
1. `src/store/` 폴더에 Pinia 스토어 생성
2. 필요시 관련 Composable 생성
3. 컴포넌트에서 활용

이 뼈대를 기반으로 MSA 환경에서 안정적이고 확장 가능한 Vue3 애플리케이션을 구축할 수 있습니다.

## 추가된 헬퍼 시스템

### 페이지네이션 시스템
```javascript
import { useList } from '@/composables/useList'
import { productAPI } from '@/api/product'

// 기본 사용법
const { 
  items,           // 목록 데이터
  loading,         // 로딩 상태
  currentPage,     // 현재 페이지 (0부터 시작)
  totalPages,      // 총 페이지 수
  hasNext,         // 다음 페이지 존재 여부
  hasPrev,         // 이전 페이지 존재 여부
  goToPage,        // 페이지 이동
  nextPage,        // 다음 페이지
  prevPage,        // 이전 페이지
  refresh,         // 새로고침
  applyFilters,    // 필터 적용
  clearFilters     // 필터 초기화
} = useList(productAPI.getProducts, {
  defaultSize: 20,
  autoLoad: true,
  useQuery: true
})

// 검색/필터 적용
applyFilters({ sellerId: 'admin', keyword: '스마트폰' })

// 페이지 이동
goToPage(2)
```
```javascript
import { useNavigation } from '@/composables/useNavigation'

const { goPage, goAuthPage, goAdminPage, goPageWithConfirm } = useNavigation()

// 기본 이동
goPage('/products')

// 인증 필요 페이지 (미인증 시 로그인으로)
goAuthPage('/profile')

// 관리자 권한 필요 페이지
goAdminPage('/admin')

// 확인 후 이동
await goPageWithConfirm('정말 이동하시겠습니까?', '/orders')
```

### 네비게이션 헬퍼
```javascript
import { useValidation } from '@/composables/useValidation'
import { required, email, minLength } from '@/utils/validation'

const { form, errors, isValid, handleFieldInput } = useValidation(
  { email: '', password: '' },
  {
    email: [required, email],
    password: [required, (value) => minLength(value, 8)]
  }
)
```

### 공통 헬퍼 함수들
```javascript
import { formatNumber, formatDate, debounce, storage } from '@/utils/helpers'

// 포맷팅
formatNumber(1234567)        // "1,234,567"
formatDate('2025-01-09')     // "2025-01-09"

// 유틸리티
const debouncedFn = debounce(fn, 300)
storage.set('key', data)
```

이제 완전한 MSA 환경용 Vue3 프론트엔드 뼈대가 구축되었습니다!