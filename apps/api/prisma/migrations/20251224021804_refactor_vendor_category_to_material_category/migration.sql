/*
  Warnings:

  - You are about to drop the column `vendor_category_id` on the `mst_checklist_item` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_category_id` on the `mst_vendor` table. All the data in the column will be lost.
  - You are about to drop the column `snapshot_vendor_category_id` on the `ops_checkin_entry` table. All the data in the column will be lost.
  - You are about to drop the `mst_vendor_category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `material_category_id` to the `ops_checkin_entry` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mst_checklist_item] DROP CONSTRAINT [mst_checklist_item_vendor_category_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mst_vendor] DROP CONSTRAINT [mst_vendor_vendor_category_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] DROP CONSTRAINT [ops_checkin_entry_snapshot_vendor_category_id_fkey];

-- DropIndex
DROP INDEX [idx_mst_checklist_item_type_vendor_active] ON [dbo].[mst_checklist_item];

-- DropIndex
DROP INDEX [idx_mst_vendor_category_active] ON [dbo].[mst_vendor];

-- AlterTable
ALTER TABLE [dbo].[cfg_system] DROP CONSTRAINT [cfg_system_created_at_df],
[cfg_system_updated_at_df];
ALTER TABLE [dbo].[cfg_system] ADD CONSTRAINT [cfg_system_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [cfg_system_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[log_audit] DROP CONSTRAINT [log_audit_created_at_df];
ALTER TABLE [dbo].[log_audit] ADD CONSTRAINT [log_audit_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at];

-- AlterTable
ALTER TABLE [dbo].[log_report_export] DROP CONSTRAINT [log_report_export_export_time_df];
ALTER TABLE [dbo].[log_report_export] ADD CONSTRAINT [log_report_export_export_time_df] DEFAULT CURRENT_TIMESTAMP FOR [export_time];

-- AlterTable
ALTER TABLE [dbo].[mst_checklist_category] DROP CONSTRAINT [mst_checklist_category_created_at_df],
[mst_checklist_category_updated_at_df];
ALTER TABLE [dbo].[mst_checklist_category] ADD CONSTRAINT [mst_checklist_category_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_checklist_category_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_checklist_item] DROP CONSTRAINT [mst_checklist_item_created_at_df],
[mst_checklist_item_updated_at_df];
ALTER TABLE [dbo].[mst_checklist_item] DROP COLUMN [vendor_category_id];
ALTER TABLE [dbo].[mst_checklist_item] ADD CONSTRAINT [mst_checklist_item_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_checklist_item_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];
ALTER TABLE [dbo].[mst_checklist_item] ADD [material_category_id] INT;

-- AlterTable
ALTER TABLE [dbo].[mst_user] DROP CONSTRAINT [mst_user_created_at_df],
[mst_user_updated_at_df];
ALTER TABLE [dbo].[mst_user] ADD CONSTRAINT [mst_user_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_user_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_vendor] DROP CONSTRAINT [mst_vendor_created_at_df],
[mst_vendor_updated_at_df];
ALTER TABLE [dbo].[mst_vendor] DROP COLUMN [vendor_category_id];
ALTER TABLE [dbo].[mst_vendor] ADD CONSTRAINT [mst_vendor_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_vendor_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[ops_checkin_entry] DROP CONSTRAINT [ops_checkin_entry_created_at_df],
[ops_checkin_entry_submission_time_df],
[ops_checkin_entry_updated_at_df];
ALTER TABLE [dbo].[ops_checkin_entry] DROP COLUMN [snapshot_vendor_category_id];
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [ops_checkin_entry_submission_time_df] DEFAULT CURRENT_TIMESTAMP FOR [submission_time], CONSTRAINT [ops_checkin_entry_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];
ALTER TABLE [dbo].[ops_checkin_entry] ADD [material_category_id] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[ops_checkin_response] DROP CONSTRAINT [ops_checkin_response_created_at_df];
ALTER TABLE [dbo].[ops_checkin_response] ADD CONSTRAINT [ops_checkin_response_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at];

-- AlterTable
ALTER TABLE [dbo].[ops_queue_status] DROP CONSTRAINT [ops_queue_status_last_updated_df];
ALTER TABLE [dbo].[ops_queue_status] ADD CONSTRAINT [ops_queue_status_last_updated_df] DEFAULT CURRENT_TIMESTAMP FOR [last_updated];

-- AlterTable
ALTER TABLE [dbo].[ops_timelog] DROP CONSTRAINT [ops_timelog_created_at_df],
[ops_timelog_updated_at_df];
ALTER TABLE [dbo].[ops_timelog] ADD CONSTRAINT [ops_timelog_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [ops_timelog_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[ops_verification] DROP CONSTRAINT [ops_verification_created_at_df],
[ops_verification_verification_time_df];
ALTER TABLE [dbo].[ops_verification] ADD CONSTRAINT [ops_verification_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [ops_verification_verification_time_df] DEFAULT CURRENT_TIMESTAMP FOR [verification_time];

-- DropTable
DROP TABLE [dbo].[mst_vendor_category];

-- CreateTable
CREATE TABLE [dbo].[mst_material_category] (
    [material_category_id] INT NOT NULL IDENTITY(1,1),
    [category_name] VARCHAR(255) NOT NULL,
    [category_code] VARCHAR(50) NOT NULL,
    [description] TEXT,
    [is_active] BIT NOT NULL CONSTRAINT [mst_material_category_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_material_category_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_material_category_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_material_category_pkey] PRIMARY KEY CLUSTERED ([material_category_id]),
    CONSTRAINT [mst_material_category_category_name_key] UNIQUE NONCLUSTERED ([category_name]),
    CONSTRAINT [mst_material_category_category_code_key] UNIQUE NONCLUSTERED ([category_code])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_material_category_category_code] ON [dbo].[mst_material_category]([category_code]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_checklist_item_type_material_category_active] ON [dbo].[mst_checklist_item]([item_type], [material_category_id], [is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_active] ON [dbo].[mst_vendor]([is_active]);

-- AddForeignKey
ALTER TABLE [dbo].[mst_checklist_item] ADD CONSTRAINT [mst_checklist_item_material_category_id_fkey] FOREIGN KEY ([material_category_id]) REFERENCES [dbo].[mst_material_category]([material_category_id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_material_category_id_fkey] FOREIGN KEY ([material_category_id]) REFERENCES [dbo].[mst_material_category]([material_category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
