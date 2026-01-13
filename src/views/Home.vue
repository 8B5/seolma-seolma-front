<template>
  <div class="home">
    <MainNavigation />
    
    <HeroBanner @search="handleSearch" />
    
    <ProductGrid 
      :products="items"
      :loading="loading"
      @add-to-cart="handleAddToCart"
    />
    
    <!-- 페이지네이션 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        v-for="page in totalPages" 
        :key="page"
        :class="{ active: currentPage === page - 1 }"
        @click="goToPage(page - 1)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import MainNavigation from '@/components/main/MainNavigation.vue'
import HeroBanner from '@/components/main/HeroBanner.vue'
import ProductGrid from '@/components/main/ProductGrid.vue'
import { useList } from '@/composables/useList'
import { useModal } from '@/composables/useModal'
import { useCartStore } from '@/store/cart'
import { productAPI } from '@/api/product'
import { ref, onMounted } from 'vue'
import '@/assets/styles/pages/main.css'

const { success } = useModal()
const cartStore = useCartStore()

// 더미 상품 데이터
const dummyProducts = ref([])

// 상품 목록 관리 (서버 없을 때는 자동 로드 비활성화)
const {
  items,
  loading,
  currentPage,
  totalPages,
  goToPage,
  applyFilters,
  loadData
} = useList(productAPI.getProducts, {
  defaultSize: 12,
  autoLoad: false // 자동 로드 비활성화
})

// 컴포넌트 마운트 시 데이터 로드 시도
onMounted(async () => {
  try {
    const result = await loadData()
    if (!result.success) {
      // API 호출은 성공했지만 데이터가 없거나 에러인 경우
      console.log('API 응답 에러, 더미 데이터 사용')
      items.value = dummyProducts.value
    }
  } catch (error) {
    // 네트워크 에러 등으로 API 호출 자체가 실패한 경우
    console.log('네트워크 에러, 더미 데이터 사용:', error)
    items.value = dummyProducts.value
  }
})

// 검색 처리
const handleSearch = (keyword) => {
  applyFilters({ search: keyword })
}

// 장바구니 추가 처리
const handleAddToCart = (cartItem) => {
  cartStore.addToCart(cartItem)
  success(`${cartItem.product.name} ${cartItem.quantity}개가 장바구니에 추가되었습니다!`)
}
</script>