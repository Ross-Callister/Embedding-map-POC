export const testData = {
  ID: "unique_id",
  "First Name": "first_name",
  "Last Name": "last_name",
  Email: "email_address",
  "Phone Number": "contact_number",
  Address: "street_address",
  City: "town",
  State: "region",
  "Zip Code": "postal_code",
  Country: "nation",
  "Date of Birth": "dob",
  Gender: "sex",
  "Marital Status": "relationship_status",
  Occupation: "job_role",
  "Company Name": "business_name",
  Department: "division",
  "Job Title": "position",
  "Employee ID": "staff_id",
  Salary: "monthly_wage",
  "Hire Date": "start_date",
  "Termination Date": "end_date",
  "Manager Name": "supervisor",
  "Performance Rating": "review_score",
  Bonus: "extra_compensation",
  Commission: "sales_bonus",
  "Sales Target": "goal_revenue",
  "Sales Achieved": "actual_revenue",
  "Customer Name": "cust_name",
  "Customer ID": "client_id",
  "Order ID": "purchase_id",
  "Order Date": "transaction_date",
  "Product Name": "item_name",
  "Product ID": "sku",
  Category: "product_type",
  Quantity: "amount",
  "Unit Price": "price_per_item",
  "Total Price": "total_cost",
  Discount: "price_reduction",
  Tax: "tax_paid",
  "Shipping Cost": "delivery_cost",
  "Payment Method": "pay_type",
  "Transaction ID": "payment_ref",
  "Invoice Number": "billing_code",
  "Due Date": "payment_deadline",
  "Paid Amount": "settled_amount",
  "Balance Due": "remaining_balance",
  Status: "current_state",
  Notes: "comments",
  "Created Date": "entry_date",
  "Last Modified": "updated_timestamp",
};

export function getMapToStrings(): string[] {
  return Object.keys(testData).map(
    (key) => testData[key as keyof typeof testData]
  );
}

export function getMapFromStrings(): string[] {
  return Object.keys(testData);
}

export function getTrueMapping(mapFrom: string): string {
  return testData[mapFrom as keyof typeof testData];
}
