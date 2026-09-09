import { db } from './index.ts';
import { users, projects, datasets, projectVersions } from './schema.ts';
import { eq, and, desc } from 'drizzle-orm';

// User Repository
export async function upsertUser(data: {
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
}) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid: data.uid,
        email: data.email,
        displayName: data.displayName || null,
        photoUrl: data.photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: data.email,
          displayName: data.displayName || null,
          photoUrl: data.photoUrl || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in upsertUser:', error);
    throw new Error('Database query failed in upsertUser. Please try again later.', { cause: error });
  }
}

export async function getUser(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in getUser:', error);
    throw new Error('Database query failed in getUser. Please try again later.', { cause: error });
  }
}

// Project Repository
export async function getProjects(userId: string) {
  try {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  } catch (error) {
    console.error('Database query failed in getProjects:', error);
    throw new Error('Database query failed in getProjects. Please try again later.', { cause: error });
  }
}

export async function getProject(projectId: string, userId: string) {
  try {
    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in getProject:', error);
    throw new Error('Database query failed in getProject. Please try again later.', { cause: error });
  }
}

export async function upsertProject(data: {
  id: string;
  userId: string;
  name: string;
  description?: string;
  activePageId: string;
  themeId: string;
  pages: any;
  datasets: any;
}) {
  try {
    const now = new Date();
    const result = await db
      .insert(projects)
      .values({
        id: data.id,
        userId: data.userId,
        name: data.name,
        description: data.description || '',
        activePageId: data.activePageId,
        themeId: data.themeId,
        pages: data.pages,
        datasets: data.datasets,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          name: data.name,
          description: data.description || '',
          activePageId: data.activePageId,
          themeId: data.themeId,
          pages: data.pages,
          datasets: data.datasets,
          updatedAt: now,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in upsertProject:', error);
    throw new Error('Database query failed in upsertProject. Please try again later.', { cause: error });
  }
}

export async function deleteProject(projectId: string, userId: string) {
  try {
    await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteProject:', error);
    throw new Error('Database query failed in deleteProject. Please try again later.', { cause: error });
  }
}

// Datasets Repository
export async function getDatasets(userId: string) {
  try {
    return await db
      .select()
      .from(datasets)
      .where(eq(datasets.userId, userId))
      .orderBy(desc(datasets.updatedAt));
  } catch (error) {
    console.error('Database query failed in getDatasets:', error);
    throw new Error('Database query failed in getDatasets. Please try again later.', { cause: error });
  }
}

export async function getDataset(datasetId: string, userId: string) {
  try {
    const result = await db
      .select()
      .from(datasets)
      .where(and(eq(datasets.id, datasetId), eq(datasets.userId, userId)))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in getDataset:', error);
    throw new Error('Database query failed in getDataset. Please try again later.', { cause: error });
  }
}

export async function upsertDataset(data: {
  id: string;
  userId: string;
  projectId?: string | null;
  name: string;
  sourceType: string;
  sourceName: string;
  columns: any;
  data: any;
  rowCount: number;
}) {
  try {
    const now = new Date();
    const result = await db
      .insert(datasets)
      .values({
        id: data.id,
        userId: data.userId,
        projectId: data.projectId || null,
        name: data.name,
        sourceType: data.sourceType,
        sourceName: data.sourceName,
        columns: data.columns,
        data: data.data,
        rowCount: data.rowCount,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: datasets.id,
        set: {
          name: data.name,
          projectId: data.projectId || null,
          sourceType: data.sourceType,
          sourceName: data.sourceName,
          columns: data.columns,
          data: data.data,
          rowCount: data.rowCount,
          updatedAt: now,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in upsertDataset:', error);
    throw new Error('Database query failed in upsertDataset. Please try again later.', { cause: error });
  }
}

export async function deleteDataset(datasetId: string, userId: string) {
  try {
    await db
      .delete(datasets)
      .where(and(eq(datasets.id, datasetId), eq(datasets.userId, userId)));
    return { success: true };
  } catch (error) {
    console.error('Database query failed in deleteDataset:', error);
    throw new Error('Database query failed in deleteDataset. Please try again later.', { cause: error });
  }
}

// Project Versions Repository
export async function getProjectVersions(projectId: string, userId: string) {
  try {
    return await db
      .select()
      .from(projectVersions)
      .where(and(eq(projectVersions.projectId, projectId), eq(projectVersions.userId, userId)))
      .orderBy(desc(projectVersions.versionNumber));
  } catch (error) {
    console.error('Database query failed in getProjectVersions:', error);
    throw new Error('Database query failed in getProjectVersions. Please try again later.', { cause: error });
  }
}

export async function createProjectVersion(data: {
  id: string;
  projectId: string;
  userId: string;
  versionNumber: number;
  author: string;
  changeSummary: string;
  snapshotJson: string;
}) {
  try {
    const result = await db
      .insert(projectVersions)
      .values({
        id: data.id,
        projectId: data.projectId,
        userId: data.userId,
        versionNumber: data.versionNumber,
        author: data.author,
        changeSummary: data.changeSummary,
        snapshotJson: data.snapshotJson,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in createProjectVersion:', error);
    throw new Error('Database query failed in createProjectVersion. Please try again later.', { cause: error });
  }
}
