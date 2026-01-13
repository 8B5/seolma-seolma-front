<template>
  <article class="product-card">
    <div class="product-img-placeholder">
      <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
      <span v-else>상품 이미지</span>
    </div>
    
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="price">{{ formatNumber(product.price) }}원</p>
      
      <div class="controls">
        <div class="quantity">
          <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
        </div>
        <button class="add-cart-btn" @click="addToCart">담기</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { formatNumber } from '@/utils/helpers'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const quantity = ref(1)

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