import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOverlayLandscapeImage1783668315941 implements MigrationInterface {
  name = 'AddOverlayLandscapeImage1783668315941';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "temporary_collection" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "libraryId" varchar NOT NULL,
                "title" varchar NOT NULL,
                "description" varchar,
                "isActive" boolean NOT NULL DEFAULT (1),
                "arrAction" integer NOT NULL DEFAULT (0),
                "visibleOnHome" boolean NOT NULL DEFAULT (0),
                "deleteAfterDays" integer,
                "type" varchar NOT NULL DEFAULT ('movie'),
                "manualCollection" boolean NOT NULL DEFAULT (0),
                "manualCollectionName" varchar DEFAULT (''),
                "listExclusions" boolean NOT NULL DEFAULT (0),
                "forceSeerr" boolean NOT NULL DEFAULT (0),
                "addDate" date DEFAULT (CURRENT_TIMESTAMP),
                "handledMediaAmount" integer NOT NULL DEFAULT (0),
                "lastDurationInSeconds" integer NOT NULL DEFAULT (0),
                "keepLogsForMonths" integer NOT NULL DEFAULT (6),
                "tautulliWatchedPercentOverride" integer,
                "radarrSettingsId" integer,
                "sonarrSettingsId" integer,
                "visibleOnRecommended" boolean NOT NULL DEFAULT (0),
                "sortTitle" varchar,
                "mediaServerId" varchar,
                "mediaServerType" varchar NOT NULL DEFAULT ('plex'),
                "totalSizeBytes" bigint,
                "radarrQualityProfileId" integer,
                "sonarrQualityProfileId" integer,
                "overlayEnabled" boolean NOT NULL DEFAULT (0),
                "overlayTemplateId" integer,
                "handledMediaSizeBytes" bigint NOT NULL DEFAULT (0),
                "mediaServerSort" varchar,
                "tagInArr" boolean NOT NULL DEFAULT (0),
                "overlayLandscapeEnabled" boolean NOT NULL DEFAULT (0),
                "overlayLandscapeTemplateId" integer,
                CONSTRAINT "FK_b638046ca16fca4108a7981fd8c" FOREIGN KEY ("sonarrSettingsId") REFERENCES "sonarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_7b354cc91e78c8e730465f14f69" FOREIGN KEY ("radarrSettingsId") REFERENCES "radarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_9d81b59ef584c1072c2bcbcccb7" FOREIGN KEY ("overlayTemplateId") REFERENCES "overlay_templates" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_collection"(
                    "id",
                    "libraryId",
                    "title",
                    "description",
                    "isActive",
                    "arrAction",
                    "visibleOnHome",
                    "deleteAfterDays",
                    "type",
                    "manualCollection",
                    "manualCollectionName",
                    "listExclusions",
                    "forceSeerr",
                    "addDate",
                    "handledMediaAmount",
                    "lastDurationInSeconds",
                    "keepLogsForMonths",
                    "tautulliWatchedPercentOverride",
                    "radarrSettingsId",
                    "sonarrSettingsId",
                    "visibleOnRecommended",
                    "sortTitle",
                    "mediaServerId",
                    "mediaServerType",
                    "totalSizeBytes",
                    "radarrQualityProfileId",
                    "sonarrQualityProfileId",
                    "overlayEnabled",
                    "overlayTemplateId",
                    "handledMediaSizeBytes",
                    "mediaServerSort",
                    "tagInArr"
                )
            SELECT "id",
                "libraryId",
                "title",
                "description",
                "isActive",
                "arrAction",
                "visibleOnHome",
                "deleteAfterDays",
                "type",
                "manualCollection",
                "manualCollectionName",
                "listExclusions",
                "forceSeerr",
                "addDate",
                "handledMediaAmount",
                "lastDurationInSeconds",
                "keepLogsForMonths",
                "tautulliWatchedPercentOverride",
                "radarrSettingsId",
                "sonarrSettingsId",
                "visibleOnRecommended",
                "sortTitle",
                "mediaServerId",
                "mediaServerType",
                "totalSizeBytes",
                "radarrQualityProfileId",
                "sonarrQualityProfileId",
                "overlayEnabled",
                "overlayTemplateId",
                "handledMediaSizeBytes",
                "mediaServerSort",
                "tagInArr"
            FROM "collection"
        `);
    await queryRunner.query(`
            DROP TABLE "collection"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_collection"
                RENAME TO "collection"
        `);
    await queryRunner.query(`
            DROP INDEX "IDX_overlay_item_state_collection_media"
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_overlay_item_state" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "collectionId" integer NOT NULL,
                "mediaServerId" varchar NOT NULL,
                "originalPosterPath" varchar,
                "daysLeftShown" integer,
                "processedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "originalLandscapePosterPath" varchar,
                CONSTRAINT "FK_0cdb2226a8ee24176a22b2421e1" FOREIGN KEY ("collectionId") REFERENCES "collection" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_overlay_item_state"(
                    "id",
                    "collectionId",
                    "mediaServerId",
                    "originalPosterPath",
                    "daysLeftShown",
                    "processedAt"
                )
            SELECT "id",
                "collectionId",
                "mediaServerId",
                "originalPosterPath",
                "daysLeftShown",
                "processedAt"
            FROM "overlay_item_state"
        `);
    await queryRunner.query(`
            DROP TABLE "overlay_item_state"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_overlay_item_state"
                RENAME TO "overlay_item_state"
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_overlay_item_state_collection_media" ON "overlay_item_state" ("collectionId", "mediaServerId")
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_collection" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "libraryId" varchar NOT NULL,
                "title" varchar NOT NULL,
                "description" varchar,
                "isActive" boolean NOT NULL DEFAULT (1),
                "arrAction" integer NOT NULL DEFAULT (0),
                "visibleOnHome" boolean NOT NULL DEFAULT (0),
                "deleteAfterDays" integer,
                "type" varchar NOT NULL DEFAULT ('movie'),
                "manualCollection" boolean NOT NULL DEFAULT (0),
                "manualCollectionName" varchar DEFAULT (''),
                "listExclusions" boolean NOT NULL DEFAULT (0),
                "forceSeerr" boolean NOT NULL DEFAULT (0),
                "addDate" date DEFAULT (CURRENT_TIMESTAMP),
                "handledMediaAmount" integer NOT NULL DEFAULT (0),
                "lastDurationInSeconds" integer NOT NULL DEFAULT (0),
                "keepLogsForMonths" integer NOT NULL DEFAULT (6),
                "tautulliWatchedPercentOverride" integer,
                "radarrSettingsId" integer,
                "sonarrSettingsId" integer,
                "visibleOnRecommended" boolean NOT NULL DEFAULT (0),
                "sortTitle" varchar,
                "mediaServerId" varchar,
                "mediaServerType" varchar NOT NULL DEFAULT ('plex'),
                "totalSizeBytes" bigint,
                "radarrQualityProfileId" integer,
                "sonarrQualityProfileId" integer,
                "overlayEnabled" boolean NOT NULL DEFAULT (0),
                "overlayTemplateId" integer,
                "handledMediaSizeBytes" bigint NOT NULL DEFAULT (0),
                "mediaServerSort" varchar,
                "tagInArr" boolean NOT NULL DEFAULT (0),
                "overlayLandscapeEnabled" boolean NOT NULL DEFAULT (0),
                "overlayLandscapeTemplateId" integer,
                CONSTRAINT "FK_b638046ca16fca4108a7981fd8c" FOREIGN KEY ("sonarrSettingsId") REFERENCES "sonarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_7b354cc91e78c8e730465f14f69" FOREIGN KEY ("radarrSettingsId") REFERENCES "radarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_9d81b59ef584c1072c2bcbcccb7" FOREIGN KEY ("overlayTemplateId") REFERENCES "overlay_templates" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION,
                    CONSTRAINT "FK_d0facedba6e33d7efb1d6ebe027" FOREIGN KEY ("overlayLandscapeTemplateId") REFERENCES "overlay_templates" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_collection"(
                    "id",
                    "libraryId",
                    "title",
                    "description",
                    "isActive",
                    "arrAction",
                    "visibleOnHome",
                    "deleteAfterDays",
                    "type",
                    "manualCollection",
                    "manualCollectionName",
                    "listExclusions",
                    "forceSeerr",
                    "addDate",
                    "handledMediaAmount",
                    "lastDurationInSeconds",
                    "keepLogsForMonths",
                    "tautulliWatchedPercentOverride",
                    "radarrSettingsId",
                    "sonarrSettingsId",
                    "visibleOnRecommended",
                    "sortTitle",
                    "mediaServerId",
                    "mediaServerType",
                    "totalSizeBytes",
                    "radarrQualityProfileId",
                    "sonarrQualityProfileId",
                    "overlayEnabled",
                    "overlayTemplateId",
                    "handledMediaSizeBytes",
                    "mediaServerSort",
                    "tagInArr",
                    "overlayLandscapeEnabled",
                    "overlayLandscapeTemplateId"
                )
            SELECT "id",
                "libraryId",
                "title",
                "description",
                "isActive",
                "arrAction",
                "visibleOnHome",
                "deleteAfterDays",
                "type",
                "manualCollection",
                "manualCollectionName",
                "listExclusions",
                "forceSeerr",
                "addDate",
                "handledMediaAmount",
                "lastDurationInSeconds",
                "keepLogsForMonths",
                "tautulliWatchedPercentOverride",
                "radarrSettingsId",
                "sonarrSettingsId",
                "visibleOnRecommended",
                "sortTitle",
                "mediaServerId",
                "mediaServerType",
                "totalSizeBytes",
                "radarrQualityProfileId",
                "sonarrQualityProfileId",
                "overlayEnabled",
                "overlayTemplateId",
                "handledMediaSizeBytes",
                "mediaServerSort",
                "tagInArr",
                "overlayLandscapeEnabled",
                "overlayLandscapeTemplateId"
            FROM "collection"
        `);
    await queryRunner.query(`
            DROP TABLE "collection"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_collection"
                RENAME TO "collection"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "collection"
                RENAME TO "temporary_collection"
        `);
    await queryRunner.query(`
            CREATE TABLE "collection" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "libraryId" varchar NOT NULL,
                "title" varchar NOT NULL,
                "description" varchar,
                "isActive" boolean NOT NULL DEFAULT (1),
                "arrAction" integer NOT NULL DEFAULT (0),
                "visibleOnHome" boolean NOT NULL DEFAULT (0),
                "deleteAfterDays" integer,
                "type" varchar NOT NULL DEFAULT ('movie'),
                "manualCollection" boolean NOT NULL DEFAULT (0),
                "manualCollectionName" varchar DEFAULT (''),
                "listExclusions" boolean NOT NULL DEFAULT (0),
                "forceSeerr" boolean NOT NULL DEFAULT (0),
                "addDate" date DEFAULT (CURRENT_TIMESTAMP),
                "handledMediaAmount" integer NOT NULL DEFAULT (0),
                "lastDurationInSeconds" integer NOT NULL DEFAULT (0),
                "keepLogsForMonths" integer NOT NULL DEFAULT (6),
                "tautulliWatchedPercentOverride" integer,
                "radarrSettingsId" integer,
                "sonarrSettingsId" integer,
                "visibleOnRecommended" boolean NOT NULL DEFAULT (0),
                "sortTitle" varchar,
                "mediaServerId" varchar,
                "mediaServerType" varchar NOT NULL DEFAULT ('plex'),
                "totalSizeBytes" bigint,
                "radarrQualityProfileId" integer,
                "sonarrQualityProfileId" integer,
                "overlayEnabled" boolean NOT NULL DEFAULT (0),
                "overlayTemplateId" integer,
                "handledMediaSizeBytes" bigint NOT NULL DEFAULT (0),
                "mediaServerSort" varchar,
                "tagInArr" boolean NOT NULL DEFAULT (0),
                "overlayLandscapeEnabled" boolean NOT NULL DEFAULT (0),
                "overlayLandscapeTemplateId" integer,
                CONSTRAINT "FK_b638046ca16fca4108a7981fd8c" FOREIGN KEY ("sonarrSettingsId") REFERENCES "sonarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_7b354cc91e78c8e730465f14f69" FOREIGN KEY ("radarrSettingsId") REFERENCES "radarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_9d81b59ef584c1072c2bcbcccb7" FOREIGN KEY ("overlayTemplateId") REFERENCES "overlay_templates" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "collection"(
                    "id",
                    "libraryId",
                    "title",
                    "description",
                    "isActive",
                    "arrAction",
                    "visibleOnHome",
                    "deleteAfterDays",
                    "type",
                    "manualCollection",
                    "manualCollectionName",
                    "listExclusions",
                    "forceSeerr",
                    "addDate",
                    "handledMediaAmount",
                    "lastDurationInSeconds",
                    "keepLogsForMonths",
                    "tautulliWatchedPercentOverride",
                    "radarrSettingsId",
                    "sonarrSettingsId",
                    "visibleOnRecommended",
                    "sortTitle",
                    "mediaServerId",
                    "mediaServerType",
                    "totalSizeBytes",
                    "radarrQualityProfileId",
                    "sonarrQualityProfileId",
                    "overlayEnabled",
                    "overlayTemplateId",
                    "handledMediaSizeBytes",
                    "mediaServerSort",
                    "tagInArr",
                    "overlayLandscapeEnabled",
                    "overlayLandscapeTemplateId"
                )
            SELECT "id",
                "libraryId",
                "title",
                "description",
                "isActive",
                "arrAction",
                "visibleOnHome",
                "deleteAfterDays",
                "type",
                "manualCollection",
                "manualCollectionName",
                "listExclusions",
                "forceSeerr",
                "addDate",
                "handledMediaAmount",
                "lastDurationInSeconds",
                "keepLogsForMonths",
                "tautulliWatchedPercentOverride",
                "radarrSettingsId",
                "sonarrSettingsId",
                "visibleOnRecommended",
                "sortTitle",
                "mediaServerId",
                "mediaServerType",
                "totalSizeBytes",
                "radarrQualityProfileId",
                "sonarrQualityProfileId",
                "overlayEnabled",
                "overlayTemplateId",
                "handledMediaSizeBytes",
                "mediaServerSort",
                "tagInArr",
                "overlayLandscapeEnabled",
                "overlayLandscapeTemplateId"
            FROM "temporary_collection"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_collection"
        `);
    await queryRunner.query(`
            DROP INDEX "IDX_overlay_item_state_collection_media"
        `);
    await queryRunner.query(`
            ALTER TABLE "overlay_item_state"
                RENAME TO "temporary_overlay_item_state"
        `);
    await queryRunner.query(`
            CREATE TABLE "overlay_item_state" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "collectionId" integer NOT NULL,
                "mediaServerId" varchar NOT NULL,
                "originalPosterPath" varchar,
                "daysLeftShown" integer,
                "processedAt" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_0cdb2226a8ee24176a22b2421e1" FOREIGN KEY ("collectionId") REFERENCES "collection" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "overlay_item_state"(
                    "id",
                    "collectionId",
                    "mediaServerId",
                    "originalPosterPath",
                    "daysLeftShown",
                    "processedAt"
                )
            SELECT "id",
                "collectionId",
                "mediaServerId",
                "originalPosterPath",
                "daysLeftShown",
                "processedAt"
            FROM "temporary_overlay_item_state"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_overlay_item_state"
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_overlay_item_state_collection_media" ON "overlay_item_state" ("collectionId", "mediaServerId")
        `);
    await queryRunner.query(`
            ALTER TABLE "collection"
                RENAME TO "temporary_collection"
        `);
    await queryRunner.query(`
            CREATE TABLE "collection" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "libraryId" varchar NOT NULL,
                "title" varchar NOT NULL,
                "description" varchar,
                "isActive" boolean NOT NULL DEFAULT (1),
                "arrAction" integer NOT NULL DEFAULT (0),
                "visibleOnHome" boolean NOT NULL DEFAULT (0),
                "deleteAfterDays" integer,
                "type" varchar NOT NULL DEFAULT ('movie'),
                "manualCollection" boolean NOT NULL DEFAULT (0),
                "manualCollectionName" varchar DEFAULT (''),
                "listExclusions" boolean NOT NULL DEFAULT (0),
                "forceSeerr" boolean NOT NULL DEFAULT (0),
                "addDate" date DEFAULT (CURRENT_TIMESTAMP),
                "handledMediaAmount" integer NOT NULL DEFAULT (0),
                "lastDurationInSeconds" integer NOT NULL DEFAULT (0),
                "keepLogsForMonths" integer NOT NULL DEFAULT (6),
                "tautulliWatchedPercentOverride" integer,
                "radarrSettingsId" integer,
                "sonarrSettingsId" integer,
                "visibleOnRecommended" boolean NOT NULL DEFAULT (0),
                "sortTitle" varchar,
                "mediaServerId" varchar,
                "mediaServerType" varchar NOT NULL DEFAULT ('plex'),
                "totalSizeBytes" bigint,
                "radarrQualityProfileId" integer,
                "sonarrQualityProfileId" integer,
                "overlayEnabled" boolean NOT NULL DEFAULT (0),
                "overlayTemplateId" integer,
                "handledMediaSizeBytes" bigint NOT NULL DEFAULT (0),
                "mediaServerSort" varchar,
                "tagInArr" boolean NOT NULL DEFAULT (0),
                CONSTRAINT "FK_b638046ca16fca4108a7981fd8c" FOREIGN KEY ("sonarrSettingsId") REFERENCES "sonarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_7b354cc91e78c8e730465f14f69" FOREIGN KEY ("radarrSettingsId") REFERENCES "radarr_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_9d81b59ef584c1072c2bcbcccb7" FOREIGN KEY ("overlayTemplateId") REFERENCES "overlay_templates" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "collection"(
                    "id",
                    "libraryId",
                    "title",
                    "description",
                    "isActive",
                    "arrAction",
                    "visibleOnHome",
                    "deleteAfterDays",
                    "type",
                    "manualCollection",
                    "manualCollectionName",
                    "listExclusions",
                    "forceSeerr",
                    "addDate",
                    "handledMediaAmount",
                    "lastDurationInSeconds",
                    "keepLogsForMonths",
                    "tautulliWatchedPercentOverride",
                    "radarrSettingsId",
                    "sonarrSettingsId",
                    "visibleOnRecommended",
                    "sortTitle",
                    "mediaServerId",
                    "mediaServerType",
                    "totalSizeBytes",
                    "radarrQualityProfileId",
                    "sonarrQualityProfileId",
                    "overlayEnabled",
                    "overlayTemplateId",
                    "handledMediaSizeBytes",
                    "mediaServerSort",
                    "tagInArr"
                )
            SELECT "id",
                "libraryId",
                "title",
                "description",
                "isActive",
                "arrAction",
                "visibleOnHome",
                "deleteAfterDays",
                "type",
                "manualCollection",
                "manualCollectionName",
                "listExclusions",
                "forceSeerr",
                "addDate",
                "handledMediaAmount",
                "lastDurationInSeconds",
                "keepLogsForMonths",
                "tautulliWatchedPercentOverride",
                "radarrSettingsId",
                "sonarrSettingsId",
                "visibleOnRecommended",
                "sortTitle",
                "mediaServerId",
                "mediaServerType",
                "totalSizeBytes",
                "radarrQualityProfileId",
                "sonarrQualityProfileId",
                "overlayEnabled",
                "overlayTemplateId",
                "handledMediaSizeBytes",
                "mediaServerSort",
                "tagInArr"
            FROM "temporary_collection"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_collection"
        `);
  }
}
