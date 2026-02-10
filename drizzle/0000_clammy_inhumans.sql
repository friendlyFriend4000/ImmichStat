-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."asset_visibility_enum" AS ENUM('archive', 'timeline', 'hidden', 'locked');--> statement-breakpoint
CREATE TYPE "public"."assets_status_enum" AS ENUM('active', 'trashed', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."sourcetype" AS ENUM('machine-learning', 'exif', 'manual');--> statement-breakpoint
CREATE TABLE "face_search" (
	"faceId" uuid PRIMARY KEY NOT NULL,
	"embedding" vector(512) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kysely_migrations" (
	"name" varchar(255) PRIMARY KEY NOT NULL,
	"timestamp" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_face" (
	"assetId" uuid NOT NULL,
	"personId" uuid,
	"imageWidth" integer DEFAULT 0 NOT NULL,
	"imageHeight" integer DEFAULT 0 NOT NULL,
	"boundingBoxX1" integer DEFAULT 0 NOT NULL,
	"boundingBoxY1" integer DEFAULT 0 NOT NULL,
	"boundingBoxX2" integer DEFAULT 0 NOT NULL,
	"boundingBoxY2" integer DEFAULT 0 NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sourceType" "sourcetype" DEFAULT 'machine-learning' NOT NULL,
	"deletedAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_link" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"description" varchar,
	"userId" uuid NOT NULL,
	"key" "bytea" NOT NULL,
	"type" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone,
	"allowUpload" boolean DEFAULT false NOT NULL,
	"albumId" uuid,
	"allowDownload" boolean DEFAULT true NOT NULL,
	"showExif" boolean DEFAULT true NOT NULL,
	"password" varchar,
	"slug" varchar,
	CONSTRAINT "shared_link_key_uq" UNIQUE("key"),
	CONSTRAINT "shared_link_slug_uq" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "asset_metadata_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"assetId" uuid NOT NULL,
	"key" varchar NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" bigint NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "typeorm_metadata" (
	"type" varchar NOT NULL,
	"database" varchar,
	"schema" varchar,
	"table" varchar,
	"name" varchar,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "asset_file" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"assetId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"type" varchar NOT NULL,
	"path" varchar NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "asset_file_assetId_type_uq" UNIQUE("assetId","type")
);
--> statement-breakpoint
CREATE TABLE "version_history" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"version" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_ocr" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"assetId" uuid NOT NULL,
	"x1" real NOT NULL,
	"y1" real NOT NULL,
	"x2" real NOT NULL,
	"y2" real NOT NULL,
	"x3" real NOT NULL,
	"y3" real NOT NULL,
	"x4" real NOT NULL,
	"y4" real NOT NULL,
	"boxScore" real NOT NULL,
	"textScore" real NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kysely_migrations_lock" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_locked" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ocr_search" (
	"assetId" uuid PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plugin" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"author" varchar NOT NULL,
	"version" varchar NOT NULL,
	"wasmPath" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plugin_name_uq" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "plugin_filter" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"pluginId" uuid NOT NULL,
	"methodName" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"supportedContexts" varchar[] NOT NULL,
	"schema" jsonb,
	CONSTRAINT "plugin_filter_methodName_uq" UNIQUE("methodName")
);
--> statement-breakpoint
CREATE TABLE "plugin_action" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"pluginId" uuid NOT NULL,
	"methodName" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"supportedContexts" varchar[] NOT NULL,
	"schema" jsonb,
	CONSTRAINT "plugin_action_methodName_uq" UNIQUE("methodName")
);
--> statement-breakpoint
CREATE TABLE "workflow" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"ownerId" uuid NOT NULL,
	"triggerType" varchar NOT NULL,
	"name" varchar,
	"description" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_filter" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"workflowId" uuid NOT NULL,
	"pluginFilterId" uuid NOT NULL,
	"filterConfig" jsonb,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_action" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"workflowId" uuid NOT NULL,
	"pluginActionId" uuid NOT NULL,
	"actionConfig" jsonb,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "geodata_places" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"longitude" double precision NOT NULL,
	"latitude" double precision NOT NULL,
	"countryCode" char(2) NOT NULL,
	"admin1Code" varchar(20),
	"admin2Code" varchar(80),
	"modificationDate" date NOT NULL,
	"admin1Name" varchar,
	"admin2Name" varchar,
	"alternateNames" varchar
);
--> statement-breakpoint
CREATE TABLE "migration_overrides" (
	"name" varchar PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "naturalearth_countries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "naturalearth_countries_tmp_id_seq1" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"admin" varchar(50) NOT NULL,
	"admin_a3" varchar(3) NOT NULL,
	"type" varchar(50) NOT NULL,
	"coordinates" "polygon" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"personId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_metadata_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"userId" uuid NOT NULL,
	"key" varchar NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "album_asset_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"albumId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "album_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"albumId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "album_user_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"albumId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"name" varchar NOT NULL,
	"key" varchar NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"permissions" varchar[] NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"assetId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_asset_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"memoryId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"memoryId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"userId" uuid,
	"level" varchar DEFAULT 'info' NOT NULL,
	"type" varchar DEFAULT 'info' NOT NULL,
	"data" jsonb,
	"title" varchar NOT NULL,
	"description" text,
	"readAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "partner_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"sharedById" uuid NOT NULL,
	"sharedWithId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stack_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"stackId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"userId" uuid NOT NULL,
	"value" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"color" varchar,
	"parentId" uuid,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "tag_userId_value_uq" UNIQUE("userId","value")
);
--> statement-breakpoint
CREATE TABLE "user_audit" (
	"userId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar NOT NULL,
	"ownerId" uuid NOT NULL,
	"importPaths" text[] NOT NULL,
	"exclusionPatterns" text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	"refreshedAt" timestamp with time zone,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"entityType" varchar NOT NULL,
	"entityId" uuid NOT NULL,
	"action" varchar NOT NULL,
	"ownerId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"albumId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"assetId" uuid,
	"comment" text,
	"isLiked" boolean DEFAULT false NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "activity_like_check" CHECK (((comment IS NULL) AND ("isLiked" = true)) OR ((comment IS NOT NULL) AND ("isLiked" = false)))
);
--> statement-breakpoint
CREATE TABLE "move_history" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"entityId" uuid NOT NULL,
	"pathType" varchar NOT NULL,
	"oldPath" varchar NOT NULL,
	"newPath" varchar NOT NULL,
	CONSTRAINT "UQ_entityId_pathType" UNIQUE("entityId","pathType"),
	CONSTRAINT "UQ_newPath" UNIQUE("newPath")
);
--> statement-breakpoint
CREATE TABLE "system_metadata" (
	"key" varchar PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smart_search" (
	"assetId" uuid PRIMARY KEY NOT NULL,
	"embedding" vector(512) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_job_status" (
	"assetId" uuid PRIMARY KEY NOT NULL,
	"facesRecognizedAt" timestamp with time zone,
	"metadataExtractedAt" timestamp with time zone,
	"duplicatesDetectedAt" timestamp with time zone,
	"previewAt" timestamp with time zone,
	"thumbnailAt" timestamp with time zone,
	"ocrAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "asset_exif" (
	"assetId" uuid PRIMARY KEY NOT NULL,
	"make" varchar,
	"model" varchar,
	"exifImageWidth" integer,
	"exifImageHeight" integer,
	"fileSizeInByte" bigint,
	"orientation" varchar,
	"dateTimeOriginal" timestamp with time zone,
	"modifyDate" timestamp with time zone,
	"lensModel" varchar,
	"fNumber" double precision,
	"focalLength" double precision,
	"iso" integer,
	"latitude" double precision,
	"longitude" double precision,
	"city" varchar,
	"state" varchar,
	"country" varchar,
	"description" text DEFAULT '' NOT NULL,
	"fps" double precision,
	"exposureTime" varchar,
	"livePhotoCID" varchar,
	"timeZone" varchar,
	"projectionType" varchar,
	"profileDescription" varchar,
	"colorspace" varchar,
	"bitsPerSample" integer,
	"autoStackId" varchar,
	"rating" integer,
	"updatedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"lockedProperties" varchar[]
);
--> statement-breakpoint
CREATE TABLE "asset" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"deviceAssetId" varchar NOT NULL,
	"ownerId" uuid NOT NULL,
	"deviceId" varchar NOT NULL,
	"type" varchar NOT NULL,
	"originalPath" varchar NOT NULL,
	"fileCreatedAt" timestamp with time zone NOT NULL,
	"fileModifiedAt" timestamp with time zone NOT NULL,
	"isFavorite" boolean DEFAULT false NOT NULL,
	"duration" varchar,
	"encodedVideoPath" varchar DEFAULT '',
	"checksum" "bytea" NOT NULL,
	"livePhotoVideoId" uuid,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"originalFileName" varchar NOT NULL,
	"thumbhash" "bytea",
	"isOffline" boolean DEFAULT false NOT NULL,
	"libraryId" uuid,
	"isExternal" boolean DEFAULT false NOT NULL,
	"deletedAt" timestamp with time zone,
	"localDateTime" timestamp with time zone NOT NULL,
	"stackId" uuid,
	"duplicateId" uuid,
	"status" "assets_status_enum" DEFAULT 'active' NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"visibility" "asset_visibility_enum" DEFAULT 'timeline' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stack" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"primaryAssetId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "stack_primaryAssetId_uq" UNIQUE("primaryAssetId")
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"ownerId" uuid NOT NULL,
	"name" varchar DEFAULT '' NOT NULL,
	"thumbnailPath" varchar DEFAULT '' NOT NULL,
	"isHidden" boolean DEFAULT false NOT NULL,
	"birthDate" date,
	"faceAssetId" uuid,
	"isFavorite" boolean DEFAULT false NOT NULL,
	"color" varchar,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "person_birthDate_chk" CHECK ("birthDate" <= CURRENT_DATE)
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"token" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"deviceType" varchar DEFAULT '' NOT NULL,
	"deviceOS" varchar DEFAULT '' NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"pinExpiresAt" timestamp with time zone,
	"expiresAt" timestamp with time zone,
	"parentId" uuid,
	"isPendingSyncReset" boolean DEFAULT false NOT NULL,
	"appVersion" varchar
);
--> statement-breakpoint
CREATE TABLE "album" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"ownerId" uuid NOT NULL,
	"albumName" varchar DEFAULT 'Untitled Album' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"albumThumbnailAssetId" uuid,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"deletedAt" timestamp with time zone,
	"isActivityEnabled" boolean DEFAULT true NOT NULL,
	"order" varchar DEFAULT 'desc' NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	"ownerId" uuid NOT NULL,
	"type" varchar NOT NULL,
	"data" jsonb NOT NULL,
	"isSaved" boolean DEFAULT false NOT NULL,
	"memoryAt" timestamp with time zone NOT NULL,
	"seenAt" timestamp with time zone,
	"showAt" timestamp with time zone,
	"hideAt" timestamp with time zone,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar DEFAULT '' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"profileImagePath" varchar DEFAULT '' NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"shouldChangePassword" boolean DEFAULT true NOT NULL,
	"deletedAt" timestamp with time zone,
	"oauthId" varchar DEFAULT '' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"storageLabel" varchar,
	"name" varchar DEFAULT '' NOT NULL,
	"quotaSizeInBytes" bigint,
	"quotaUsageInBytes" bigint DEFAULT '0' NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"profileChangedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"avatarColor" varchar,
	"pinCode" varchar,
	CONSTRAINT "user_email_uq" UNIQUE("email"),
	CONSTRAINT "user_storageLabel_uq" UNIQUE("storageLabel")
);
--> statement-breakpoint
CREATE TABLE "asset_face_audit" (
	"id" uuid PRIMARY KEY DEFAULT immich_uuid_v7() NOT NULL,
	"assetFaceId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"deletedAt" timestamp with time zone DEFAULT clock_timestamp() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag_asset" (
	"assetId" uuid NOT NULL,
	"tagId" uuid NOT NULL,
	CONSTRAINT "tag_asset_pkey" PRIMARY KEY("assetId","tagId")
);
--> statement-breakpoint
CREATE TABLE "shared_link_asset" (
	"assetId" uuid NOT NULL,
	"sharedLinkId" uuid NOT NULL,
	CONSTRAINT "shared_link_asset_pkey" PRIMARY KEY("assetId","sharedLinkId")
);
--> statement-breakpoint
CREATE TABLE "tag_closure" (
	"id_ancestor" uuid NOT NULL,
	"id_descendant" uuid NOT NULL,
	CONSTRAINT "tag_closure_pkey" PRIMARY KEY("id_ancestor","id_descendant")
);
--> statement-breakpoint
CREATE TABLE "user_metadata" (
	"userId" uuid NOT NULL,
	"key" varchar NOT NULL,
	"value" jsonb NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_metadata_pkey" PRIMARY KEY("userId","key")
);
--> statement-breakpoint
CREATE TABLE "asset_metadata" (
	"assetId" uuid NOT NULL,
	"key" varchar NOT NULL,
	"value" jsonb NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "asset_metadata_pkey" PRIMARY KEY("assetId","key")
);
--> statement-breakpoint
CREATE TABLE "album_asset" (
	"albumId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "album_asset_pkey" PRIMARY KEY("albumId","assetId")
);
--> statement-breakpoint
CREATE TABLE "memory_asset" (
	"memoriesId" uuid NOT NULL,
	"assetId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "memory_asset_pkey" PRIMARY KEY("memoriesId","assetId")
);
--> statement-breakpoint
CREATE TABLE "session_sync_checkpoint" (
	"sessionId" uuid NOT NULL,
	"type" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"ack" varchar NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "session_sync_checkpoint_pkey" PRIMARY KEY("sessionId","type")
);
--> statement-breakpoint
CREATE TABLE "album_user" (
	"albumId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"role" varchar DEFAULT 'editor' NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "album_user_pkey" PRIMARY KEY("albumId","userId")
);
--> statement-breakpoint
CREATE TABLE "partner" (
	"sharedById" uuid NOT NULL,
	"sharedWithId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"inTimeline" boolean DEFAULT false NOT NULL,
	"updateId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	"createId" uuid DEFAULT immich_uuid_v7() NOT NULL,
	CONSTRAINT "partner_pkey" PRIMARY KEY("sharedById","sharedWithId")
);
--> statement-breakpoint
ALTER TABLE "face_search" ADD CONSTRAINT "face_search_faceId_fkey" FOREIGN KEY ("faceId") REFERENCES "public"."asset_face"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_face" ADD CONSTRAINT "asset_face_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset_face" ADD CONSTRAINT "asset_face_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "shared_link" ADD CONSTRAINT "shared_link_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "shared_link" ADD CONSTRAINT "shared_link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset_file" ADD CONSTRAINT "asset_file_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset_ocr" ADD CONSTRAINT "asset_ocr_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ocr_search" ADD CONSTRAINT "ocr_search_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "plugin_filter" ADD CONSTRAINT "plugin_filter_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "public"."plugin"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "plugin_action" ADD CONSTRAINT "plugin_action_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "public"."plugin"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workflow_filter" ADD CONSTRAINT "workflow_filter_pluginFilterId_fkey" FOREIGN KEY ("pluginFilterId") REFERENCES "public"."plugin_filter"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workflow_filter" ADD CONSTRAINT "workflow_filter_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workflow_action" ADD CONSTRAINT "workflow_action_pluginActionId_fkey" FOREIGN KEY ("pluginActionId") REFERENCES "public"."plugin_action"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workflow_action" ADD CONSTRAINT "workflow_action_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "album_asset_audit" ADD CONSTRAINT "album_asset_audit_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "memory_asset_audit" ADD CONSTRAINT "memory_asset_audit_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "public"."memory"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "library" ADD CONSTRAINT "library_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_albumId_assetId_fkey" FOREIGN KEY ("albumId","assetId") REFERENCES "public"."album_asset"("albumId","assetId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "smart_search" ADD CONSTRAINT "smart_search_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_job_status" ADD CONSTRAINT "asset_job_status_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset_exif" ADD CONSTRAINT "asset_exif_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "public"."library"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_livePhotoVideoId_fkey" FOREIGN KEY ("livePhotoVideoId") REFERENCES "public"."asset"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "public"."stack"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "stack" ADD CONSTRAINT "stack_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "stack" ADD CONSTRAINT "stack_primaryAssetId_fkey" FOREIGN KEY ("primaryAssetId") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_faceAssetId_fkey" FOREIGN KEY ("faceAssetId") REFERENCES "public"."asset_face"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "album" ADD CONSTRAINT "album_albumThumbnailAssetId_fkey" FOREIGN KEY ("albumThumbnailAssetId") REFERENCES "public"."asset"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "album" ADD CONSTRAINT "album_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "memory" ADD CONSTRAINT "memory_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tag_asset" ADD CONSTRAINT "tag_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tag_asset" ADD CONSTRAINT "tag_asset_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "shared_link_asset" ADD CONSTRAINT "shared_link_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "shared_link_asset" ADD CONSTRAINT "shared_link_asset_sharedLinkId_fkey" FOREIGN KEY ("sharedLinkId") REFERENCES "public"."shared_link"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tag_closure" ADD CONSTRAINT "tag_closure_id_ancestor_fkey" FOREIGN KEY ("id_ancestor") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_closure" ADD CONSTRAINT "tag_closure_id_descendant_fkey" FOREIGN KEY ("id_descendant") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD CONSTRAINT "user_metadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "asset_metadata" ADD CONSTRAINT "asset_metadata_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "album_asset" ADD CONSTRAINT "album_asset_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "album_asset" ADD CONSTRAINT "album_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "memory_asset" ADD CONSTRAINT "memory_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "memory_asset" ADD CONSTRAINT "memory_asset_memoriesId_fkey" FOREIGN KEY ("memoriesId") REFERENCES "public"."memory"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session_sync_checkpoint" ADD CONSTRAINT "session_sync_checkpoint_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "album_user" ADD CONSTRAINT "album_user_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "album_user" ADD CONSTRAINT "album_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "partner" ADD CONSTRAINT "partner_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner" ADD CONSTRAINT "partner_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "face_index" ON "face_search" USING vchordrq ("embedding" vector_cosine_ops) WITH (options=
        residual_quantization );--> statement-breakpoint
CREATE INDEX "asset_face_assetId_personId_idx" ON "asset_face" USING btree ("assetId" uuid_ops,"personId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_face_personId_assetId_idx" ON "asset_face" USING btree ("personId" uuid_ops,"assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "shared_link_albumId_idx" ON "shared_link" USING btree ("albumId" uuid_ops);--> statement-breakpoint
CREATE INDEX "shared_link_key_idx" ON "shared_link" USING btree ("key" bytea_ops);--> statement-breakpoint
CREATE INDEX "shared_link_userId_idx" ON "shared_link" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_metadata_audit_assetId_idx" ON "asset_metadata_audit" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_metadata_audit_deletedAt_idx" ON "asset_metadata_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "asset_metadata_audit_key_idx" ON "asset_metadata_audit" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "asset_file_assetId_idx" ON "asset_file" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_file_updateId_idx" ON "asset_file" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_ocr_assetId_idx" ON "asset_ocr" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_ocr_search_text" ON "ocr_search" USING gin (f_unaccent(text) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "plugin_name_idx" ON "plugin" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "plugin_filter_methodName_idx" ON "plugin_filter" USING btree ("methodName" text_ops);--> statement-breakpoint
CREATE INDEX "plugin_filter_pluginId_idx" ON "plugin_filter" USING btree ("pluginId" uuid_ops);--> statement-breakpoint
CREATE INDEX "plugin_filter_supportedContexts_idx" ON "plugin_filter" USING gin ("supportedContexts" array_ops);--> statement-breakpoint
CREATE INDEX "plugin_action_methodName_idx" ON "plugin_action" USING btree ("methodName" text_ops);--> statement-breakpoint
CREATE INDEX "plugin_action_pluginId_idx" ON "plugin_action" USING btree ("pluginId" uuid_ops);--> statement-breakpoint
CREATE INDEX "plugin_action_supportedContexts_idx" ON "plugin_action" USING gin ("supportedContexts" array_ops);--> statement-breakpoint
CREATE INDEX "workflow_ownerId_idx" ON "workflow" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "workflow_filter_pluginFilterId_idx" ON "workflow_filter" USING btree ("pluginFilterId" uuid_ops);--> statement-breakpoint
CREATE INDEX "workflow_filter_workflowId_idx" ON "workflow_filter" USING btree ("workflowId" uuid_ops);--> statement-breakpoint
CREATE INDEX "workflow_filter_workflowId_order_idx" ON "workflow_filter" USING btree ("workflowId" uuid_ops,"order" int4_ops);--> statement-breakpoint
CREATE INDEX "workflow_action_pluginActionId_idx" ON "workflow_action" USING btree ("pluginActionId" uuid_ops);--> statement-breakpoint
CREATE INDEX "workflow_action_workflowId_idx" ON "workflow_action" USING btree ("workflowId" uuid_ops);--> statement-breakpoint
CREATE INDEX "workflow_action_workflowId_order_idx" ON "workflow_action" USING btree ("workflowId" uuid_ops,"order" int4_ops);--> statement-breakpoint
CREATE INDEX "IDX_geodata_gist_earthcoord" ON "geodata_places" USING gist (ll_to_earth_public(latitude, longitude) gist_cube_ops);--> statement-breakpoint
CREATE INDEX "idx_geodata_places_admin1_name" ON "geodata_places" USING gin (f_unaccent(("admin1Name")::text) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_geodata_places_admin2_name" ON "geodata_places" USING gin (f_unaccent(("admin2Name")::text) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_geodata_places_alternate_names" ON "geodata_places" USING gin (f_unaccent(("alternateNames")::text) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_geodata_places_name" ON "geodata_places" USING gin (f_unaccent((name)::text) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "person_audit_deletedAt_idx" ON "person_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "person_audit_ownerId_idx" ON "person_audit" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "person_audit_personId_idx" ON "person_audit" USING btree ("personId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IDX_user_metadata_audit_deleted_at" ON "user_metadata_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "IDX_user_metadata_audit_key" ON "user_metadata_audit" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_user_metadata_audit_user_id" ON "user_metadata_audit" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_asset_audit_albumId_idx" ON "album_asset_audit" USING btree ("albumId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_asset_audit_assetId_idx" ON "album_asset_audit" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_asset_audit_deletedAt_idx" ON "album_asset_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "album_audit_albumId_idx" ON "album_audit" USING btree ("albumId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_audit_deletedAt_idx" ON "album_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "album_audit_userId_idx" ON "album_audit" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_user_audit_albumId_idx" ON "album_user_audit" USING btree ("albumId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_user_audit_deletedAt_idx" ON "album_user_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "album_user_audit_userId_idx" ON "album_user_audit" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "api_key_updateId_idx" ON "api_key" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "api_key_userId_idx" ON "api_key" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_audit_assetId_idx" ON "asset_audit" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_audit_deletedAt_idx" ON "asset_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "asset_audit_ownerId_idx" ON "asset_audit" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_asset_audit_assetId_idx" ON "memory_asset_audit" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_asset_audit_deletedAt_idx" ON "memory_asset_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "memory_asset_audit_memoryId_idx" ON "memory_asset_audit" USING btree ("memoryId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_audit_deletedAt_idx" ON "memory_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "memory_audit_memoryId_idx" ON "memory_audit" USING btree ("memoryId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_audit_userId_idx" ON "memory_audit" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "notification_updateId_idx" ON "notification" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "notification_userId_idx" ON "notification" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "partner_audit_deletedAt_idx" ON "partner_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "partner_audit_sharedById_idx" ON "partner_audit" USING btree ("sharedById" uuid_ops);--> statement-breakpoint
CREATE INDEX "partner_audit_sharedWithId_idx" ON "partner_audit" USING btree ("sharedWithId" uuid_ops);--> statement-breakpoint
CREATE INDEX "stack_audit_deletedAt_idx" ON "stack_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "tag_parentId_idx" ON "tag" USING btree ("parentId" uuid_ops);--> statement-breakpoint
CREATE INDEX "tag_updateId_idx" ON "tag" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "user_audit_deletedAt_idx" ON "user_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "library_ownerId_idx" ON "library" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "library_updateId_idx" ON "library" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "audit_ownerId_createdAt_idx" ON "audit" USING btree ("ownerId" timestamptz_ops,"createdAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "activity_albumId_assetId_idx" ON "activity" USING btree ("albumId" uuid_ops,"assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "activity_albumId_idx" ON "activity" USING btree ("albumId" uuid_ops);--> statement-breakpoint
CREATE INDEX "activity_assetId_idx" ON "activity" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "activity_like_idx" ON "activity" USING btree ("assetId" uuid_ops,"userId" uuid_ops,"albumId" uuid_ops) WHERE ("isLiked" = true);--> statement-breakpoint
CREATE INDEX "activity_updateId_idx" ON "activity" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "activity_userId_idx" ON "activity" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "clip_index" ON "smart_search" USING vchordrq ("embedding" vector_cosine_ops) WITH (options=
        residual_quantization );--> statement-breakpoint
CREATE INDEX "asset_exif_autoStackId_idx" ON "asset_exif" USING btree ("autoStackId" text_ops);--> statement-breakpoint
CREATE INDEX "asset_exif_city_idx" ON "asset_exif" USING btree ("city" text_ops);--> statement-breakpoint
CREATE INDEX "asset_exif_livePhotoCID_idx" ON "asset_exif" USING btree ("livePhotoCID" text_ops);--> statement-breakpoint
CREATE INDEX "asset_exif_updateId_idx" ON "asset_exif" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UQ_assets_owner_checksum" ON "asset" USING btree ("ownerId" bytea_ops,"checksum" bytea_ops) WHERE ("libraryId" IS NULL);--> statement-breakpoint
CREATE INDEX "asset_checksum_idx" ON "asset" USING btree ("checksum" bytea_ops);--> statement-breakpoint
CREATE INDEX "asset_duplicateId_idx" ON "asset" USING btree ("duplicateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_fileCreatedAt_idx" ON "asset" USING btree ("fileCreatedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "asset_id_stackId_idx" ON "asset" USING btree ("id" uuid_ops,"stackId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_libraryId_idx" ON "asset" USING btree ("libraryId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_livePhotoVideoId_idx" ON "asset" USING btree ("livePhotoVideoId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_localDateTime_idx" ON "asset" USING btree (((("localDateTime" AT TIME ZONE 'UTC'::text))::date) date_ops);--> statement-breakpoint
CREATE INDEX "asset_localDateTime_month_idx" ON "asset" USING btree ((date_trunc('MONTH'::text, ("localDateTime" AT TIME ZONE 'UTC': timestamptz_ops);--> statement-breakpoint
CREATE INDEX "asset_originalFileName_idx" ON "asset" USING btree ("originalFileName" text_ops);--> statement-breakpoint
CREATE INDEX "asset_originalFilename_trigram_idx" ON "asset" USING gin (f_unaccent(("originalFileName")::text) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "asset_originalPath_libraryId_idx" ON "asset" USING btree ("originalPath" uuid_ops,"libraryId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_ownerId_idx" ON "asset" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "asset_ownerId_libraryId_checksum_idx" ON "asset" USING btree ("ownerId" uuid_ops,"libraryId" uuid_ops,"checksum" bytea_ops) WHERE ("libraryId" IS NOT NULL);--> statement-breakpoint
CREATE INDEX "asset_stackId_idx" ON "asset" USING btree ("stackId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_updateId_idx" ON "asset" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "stack_ownerId_idx" ON "stack" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "stack_primaryAssetId_idx" ON "stack" USING btree ("primaryAssetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "person_faceAssetId_idx" ON "person" USING btree ("faceAssetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "person_ownerId_idx" ON "person" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "person_updateId_idx" ON "person" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_parentId_idx" ON "session" USING btree ("parentId" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_updateId_idx" ON "session" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_albumThumbnailAssetId_idx" ON "album" USING btree ("albumThumbnailAssetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_ownerId_idx" ON "album" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_updateId_idx" ON "album" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_ownerId_idx" ON "memory" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_updateId_idx" ON "memory" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "user_updateId_idx" ON "user" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "user_updatedAt_id_idx" ON "user" USING btree ("updatedAt" uuid_ops,"id" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "asset_face_audit_assetFaceId_idx" ON "asset_face_audit" USING btree ("assetFaceId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_face_audit_assetId_idx" ON "asset_face_audit" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_face_audit_deletedAt_idx" ON "asset_face_audit" USING btree ("deletedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "tag_asset_assetId_idx" ON "tag_asset" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "tag_asset_assetId_tagId_idx" ON "tag_asset" USING btree ("assetId" uuid_ops,"tagId" uuid_ops);--> statement-breakpoint
CREATE INDEX "tag_asset_tagId_idx" ON "tag_asset" USING btree ("tagId" uuid_ops);--> statement-breakpoint
CREATE INDEX "shared_link_asset_assetId_idx" ON "shared_link_asset" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "shared_link_asset_sharedLinkId_idx" ON "shared_link_asset" USING btree ("sharedLinkId" uuid_ops);--> statement-breakpoint
CREATE INDEX "tag_closure_id_ancestor_idx" ON "tag_closure" USING btree ("id_ancestor" uuid_ops);--> statement-breakpoint
CREATE INDEX "tag_closure_id_descendant_idx" ON "tag_closure" USING btree ("id_descendant" uuid_ops);--> statement-breakpoint
CREATE INDEX "IDX_user_metadata_update_id" ON "user_metadata" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IDX_user_metadata_updated_at" ON "user_metadata" USING btree ("updatedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "asset_metadata_updateId_idx" ON "asset_metadata" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "asset_metadata_updatedAt_idx" ON "asset_metadata" USING btree ("updatedAt" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "album_asset_albumId_idx" ON "album_asset" USING btree ("albumId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_asset_assetId_idx" ON "album_asset" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_asset_updateId_idx" ON "album_asset" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_asset_assetId_idx" ON "memory_asset" USING btree ("assetId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_asset_memoriesId_idx" ON "memory_asset" USING btree ("memoriesId" uuid_ops);--> statement-breakpoint
CREATE INDEX "memory_asset_updateId_idx" ON "memory_asset" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_sync_checkpoint_sessionId_idx" ON "session_sync_checkpoint" USING btree ("sessionId" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_sync_checkpoint_updateId_idx" ON "session_sync_checkpoint" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_user_albumId_idx" ON "album_user" USING btree ("albumId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_user_createId_idx" ON "album_user" USING btree ("createId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_user_updateId_idx" ON "album_user" USING btree ("updateId" uuid_ops);--> statement-breakpoint
CREATE INDEX "album_user_userId_idx" ON "album_user" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "partner_createId_idx" ON "partner" USING btree ("createId" uuid_ops);--> statement-breakpoint
CREATE INDEX "partner_sharedWithId_idx" ON "partner" USING btree ("sharedWithId" uuid_ops);--> statement-breakpoint
CREATE INDEX "partner_updateId_idx" ON "partner" USING btree ("updateId" uuid_ops);
*/