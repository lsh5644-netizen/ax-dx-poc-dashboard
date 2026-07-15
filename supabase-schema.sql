-- ==============================================================================
-- AX/DX PoC Dashboard - Supabase Database Schema
-- Run this in the Supabase SQL Editor to create the 'projects' table and seed it.
-- ==============================================================================

-- 1. Create table for PoC Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  developer VARCHAR(100) NOT NULL,
  dev_method VARCHAR(50) NOT NULL CHECK (dev_method IN ('바이브코딩', '외주', '자체개발')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('기획', '개발', '시범운영', '완료')),
  description TEXT,
  secret_level VARCHAR(50) NOT NULL CHECK (secret_level IN ('일반', '대외비', '극비')),
  ai_model VARCHAR(100) DEFAULT 'N/A',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexing for search efficiency (useful for filtering/stats aggregation)
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_department ON projects(department);

-- 3. Insert realistic mockup data for testing
INSERT INTO projects (title, department, developer, dev_method, status, description, secret_level, ai_model, summary) VALUES
('AI 기반 송배전 설비 노후도 예측 모니터링', '송배전운영처', '김민수 과장', '자체개발', '시범운영', '드론 및 IoT 센서 데이터를 활용하여 전신주 및 송전탑 등 배전 설비의 마모 상태와 노후도를 합성곱 신경망(CNN) 기반으로 분석하고 교체 시점을 자동 추정하는 과제입니다. 실시간 알림 대시보드를 통해 현장 안전 점검 일정을 사전 예방합니다.', '대외비', 'Custom PyTorch CNN & Claude 3.5 Sonnet', '설비 오진율 12% 감소 및 선제 교체 타이밍 예측율 89% 기록'),

('문서 요약 및 법무 검토 지원 GenAI 챗봇', '기획조정실', '이선영 차장', '바이브코딩', '완료', '사내 정관 및 법무 유권해석 데이터를 RAG(검색 증강 생성) 기법으로 연계하여 직원들이 복잡한 계약서 검토 및 사내 규정 질문 시 실시간으로 준법 여부와 참조 조항을 요약 제시해 주는 챗봇 서비스입니다.', '일반', 'GPT-4o & Llama 3.1 70B (Private Run)', '일반 법무 검토 소요 시간 평균 40% 단축'),

('화력발전소 미세먼지 저감 연소 제어 최적화', '발전처', '박철우 대리', '외주', '개발', '보일러 연소 과정의 다차원 변수(온도, 압력, 산소 농도)를 강화 학습 에이전트로 실시간 피드백 루프를 돌아 미세먼지 유발 물질 배출을 낮추고 열효율을 극대화하는 시뮬레이션 및 제어 솔루션 구축 과제입니다.', '극비', 'Custom Reinforcement Learning Model', '연소 효율 1.5% 향상 및 질소산화물 배출 8% 저감 시뮬레이션 성공'),

('사내 전표 및 세무 영수증 OCR 자동 전표 처리', '재무관리처', '정지원 과장', '바이브코딩', '기획', '다양한 포맷의 종이/전자 전표와 영수증 이미지를 딥러닝 기반 OCR로 텍스트화한 뒤, 회계 전표 표준 항목에 맞게 자동 분류하고 SAP ERP 시스템으로 연동 처리하는 업무 프로세스 자동화(RPA) 프로젝트입니다.', '일반', 'Tesseract & GPT-4o-mini', '수기 입력 대비 오류율 95% 감소 기대 및 전표 처리 시간 건당 5분 -> 30초 단축 목표'),

('신재생에너지 발전량 예측 및 전력 거래 시뮬레이터', '신재생사업단', '최윤석 과장', '자체개발', '개발', '관측소 위성 이미지와 국지 기상 데이터를 기반으로 풍력/태양광 발전 효율을 시계열 모델(LSTM/Transformer)을 사용해 실시간 예측하고 가상 전력 입찰 거래 환경에서 모의 수익률을 시뮬레이션합니다.', '대외비', 'LSTM Time Series & Claude 3.5 Sonnet', '태양광 발전량 예측 오차율(MAPE) 7.8% 달성');
