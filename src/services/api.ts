import { DashboardProject, ProjectVersion } from '../types/project.ts';
import { Dataset } from '../types/data.ts';

export async function saveProjectToDb(project: DashboardProject, token: string): Promise<any> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: project.id,
      name: project.name,
      description: project.description,
      activePageId: project.activePageId,
      themeId: project.themeId,
      pages: project.pages,
      datasets: project.datasets,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save project to database');
  }

  return response.json();
}

export async function loadProjectsFromDb(token: string): Promise<DashboardProject[]> {
  const response = await fetch('/api/projects', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load projects from database');
  }

  return response.json();
}

export async function loadProjectFromDb(id: string, token: string): Promise<DashboardProject | null> {
  const response = await fetch(`/api/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load project from database');
  }

  return response.json();
}

export async function saveDatasetToDb(dataset: Dataset, token: string, projectId?: string): Promise<any> {
  const response = await fetch('/api/datasets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: dataset.id,
      name: dataset.name,
      sourceType: dataset.sourceType,
      sourceName: dataset.sourceName,
      columns: dataset.columns,
      data: dataset.data,
      rowCount: dataset.rowCount,
      projectId: projectId || null,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save dataset to database');
  }

  return response.json();
}

export async function loadDatasetsFromDb(token: string): Promise<Dataset[]> {
  const response = await fetch('/api/datasets', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load datasets from database');
  }

  return response.json();
}

export async function deleteDatasetFromDb(id: string, token: string): Promise<void> {
  const response = await fetch(`/api/datasets/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete dataset from database');
  }
}

export async function saveProjectVersionToDb(
  projectId: string,
  version: ProjectVersion,
  token: string
): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/versions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: version.id,
      versionNumber: version.versionNumber,
      author: version.author,
      changeSummary: version.changeSummary,
      snapshotJson: version.snapshotJson,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save version to database');
  }

  return response.json();
}

export async function loadProjectVersionsFromDb(projectId: string, token: string): Promise<ProjectVersion[]> {
  const response = await fetch(`/api/projects/${projectId}/versions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load versions from database');
  }

  return response.json();
}
