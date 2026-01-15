// 환경변수 테스트 스크립트
console.log('=== 환경변수 확인 ===')
console.log('VITE_ENV:', import.meta.env.VITE_ENV)
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('VITE_GENERAL_SERVICE_URL:', import.meta.env.VITE_GENERAL_SERVICE_URL)
console.log('VITE_COUPON_SERVICE_URL:', import.meta.env.VITE_COUPON_SERVICE_URL)
console.log('VITE_DEBUG_MODE:', import.meta.env.VITE_DEBUG_MODE)
console.log('VITE_LOG_LEVEL:', import.meta.env.VITE_LOG_LEVEL)

// API 클라이언트에서 실제 사용되는 URL 확인
import { generalServiceClient, couponServiceClient } from './src/api/client.js'
console.log('=== API 클라이언트 URL ===')
console.log('General Service URL:', generalServiceClient.defaults.baseURL)
console.log('Coupon Service URL:', couponServiceClient.defaults.baseURL)