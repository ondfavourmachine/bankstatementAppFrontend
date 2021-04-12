export interface DashboardData {
  completed?: boolean;
  user?: User;
}

export interface User {
  active_package?: number;
  email?: string;
  email_verified?: number;
  current_package_validity?: any;
  fullname?: string;
  id?: number;
  phone?: string;
  subscription_credit?: number;
  transactions_left?: number;
  free_plan_used?: number;
}


export interface Bank {
  id: string;
  bank_code: string;
  name: string;
}