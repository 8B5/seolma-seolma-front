<template>
  <div class="admin-page">
    <MainNavigation />
    
    <section class="admin-banner" @click="goToHome">
    </section>
    
    <section class="admin-section">
      <h2 class="section-title">쿠폰 등록</h2>
      
      <div class="admin-container">
        <form @submit.prevent="handleSubmit" class="coupon-form">
          <div class="form-field">
            <label for="couponTitle" class="field-label">쿠폰명 *</label>
            <input 
              id="couponTitle"
              v-model="couponForm.title"
              type="text" 
              placeholder="쿠폰명을 입력하세요"
              class="field-input"
              required
            />
          </div>
          
          <div class="form-field">
            <label class="field-label">할인 타입 *</label>
            <div class="radio-group">
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="couponForm.discountType"
                  value="PERCENT"
                />
                <span>퍼센트 할인</span>
              </label>
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="couponForm.discountType"
                  value="FIXED_AMOUNT"
                />
                <span>고정 금액 할인</span>
              </label>
            </div>
          </div>
          
          <div class="form-field">
            <label for="discountValue" class="field-label">
              {{ couponForm.discountType === 'PERCENT' ? '할인율 (%)' : '할인 금액 (원)' }} *
            </label>
            <input 
              id="discountValue"
              v-model.number="couponForm.discountValue"
              type="number" 
              :placeholder="couponForm.discountType === 'PERCENT' ? '할인율을 입력하세요 (예: 10)' : '할인 금액을 입력하세요'"
              class="field-input"
              min="0"
              :max="couponForm.discountType === 'PERCENT' ? 100 : undefined"
              required
            />
          </div>
          
          <div class="form-field">
            <label for="startDate" class="field-label">시작일시 *</label>
            <input 
              id="startDate"
              v-model="couponForm.startedAt"
              type="datetime-local" 
              class="field-input"
              required
            />
          </div>
          
          <div class="form-field">
            <label for="endDate" class="field-label">종료일시 *</label>
            <input 
              id="endDate"
              v-model="couponForm.finishedAt"
              type="datetime-local" 
              class="field-input"
              required
            />
          </div>
          
          <div class="form-field">
            <label class="field-label checkbox-label">
              <input 
                type="checkbox" 
                v-model="couponForm.isLimited"
              />
              <span>선착순 쿠폰</span>
            </label>
          </div>
          
          <div v-if="couponForm.isLimited" class="form-field">
            <label for="totalQuantity" class="field-label">발급 수량 *</label>
            <input 
              id="totalQuantity"
              v-model.number="couponForm.totalQuantity"
              type="number" 
              placeholder="발급 가능한 수량을 입력하세요"
              class="field-input"
              min="1"
              :required="couponForm.isLimited"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? '등록 중...' : '쿠폰 등록' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainNavigation from '@/components/main/MainNavigation.vue'
import { couponAPI } from '@/api/coupon'
import { useApi } from '@/composables/useApi'
import { useModal } from '@/composables/useModal'
import { useAuthStore } from '@/store/auth'
import '@/assets/styles/pages/admin.css'

const router = useRouter()
const authStore = useAuthStore()
const { execute, loading } = useApi()
const { success, error: showError, alert } = useModal()

const couponForm = ref({
  title: '',
  discountType: 'PERCENT',
  discountValue: 0,
  startedAt: '',
  finishedAt: '',
  isLimited: false,
  totalQuantity: null
})

const goToHome = () => {
  router.push('/')
}

const handleSubmit = async () => {
  if (!couponForm.value.title || couponForm.value.discountValue <= 0) {
    alert('모든 필수 항목을 입력해주세요.')
    return
  }

  if (couponForm.value.isLimited && (!couponForm.value.totalQuantity || couponForm.value.totalQuantity <= 0)) {
    alert('선착순 쿠폰의 발급 수량을 입력해주세요.')
    return
  }

  // 날짜 형식 변환 (ISO 8601)
  const templateData = {
    ...couponForm.value,
    startedAt: new Date(couponForm.value.startedAt).toISOString(),
    finishedAt: new Date(couponForm.value.finishedAt).toISOString(),
    totalQuantity: couponForm.value.isLimited ? couponForm.value.totalQuantity : null
  }

  const result = await execute(
    () => couponAPI.createTemplate(templateData),
    {
      onSuccess: () => {
        success('쿠폰이 등록되었습니다!')
        // 폼 초기화
        couponForm.value = {
          title: '',
          discountType: 'PERCENT',
          discountValue: 0,
          startedAt: '',
          finishedAt: '',
          isLimited: false,
          totalQuantity: null
        }
      },
      onError: (message) => {
        showError(message || '쿠폰 등록에 실패했습니다.')
      }
    }
  )
}

// 관리자 권한 확인
if (!authStore.isAdmin) {
  alert('관리자만 접근할 수 있습니다.')
  router.push('/')
}
</script>
