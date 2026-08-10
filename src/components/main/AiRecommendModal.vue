<template>
  <!-- 메인 화면 우측 하단 플로팅 버튼 -->
  <button class="ai-fab" type="button" @click="open" aria-label="AI 선물 추천">
    ✨ AI 선물 추천
  </button>

  <!-- Chat Modal -->
  <div v-if="visible" class="ai-modal-overlay" @click.self="close">
    <div class="ai-modal">
      <header class="ai-modal__header">
        <span>AI 선물 추천 도우미</span>
        <button class="ai-modal__close" type="button" @click="close" aria-label="닫기">×</button>
      </header>

      <div class="ai-modal__body" ref="bodyRef">
        <div class="ai-msg ai-msg--bot">어떤 선물을 찾으시나요? 예산과 대상을 알려주세요.</div>

        <template v-for="(msg, i) in messages" :key="i">
          <div class="ai-msg" :class="msg.role === 'user' ? 'ai-msg--user' : 'ai-msg--bot'">
            <pre class="ai-msg__text">{{ msg.text }}</pre>
            <small v-if="msg.role === 'bot' && msg.meta" class="ai-msg__meta">
              provider: {{ msg.meta.provider }} · LLM {{ msg.meta.llmLatencyMs }}ms
            </small>
          </div>
        </template>

        <div v-if="loading" class="ai-msg ai-msg--bot ai-msg--loading">추천 생성 중…</div>
        <div v-if="error" class="ai-msg ai-msg--error">{{ error }}</div>
      </div>

      <footer class="ai-modal__footer">
        <input
          v-model="input"
          class="ai-modal__input"
          type="text"
          placeholder="질문 입력..."
          :disabled="loading"
          @keyup.enter="send"
        />
        <button class="ai-modal__send" type="button" :disabled="loading || !input.trim()" @click="send">
          전송
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { aiAPI } from '@/api/ai'

const visible = ref(false)
const input = ref('')
const loading = ref(false)
const error = ref('')
const messages = ref([])
const bodyRef = ref(null)

const open = () => { visible.value = true }
const close = () => { visible.value = false }

const scrollToBottom = async () => {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}

const send = async () => {
  const message = input.value.trim()
  // 요청 중 중복 전송 방지
  if (!message || loading.value) return

  error.value = ''
  messages.value.push({ role: 'user', text: message })
  input.value = ''
  loading.value = true
  await scrollToBottom()

  try {
    const res = await aiAPI.recommend(message)
    const body = res.data
    if (body && body.code === 'C0000' && body.data) {
      messages.value.push({
        role: 'bot',
        text: body.data.answer,
        meta: { provider: body.data.provider, llmLatencyMs: body.data.llmLatencyMs }
      })
    } else {
      error.value = (body && body.message) || '추천을 가져오지 못했습니다.'
    }
  } catch (e) {
    error.value = e?.code === 'ECONNABORTED'
      ? '응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.'
      : '추천 요청 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped>
.ai-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  padding: 12px 18px;
  border: none;
  border-radius: 999px;
  background: #6b5bd2;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}
.ai-fab:hover { background: #5a4cc0; }

.ai-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;
}
.ai-modal {
  width: 360px;
  max-width: 100%;
  height: 520px;
  max-height: 80vh;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}
.ai-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #6b5bd2;
  color: #fff;
  font-weight: 600;
}
.ai-modal__close {
  background: none;
  border: none;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}
.ai-modal__body {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  background: #f6f6fa;
}
.ai-msg {
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  max-width: 85%;
}
.ai-msg--bot { background: #fff; border: 1px solid #eee; }
.ai-msg--user { background: #e5e0fb; margin-left: auto; }
.ai-msg--error { background: #ffe5e5; color: #b00020; }
.ai-msg--loading { color: #888; font-style: italic; }
.ai-msg__text { margin: 0; white-space: pre-wrap; word-break: break-word; font-family: inherit; }
.ai-msg__meta { display: block; margin-top: 6px; color: #999; font-size: 11px; }
.ai-modal__footer {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #eee;
  background: #fff;
}
.ai-modal__input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
.ai-modal__send {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #6b5bd2;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.ai-modal__send:disabled { background: #b7afe4; cursor: not-allowed; }
</style>
