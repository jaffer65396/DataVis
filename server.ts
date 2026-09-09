import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  upsertUser,
  getUser,
  getProjects,
  getProject,
  upsertProject,
  deleteProject,
  getDatasets,
  getDataset,
  upsertDataset,
  deleteDataset,
  getProjectVersions,
  createProjectVersion,
} from './src/db/repository.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User sync endpoint (runs after Firebase sign-in)
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const syncedUser = await upsertUser({
      uid: user.uid,
      email: user.email || '',
      displayName: user.name || (user as any).displayName || null,
      photoUrl: user.picture || (user as any).photoURL || null,
    });
    res.json({ user: syncedUser });
  } catch (error: any) {
    console.error('Failed to sync user:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user profile' });
  }
});

// Projects endpoints
app.get('/api/projects', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userProjects = await getProjects(req.user!.uid);
    res.json(userProjects);
  } catch (error: any) {
    console.error('Failed to fetch projects:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const project = await getProject(req.params.id, req.user!.uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    console.error('Failed to fetch project:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch project' });
  }
});

app.post('/api/projects', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id, name, description, activePageId, themeId, pages, datasets: projDatasets } = req.body;
    if (!id || !name || !activePageId || !themeId || !pages) {
      return res.status(400).json({ error: 'Missing required project fields' });
    }
    const saved = await upsertProject({
      id,
      userId: req.user!.uid,
      name,
      description,
      activePageId,
      themeId,
      pages,
      datasets: projDatasets || [],
    });
    res.json(saved);
  } catch (error: any) {
    console.error('Failed to save project:', error);
    res.status(500).json({ error: error.message || 'Failed to save project' });
  }
});

app.delete('/api/projects/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteProject(req.params.id, req.user!.uid);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    res.status(500).json({ error: error.message || 'Failed to delete project' });
  }
});

// Datasets endpoints
app.get('/api/datasets', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userDatasets = await getDatasets(req.user!.uid);
    res.json(userDatasets);
  } catch (error: any) {
    console.error('Failed to fetch datasets:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch datasets' });
  }
});

app.get('/api/datasets/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const dataset = await getDataset(req.params.id, req.user!.uid);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json(dataset);
  } catch (error: any) {
    console.error('Failed to fetch dataset:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch dataset' });
  }
});

app.post('/api/datasets', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id, name, sourceType, sourceName, columns, data, rowCount, projectId } = req.body;
    if (!id || !name || !sourceType || !columns || !data) {
      return res.status(400).json({ error: 'Missing required dataset fields' });
    }
    const saved = await upsertDataset({
      id,
      userId: req.user!.uid,
      projectId: projectId || null,
      name,
      sourceType,
      sourceName: sourceName || name,
      columns,
      data,
      rowCount: rowCount ?? (Array.isArray(data) ? data.length : 0),
    });
    res.json(saved);
  } catch (error: any) {
    console.error('Failed to save dataset:', error);
    res.status(500).json({ error: error.message || 'Failed to save dataset' });
  }
});

app.delete('/api/datasets/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteDataset(req.params.id, req.user!.uid);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete dataset:', error);
    res.status(500).json({ error: error.message || 'Failed to delete dataset' });
  }
});

// Project Versions endpoints
app.get('/api/projects/:id/versions', requireAuth, async (req: AuthRequest, res) => {
  try {
    const versions = await getProjectVersions(req.params.id, req.user!.uid);
    res.json(versions);
  } catch (error: any) {
    console.error('Failed to fetch versions:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch versions' });
  }
});

app.post('/api/projects/:id/versions', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id, versionNumber, author, changeSummary, snapshotJson } = req.body;
    if (!id || !versionNumber || !snapshotJson) {
      return res.status(400).json({ error: 'Missing required version fields' });
    }
    const created = await createProjectVersion({
      id,
      projectId: req.params.id,
      userId: req.user!.uid,
      versionNumber,
      author: author || req.user!.email || 'User',
      changeSummary: changeSummary || 'Version checkpoint',
      snapshotJson,
    });
    res.json(created);
  } catch (error: any) {
    console.error('Failed to save version:', error);
    res.status(500).json({ error: error.message || 'Failed to save version' });
  }
});

// Vite middleware & Static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
