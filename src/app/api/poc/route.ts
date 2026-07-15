import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const secretLevel = searchParams.get('secretLevel') || '';

    // Fetch all projects from the database to compute statistics and perform filtering
    const { data: allProjects, error: fetchAllError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchAllError) {
      return NextResponse.json({ error: fetchAllError.message }, { status: 500 });
    }

    const projects = allProjects || [];

    // Calculate aggregated statistics on the overall project data
    const total = projects.length;
    const byDepartment: Record<string, number> = {};
    const byStatus: Record<string, number> = { '기획': 0, '개발': 0, '시범운영': 0, '완료': 0 };
    const byMethod: Record<string, number> = { '자체개발': 0, '바이브코딩': 0, '외주': 0 };
    const bySecretLevel: Record<string, number> = { '일반': 0, '대외비': 0, '극비': 0 };

    projects.forEach((p) => {
      // Department breakdown
      byDepartment[p.department] = (byDepartment[p.department] || 0) + 1;
      // Status breakdown
      if (p.status in byStatus) byStatus[p.status]++;
      else byStatus[p.status] = 1;
      // Development method breakdown
      if (p.dev_method in byMethod) byMethod[p.dev_method]++;
      else byMethod[p.dev_method] = 1;
      // Security level breakdown
      if (p.secret_level in bySecretLevel) bySecretLevel[p.secret_level]++;
      else bySecretLevel[p.secret_level] = 1;
    });

    // Apply filters to the projects array for the display list
    let filteredProjects = projects;

    if (search) {
      const query = search.toLowerCase();
      filteredProjects = filteredProjects.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.developer?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.summary?.toLowerCase().includes(query) ||
          p.ai_model?.toLowerCase().includes(query)
      );
    }

    if (department) {
      filteredProjects = filteredProjects.filter((p) => p.department === department);
    }

    if (status) {
      filteredProjects = filteredProjects.filter((p) => p.status === status);
    }

    if (secretLevel) {
      filteredProjects = filteredProjects.filter((p) => p.secret_level === secretLevel);
    }

    return NextResponse.json({
      projects: filteredProjects,
      stats: {
        total,
        byDepartment,
        byStatus,
        byMethod,
        bySecretLevel,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, department, developer, dev_method, status, description, secret_level, ai_model, summary } = body;

    // Required fields check
    if (!title || !department || !developer || !dev_method || !status || !secret_level) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title,
          department,
          developer,
          dev_method,
          status,
          description,
          secret_level,
          ai_model: ai_model || 'N/A',
          summary: summary || '',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
