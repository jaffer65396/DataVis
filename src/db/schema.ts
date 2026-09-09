import { pgTable, text, integer, timestamp, serial, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table storing registered Firebase users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Projects table storing dashboards
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Linked to Firebase UID
  name: text('name').notNull(),
  description: text('description').default(''),
  activePageId: text('active_page_id').notNull(),
  themeId: text('theme_id').notNull(),
  pages: jsonb('pages').notNull(),
  datasets: jsonb('datasets').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Datasets table storing imported/created data tables
export const datasets = pgTable('datasets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Linked to Firebase UID
  projectId: text('project_id'),
  name: text('name').notNull(),
  sourceType: text('source_type').notNull(),
  sourceName: text('source_name').notNull(),
  columns: jsonb('columns').notNull(),
  data: jsonb('data').notNull(),
  rowCount: integer('row_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Project versions for rollback & version history
export const projectVersions = pgTable('project_versions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  userId: text('user_id').notNull(),
  versionNumber: integer('version_number').notNull(),
  author: text('author').notNull(),
  changeSummary: text('change_summary').notNull(),
  snapshotJson: text('snapshot_json').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  datasets: many(datasets),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  author: one(users, {
    fields: [projects.userId],
    references: [users.uid],
  }),
  versions: many(projectVersions),
}));

export const datasetsRelations = relations(datasets, ({ one }) => ({
  author: one(users, {
    fields: [datasets.userId],
    references: [users.uid],
  }),
  project: one(projects, {
    fields: [datasets.projectId],
    references: [projects.id],
  }),
}));

export const projectVersionsRelations = relations(projectVersions, ({ one }) => ({
  project: one(projects, {
    fields: [projectVersions.projectId],
    references: [projects.id],
  }),
}));
