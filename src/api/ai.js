import { generalServiceClient } from './client'

// AI 추천은 외부 LLM(mock 최대 30초 + overhead)을 Blocking 대기하므로
// 기본 client timeout(30초)보다 넉넉하게 잡는다.
const AI_TIMEOUT_MS = 65000

export const aiAPI = {
    // AI 선물 추천 요청
    // 응답: ApiResponse<{ answer, provider, llmLatencyMs }>
    recommend(message) {
        return generalServiceClient.post(
            '/api/v1/ai/recommendations',
            { message },
            { timeout: AI_TIMEOUT_MS, skipErrorModal: true }
        )
    }
}
