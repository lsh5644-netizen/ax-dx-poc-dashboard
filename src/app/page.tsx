'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Layers, 
  Cpu, 
  ShieldAlert, 
  User, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal
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

interface Stats {
  total: number;
  byDepartment: Record<string, number>;
  byStatus: Record<string, number>;
  byMethod: Record<string, number>;
  bySecretLevel: Record<string, number>;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byDepartment: {},
    byStatus: { '기획': 0, '개발': 0, '시범운영': 0, '완료': 0 },
    byMethod: { '자체개발': 0, '바이브코딩': 0, '외주': 0 },
    bySecretLevel: { '일반': 0, '대외비': 0, '극비': 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSecret, setSelectedSecret] = useState('');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/poc');
      if (!res.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }
      const data = await res.json();
      setProjects(data.projects || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter projects in memory for real-time reactivity
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.developer.toLowerCase().includes(search.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(search.toLowerCase())) ||
      (project.summary && project.summary.toLowerCase().includes(search.toLowerCase())) ||
      (project.ai_model && project.ai_model.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept ? project.department === selectedDept : true;
    const matchesStatus = selectedStatus ? project.status === selectedStatus : true;
    const matchesSecret = selectedSecret ? project.secret_level === selectedSecret : true;

    return matchesSearch && matchesDept && matchesStatus && matchesSecret;
  });

  // Get unique departments for filter dropdown
  const departments = Array.from(new Set(projects.map((p) => p.department)));

  // Status Style Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case '기획':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case '개발':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case '시범운영':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case '완료':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-700/10 text-slate-400 border-slate-700/20';
    }
  };

  // Secret Level Style Helper
  const getSecretBadge = (level: string) => {
    switch (level) {
      case '일반':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case '대외비':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case '극비':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-700/10 text-slate-400 border-slate-700/20';
    }
  };

  // Development Method Helper
  const getMethodBadge = (method: string) => {
    switch (method) {
      case '바이브코딩':
        return 'from-violet-600 to-indigo-600 text-violet-200';
      case '외주':
        return 'from-slate-700 to-slate-800 text-slate-300';
      case '자체개발':
        return 'from-blue-600 to-cyan-600 text-blue-200';
      default:
        return 'from-slate-700 to-slate-850 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent">
            AX/DX 시범운영(PoC) 종합 현황판
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            공사 내 각 부서에서 추진하고 있는 AI/DX 관련 과제들의 통계 및 수행 현황입니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="p-2.5 rounded-lg border border-card-border bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 transition-all duration-200 disabled:opacity-50"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/project/new"
            className="inline-flex items-center justify-between text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 px-4 py-2.5 rounded-lg transition-all duration-200 gap-1.5 font-semibold"
          >
            <Plus className="w-4 h-4" />
            과제 등록
          </Link>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Count */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">총 수행 과제</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
              {loading ? '-' : stats.total}
              <span className="text-sm font-medium text-slate-400">건</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Supabase 클라우드 실시간 연동
            </div>
          </div>
          {/* Decorative background glow */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Card 2: Status Progress */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">진행 단계별 현황</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/15">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {['기획', '개발', '시범운영', '완료'].map((status) => {
                const count = stats.byStatus[status] || 0;
                const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={status} className="group relative">
                    <div className="text-base font-bold text-slate-200">{loading ? '-' : count}</div>
                    <div className="text-[9px] text-slate-400 font-medium">{status}</div>
                    {/* Tiny gauge */}
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full ${
                          status === '기획' ? 'bg-slate-500' :
                          status === '개발' ? 'bg-blue-500' :
                          status === '시범운영' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Card 3: Dev Method Breakdown */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">개발 방식별 비율</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/15">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            {['바이브코딩', '자체개발', '외주'].map((method) => {
              const count = stats.byMethod[method] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={method} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      method === '바이브코딩' ? 'bg-violet-500' :
                      method === '자체개발' ? 'bg-blue-500' : 'bg-slate-500'
                    }`}></span>
                    {method}
                  </span>
                  <span className="font-semibold text-slate-200">
                    {loading ? '-' : `${count}건 (${Math.round(percent)}%)`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Card 4: Secret Level */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">보안 등급 비율</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/15">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            {['일반', '대외비', '극비'].map((level) => {
              const count = stats.bySecretLevel[level] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={level} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      level === '일반' ? 'bg-sky-400' :
                      level === '대외비' ? 'bg-orange-500' : 'bg-rose-500'
                    }`}></span>
                    {level}
                  </span>
                  <span className="font-semibold text-slate-200">
                    {loading ? '-' : `${count}건 (${Math.round(percent)}%)`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          상세 필터 검색
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="과제명, 담당자, 기술 스택, 핵심 성과 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Department Select */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
            >
              <option value="">제안부서 (전체)</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Secret Level Select */}
          <div>
            <select
              value={selectedSecret}
              onChange={(e) => setSelectedSecret(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950/60 border border-card-border rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
            >
              <option value="">보안등급 (전체)</option>
              <option value="일반">일반</option>
              <option value="대외비">대외비</option>
              <option value="극비">극비</option>
            </select>
          </div>
        </div>

        {/* Status Filters (Tabs-style) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-card-border/40">
          <span className="text-xs text-slate-400 font-medium mr-2">진행상태 필터:</span>
          {['', '기획', '개발', '시범운영', '완료'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${
                selectedStatus === status
                  ? 'bg-blue-600/90 text-white border-blue-500 shadow-md shadow-blue-600/10'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {status === '' ? '전체' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Supabase에서 과제 목록을 로딩 중입니다...</p>
        </div>
      ) : error ? (
        <div className="glass-panel rounded-2xl p-8 border-rose-500/20 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">데이터 로딩 에러</h3>
            <p className="text-slate-400 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto border border-card-border">
            <Layers className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">해당하는 과제가 없습니다</h3>
            <p className="text-slate-400 text-sm mt-2">
              조건을 다르게 설정하시거나 새로운 AX/DX PoC 과제를 등록해 보세요.
            </p>
          </div>
          <Link
            href="/project/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            신규 과제 등록하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between h-[360px] relative overflow-hidden group shadow-md"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSecretBadge(project.secret_level)}`}>
                    {project.secret_level}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {project.title}
                </h3>
              </div>

              {/* Card Body - Content */}
              <div className="space-y-4 my-4 flex-1">
                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {project.description || '상세 내용이 작성되지 않은 과제입니다.'}
                </p>

                {/* Tags (AI Model & Method) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold bg-gradient-to-r ${getMethodBadge(project.dev_method)} px-2.5 py-0.5 rounded-full`}>
                    {project.dev_method}
                  </span>
                  {project.ai_model && project.ai_model !== 'N/A' && (
                    <span className="text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      {project.ai_model.split('&')[0].trim()}
                    </span>
                  )}
                </div>

                {/* Outcome summary preview */}
                {project.summary && (
                  <div className="bg-slate-950/40 border border-slate-900/60 rounded-lg p-2.5 text-[11px] text-slate-300 flex items-start gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{project.summary}</span>
                  </div>
                )}
              </div>

              {/* Card Footer - Meta Info */}
              <div className="pt-4 border-t border-card-border/40 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{project.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{project.developer.split(' ')[0]}</span>
                  </div>
                </div>

                <Link
                  href={`/project/${project.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  상세보기
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
