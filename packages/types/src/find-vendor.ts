export interface findVendorResponse {
  vendor_id: number;
  vendor_code: string;
  company_name: string;
  vendor_category_id: number;
  vendor_category: {
    category_name: string;
  };
}
