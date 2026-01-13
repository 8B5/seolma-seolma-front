<template>
  <div class="coupon-page">
    <MainNavigation />
    
    <!-- 쿠폰 배너 -->
    <section class="coupon-banner">
    </section>
    
    <!-- 쿠폰 목록 -->
    <section class="coupon-section">
      <h2 class="section-title">쿠폰 목록</h2>
      
      <div v-if="loading" class="loading-message">
        쿠폰을 불러오는 중...
      </div>
      
      <div v-else-if="coupons.length === 0" class="empty-message">
        발급 가능한 쿠폰이 없습니다.
      </div>
      
      <div v-else class="coupon-grid">
        <div 
          v-for="coupon in coupons" 
          :key="coupon.templateId"
          class="coupon-card"
        >
          <div class="coupon-header">
            <h3 class="coupon-title">{{ coupon.title }}</h3>
            <div class="coupon-discount">
              <span v-if="coupon.discountType === 'PERCENT'" class="discount-value">
                {{ coupon.discountValue }}% OFF
              </span>
              <span v-else class="discount-value">
                {{ formatNumber(coupon.discountValue) }}원 OFF
              </span>
            </div>
            <!-- 선착순 쿠폰 표시 -->
            <div v-if="coupon.isLimited && coupon.totalQuantity" class="coupon-limited">
              <span class="limited-text">선착순: {{ formatNumber(coupon.totalQuantity) }}명</span>
            </div>
          </div>
          
          <div class="coupon-period">
            <p class="period-text">
              {{ formatDate(coupon.startedAt) }} ~ {{ formatDate(coupon.finishedAt) }}
            </p>
          </div>
          
          <div class="coupon-footer">
            <button 
              :class="getCouponButtonClass(coupon)"
              :disabled="!isCouponAvailable(coupon)"
              @click="handleIssueCoupon(coupon)"
            >
              {{ getCouponButtonText(coupon) }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainNavigation from '@/components/main/MainNavigation.vue'
import { couponAPI } from '@/api/coupon'
import { useModal } from '@/composables/useModal'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/store/auth'
import { formatNumber } from '@/utils/helpers'
import '@/assets/styles/pages/coupon.css'

const { success, error: showError, alert } = useModal()
const { execute, loading } = useApi()
const authStore = useAuthStore()

const coupons = ref([])

// 쿠폰 목록 로드
const loadCoupons = async () => {
  const result = await execute(
    () => couponAPI.getAvailableTemplates(),
    {
      showErrorModal: false,
      onError: (error) => {
        console.error('쿠폰 목록 로드 실패:', error)
        // API 실패 시 테스트용 더미 데이터 사용
        coupons.value = getTestCoupons()
      }
    }
  )

  if (result.success) {
    // useApi에서 이미 response.data.data를 추출해서 반환함
    coupons.value = result.data || []
    console.log('로드된 쿠폰 목록:', coupons.value)
    
    // API에서 데이터가 없으면 테스트 데이터 사용
    if (coupons.value.length === 0) {
      console.log('API에서 쿠폰 데이터가 없어서 테스트 데이터 사용')
      coupons.value = getTestCoupons()
    }
  } else {
    // API 실패 시 테스트용 더미 데이터 사용
    coupons.value = getTestCoupons()
  }
}

// 테스트용 쿠폰 데이터 (API 명세서 구조와 동일)
const getTestCoupons = () => [
  {
    templateId: 1,
    title: "신규 회원 할인 쿠폰",
    discountType: "PERCENT",
    discountValue: 10,
    startedAt: "2025-01-01T00:00:00",
    finishedAt: "2025-12-31T23:59:59",
    isLimited: false
  },
  {
    templateId: 2,
    title: "선착순 100명 할인쿠폰",
    discountType: "FIXED",
    discountValue: 5000,
    startedAt: "2025-01-09T00:00:00",
    finishedAt: "2025-01-31T23:59:59",
    isLimited: true,
    totalQuantity: 100
  },
  {
    templateId: 3,
    title: "특별 할인 쿠폰",
    discountType: "PERCENT",
    discountValue: 15,
    startedAt: "2025-01-10T00:00:00",
    finishedAt: "2025-02-28T23:59:59",
    isLimited: true,
    totalQuantity: 50
  }
]

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '.').replace(/\s/g, '')
}

// 쿠폰 발급 가능 여부 확인
const isCouponAvailable = (coupon) => {
  const now = new Date()
  const startDate = new Date(coupon.startedAt)
  const endDate = new Date(coupon.finishedAt)
  
  return now >= startDate && now <= endDate
}

// 쿠폰 버튼 클래스 결정
const getCouponButtonClass = (coupon) => {
  const baseClass = 'coupon-button'
  
  if (isCouponAvailable(coupon)) {
    return `${baseClass} coupon-button--available`
  } else {
    return `${baseClass} coupon-button--disabled`
  }
}

// 쿠폰 버튼 텍스트 결정
const getCouponButtonText = (coupon) => {
  const now = new Date()
  const startDate = new Date(coupon.startedAt)
  const endDate = new Date(coupon.finishedAt)
  
  if (now < startDate) {
    return '발급 예정'
  } else if (now > endDate) {
    return '발급 마감'
  } else {
    return '다운로드'
  }
}

// 쿠폰 발급 처리
const handleIssueCoupon = async (coupon) => {
  if (!isCouponAvailable(coupon)) {
    return
  }

  // 로그인 상태 확인
  if (!authStore.isAuthenticated) {
    alert('로그인 후 발급 가능합니다.')
    return
  }

  // 쿠폰 객체와 templateId 확인
  console.log('클릭된 쿠폰:', coupon)
  console.log('templateId:', coupon.templateId)
  
  // templateId가 없으면 에러
  if (!coupon.templateId) {
    console.error('templateId가 없습니다:', coupon)
    showError('쿠폰 정보가 올바르지 않습니다.')
    return
  }

  const result = await execute(
    () => couponAPI.issueCoupon(coupon.templateId),
    {
      onSuccess: (data) => {
        success(`${coupon.title} 쿠폰이 발급되었습니다!`)
      },
      onError: (message) => {
        showError(message)
      }
    }
  )
}

onMounted(() => {
  loadCoupons()
})
</script>