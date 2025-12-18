import { checklistData } from '@/lib/data/checklist';
import { CheckinPayload, OpsCheckinEntry, OpsCheckinResponse, OpsQueueStatus } from '@repo/types';

type Step1Data = {
  fullName: string;
  company: {
    value: string;
    label: string;
    category_name: string;
    category_id: number;
    vendorCode: string;
  };
};

type Step2Data = {
  checklistItems: Record<string, string>;
};

export function transformCheckinData(step1Data: Step1Data | null, step2Data: Step2Data | null): CheckinPayload | null {
  if (!step1Data || !step2Data) {
    console.error('Data incomplete');
    return null;
  }

  // Generate Queue Number (YYYYMMDD-XXX format placeholder)
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(Math.random() * 900) + 100;
  const queueNumber = `${dateStr}-${randomSuffix}`;
  const submissionTime = date.toISOString();

  // Transform Responses
  const responses: OpsCheckinResponse[] = [];
  let nonCompliantCount = 0;

  Object.entries(step2Data.checklistItems).forEach(([itemId, value]) => {
    // Find item in checklist data
    let foundItem: any = null;
    let foundCategory: any = null;

    for (const category of checklistData) {
      const item = category.items.find((i) => i.checklist_item_id.toString() === itemId);
      if (item) {
        foundItem = item;
        foundCategory = category;
        break;
      }
    }

    if (foundItem && foundCategory) {
      const responseValue = value === 'true';
      // Assuming YES (true) is always compliant for now based on current questions
      const isCompliant = responseValue; 
      
      if (!isCompliant) {
        nonCompliantCount++;
      }

      responses.push({
        checklist_item_id: foundItem.checklist_item_id,
        checklist_category_id: foundCategory.display_order, // Using display_order as ID based on assumption
        item_text_snapshot: foundItem.item_text,
        item_type: foundItem.item_type,
        response_value: responseValue,
        is_compliant: isCompliant,
        display_order: foundItem.checklist_item_id, // Or some other order logic
      });
    }
  });

  // Construct Entry
  const entry: OpsCheckinEntry = {
    queue_number: queueNumber,
    vendor_id: parseInt(step1Data.company.value, 10), // Assuming value is the ID string
    driver_name: step1Data.fullName,
    snapshot_vendor_category_id: step1Data.company.category_id,
    snapshot_company_name: step1Data.company.label,
    snapshot_category_name: step1Data.company.category_name,
    submission_time: submissionTime,
    current_status: 'MENUNGGU',
    has_non_compliant_items: nonCompliantCount > 0,
    non_compliant_count: nonCompliantCount,
  };

  // Construct Queue Status
  const queueStatus: OpsQueueStatus = {
    queue_number: queueNumber,
    current_status: 'MENUNGGU',
    status_display_text: 'Menunggu Verifikasi',
    priority_order: 0,
    estimated_wait_minutes: 0, 
    last_updated: submissionTime
  };

  return {
    entry,
    responses,
    queue_status: queueStatus,
  };
}
