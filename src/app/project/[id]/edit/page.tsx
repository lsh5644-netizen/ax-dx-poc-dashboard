'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, ShieldAlert, Cpu } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    developer: '',
    dev_method: '자체개발',
    status: '기획',
    description: '',
    secret_level: '일반',
    ai_model: '',
    summary: '',
  });

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      setFetching(true);
      setError('');
      try {
        const res = await fetch(`/api/poc/${id}`);
        if (!res.ok) {
          throw new Error('프로젝트 상세 정보를 가져오는 데 실패했습니다.');
        }
        const data = await res.json();
        setFormData({
          title: data.title || '',
          department: data.department || '',
          developer: data.developer || '',
          dev_method: data.dev_method || '자체개발',
          status: data.status || '기획',
          description: data.description || '',
          secret_level: data.secret_level || '일반',
          ai_model: data.ai_model || '',
          summary: data.summary || '',
        });
      } catch (err: any) {
        setError(err.message || '데이터 로딩 중 에러가 발생했습니다.');
      } finally {
        setFetching(false);
      }
    };
    
    fetchProject();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Client-side validations
    if (!formData.title.trim()) {
      setError('과제명을 입력해 주세요.');
      setSaving(false);
      return;
    }
    if (!formData.department.trim()) {
      setError('제안부서를 입력해 주세요.');
      setSaving(false);
      return;
    }
    if (!formData.developer.trim()) {
      setError('담당자명을 입력해 주세요.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/poc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '과제 정보 수정 중 오류가 발생했습니다.');
      }

      router.push(`/project/${id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">과제 데이터를 로드하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link
          href={`/project/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          과제 상세정보로 돌아가기
        </Link>
      </div>

      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">과제 세부 정보 수정</h2>
          <p className="text-xs text-slate-400 mt-1">
            PoC 과제의 진행 상태, 성과 내용, 기술 스택 등을 갱신하여 Supabase DB에 실시간 반영합니다.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              과제명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="예: AI 기반 송배전 설비 노후도 예측 모니터링"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div className="space-y-2">
              <label htmlFor="department" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                제안 부서 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                placeholder="예: 송배전운영처"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            {/* Developer */}
            <div className="space-y-2">
              <label htmlFor="developer" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                담당자 (개발자/현업) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="developer"
                name="developer"
                required
                value={formData.developer}
                onChange={handleChange}
                placeholder="예: 김민수 과장"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Development Method */}
            <div className="space-y-2">
              <label htmlFor="dev_method" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                개발 방식 <span className="text-rose-500">*</span>
              </label>
              <select
                id="dev_method"
                name="dev_method"
                value={formData.dev_method}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="자체개발">자체개발</option>
                <option value="바이브코딩">바이브코딩</option>
                <option value="외주">외주</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                진행 상태 <span className="text-rose-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="기획">기획</option>
                <option value="개발">개발</option>
                <option value="시범운영">시범운영</option>
                <option value="완료">완료</option>
              </select>
            </div>

            {/* Secret Level */}
            <div className="space-y-2">
              <label htmlFor="secret_level" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                보안 등급 <span className="text-rose-500">*</span>
              </label>
              <select
                id="secret_level"
                name="secret_level"
                value={formData.secret_level}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="일반">일반 (공개 가능)</option>
                <option value="대외비">대외비 (보안)</option>
                <option value="극비">극비 (기밀)</option>
              </select>
            </div>
          </div>

          {/* AI Model */}
          <div className="space-y-2">
            <label htmlFor="ai_model" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              사용 AI API / 모델
            </label>
            <input
              type="text"
              id="ai_model"
              name="ai_model"
              value={formData.ai_model}
              onChange={handleChange}
              placeholder="예: GPT-4o, Claude 3.5 Sonnet, Llama 3.1 70B (Private)"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              과제 상세 내용
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="과제의 추진 배경, 상세 구현 기법, 연동 대상 사내 레거시 시스템 등에 대해 구체적으로 서술해 주세요."
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
            ></textarea>
          </div>

          {/* Outcome Summary */}
          <div className="space-y-2">
            <label htmlFor="summary" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              성과 요약 (Outcome)
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={2}
              value={formData.summary}
              onChange={handleChange}
              placeholder="예: 업무 소요시간 40% 단축 기대, 예측 오차율(MAPE) 7.8% 달성 등 정량/정성적 기대 효과를 기입합니다."
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
            ></textarea>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-card-border/40">
            <Link
              href={`/project/${id}`}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
