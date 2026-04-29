export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Discharged';
  doctor: string;
  ward: string;
  admittedDate: string;
  lastVisit: string;
  bloodType: string;
  phone: string;
  email: string;
  avatar?: string;
  insurance: string;
  roomNumber: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface ActivityItem {
  id: string;
  type: 'admission' | 'discharge' | 'alert' | 'appointment' | 'lab';
  message: string;
  time: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface KPICard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'reminder' | 'info';
}

export type ViewMode = 'grid' | 'list';
