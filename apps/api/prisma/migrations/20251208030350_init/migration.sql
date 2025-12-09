BEGIN TRY

BEGIN TRAN;

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
CREATE TABLE [dbo].[mst_vendor] (
    [vendor_id] INT NOT NULL IDENTITY(1,1),
    [vendor_code] VARCHAR(100) NOT NULL,
    [company_name] VARCHAR(500) NOT NULL,
    [vendor_category_id] INT NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [mst_vendor_is_active_df] DEFAULT 1,
    [last_sync_time] DATETIME2,
    [sync_source] VARCHAR(100),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_vendor_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_vendor_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_vendor_pkey] PRIMARY KEY CLUSTERED ([vendor_id]),
    CONSTRAINT [mst_vendor_vendor_code_key] UNIQUE NONCLUSTERED ([vendor_code])
);

-- CreateTable
CREATE TABLE [dbo].[mst_checklist_category] (
    [checklist_category_id] INT NOT NULL IDENTITY(1,1),
    [category_name] VARCHAR(255) NOT NULL,
    [category_code] VARCHAR(50) NOT NULL,
    [display_order] INT NOT NULL,
    [icon_name] VARCHAR(100),
    [color_code] VARCHAR(50),
    [description] TEXT,
    [is_active] BIT NOT NULL CONSTRAINT [mst_checklist_category_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_checklist_category_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_checklist_category_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_checklist_category_pkey] PRIMARY KEY CLUSTERED ([checklist_category_id]),
    CONSTRAINT [mst_checklist_category_category_name_key] UNIQUE NONCLUSTERED ([category_name]),
    CONSTRAINT [mst_checklist_category_category_code_key] UNIQUE NONCLUSTERED ([category_code])
);

-- CreateTable
CREATE TABLE [dbo].[mst_checklist_item] (
    [checklist_item_id] INT NOT NULL IDENTITY(1,1),
    [checklist_category_id] INT NOT NULL,
    [item_code] VARCHAR(100) NOT NULL,
    [item_text] TEXT NOT NULL,
    [item_type] VARCHAR(50) NOT NULL,
    [vendor_category_id] INT,
    [display_order] INT NOT NULL,
    [is_required] BIT NOT NULL CONSTRAINT [mst_checklist_item_is_required_df] DEFAULT 1,
    [is_active] BIT NOT NULL CONSTRAINT [mst_checklist_item_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_checklist_item_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_checklist_item_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_checklist_item_pkey] PRIMARY KEY CLUSTERED ([checklist_item_id]),
    CONSTRAINT [mst_checklist_item_item_code_key] UNIQUE NONCLUSTERED ([item_code])
);

-- CreateTable
CREATE TABLE [dbo].[mst_user] (
    [user_id] INT NOT NULL IDENTITY(1,1),
    [external_user_id] VARCHAR(255) NOT NULL,
    [username] VARCHAR(255) NOT NULL,
    [full_name] VARCHAR(500) NOT NULL,
    [role] VARCHAR(50) NOT NULL,
    [last_login] DATETIME2,
    [is_active] BIT NOT NULL CONSTRAINT [mst_user_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [mst_user_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [mst_user_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mst_user_pkey] PRIMARY KEY CLUSTERED ([user_id]),
    CONSTRAINT [mst_user_external_user_id_key] UNIQUE NONCLUSTERED ([external_user_id])
);

-- CreateTable
CREATE TABLE [dbo].[ops_checkin_entry] (
    [entry_id] INT NOT NULL IDENTITY(1,1),
    [queue_number] VARCHAR(50) NOT NULL,
    [vendor_id] INT NOT NULL,
    [driver_name] VARCHAR(500) NOT NULL,
    [snapshot_vendor_category_id] INT NOT NULL,
    [snapshot_company_name] VARCHAR(500) NOT NULL,
    [snapshot_category_name] VARCHAR(255) NOT NULL,
    [submission_time] DATETIME2 NOT NULL CONSTRAINT [ops_checkin_entry_submission_time_df] DEFAULT CURRENT_TIMESTAMP,
    [current_status] VARCHAR(50) NOT NULL CONSTRAINT [ops_checkin_entry_current_status_df] DEFAULT 'MENUNGGU',
    [device_identifier] VARCHAR(255),
    [ip_address] VARCHAR(50),
    [has_non_compliant_items] BIT NOT NULL CONSTRAINT [ops_checkin_entry_has_non_compliant_items_df] DEFAULT 0,
    [non_compliant_count] INT NOT NULL CONSTRAINT [ops_checkin_entry_non_compliant_count_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ops_checkin_entry_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [ops_checkin_entry_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ops_checkin_entry_pkey] PRIMARY KEY CLUSTERED ([entry_id]),
    CONSTRAINT [ops_checkin_entry_queue_number_key] UNIQUE NONCLUSTERED ([queue_number])
);

-- CreateTable
CREATE TABLE [dbo].[ops_checkin_response] (
    [response_id] INT NOT NULL IDENTITY(1,1),
    [entry_id] INT NOT NULL,
    [checklist_item_id] INT NOT NULL,
    [checklist_category_id] INT NOT NULL,
    [item_text_snapshot] TEXT NOT NULL,
    [item_type] VARCHAR(50) NOT NULL,
    [response_value] BIT NOT NULL,
    [is_compliant] BIT NOT NULL,
    [display_order] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ops_checkin_response_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ops_checkin_response_pkey] PRIMARY KEY CLUSTERED ([response_id])
);

-- CreateTable
CREATE TABLE [dbo].[ops_verification] (
    [verification_id] INT NOT NULL IDENTITY(1,1),
    [entry_id] INT NOT NULL,
    [verified_by_user_id] INT NOT NULL,
    [verification_status] VARCHAR(50) NOT NULL,
    [rejection_reason] TEXT,
    [verification_time] DATETIME2 NOT NULL CONSTRAINT [ops_verification_verification_time_df] DEFAULT CURRENT_TIMESTAMP,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ops_verification_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ops_verification_pkey] PRIMARY KEY CLUSTERED ([verification_id]),
    CONSTRAINT [ops_verification_entry_id_key] UNIQUE NONCLUSTERED ([entry_id])
);

-- CreateTable
CREATE TABLE [dbo].[ops_timelog] (
    [timelog_id] INT NOT NULL IDENTITY(1,1),
    [entry_id] INT NOT NULL,
    [checkin_time] DATETIME2,
    [checkout_time] DATETIME2,
    [checkout_by_user_id] INT,
    [duration_minutes] INT,
    [is_checked_out] BIT NOT NULL CONSTRAINT [ops_timelog_is_checked_out_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ops_timelog_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [ops_timelog_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ops_timelog_pkey] PRIMARY KEY CLUSTERED ([timelog_id]),
    CONSTRAINT [ops_timelog_entry_id_key] UNIQUE NONCLUSTERED ([entry_id])
);

-- CreateTable
CREATE TABLE [dbo].[ops_queue_status] (
    [queue_status_id] INT NOT NULL IDENTITY(1,1),
    [entry_id] INT NOT NULL,
    [queue_number] VARCHAR(50) NOT NULL,
    [current_status] VARCHAR(50) NOT NULL,
    [status_display_text] VARCHAR(255) NOT NULL,
    [priority_order] INT,
    [estimated_wait_minutes] INT,
    [last_updated] DATETIME2 NOT NULL CONSTRAINT [ops_queue_status_last_updated_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ops_queue_status_pkey] PRIMARY KEY CLUSTERED ([queue_status_id]),
    CONSTRAINT [ops_queue_status_entry_id_key] UNIQUE NONCLUSTERED ([entry_id])
);

-- CreateTable
CREATE TABLE [dbo].[log_audit] (
    [audit_id] INT NOT NULL IDENTITY(1,1),
    [entry_id] INT,
    [user_id] INT,
    [action_type] VARCHAR(100) NOT NULL,
    [action_description] TEXT NOT NULL,
    [old_value] TEXT,
    [new_value] TEXT,
    [ip_address] VARCHAR(50),
    [user_agent] VARCHAR(500),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [log_audit_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [log_audit_pkey] PRIMARY KEY CLUSTERED ([audit_id])
);

-- CreateTable
CREATE TABLE [dbo].[log_report_export] (
    [export_id] INT NOT NULL IDENTITY(1,1),
    [exported_by_user_id] INT NOT NULL,
    [report_type] VARCHAR(100) NOT NULL,
    [date_from] DATE NOT NULL,
    [date_to] DATE NOT NULL,
    [filter_criteria] TEXT,
    [total_records] INT NOT NULL,
    [file_name] VARCHAR(500) NOT NULL,
    [file_path] VARCHAR(1000),
    [export_time] DATETIME2 NOT NULL CONSTRAINT [log_report_export_export_time_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [log_report_export_pkey] PRIMARY KEY CLUSTERED ([export_id])
);

-- CreateTable
CREATE TABLE [dbo].[cfg_system] (
    [config_id] INT NOT NULL IDENTITY(1,1),
    [config_key] VARCHAR(255) NOT NULL,
    [config_value] TEXT NOT NULL,
    [config_type] VARCHAR(50) NOT NULL,
    [description] TEXT,
    [is_editable] BIT NOT NULL CONSTRAINT [cfg_system_is_editable_df] DEFAULT 1,
    [updated_by_user_id] INT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [cfg_system_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [cfg_system_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [cfg_system_pkey] PRIMARY KEY CLUSTERED ([config_id]),
    CONSTRAINT [cfg_system_config_key_key] UNIQUE NONCLUSTERED ([config_key])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_category_category_code] ON [dbo].[mst_vendor_category]([category_code]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_category_active] ON [dbo].[mst_vendor]([vendor_category_id], [is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_vendor_vendor_code] ON [dbo].[mst_vendor]([vendor_code]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_checklist_category_active_order] ON [dbo].[mst_checklist_category]([is_active], [display_order]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_checklist_item_category_active_order] ON [dbo].[mst_checklist_item]([checklist_category_id], [is_active], [display_order]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_checklist_item_item_code] ON [dbo].[mst_checklist_item]([item_code]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_checklist_item_type_vendor_active] ON [dbo].[mst_checklist_item]([item_type], [vendor_category_id], [is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_mst_user_external_user_id] ON [dbo].[mst_user]([external_user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_entry_queue_number] ON [dbo].[ops_checkin_entry]([queue_number]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_entry_status_time] ON [dbo].[ops_checkin_entry]([current_status], [submission_time]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_entry_time_vendor] ON [dbo].[ops_checkin_entry]([submission_time], [vendor_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_entry_non_compliant] ON [dbo].[ops_checkin_entry]([has_non_compliant_items]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_response_entry_id] ON [dbo].[ops_checkin_response]([entry_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_checkin_response_entry_compliant] ON [dbo].[ops_checkin_response]([entry_id], [is_compliant]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_verification_entry_id] ON [dbo].[ops_verification]([entry_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_verification_time_status] ON [dbo].[ops_verification]([verification_time], [verification_status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_timelog_entry_id] ON [dbo].[ops_timelog]([entry_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_timelog_checkout_time] ON [dbo].[ops_timelog]([is_checked_out], [checkin_time]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_queue_status_entry_id] ON [dbo].[ops_queue_status]([entry_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_ops_queue_status_display] ON [dbo].[ops_queue_status]([current_status], [priority_order]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_log_audit_time_action] ON [dbo].[log_audit]([created_at], [action_type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_log_audit_entry_id] ON [dbo].[log_audit]([entry_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_log_report_export_time_type] ON [dbo].[log_report_export]([export_time], [report_type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_cfg_system_config_key] ON [dbo].[cfg_system]([config_key]);

-- AddForeignKey
ALTER TABLE [dbo].[mst_vendor] ADD CONSTRAINT [mst_vendor_vendor_category_id_fkey] FOREIGN KEY ([vendor_category_id]) REFERENCES [dbo].[mst_vendor_category]([vendor_category_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mst_checklist_item] ADD CONSTRAINT [mst_checklist_item_checklist_category_id_fkey] FOREIGN KEY ([checklist_category_id]) REFERENCES [dbo].[mst_checklist_category]([checklist_category_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mst_checklist_item] ADD CONSTRAINT [mst_checklist_item_vendor_category_id_fkey] FOREIGN KEY ([vendor_category_id]) REFERENCES [dbo].[mst_vendor_category]([vendor_category_id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[mst_vendor]([vendor_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_entry] ADD CONSTRAINT [ops_checkin_entry_snapshot_vendor_category_id_fkey] FOREIGN KEY ([snapshot_vendor_category_id]) REFERENCES [dbo].[mst_vendor_category]([vendor_category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_response] ADD CONSTRAINT [ops_checkin_response_entry_id_fkey] FOREIGN KEY ([entry_id]) REFERENCES [dbo].[ops_checkin_entry]([entry_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_response] ADD CONSTRAINT [ops_checkin_response_checklist_item_id_fkey] FOREIGN KEY ([checklist_item_id]) REFERENCES [dbo].[mst_checklist_item]([checklist_item_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_checkin_response] ADD CONSTRAINT [ops_checkin_response_checklist_category_id_fkey] FOREIGN KEY ([checklist_category_id]) REFERENCES [dbo].[mst_checklist_category]([checklist_category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ops_verification] ADD CONSTRAINT [ops_verification_entry_id_fkey] FOREIGN KEY ([entry_id]) REFERENCES [dbo].[ops_checkin_entry]([entry_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_verification] ADD CONSTRAINT [ops_verification_verified_by_user_id_fkey] FOREIGN KEY ([verified_by_user_id]) REFERENCES [dbo].[mst_user]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_timelog] ADD CONSTRAINT [ops_timelog_entry_id_fkey] FOREIGN KEY ([entry_id]) REFERENCES [dbo].[ops_checkin_entry]([entry_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_timelog] ADD CONSTRAINT [ops_timelog_checkout_by_user_id_fkey] FOREIGN KEY ([checkout_by_user_id]) REFERENCES [dbo].[mst_user]([user_id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ops_queue_status] ADD CONSTRAINT [ops_queue_status_entry_id_fkey] FOREIGN KEY ([entry_id]) REFERENCES [dbo].[ops_checkin_entry]([entry_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[log_audit] ADD CONSTRAINT [log_audit_entry_id_fkey] FOREIGN KEY ([entry_id]) REFERENCES [dbo].[ops_checkin_entry]([entry_id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[log_audit] ADD CONSTRAINT [log_audit_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[mst_user]([user_id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[log_report_export] ADD CONSTRAINT [log_report_export_exported_by_user_id_fkey] FOREIGN KEY ([exported_by_user_id]) REFERENCES [dbo].[mst_user]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cfg_system] ADD CONSTRAINT [cfg_system_updated_by_user_id_fkey] FOREIGN KEY ([updated_by_user_id]) REFERENCES [dbo].[mst_user]([user_id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
