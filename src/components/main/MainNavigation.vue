<template>
  <header>
    <nav class="top-nav">
      <!-- 로그인 상태일 때 -->
      <template v-if="authStore.isAuthenticated">
        <router-link to="/coupons">쿠폰 발급</router-link>
        <router-link to="/my-coupons">쿠폰 조회</router-link>
        <router-link to="/payment">결제 페이지</router-link>
        <router-link to="/orders">주문 확인</router-link>
        <button @click="handleLogout" class="logout-btn">로그아웃</button>
      </template>
      
      <!-- 로그인 전일 때 -->
      <template v-else>
        <router-link to="/coupons">쿠폰 발급</router-link>
        <router-link to="/login">로그인</router-link>
        <router-link to="/register">회원가입</router-link>
      </template>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { useModal } from '@/composables/useModal'
import { useRouter } from 'vue-router'
import '@/assets/styles/components/main-navigation.css'

const authStore = useAuthStore()
const { confirm, success } = useModal()
const router = useRouter()

const handleLogout = async () => {
  const result = await confirm('로그아웃 하시겠습니까?', '로그아웃')
  
  if (result) {
    authStore.logout()
    success('로그아웃되었습니다.')
    router.push('/')
  }
}
</script>