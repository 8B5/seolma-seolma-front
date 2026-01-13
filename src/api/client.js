import axios from 'axios'

// 서비스별 API 클라이언트 생성
const createServiceClient = (serviceUrl) => {
    const client = axios.create({
        baseURL: serviceUrl,
        timeout: 30000, // 30초로 증가
        withCredentials: true, // MSA 환경에서 필수 - RefreshToken 쿠키 전송
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return client
}

// 각 서비스별 클라이언트
export const userServiceClient = createServiceClient(import.meta.env.VITE_USER_SERVICE_URL)
export const productServiceClient = createServiceClient(import.meta.env.VITE_PRODUCT_SERVICE_URL)
export const couponServiceClient = createServiceClient(import.meta.env.VITE_COUPON_SERVICE_URL)
export const orderServiceClient = createServiceClient(import.meta.env.VITE_ORDER_SERVICE_URL)

// 기본 클라이언트 (하위 호환성)
const apiClient = userServiceClient

export default apiClient