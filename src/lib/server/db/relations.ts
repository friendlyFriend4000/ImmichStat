import { relations } from "drizzle-orm/relations";
import { assetFace, faceSearch, asset, person, album, sharedLink, user, assetFile, assetOcr, ocrSearch, plugin, pluginFilter, pluginAction, workflow, workflowFilter, workflowAction, albumAssetAudit, apiKey, memory, memoryAssetAudit, notification, tag, library, albumAsset, activity, smartSearch, assetJobStatus, assetExif, stack, session, tagAsset, sharedLinkAsset, tagClosure, userMetadata, assetMetadata, memoryAsset, sessionSyncCheckpoint, albumUser, partner } from "./schema";

export const faceSearchRelations = relations(faceSearch, ({one}) => ({
	assetFace: one(assetFace, {
		fields: [faceSearch.faceId],
		references: [assetFace.id]
	}),
}));

export const assetFaceRelations = relations(assetFace, ({one, many}) => ({
	faceSearches: many(faceSearch),
	asset: one(asset, {
		fields: [assetFace.assetId],
		references: [asset.id]
	}),
	person: one(person, {
		fields: [assetFace.personId],
		references: [person.id],
		relationName: "assetFace_personId_person_id"
	}),
	people: many(person, {
		relationName: "person_faceAssetId_assetFace_id"
	}),
}));

export const assetRelations = relations(asset, ({one, many}) => ({
	assetFaces: many(assetFace),
	assetFiles: many(assetFile),
	assetOcrs: many(assetOcr),
	ocrSearches: many(ocrSearch),
	activities: many(activity),
	smartSearches: many(smartSearch),
	assetJobStatuses: many(assetJobStatus),
	assetExifs: many(assetExif),
	library: one(library, {
		fields: [asset.libraryId],
		references: [library.id]
	}),
	asset: one(asset, {
		fields: [asset.livePhotoVideoId],
		references: [asset.id],
		relationName: "asset_livePhotoVideoId_asset_id"
	}),
	assets: many(asset, {
		relationName: "asset_livePhotoVideoId_asset_id"
	}),
	user: one(user, {
		fields: [asset.ownerId],
		references: [user.id]
	}),
	stack: one(stack, {
		fields: [asset.stackId],
		references: [stack.id],
		relationName: "asset_stackId_stack_id"
	}),
	stacks: many(stack, {
		relationName: "stack_primaryAssetId_asset_id"
	}),
	albums: many(album),
	tagAssets: many(tagAsset),
	sharedLinkAssets: many(sharedLinkAsset),
	assetMetadata: many(assetMetadata),
	albumAssets: many(albumAsset),
	memoryAssets: many(memoryAsset),
}));

export const personRelations = relations(person, ({one, many}) => ({
	assetFaces: many(assetFace, {
		relationName: "assetFace_personId_person_id"
	}),
	assetFace: one(assetFace, {
		fields: [person.faceAssetId],
		references: [assetFace.id],
		relationName: "person_faceAssetId_assetFace_id"
	}),
	user: one(user, {
		fields: [person.ownerId],
		references: [user.id]
	}),
}));

export const sharedLinkRelations = relations(sharedLink, ({one, many}) => ({
	album: one(album, {
		fields: [sharedLink.albumId],
		references: [album.id]
	}),
	user: one(user, {
		fields: [sharedLink.userId],
		references: [user.id]
	}),
	sharedLinkAssets: many(sharedLinkAsset),
}));

export const albumRelations = relations(album, ({one, many}) => ({
	sharedLinks: many(sharedLink),
	albumAssetAudits: many(albumAssetAudit),
	activities: many(activity),
	asset: one(asset, {
		fields: [album.albumThumbnailAssetId],
		references: [asset.id]
	}),
	user: one(user, {
		fields: [album.ownerId],
		references: [user.id]
	}),
	albumAssets: many(albumAsset),
	albumUsers: many(albumUser),
}));

export const userRelations = relations(user, ({many}) => ({
	sharedLinks: many(sharedLink),
	workflows: many(workflow),
	apiKeys: many(apiKey),
	notifications: many(notification),
	tags: many(tag),
	libraries: many(library),
	activities: many(activity),
	assets: many(asset),
	stacks: many(stack),
	people: many(person),
	sessions: many(session),
	albums: many(album),
	memories: many(memory),
	userMetadata: many(userMetadata),
	albumUsers: many(albumUser),
	partners_sharedById: many(partner, {
		relationName: "partner_sharedById_user_id"
	}),
	partners_sharedWithId: many(partner, {
		relationName: "partner_sharedWithId_user_id"
	}),
}));

export const assetFileRelations = relations(assetFile, ({one}) => ({
	asset: one(asset, {
		fields: [assetFile.assetId],
		references: [asset.id]
	}),
}));

export const assetOcrRelations = relations(assetOcr, ({one}) => ({
	asset: one(asset, {
		fields: [assetOcr.assetId],
		references: [asset.id]
	}),
}));

export const ocrSearchRelations = relations(ocrSearch, ({one}) => ({
	asset: one(asset, {
		fields: [ocrSearch.assetId],
		references: [asset.id]
	}),
}));

export const pluginFilterRelations = relations(pluginFilter, ({one, many}) => ({
	plugin: one(plugin, {
		fields: [pluginFilter.pluginId],
		references: [plugin.id]
	}),
	workflowFilters: many(workflowFilter),
}));

export const pluginRelations = relations(plugin, ({many}) => ({
	pluginFilters: many(pluginFilter),
	pluginActions: many(pluginAction),
}));

export const pluginActionRelations = relations(pluginAction, ({one, many}) => ({
	plugin: one(plugin, {
		fields: [pluginAction.pluginId],
		references: [plugin.id]
	}),
	workflowActions: many(workflowAction),
}));

export const workflowRelations = relations(workflow, ({one, many}) => ({
	user: one(user, {
		fields: [workflow.ownerId],
		references: [user.id]
	}),
	workflowFilters: many(workflowFilter),
	workflowActions: many(workflowAction),
}));

export const workflowFilterRelations = relations(workflowFilter, ({one}) => ({
	pluginFilter: one(pluginFilter, {
		fields: [workflowFilter.pluginFilterId],
		references: [pluginFilter.id]
	}),
	workflow: one(workflow, {
		fields: [workflowFilter.workflowId],
		references: [workflow.id]
	}),
}));

export const workflowActionRelations = relations(workflowAction, ({one}) => ({
	pluginAction: one(pluginAction, {
		fields: [workflowAction.pluginActionId],
		references: [pluginAction.id]
	}),
	workflow: one(workflow, {
		fields: [workflowAction.workflowId],
		references: [workflow.id]
	}),
}));

export const albumAssetAuditRelations = relations(albumAssetAudit, ({one}) => ({
	album: one(album, {
		fields: [albumAssetAudit.albumId],
		references: [album.id]
	}),
}));

export const apiKeyRelations = relations(apiKey, ({one}) => ({
	user: one(user, {
		fields: [apiKey.userId],
		references: [user.id]
	}),
}));

export const memoryAssetAuditRelations = relations(memoryAssetAudit, ({one}) => ({
	memory: one(memory, {
		fields: [memoryAssetAudit.memoryId],
		references: [memory.id]
	}),
}));

export const memoryRelations = relations(memory, ({one, many}) => ({
	memoryAssetAudits: many(memoryAssetAudit),
	user: one(user, {
		fields: [memory.ownerId],
		references: [user.id]
	}),
	memoryAssets: many(memoryAsset),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id]
	}),
}));

export const tagRelations = relations(tag, ({one, many}) => ({
	tag: one(tag, {
		fields: [tag.parentId],
		references: [tag.id],
		relationName: "tag_parentId_tag_id"
	}),
	tags: many(tag, {
		relationName: "tag_parentId_tag_id"
	}),
	user: one(user, {
		fields: [tag.userId],
		references: [user.id]
	}),
	tagAssets: many(tagAsset),
	tagClosures_idAncestor: many(tagClosure, {
		relationName: "tagClosure_idAncestor_tag_id"
	}),
	tagClosures_idDescendant: many(tagClosure, {
		relationName: "tagClosure_idDescendant_tag_id"
	}),
}));

export const libraryRelations = relations(library, ({one, many}) => ({
	user: one(user, {
		fields: [library.ownerId],
		references: [user.id]
	}),
	assets: many(asset),
}));

export const activityRelations = relations(activity, ({one}) => ({
	albumAsset: one(albumAsset, {
		fields: [activity.albumId],
		references: [albumAsset.albumId]
	}),
	album: one(album, {
		fields: [activity.albumId],
		references: [album.id]
	}),
	asset: one(asset, {
		fields: [activity.assetId],
		references: [asset.id]
	}),
	user: one(user, {
		fields: [activity.userId],
		references: [user.id]
	}),
}));

export const albumAssetRelations = relations(albumAsset, ({one, many}) => ({
	activities: many(activity),
	album: one(album, {
		fields: [albumAsset.albumId],
		references: [album.id]
	}),
	asset: one(asset, {
		fields: [albumAsset.assetId],
		references: [asset.id]
	}),
}));

export const smartSearchRelations = relations(smartSearch, ({one}) => ({
	asset: one(asset, {
		fields: [smartSearch.assetId],
		references: [asset.id]
	}),
}));

export const assetJobStatusRelations = relations(assetJobStatus, ({one}) => ({
	asset: one(asset, {
		fields: [assetJobStatus.assetId],
		references: [asset.id]
	}),
}));

export const assetExifRelations = relations(assetExif, ({one}) => ({
	asset: one(asset, {
		fields: [assetExif.assetId],
		references: [asset.id]
	}),
}));

export const stackRelations = relations(stack, ({one, many}) => ({
	assets: many(asset, {
		relationName: "asset_stackId_stack_id"
	}),
	user: one(user, {
		fields: [stack.ownerId],
		references: [user.id]
	}),
	asset: one(asset, {
		fields: [stack.primaryAssetId],
		references: [asset.id],
		relationName: "stack_primaryAssetId_asset_id"
	}),
}));

export const sessionRelations = relations(session, ({one, many}) => ({
	session: one(session, {
		fields: [session.parentId],
		references: [session.id],
		relationName: "session_parentId_session_id"
	}),
	sessions: many(session, {
		relationName: "session_parentId_session_id"
	}),
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
	sessionSyncCheckpoints: many(sessionSyncCheckpoint),
}));

export const tagAssetRelations = relations(tagAsset, ({one}) => ({
	asset: one(asset, {
		fields: [tagAsset.assetId],
		references: [asset.id]
	}),
	tag: one(tag, {
		fields: [tagAsset.tagId],
		references: [tag.id]
	}),
}));

export const sharedLinkAssetRelations = relations(sharedLinkAsset, ({one}) => ({
	asset: one(asset, {
		fields: [sharedLinkAsset.assetId],
		references: [asset.id]
	}),
	sharedLink: one(sharedLink, {
		fields: [sharedLinkAsset.sharedLinkId],
		references: [sharedLink.id]
	}),
}));

export const tagClosureRelations = relations(tagClosure, ({one}) => ({
	tag_idAncestor: one(tag, {
		fields: [tagClosure.idAncestor],
		references: [tag.id],
		relationName: "tagClosure_idAncestor_tag_id"
	}),
	tag_idDescendant: one(tag, {
		fields: [tagClosure.idDescendant],
		references: [tag.id],
		relationName: "tagClosure_idDescendant_tag_id"
	}),
}));

export const userMetadataRelations = relations(userMetadata, ({one}) => ({
	user: one(user, {
		fields: [userMetadata.userId],
		references: [user.id]
	}),
}));

export const assetMetadataRelations = relations(assetMetadata, ({one}) => ({
	asset: one(asset, {
		fields: [assetMetadata.assetId],
		references: [asset.id]
	}),
}));

export const memoryAssetRelations = relations(memoryAsset, ({one}) => ({
	asset: one(asset, {
		fields: [memoryAsset.assetId],
		references: [asset.id]
	}),
	memory: one(memory, {
		fields: [memoryAsset.memoriesId],
		references: [memory.id]
	}),
}));

export const sessionSyncCheckpointRelations = relations(sessionSyncCheckpoint, ({one}) => ({
	session: one(session, {
		fields: [sessionSyncCheckpoint.sessionId],
		references: [session.id]
	}),
}));

export const albumUserRelations = relations(albumUser, ({one}) => ({
	album: one(album, {
		fields: [albumUser.albumId],
		references: [album.id]
	}),
	user: one(user, {
		fields: [albumUser.userId],
		references: [user.id]
	}),
}));

export const partnerRelations = relations(partner, ({one}) => ({
	user_sharedById: one(user, {
		fields: [partner.sharedById],
		references: [user.id],
		relationName: "partner_sharedById_user_id"
	}),
	user_sharedWithId: one(user, {
		fields: [partner.sharedWithId],
		references: [user.id],
		relationName: "partner_sharedWithId_user_id"
	}),
}));