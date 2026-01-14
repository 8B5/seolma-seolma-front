<template>
  <article class="product-card">
    <div class="product-img-placeholder">
      <img 
        v-if="productImageUrl" 
        :src="productImageUrl" 
        :alt="product.name" 
      />
      <span v-else>상품 이미지</span>
    </div>
    
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="price">{{ formatNumber(product.price) }}원</p>
      
      <div v-if="!isAdmin" class="controls">
        <div class="quantity">
          <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
        </div>
        <button class="add-cart-btn" @click="addToCart">주문</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/utils/helpers'
import { useAuthStore } from '@/store/auth'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

const quantity = ref(1)

// 이미지 URL 처리
const productImageUrl = computed(() => {
  // images 배열이 있고 첫 번째 이미지가 있는 경우
  if (props.product.images && props.product.images.length > 0) {
    const imageUrl = props.product.images[0].imageUrl
    return getImageUrl(imageUrl)
  }
  
  // 기존 imageUrl 필드가 있는 경우 (하위 호환성)
  if (props.product.imageUrl) {
    return getImageUrl(props.product.imageUrl)
  }
  
  return null
})

// 이미지 URL 처리 (상대 경로를 절대 경로로 변환)
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  
  // 이미 전체 URL인 경우
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // 상대 경로인 경우 서버 URL 추가
  const baseUrl = import.meta.env.VITE_GENERAL_SERVICE_URL || 'http://localhost:8080'
  return `${baseUrl}${imageUrl}`
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  emit('add-to-cart', {
    product: props.product,
    quantity: quantity.value
  })
}
</script>