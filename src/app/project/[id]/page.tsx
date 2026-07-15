'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Cpu, 
  User, 
  Briefcase, 
  ShieldAlert, 
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  department: string;
  developer: string;
  dev_method: '바이브코딩' | '외주' | '자체개발';
  status: '기획' | '개발' | '시범운영' | '완료';
  description: string;
  secret_level: '일반' | '대외비' | '극비';
  ai_model: string;
  summary: string;
  created_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Fetch project detail
  const fetchProject = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/poc/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('요청하신 과제를 찾을 수 없습니다.');
        }
        throw new Error('데이터를 가져오는데 실패했습니다.');
      }
      const data = await res.json();
      setProject(data);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/poc/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('과제 삭제에 실패했습니다.');
      }
      router.push('/');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  // Status Style Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case '기획':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      case '개발':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case '시범운영':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case '완료':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-slate-700/10 border-slate-700/20';
    }
  };

  // Secret Level Style Helper
  const getSecretDetails = (level: string) => {
    switch (level) {
      case '일반':
        return {
          badge: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
          banner: null
        };
      case '대외비':
        return {
          badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
          banner: 'bg-orange-500/10 border border-orange-500/25 text-orange-200 text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 mb-6'
        };
      case '극비':
        return {
          badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          banner: 'bg-rose-500/10 border border-rose-500/25 text-rose-200 text-xs py-3 px-4 rounded-xl flex items-center gap-2.5 mb-6 animate-pulse'
        };
      default:
        return {
          badge: 'text-slate-400 bg-slate-700/10 border-slate-700/20',
          banner: null
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">과제 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="glass-panel rounded-2xl p-8 border-rose-500/20 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">에러가 발생했습니다</h3>
          <p className="text-slate-400 text-sm mt-1">{error || '정보를 조회할 수 없습니다.'}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const { badge: secretBadgeClass, banner: secretBanner } = getSecretDetails(project.secret_level);

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          현황판으로 돌아가기
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/project/${project.id}/edit`}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-card-border rounded-xl transition-all duration-200 shadow-md"
          >
            <Edit className="w-3.5 h-3.5" />
            수정하기
          </Link>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border border-rose-500/20 rounded-xl transition-all duration-200 shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
            삭제하기
          </button>
        </div>
      </div>

      {/* Secret Warning Banner */}
      {secretBanner && (
        <div className={secretBanner}>
          <ShieldAlert className="w-4.5 h-4.5 text-rose-500 shrink-0" />
          <div>
            <strong>보안 등급 경고 ({project.secret_level}):</strong> 본 과제는 사내 대외비 이상 등급의 정보자산입니다. 내부망 인프라 외부로의 유출을 엄격히 금합니다.
          </div>
        </div>
      )}

      {/* Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Description and outcome */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Title Card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${secretBadgeClass}`}>
                {project.secret_level}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {project.title}
            </h2>
          </div>

          {/* Description Card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-slate-300 border-l-3 border-blue-500 pl-3">
              과제 상세 내용
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {project.description || '상세 과제 내용이 등록되지 않았습니다.'}
            </p>
          </div>

          {/* Outcome Summary Card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4 shadow-lg bg-gradient-to-br from-slate-900/60 to-emerald-950/20">
            <h3 className="text-base font-bold text-slate-300 border-l-3 border-emerald-500 pl-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              주요 성과 요약 (Outcome)
            </h3>
            <p className="text-emerald-100/90 text-sm leading-relaxed whitespace-pre-wrap bg-slate-950/40 border border-slate-900/60 rounded-xl p-4">
              {project.summary || '수행 성과가 아직 기재되지 않았거나, 현재 진행 과정에 있는 프로젝트입니다.'}
            </p>
          </div>
        </div>

        {/* Right Column - Sidebar Project Details Metadata */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-card-border pb-3">
              과제 속성 정보
            </h3>

            <div className="space-y-4">
              {/* Department */}
              <div className="flex items-start gap-3 text-sm">
                <Briefcase className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">제안부서</div>
                  <div className="text-slate-200 font-medium">{project.department}</div>
                </div>
              </div>

              {/* Developer */}
              <div className="flex items-start gap-3 text-sm">
                <User className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">담당 개발자/현업</div>
                  <div className="text-slate-200 font-medium">{project.developer}</div>
                </div>
              </div>

              {/* Dev Method */}
              <div className="flex items-start gap-3 text-sm">
                <Layers className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">개발 방식</div>
                  <div className="text-slate-200 font-medium">{project.dev_method}</div>
                </div>
              </div>

              {/* AI Model */}
              <div className="flex items-start gap-3 text-sm">
                <Cpu className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">사용 AI API/모델</div>
                  <div className="text-slate-200 font-medium">{project.ai_model || 'N/A'}</div>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">최초 등록일시</div>
                  <div className="text-slate-200 font-medium">
                    {new Date(project.created_at).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Status Box */}
          <div className="glass-panel rounded-2xl p-5 shadow-lg border-blue-500/10 bg-blue-950/5 text-xs text-slate-400 space-y-2">
            <h4 className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              시스템 연동 정보
            </h4>
            <p>
              이 데이터는 Next.js 백엔드 API 라우트를 경유하여 Supabase 인스턴스에서 조회되었습니다. 
              향후 온프레미스 Docker 이관 시, DB 구조 및 스키마 명세 변경 없이 연동됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 space-y-6 shadow-2xl border border-rose-500/20">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">과제를 삭제하시겠습니까?</h3>
                <p className="text-xs text-slate-400 mt-1">삭제된 데이터는 Supabase DB에서 영구 소멸됩니다.</p>
              </div>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-card-border/60 text-xs text-slate-300">
              <div className="font-bold text-slate-100">{project.title}</div>
              <div className="mt-1 text-slate-400">{project.department} &bull; {project.developer}</div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                disabled={deleting}
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-rose-600/20"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  '삭제 승인'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
