import { pgTable, text, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // using Firebase UID as id
  email: text('email').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const translationEntries = pgTable('translation_entries', {
  id: text('id').primaryKey(),
  nativeText: text('native_text').notNull(),
  frenchTranslation: text('french_translation').notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  audioUrl: text('audio_url'),
  examples: jsonb('examples'),
  userId: text('user_id').references(() => users.id).notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  entries: many(translationEntries),
}));

export const entriesRelations = relations(translationEntries, ({ one }) => ({
  author: one(users, {
    fields: [translationEntries.userId],
    references: [users.id],
  }),
}));
