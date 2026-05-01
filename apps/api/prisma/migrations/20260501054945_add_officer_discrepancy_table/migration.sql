BEGIN TRY

BEGIN TRAN;

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
ALTER TABLE [dbo].[mst_checklist_item] ADD CONSTRAINT [mst_checklist_item_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_checklist_item_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_delay_reason] DROP CONSTRAINT [mst_delay_reason_created_at_df],
[mst_delay_reason_updated_at_df];
ALTER TABLE [dbo].[mst_delay_reason] ADD CONSTRAINT [mst_delay_reason_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_delay_reason_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_user] DROP CONSTRAINT [mst_user_created_at_df],
[mst_user_updated_at_df];
ALTER TABLE [dbo].[mst_user] ADD CONSTRAINT [mst_user_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_user_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_vendor] DROP CONSTRAINT [mst_vendor_created_at_df],
[mst_vendor_updated_at_df];
ALTER TABLE [dbo].[mst_vendor] ADD CONSTRAINT [mst_vendor_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_vendor_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_vendor_category] DROP CONSTRAINT [mst_vendor_category_created_at_df],
[mst_vendor_category_updated_at_df];
ALTER TABLE [dbo].[mst_vendor_category] ADD CONSTRAINT [mst_vendor_category_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_vendor_category_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[mst_vendor_schedule] DROP CONSTRAINT [mst_vendor_schedule_created_at_df],
[mst_vendor_schedule_updated_at_df];
ALTER TABLE [dbo].[mst_vendor_schedule] ADD CONSTRAINT [mst_vendor_schedule_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [mst_vendor_schedule_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[ops_checkin_entry] DROP CONSTRAINT [ops_checkin_entry_created_at_df],
[ops_checkin_entry_submission_time_df],
[ops_checkin_entry_updated_at_df];
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [ops_checkin_entry_submission_time_df] DEFAULT CURRENT_TIMESTAMP FOR [submission_time], CONSTRAINT [ops_checkin_entry_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[ops_checkin_response] DROP CONSTRAINT [ops_checkin_response_created_at_df];
ALTER TABLE [dbo].[ops_checkin_response] ADD CONSTRAINT [ops_checkin_response_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at];

-- AlterTable
ALTER TABLE [dbo].[ops_delivery_slot] DROP CONSTRAINT [ops_delivery_slot_created_at_df],
[ops_delivery_slot_updated_at_df];
ALTER TABLE [dbo].[ops_delivery_slot] ADD CONSTRAINT [ops_delivery_slot_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at], CONSTRAINT [ops_delivery_slot_updated_at_df] DEFAULT CURRENT_TIMESTAMP FOR [updated_at];

-- AlterTable
ALTER TABLE [dbo].[ops_ppe_scan] DROP CONSTRAINT [ops_ppe_scan_created_at_df];
ALTER TABLE [dbo].[ops_ppe_scan] ADD CONSTRAINT [ops_ppe_scan_created_at_df] DEFAULT CURRENT_TIMESTAMP FOR [created_at];

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

-- CreateTable
CREATE TABLE [dbo].[ops_officer_discrepancy] (
    [discrepancy_id] INT NOT NULL IDENTITY(1,1),
    [entry_id] INT NOT NULL,
    [response_id] INT,
    [item_text_snapshot] TEXT NOT NULL,
    [officer_note] TEXT,
    [evidence_image_path] VARCHAR(1000),
    [marked_by_user_id] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ops_officer_discrepancy_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ops_officer_discrepancy_pkey] PRIMARY KEY CLUSTERED ([discrepancy_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_officer_discrepancy_entry_id] ON [dbo].[ops_officer_discrepancy]([entry_id]);

-- AddForeignKey
ALTER TABLE [dbo].[ops_officer_discrepancy] ADD CONSTRAINT [ops_officer_discrepancy_entry_id_fkey] FOREIGN KEY ([entry_id]) REFERENCES [dbo].[ops_checkin_entry]([entry_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_officer_discrepancy] ADD CONSTRAINT [ops_officer_discrepancy_marked_by_user_id_fkey] FOREIGN KEY ([marked_by_user_id]) REFERENCES [dbo].[mst_user]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
