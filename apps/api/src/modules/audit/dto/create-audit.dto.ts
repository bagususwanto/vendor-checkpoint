export class CreateAuditDto {
  entry_id?: number;
  user_id?: number;
  action_type: string;
  action_description: string;
  old_value?: string;
  new_value?: string;
  ip_address?: string;
  user_agent?: string;
}
