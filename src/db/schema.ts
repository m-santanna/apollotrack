import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, integer, real, boolean } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
})
//
//
//
//
//
//
//
//
//
// User macros table
export const user_macros = pgTable('user_macros', {
    id: text('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    daily_calories: integer('daily_calories').notNull(),
    daily_protein: integer('daily_protein').notNull(),
    daily_carbs: integer('daily_carbs').notNull(),
    daily_fat: integer('daily_fat').notNull(),
})

// Food item table
export const food_item = pgTable('food_item', {
    id: text('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    calories: integer('calories'),
    protein: real('protein'),
    carbs: real('carbs'),
    fat: real('fat'),
    total_grams: real('total_grams'),
    price: real('price'),
    checked: boolean('checked').notNull().default(false),
    category: text('category').notNull().default('Other'),
})

// Exercise
export const exercise = pgTable('exercise', {
    id: text('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    mainMuscle: text('main_muscle').notNull(),
})

// The exercise group table
export const exerciseGroup = pgTable('exercise_group', {
    id: text('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    groupName: text('group_name').notNull(),
    exerciseId: text('execise_id')
        .notNull()
        .references(() => exercise.id, { onDelete: 'cascade' }),
})

// Workout table
export const workout = pgTable('workout', {
    id: text('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    exerciseId: text('exercise_id')
        .notNull()
        .references(() => exercise.id, { onDelete: 'cascade' }),
    set_number: integer('set_number').notNull(),
    reps: integer('reps').notNull(),
    weight: real('weight').notNull(),
    date: timestamp('date').notNull(),
})
