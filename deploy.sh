#!/bin/bash

# 배포 스크립트
# 사용법: ./deploy.sh [staging|production]

ENV=$1

if [ -z "$ENV" ]; then
    echo "사용법: ./deploy.sh [staging|production]"
    echo "예시: ./deploy.sh staging"
    exit 1
fi

case $ENV in
    "staging")
        echo "🚀 개발 환경 배포 시작..."
        npm run build:staging
        
        # S3 업로드 (개발 버킷)
        aws s3 sync dist/ s3://your-dev-frontend-bucket --delete
        
        # CloudFront 캐시 무효화 (개발)
        aws cloudfront create-invalidation --distribution-id YOUR_DEV_DISTRIBUTION_ID --paths "/*"
        
        echo "✅ 개발 환경 배포 완료: https://dev.your-domain.com"
        ;;
        
    "production")
        echo "🚀 운영 환경 배포 시작..."
        
        # 운영 배포 전 확인
        read -p "운영 환경에 배포하시겠습니까? (y/N): " confirm
        if [[ $confirm != [yY] ]]; then
            echo "배포가 취소되었습니다."
            exit 1
        fi
        
        npm run build:prod
        
        # S3 업로드 (운영 버킷)
        aws s3 sync dist/ s3://your-prod-frontend-bucket --delete
        
        # CloudFront 캐시 무효화 (운영)
        aws cloudfront create-invalidation --distribution-id YOUR_PROD_DISTRIBUTION_ID --paths "/*"
        
        echo "✅ 운영 환경 배포 완료: https://your-domain.com"
        ;;
        
    *)
        echo "❌ 잘못된 환경입니다. staging 또는 production을 입력하세요."
        exit 1
        ;;
esac