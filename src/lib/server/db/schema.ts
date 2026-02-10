import { pgTable, index, foreignKey, uuid, vector, varchar, type AnyPgColumn, integer, timestamp, unique, boolean, serial, bigint, text, real, jsonb, doublePrecision, char, date, uniqueIndex, check, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

const unknown = (name: string) => varchar(name);

export const assetVisibilityEnum = pgEnum("asset_visibility_enum", ['archive', 'timeline', 'hidden', 'locked'])
export const assetsStatusEnum = pgEnum("assets_status_enum", ['active', 'trashed', 'deleted'])
export const sourcetype = pgEnum("sourcetype", ['machine-learning', 'exif', 'manual'])


export const faceSearch = pgTable("face_search", {
	faceId: uuid().primaryKey().notNull(),
	embedding: vector({ dimensions: 512 }).notNull(),
}, (table) => [
	index("face_index").using("vchordrq", table.embedding.asc().nullsLast().op("vector_cosine_ops")).with({options: "residual_quantization"}),
	foreignKey({
			columns: [table.faceId],
			foreignColumns: [assetFace.id],
			name: "face_search_faceId_fkey"
		}).onDelete("cascade"),
]);

export const kyselyMigrations = pgTable("kysely_migrations", {
	name: varchar({ length: 255 }).primaryKey().notNull(),
	timestamp: varchar({ length: 255 }).notNull(),
});

export const assetFace = pgTable("asset_face", {
	assetId: uuid().notNull(),
	personId: uuid(),
	imageWidth: integer().default(0).notNull(),
	imageHeight: integer().default(0).notNull(),
	boundingBoxX1: integer().default(0).notNull(),
	boundingBoxY1: integer().default(0).notNull(),
	boundingBoxX2: integer().default(0).notNull(),
	boundingBoxY2: integer().default(0).notNull(),
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	sourceType: sourcetype().default('machine-learning').notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("asset_face_assetId_personId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops"), table.personId.asc().nullsLast().op("uuid_ops")),
	index("asset_face_personId_assetId_idx").using("btree", table.personId.asc().nullsLast().op("uuid_ops"), table.assetId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "asset_face_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.personId],
			foreignColumns: [person.id],
			name: "asset_face_personId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const sharedLink = pgTable("shared_link", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	description: varchar(),
	userId: uuid().notNull(),
	// TODO: failed to parse database type 'bytea'
	key: unknown("key").notNull(),
	type: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	allowUpload: boolean().default(false).notNull(),
	albumId: uuid(),
	allowDownload: boolean().default(true).notNull(),
	showExif: boolean().default(true).notNull(),
	password: varchar(),
	slug: varchar(),
}, (table) => [
	index("shared_link_albumId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops")),
	index("shared_link_key_idx").using("btree", table.key.asc().nullsLast().op("bytea_ops")),
	index("shared_link_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.albumId],
			foreignColumns: [album.id],
			name: "shared_link_albumId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "shared_link_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("shared_link_key_uq").on(table.key),
	unique("shared_link_slug_uq").on(table.slug),
]);

export const assetMetadataAudit = pgTable("asset_metadata_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	assetId: uuid().notNull(),
	key: varchar().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("asset_metadata_audit_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("asset_metadata_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("asset_metadata_audit_key_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
]);

export const migrations = pgTable("migrations", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timestamp: bigint({ mode: "number" }).notNull(),
	name: varchar().notNull(),
});

export const typeormMetadata = pgTable("typeorm_metadata", {
	type: varchar().notNull(),
	database: varchar(),
	schema: varchar(),
	table: varchar(),
	name: varchar(),
	value: text(),
});

export const assetFile = pgTable("asset_file", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	assetId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	type: varchar().notNull(),
	path: varchar().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("asset_file_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("asset_file_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "asset_file_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("asset_file_assetId_type_uq").on(table.assetId, table.type),
]);

export const versionHistory = pgTable("version_history", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	version: varchar().notNull(),
});

export const assetOcr = pgTable("asset_ocr", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	assetId: uuid().notNull(),
	x1: real().notNull(),
	y1: real().notNull(),
	x2: real().notNull(),
	y2: real().notNull(),
	x3: real().notNull(),
	y3: real().notNull(),
	x4: real().notNull(),
	y4: real().notNull(),
	boxScore: real().notNull(),
	textScore: real().notNull(),
	text: text().notNull(),
}, (table) => [
	index("asset_ocr_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "asset_ocr_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const kyselyMigrationsLock = pgTable("kysely_migrations_lock", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	isLocked: integer("is_locked").default(0).notNull(),
});

export const ocrSearch = pgTable("ocr_search", {
	assetId: uuid().primaryKey().notNull(),
	text: text().notNull(),
}, (table) => [
	index("idx_ocr_search_text").using("gin", sql`f_unaccent(text)`),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "ocr_search_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const plugin = pgTable("plugin", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar().notNull(),
	title: varchar().notNull(),
	description: varchar().notNull(),
	author: varchar().notNull(),
	version: varchar().notNull(),
	wasmPath: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("plugin_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	unique("plugin_name_uq").on(table.name),
]);

export const pluginFilter = pgTable("plugin_filter", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	pluginId: uuid().notNull(),
	methodName: varchar().notNull(),
	title: varchar().notNull(),
	description: varchar().notNull(),
	supportedContexts: varchar().array().notNull(),
	schema: jsonb(),
}, (table) => [
	index("plugin_filter_methodName_idx").using("btree", table.methodName.asc().nullsLast().op("text_ops")),
	index("plugin_filter_pluginId_idx").using("btree", table.pluginId.asc().nullsLast().op("uuid_ops")),
	index("plugin_filter_supportedContexts_idx").using("gin", table.supportedContexts.asc().nullsLast().op("array_ops")),
	foreignKey({
			columns: [table.pluginId],
			foreignColumns: [plugin.id],
			name: "plugin_filter_pluginId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("plugin_filter_methodName_uq").on(table.methodName),
]);

export const pluginAction = pgTable("plugin_action", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	pluginId: uuid().notNull(),
	methodName: varchar().notNull(),
	title: varchar().notNull(),
	description: varchar().notNull(),
	supportedContexts: varchar().array().notNull(),
	schema: jsonb(),
}, (table) => [
	index("plugin_action_methodName_idx").using("btree", table.methodName.asc().nullsLast().op("text_ops")),
	index("plugin_action_pluginId_idx").using("btree", table.pluginId.asc().nullsLast().op("uuid_ops")),
	index("plugin_action_supportedContexts_idx").using("gin", table.supportedContexts.asc().nullsLast().op("array_ops")),
	foreignKey({
			columns: [table.pluginId],
			foreignColumns: [plugin.id],
			name: "plugin_action_pluginId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("plugin_action_methodName_uq").on(table.methodName),
]);

export const workflow = pgTable("workflow", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	ownerId: uuid().notNull(),
	triggerType: varchar().notNull(),
	name: varchar(),
	description: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	enabled: boolean().default(true).notNull(),
}, (table) => [
	index("workflow_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "workflow_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowFilter = pgTable("workflow_filter", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	workflowId: uuid().notNull(),
	pluginFilterId: uuid().notNull(),
	filterConfig: jsonb(),
	order: integer().notNull(),
}, (table) => [
	index("workflow_filter_pluginFilterId_idx").using("btree", table.pluginFilterId.asc().nullsLast().op("uuid_ops")),
	index("workflow_filter_workflowId_idx").using("btree", table.workflowId.asc().nullsLast().op("uuid_ops")),
	index("workflow_filter_workflowId_order_idx").using("btree", table.workflowId.asc().nullsLast().op("uuid_ops"), table.order.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.pluginFilterId],
			foreignColumns: [pluginFilter.id],
			name: "workflow_filter_pluginFilterId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.workflowId],
			foreignColumns: [workflow.id],
			name: "workflow_filter_workflowId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowAction = pgTable("workflow_action", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	workflowId: uuid().notNull(),
	pluginActionId: uuid().notNull(),
	actionConfig: jsonb(),
	order: integer().notNull(),
}, (table) => [
	index("workflow_action_pluginActionId_idx").using("btree", table.pluginActionId.asc().nullsLast().op("uuid_ops")),
	index("workflow_action_workflowId_idx").using("btree", table.workflowId.asc().nullsLast().op("uuid_ops")),
	index("workflow_action_workflowId_order_idx").using("btree", table.workflowId.asc().nullsLast().op("uuid_ops"), table.order.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.pluginActionId],
			foreignColumns: [pluginAction.id],
			name: "workflow_action_pluginActionId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.workflowId],
			foreignColumns: [workflow.id],
			name: "workflow_action_workflowId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const geodataPlaces = pgTable("geodata_places", {
	id: integer().primaryKey().notNull(),
	name: varchar({ length: 200 }).notNull(),
	longitude: doublePrecision().notNull(),
	latitude: doublePrecision().notNull(),
	countryCode: char({ length: 2 }).notNull(),
	admin1Code: varchar({ length: 20 }),
	admin2Code: varchar({ length: 80 }),
	modificationDate: date().notNull(),
	admin1Name: varchar(),
	admin2Name: varchar(),
	alternateNames: varchar(),
}, (table) => [
	index("IDX_geodata_gist_earthcoord").using("gist", sql`ll_to_earth_public(latitude, longitude)`),
	index("idx_geodata_places_admin1_name").using("gin", sql`f_unaccent(("admin1Name")::text)`),
	index("idx_geodata_places_admin2_name").using("gin", sql`f_unaccent(("admin2Name")::text)`),
	index("idx_geodata_places_alternate_names").using("gin", sql`f_unaccent(("alternateNames")::text)`),
	index("idx_geodata_places_name").using("gin", sql`f_unaccent((name)::text)`),
]);

export const migrationOverrides = pgTable("migration_overrides", {
	name: varchar().primaryKey().notNull(),
	value: jsonb().notNull(),
});

export const naturalearthCountries = pgTable("naturalearth_countries", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "naturalearth_countries_tmp_id_seq1", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	admin: varchar({ length: 50 }).notNull(),
	adminA3: varchar("admin_a3", { length: 3 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	// TODO: failed to parse database type 'polygon'
	coordinates: unknown("coordinates").notNull(),
});

export const personAudit = pgTable("person_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	personId: uuid().notNull(),
	ownerId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("person_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("person_audit_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("person_audit_personId_idx").using("btree", table.personId.asc().nullsLast().op("uuid_ops")),
]);

export const userMetadataAudit = pgTable("user_metadata_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	userId: uuid().notNull(),
	key: varchar().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("IDX_user_metadata_audit_deleted_at").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("IDX_user_metadata_audit_key").using("btree", table.key.asc().nullsLast().op("text_ops")),
	index("IDX_user_metadata_audit_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
]);

export const albumAssetAudit = pgTable("album_asset_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	albumId: uuid().notNull(),
	assetId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("album_asset_audit_albumId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops")),
	index("album_asset_audit_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("album_asset_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.albumId],
			foreignColumns: [album.id],
			name: "album_asset_audit_albumId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const albumAudit = pgTable("album_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	albumId: uuid().notNull(),
	userId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("album_audit_albumId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops")),
	index("album_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("album_audit_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
]);

export const albumUserAudit = pgTable("album_user_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	albumId: uuid().notNull(),
	userId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("album_user_audit_albumId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops")),
	index("album_user_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("album_user_audit_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
]);

export const apiKey = pgTable("api_key", {
	name: varchar().notNull(),
	key: varchar().notNull(),
	userId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	permissions: varchar().array().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("api_key_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("api_key_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "api_key_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const assetAudit = pgTable("asset_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	assetId: uuid().notNull(),
	ownerId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("asset_audit_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("asset_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("asset_audit_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
]);

export const memoryAssetAudit = pgTable("memory_asset_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	memoryId: uuid().notNull(),
	assetId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("memory_asset_audit_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("memory_asset_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("memory_asset_audit_memoryId_idx").using("btree", table.memoryId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.memoryId],
			foreignColumns: [memory.id],
			name: "memory_asset_audit_memoryId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const memoryAudit = pgTable("memory_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	memoryId: uuid().notNull(),
	userId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("memory_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("memory_audit_memoryId_idx").using("btree", table.memoryId.asc().nullsLast().op("uuid_ops")),
	index("memory_audit_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
]);

export const notification = pgTable("notification", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	userId: uuid(),
	level: varchar().default('info').notNull(),
	type: varchar().default('info').notNull(),
	data: jsonb(),
	title: varchar().notNull(),
	description: text(),
	readAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	index("notification_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("notification_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "notification_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const partnerAudit = pgTable("partner_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	sharedById: uuid().notNull(),
	sharedWithId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("partner_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("partner_audit_sharedById_idx").using("btree", table.sharedById.asc().nullsLast().op("uuid_ops")),
	index("partner_audit_sharedWithId_idx").using("btree", table.sharedWithId.asc().nullsLast().op("uuid_ops")),
]);

export const stackAudit = pgTable("stack_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	stackId: uuid().notNull(),
	userId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("stack_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const tag = pgTable("tag", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid().notNull(),
	value: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	color: varchar(),
	parentId: uuid(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("tag_parentId_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("tag_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "tag_parentId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "tag_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("tag_userId_value_uq").on(table.userId, table.value),
]);

export const userAudit = pgTable("user_audit", {
	userId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
}, (table) => [
	index("user_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const library = pgTable("library", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar().notNull(),
	ownerId: uuid().notNull(),
	importPaths: text().array().notNull(),
	exclusionPatterns: text().array().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	refreshedAt: timestamp({ withTimezone: true, mode: 'string' }),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("library_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("library_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "library_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const audit = pgTable("audit", {
	id: serial().primaryKey().notNull(),
	entityType: varchar().notNull(),
	entityId: uuid().notNull(),
	action: varchar().notNull(),
	ownerId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("audit_ownerId_createdAt_idx").using("btree", table.ownerId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const activity = pgTable("activity", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	albumId: uuid().notNull(),
	userId: uuid().notNull(),
	assetId: uuid(),
	comment: text(),
	isLiked: boolean().default(false).notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("activity_albumId_assetId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops"), table.assetId.asc().nullsLast().op("uuid_ops")),
	index("activity_albumId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops")),
	index("activity_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("activity_like_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops"), table.userId.asc().nullsLast().op("uuid_ops"), table.albumId.asc().nullsLast().op("uuid_ops")).where(sql`("isLiked" = true)`),
	index("activity_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("activity_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.albumId, table.assetId],
			foreignColumns: [albumAsset.albumId, albumAsset.assetId],
			name: "activity_albumId_assetId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.albumId],
			foreignColumns: [album.id],
			name: "activity_albumId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "activity_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "activity_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	check("activity_like_check", sql`((comment IS NULL) AND ("isLiked" = true)) OR ((comment IS NOT NULL) AND ("isLiked" = false))`),
]);

export const moveHistory = pgTable("move_history", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	entityId: uuid().notNull(),
	pathType: varchar().notNull(),
	oldPath: varchar().notNull(),
	newPath: varchar().notNull(),
}, (table) => [
	unique("UQ_entityId_pathType").on(table.entityId, table.pathType),
	unique("UQ_newPath").on(table.newPath),
]);

export const systemMetadata = pgTable("system_metadata", {
	key: varchar().primaryKey().notNull(),
	value: jsonb().notNull(),
});

export const smartSearch = pgTable("smart_search", {
	assetId: uuid().primaryKey().notNull(),
	embedding: vector({ dimensions: 512 }).notNull(),
}, (table) => [
	index("clip_index").using("vchordrq", table.embedding.asc().nullsLast().op("vector_cosine_ops")).with({options: "residual_quantization"}),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "smart_search_assetId_fkey"
		}).onDelete("cascade"),
]);

export const assetJobStatus = pgTable("asset_job_status", {
	assetId: uuid().primaryKey().notNull(),
	facesRecognizedAt: timestamp({ withTimezone: true, mode: 'string' }),
	metadataExtractedAt: timestamp({ withTimezone: true, mode: 'string' }),
	duplicatesDetectedAt: timestamp({ withTimezone: true, mode: 'string' }),
	previewAt: timestamp({ withTimezone: true, mode: 'string' }),
	thumbnailAt: timestamp({ withTimezone: true, mode: 'string' }),
	ocrAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "asset_job_status_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const assetExif = pgTable("asset_exif", {
	assetId: uuid().primaryKey().notNull(),
	make: varchar(),
	model: varchar(),
	exifImageWidth: integer(),
	exifImageHeight: integer(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSizeInByte: bigint({ mode: "number" }),
	orientation: varchar(),
	dateTimeOriginal: timestamp({ withTimezone: true, mode: 'string' }),
	modifyDate: timestamp({ withTimezone: true, mode: 'string' }),
	lensModel: varchar(),
	fNumber: doublePrecision(),
	focalLength: doublePrecision(),
	iso: integer(),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	city: varchar(),
	state: varchar(),
	country: varchar(),
	description: text().default('').notNull(),
	fps: doublePrecision(),
	exposureTime: varchar(),
	livePhotoCid: varchar(),
	timeZone: varchar(),
	projectionType: varchar(),
	profileDescription: varchar(),
	colorspace: varchar(),
	bitsPerSample: integer(),
	autoStackId: varchar(),
	rating: integer(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	lockedProperties: varchar().array(),
}, (table) => [
	index("asset_exif_autoStackId_idx").using("btree", table.autoStackId.asc().nullsLast().op("text_ops")),
	index("asset_exif_city_idx").using("btree", table.city.asc().nullsLast().op("text_ops")),
	index("asset_exif_livePhotoCID_idx").using("btree", table.livePhotoCid.asc().nullsLast().op("text_ops")),
	index("asset_exif_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "asset_exif_assetId_fkey"
		}).onDelete("cascade"),
]);

export const asset = pgTable("asset", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	deviceAssetId: varchar().notNull(),
	ownerId: uuid().notNull(),
	deviceId: varchar().notNull(),
	type: varchar().notNull(),
	originalPath: varchar().notNull(),
	fileCreatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	fileModifiedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	isFavorite: boolean().default(false).notNull(),
	duration: varchar(),
	encodedVideoPath: varchar().default(''),
	// TODO: failed to parse database type 'bytea'
	checksum: unknown("checksum").notNull(),
	livePhotoVideoId: uuid(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	originalFileName: varchar().notNull(),
	// TODO: failed to parse database type 'bytea'
	thumbhash: unknown("thumbhash"),
	isOffline: boolean().default(false).notNull(),
	libraryId: uuid(),
	isExternal: boolean().default(false).notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	localDateTime: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	stackId: uuid(),
	duplicateId: uuid(),
	status: assetsStatusEnum().default('active').notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	visibility: assetVisibilityEnum().default('timeline').notNull(),
}, (table) => [
	uniqueIndex("UQ_assets_owner_checksum").using("btree", table.ownerId.asc().nullsLast().op("bytea_ops"), table.checksum.asc().nullsLast().op("bytea_ops")).where(sql`("libraryId" IS NULL)`),
	index("asset_checksum_idx").using("btree", table.checksum.asc().nullsLast().op("bytea_ops")),
	index("asset_duplicateId_idx").using("btree", table.duplicateId.asc().nullsLast().op("uuid_ops")),
	index("asset_fileCreatedAt_idx").using("btree", table.fileCreatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("asset_id_stackId_idx").using("btree", table.id.asc().nullsLast().op("uuid_ops"), table.stackId.asc().nullsLast().op("uuid_ops")),
	index("asset_libraryId_idx").using("btree", table.libraryId.asc().nullsLast().op("uuid_ops")),
	index("asset_livePhotoVideoId_idx").using("btree", table.livePhotoVideoId.asc().nullsLast().op("uuid_ops")),
	index("asset_localDateTime_idx").using("btree", sql`((("localDateTime" AT TIME ZONE 'UTC'::text))::date)`),
	index("asset_localDateTime_month_idx").using("btree", sql`(date_trunc('MONTH'::text, ("localDateTime" AT TIME ZONE 'UTC':`),
	index("asset_originalFileName_idx").using("btree", table.originalFileName.asc().nullsLast().op("text_ops")),
	index("asset_originalFilename_trigram_idx").using("gin", sql`f_unaccent(("originalFileName")::text)`),
	index("asset_originalPath_libraryId_idx").using("btree", table.originalPath.asc().nullsLast().op("uuid_ops"), table.libraryId.asc().nullsLast().op("uuid_ops")),
	index("asset_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("asset_ownerId_libraryId_checksum_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops"), table.libraryId.asc().nullsLast().op("uuid_ops"), table.checksum.asc().nullsLast().op("bytea_ops")).where(sql`("libraryId" IS NOT NULL)`),
	index("asset_stackId_idx").using("btree", table.stackId.asc().nullsLast().op("uuid_ops")),
	index("asset_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.libraryId],
			foreignColumns: [library.id],
			name: "asset_libraryId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.livePhotoVideoId],
			foreignColumns: [table.id],
			name: "asset_livePhotoVideoId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "asset_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.stackId],
			foreignColumns: [stack.id],
			name: "asset_stackId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const stack = pgTable("stack", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	primaryAssetId: uuid().notNull(),
	ownerId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("stack_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("stack_primaryAssetId_idx").using("btree", table.primaryAssetId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "stack_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.primaryAssetId],
			foreignColumns: [asset.id],
			name: "stack_primaryAssetId_fkey"
		}),
	unique("stack_primaryAssetId_uq").on(table.primaryAssetId),
]);

export const person = pgTable("person", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ownerId: uuid().notNull(),
	name: varchar().default('').notNull(),
	thumbnailPath: varchar().default('').notNull(),
	isHidden: boolean().default(false).notNull(),
	birthDate: date(),
	faceAssetId: uuid(),
	isFavorite: boolean().default(false).notNull(),
	color: varchar(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("person_faceAssetId_idx").using("btree", table.faceAssetId.asc().nullsLast().op("uuid_ops")),
	index("person_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("person_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.faceAssetId],
			foreignColumns: [assetFace.id],
			name: "person_faceAssetId_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "person_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	check("person_birthDate_chk", sql`"birthDate" <= CURRENT_DATE`),
]);

export const session = pgTable("session", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	token: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid().notNull(),
	deviceType: varchar().default('').notNull(),
	deviceOs: varchar().default('').notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	pinExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	parentId: uuid(),
	isPendingSyncReset: boolean().default(false).notNull(),
	appVersion: varchar(),
}, (table) => [
	index("session_parentId_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("session_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "session_parentId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const album = pgTable("album", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	ownerId: uuid().notNull(),
	albumName: varchar().default('Untitled Album').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	albumThumbnailAssetId: uuid(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	description: text().default('').notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	isActivityEnabled: boolean().default(true).notNull(),
	order: varchar().default('desc').notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("album_albumThumbnailAssetId_idx").using("btree", table.albumThumbnailAssetId.asc().nullsLast().op("uuid_ops")),
	index("album_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("album_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.albumThumbnailAssetId],
			foreignColumns: [asset.id],
			name: "album_albumThumbnailAssetId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "album_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const memory = pgTable("memory", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	ownerId: uuid().notNull(),
	type: varchar().notNull(),
	data: jsonb().notNull(),
	isSaved: boolean().default(false).notNull(),
	memoryAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	seenAt: timestamp({ withTimezone: true, mode: 'string' }),
	showAt: timestamp({ withTimezone: true, mode: 'string' }),
	hideAt: timestamp({ withTimezone: true, mode: 'string' }),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("memory_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("memory_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "memory_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	email: varchar().notNull(),
	password: varchar().default('').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	profileImagePath: varchar().default('').notNull(),
	isAdmin: boolean().default(false).notNull(),
	shouldChangePassword: boolean().default(true).notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
	oauthId: varchar().default('').notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	storageLabel: varchar(),
	name: varchar().default('').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quotaSizeInBytes: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quotaUsageInBytes: bigint({ mode: "number" }).default(sql`'0'`).notNull(),
	status: varchar().default('active').notNull(),
	profileChangedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	avatarColor: varchar(),
	pinCode: varchar(),
}, (table) => [
	index("user_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("user_updatedAt_id_idx").using("btree", table.updatedAt.asc().nullsLast().op("uuid_ops"), table.id.asc().nullsLast().op("timestamptz_ops")),
	unique("user_email_uq").on(table.email),
	unique("user_storageLabel_uq").on(table.storageLabel),
]);

export const assetFaceAudit = pgTable("asset_face_audit", {
	id: uuid().default(sql`immich_uuid_v7()`).primaryKey().notNull(),
	assetFaceId: uuid().notNull(),
	assetId: uuid().notNull(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`clock_timestamp()`).notNull(),
}, (table) => [
	index("asset_face_audit_assetFaceId_idx").using("btree", table.assetFaceId.asc().nullsLast().op("uuid_ops")),
	index("asset_face_audit_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("asset_face_audit_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const tagAsset = pgTable("tag_asset", {
	assetId: uuid().notNull(),
	tagId: uuid().notNull(),
}, (table) => [
	index("tag_asset_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("tag_asset_assetId_tagId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops"), table.tagId.asc().nullsLast().op("uuid_ops")),
	index("tag_asset_tagId_idx").using("btree", table.tagId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "tag_asset_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tag.id],
			name: "tag_asset_tagId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.assetId, table.tagId], name: "tag_asset_pkey"}),
]);

export const sharedLinkAsset = pgTable("shared_link_asset", {
	assetId: uuid().notNull(),
	sharedLinkId: uuid().notNull(),
}, (table) => [
	index("shared_link_asset_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("shared_link_asset_sharedLinkId_idx").using("btree", table.sharedLinkId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "shared_link_asset_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.sharedLinkId],
			foreignColumns: [sharedLink.id],
			name: "shared_link_asset_sharedLinkId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.assetId, table.sharedLinkId], name: "shared_link_asset_pkey"}),
]);

export const tagClosure = pgTable("tag_closure", {
	idAncestor: uuid("id_ancestor").notNull(),
	idDescendant: uuid("id_descendant").notNull(),
}, (table) => [
	index("tag_closure_id_ancestor_idx").using("btree", table.idAncestor.asc().nullsLast().op("uuid_ops")),
	index("tag_closure_id_descendant_idx").using("btree", table.idDescendant.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.idAncestor],
			foreignColumns: [tag.id],
			name: "tag_closure_id_ancestor_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idDescendant],
			foreignColumns: [tag.id],
			name: "tag_closure_id_descendant_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.idAncestor, table.idDescendant], name: "tag_closure_pkey"}),
]);

export const userMetadata = pgTable("user_metadata", {
	userId: uuid().notNull(),
	key: varchar().notNull(),
	value: jsonb().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("IDX_user_metadata_update_id").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("IDX_user_metadata_updated_at").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_metadata_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.key], name: "user_metadata_pkey"}),
]);

export const assetMetadata = pgTable("asset_metadata", {
	assetId: uuid().notNull(),
	key: varchar().notNull(),
	value: jsonb().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("asset_metadata_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("asset_metadata_updatedAt_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "asset_metadata_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.assetId, table.key], name: "asset_metadata_pkey"}),
]);

export const albumAsset = pgTable("album_asset", {
	albumId: uuid().notNull(),
	assetId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("album_asset_albumId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops")),
	index("album_asset_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("album_asset_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.albumId],
			foreignColumns: [album.id],
			name: "album_asset_albumId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "album_asset_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.albumId, table.assetId], name: "album_asset_pkey"}),
]);

export const memoryAsset = pgTable("memory_asset", {
	memoriesId: uuid().notNull(),
	assetId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("memory_asset_assetId_idx").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	index("memory_asset_memoriesId_idx").using("btree", table.memoriesId.asc().nullsLast().op("uuid_ops")),
	index("memory_asset_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "memory_asset_assetId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.memoriesId],
			foreignColumns: [memory.id],
			name: "memory_asset_memoriesId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.memoriesId, table.assetId], name: "memory_asset_pkey"}),
]);

export const sessionSyncCheckpoint = pgTable("session_sync_checkpoint", {
	sessionId: uuid().notNull(),
	type: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ack: varchar().notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("session_sync_checkpoint_sessionId_idx").using("btree", table.sessionId.asc().nullsLast().op("uuid_ops")),
	index("session_sync_checkpoint_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [session.id],
			name: "session_sync_checkpoint_sessionId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.sessionId, table.type], name: "session_sync_checkpoint_pkey"}),
]);

export const albumUser = pgTable("album_user", {
	albumId: uuid().notNull(),
	userId: uuid().notNull(),
	role: varchar().default('editor').notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("album_user_albumId_idx").using("btree", table.albumId.asc().nullsLast().op("uuid_ops")),
	index("album_user_createId_idx").using("btree", table.createId.asc().nullsLast().op("uuid_ops")),
	index("album_user_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	index("album_user_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.albumId],
			foreignColumns: [album.id],
			name: "album_user_albumId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "album_user_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.albumId, table.userId], name: "album_user_pkey"}),
]);

export const partner = pgTable("partner", {
	sharedById: uuid().notNull(),
	sharedWithId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	inTimeline: boolean().default(false).notNull(),
	updateId: uuid().default(sql`immich_uuid_v7()`).notNull(),
	createId: uuid().default(sql`immich_uuid_v7()`).notNull(),
}, (table) => [
	index("partner_createId_idx").using("btree", table.createId.asc().nullsLast().op("uuid_ops")),
	index("partner_sharedWithId_idx").using("btree", table.sharedWithId.asc().nullsLast().op("uuid_ops")),
	index("partner_updateId_idx").using("btree", table.updateId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.sharedById],
			foreignColumns: [user.id],
			name: "partner_sharedById_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sharedWithId],
			foreignColumns: [user.id],
			name: "partner_sharedWithId_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.sharedById, table.sharedWithId], name: "partner_pkey"}),
]);
