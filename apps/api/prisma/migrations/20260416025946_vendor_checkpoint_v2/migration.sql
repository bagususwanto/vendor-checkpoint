/*
  Warnings:

  - You are about to drop the column `material_category_id` on the `mst_checklist_item` table. All the data in the column will be lost.
  - You are about to alter the column `external_user_id` on the `mst_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to drop the column `material_category_id` on the `ops_checkin_entry` table. All the data in the column will be lost.
  - You are about to drop the `mst_material_category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `snapshot_vendor_category_id` to the `ops_checkin_entry` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mst_checklist_item] DROP CONSTRAINT [mst_checklist_item_material_category_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] DROP CONSTRAINT [ops_checkin_entry_material_category_id_fkey];

-- DropIndex
DROP INDEX [idx_mst_checklist_item_type_material_category_active] ON [dbo].[mst_checklist_item];

-- DropIndex
DROP INDEX [idx_mst_user_external_user_id] ON [dbo].[mst_user];

-- DropIndex
ALTER TABLE [dbo].[mst_user] DROP CONSTRAINT [mst_user_external_user_id_key];

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
ALTER TABLE [dbo].[mst_checklist_item] DROP COLUMN [material_category_id];
ALTER TABLE [dbo].[mst_checklist_item] ADD CONSTRAINT [mst_checklist_item_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_checklist_item_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];
ALTER TABLE [dbo].[mst_checklist_item] ADD [vendor_category_id] INT;

-- AlterTable
ALTER TABLE [dbo].[mst_user] DROP CONSTRAINT [mst_user_created_at_df],
[mst_user_updated_at_df];
ALTER TABLE [dbo].[mst_user] ALTER COLUMN [external_user_id] INT NOT NULL;
ALTER TABLE [dbo].[mst_user] ADD CONSTRAINT [mst_user_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_user_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_vendor] DROP CONSTRAINT [mst_vendor_created_at_df],
[mst_vendor_updated_at_df];
ALTER TABLE [dbo].[mst_vendor] ADD CONSTRAINT [mst_vendor_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_vendor_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];
ALTER TABLE [dbo].[mst_vendor] ADD [vendor_category_id] INT;

-- AlterTable
ALTER TABLE [dbo].[ops_checkin_entry] DROP CONSTRAINT [ops_checkin_entry_created_at_df],
[ops_checkin_entry_submission_time_df],
[ops_checkin_entry_updated_at_df];
ALTER TABLE [dbo].[ops_checkin_entry] DROP COLUMN [material_category_id];
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [ops_checkin_entry_submission_time_df] DEFAULT CURRENT_TIMESTAMP FOR [submission_time], CONSTRAINT [ops_checkin_entry_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];
ALTER TABLE [dbo].[ops_checkin_entry] ADD [ai_safety_status] VARCHAR(50),
[arrival_status] VARCHAR(50),
[delay_arrival_reason_id] INT,
[dn_number] VARCHAR(100),
[po_number] VARCHAR(100),
[slot_id] INT,
[snapshot_vendor_category_id] INT NOT NULL;

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
ALTER TABLE [dbo].[ops_timelog] ADD [delay_departure_reason_id] INT,
[departure_status] VARCHAR(50);

-- AlterTable
ALTER TABLE [dbo].[ops_verification] DROP CONSTRAINT [ops_verification_created_at_df],
[ops_verification_verification_time_df];
ALTER TABLE [dbo].[ops_verification] ADD CONSTRAINT [ops_verification_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [ops_verification_verification_time_df] DEFAULT CURRENT_TIMESTAMP FOR [verification_time];

-- DropTable
DROP TABLE [dbo].[mst_material_category];

-- CreateTable
CREATE TABLE [dbo].[mst_vendor_category] (
    [vendor_category_id] INT NOT NULL IDENTITY(1,1),
    [category_name] VARCHAR(255) NOT NULL,
    [category_code] VARCHAR(50) NOT NULL,
    [description] TEXT,
    [is_active] BIT NOT NULL CONSTRAINT [mst_vendor_category_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_vendor_category_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_vendor_category_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_vendor_category_pkey] PRIMARY KEY CLUSTERED ([vendor_category_id]),
    CONSTRAINT [mst_vendor_category_category_name_key] UNIQUE NONCLUSTERED ([category_name]),
    CONSTRAINT [mst_vendor_category_category_code_key] UNIQUE NONCLUSTERED ([category_code])
);

-- CreateTable
CREATE TABLE [dbo].[mst_delay_reason] (
    [delay_reason_id] INT NOT NULL IDENTITY(1,1),
    [category] VARCHAR(50) NOT NULL,
    [reason_text] VARCHAR(255) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [mst_delay_reason_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_delay_reason_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_delay_reason_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_delay_reason_pkey] PRIMARY KEY CLUSTERED ([delay_reason_id])
);

-- CreateTable
CREATE TABLE [dbo].[mst_vendor_schedule] (
    [schedule_id] INT NOT NULL IDENTITY(1,1),
    [vendor_id] INT NOT NULL,
    [day_of_week] INT NOT NULL,
    [arrival_time] VARCHAR(10) NOT NULL,
    [departure_time] VARCHAR(10) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [mst_vendor_schedule_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_vendor_schedule_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_vendor_schedule_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_vendor_schedule_pkey] PRIMARY KEY CLUSTERED ([schedule_id])
);

-- CreateTable
CREATE TABLE [dbo].[ops_delivery_slot] (
    [slot_id] INT NOT NULL IDENTITY(1,1),
    [schedule_id] INT NOT NULL,
    [expected_date] DATE NOT NULL,
    [status] VARCHAR(50) NOT NULL CONSTRAINT [ops_delivery_slot_status_df] DEFAULT 'Open',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ops_delivery_slot_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [ops_delivery_slot_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ops_delivery_slot_pkey] PRIMARY KEY CLUSTERED ([slot_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_category_category_code] ON [dbo].[mst_vendor_category]([category_code]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_delay_reason_category_active] ON [dbo].[mst_delay_reason]([category], [is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_schedule_vendor_active] ON [dbo].[mst_vendor_schedule]([vendor_id], [is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_schedule_day_active] ON [dbo].[mst_vendor_schedule]([day_of_week], [is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_delivery_slot_date_status] ON [dbo].[ops_delivery_slot]([expected_date], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_delivery_slot_schedule_id] ON [dbo].[ops_delivery_slot]([schedule_id]);

-- CreateIndex
ALTER TABLE [dbo].[mst_user] ADD CONSTRAINT [mst_user_external_user_id_key] UNIQUE NONCLUSTERED ([external_user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_user_external_user_id] ON [dbo].[mst_user]([external_user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_checklist_item_type_vendor_category_active] ON [dbo].[mst_checklist_item]([item_type], [vendor_category_id], [is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_vendor_category_id] ON [dbo].[mst_vendor]([vendor_category_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_entry_slot_id] ON [dbo].[ops_checkin_entry]([slot_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_entry_arrival_status] ON [dbo].[ops_checkin_entry]([arrival_status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_timelog_departure_status] ON [dbo].[ops_timelog]([departure_status]);

-- AddForeignKey
ALTER TABLE [dbo].[mst_vendor] ADD CONSTRAINT [mst_vendor_vendor_category_id_fkey] FOREIGN KEY ([vendor_category_id]) REFERENCES [dbo].[mst_vendor_category]([vendor_category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mst_vendor_schedule] ADD CONSTRAINT [mst_vendor_schedule_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[mst_vendor]([vendor_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_delivery_slot] ADD CONSTRAINT [ops_delivery_slot_schedule_id_fkey] FOREIGN KEY ([schedule_id]) REFERENCES [dbo].[mst_vendor_schedule]([schedule_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mst_checklist_item] ADD CONSTRAINT [mst_checklist_item_vendor_category_id_fkey] FOREIGN KEY ([vendor_category_id]) REFERENCES [dbo].[mst_vendor_category]([vendor_category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_snapshot_vendor_category_id_fkey] FOREIGN KEY ([snapshot_vendor_category_id]) REFERENCES [dbo].[mst_vendor_category]([vendor_category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_slot_id_fkey] FOREIGN KEY ([slot_id]) REFERENCES [dbo].[ops_delivery_slot]([slot_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_delay_arrival_reason_id_fkey] FOREIGN KEY ([delay_arrival_reason_id]) REFERENCES [dbo].[mst_delay_reason]([delay_reason_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_timelog] ADD CONSTRAINT [ops_timelog_delay_departure_reason_id_fkey] FOREIGN KEY ([delay_departure_reason_id]) REFERENCES [dbo].[mst_delay_reason]([delay_reason_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
