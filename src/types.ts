export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  membershipStatus: 'Active' | 'Inactive' | 'Visitor' | 'New Member';
  joinDate: string;
  ministry: string[];
  campus: string;
  smallGroup?: string;
  profileImage?: string;
  familyId?: string;
  relationshipType?: 'Head' | 'Spouse' | 'Child' | 'Other';
  occupation?: string;
  employer?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  anniversary?: string;
  skills?: string[];
  interests?: string[];
  previousChurch?: string;
  salvationDate?: string;
  waterBaptismDate?: string;
  holyGhostBaptismDate?: string;
  membershipClassDate?: string;
  servingAreas?: string[];
  notes?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
  }[];
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    communicationLanguage: string;
    preferredContactMethod: 'email' | 'phone' | 'sms';
    mailingAddress?: string;
    receiveNewsletter: boolean;
    allowPhotography: boolean;
  };
  role: 'admin' | 'pastor' | 'leader' | 'member' | 'volunteer';
  lastAttended?: string;
  baptismDate?: string;
  membershipClass?: boolean;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  service: string;
  campus: string;
  present: boolean;
  checkedInBy?: string;
  checkInTime?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
  description: string;
  memberName?: string;
  memberId?: string;
  paymentMethod: string;
  accountId: string;
  campus: string;
  fund?: string;
  recurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
  taxDeductible: boolean;
  receiptSent: boolean;
  referenceNumber?: string;
  approvedBy?: string;
  attachments?: string[];
}

export interface Giving {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  type: 'tithe' | 'offering' | 'special' | 'missions' | 'building';
  fund: string;
  paymentMethod: string;
  campus: string;
  recurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
  taxDeductible: boolean;
  receiptSent: boolean;
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  campus: string;
  type: 'Service' | 'Meeting' | 'Fellowship' | 'Outreach' | 'Conference' | 'Training' | 'Other';
  organizer: string;
  expectedAttendance: number;
  actualAttendance?: number;
  registrationRequired: boolean;
  maxCapacity?: number;
  cost?: number;
  volunteers: VolunteerAssignment[];
  resources: string[];
  recurring: boolean;
  recurringPattern?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface VolunteerAssignment {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  role: string;
  department: string;
  campus: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'no-show';
  notes?: string;
}

export interface SmallGroup {
  id: string;
  name: string;
  description: string;
  leader: string;
  leaderId: string;
  members: string[];
  campus: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  capacity: number;
  category: string;
  ageGroup?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  series?: string;
  scripture: string;
  description: string;
  campus: string;
  audioUrl?: string;
  videoUrl?: string;
  notesUrl?: string;
  duration?: number;
  views: number;
  downloads: number;
  tags: string[];
}

export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'push' | 'announcement';
  title: string;
  content: string;
  recipients: string[];
  recipientGroups: string[];
  sender: string;
  sentDate: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  campus: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  readReceipts: { [memberId: string]: string };
}

export interface ChildCheckIn {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  checkInTime: string;
  checkOutTime?: string;
  service: string;
  room: string;
  campus: string;
  allergies?: string;
  medicalNotes?: string;
  emergencyContact: string;
  securityCode: string;
  checkedInBy: string;
  checkedOutBy?: string;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentIds: string[];
  allergies?: string;
  medicalNotes?: string;
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  campus: string;
  classroom?: string;
  photoPermission: boolean;
}

export interface Campus {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  pastor: string;
  capacity: number;
  services: {
    name: string;
    time: string;
    day: string;
  }[];
  facilities: string[];
  isActive: boolean;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  leaderId: string;
  members: string[];
  campus: string;
  department: string;
  meetingSchedule: string;
  budget?: number;
  isActive: boolean;
  requirements?: string[];
}

export interface Automation {
  id: string;
  name: string;
  type: 'follow-up' | 'birthday' | 'attendance' | 'giving' | 'devotional' | 'anniversary';
  trigger: string;
  action: string;
  isActive: boolean;
  campus: string;
  conditions: any;
  lastRun?: string;
  nextRun?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'membership' | 'financial' | 'attendance' | 'giving' | 'volunteer' | 'custom';
  parameters: any;
  schedule?: string;
  recipients: string[];
  lastGenerated?: string;
  campus: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'pastor' | 'leader' | 'member' | 'volunteer';
  permissions: string[];
  campus: string[];
  lastLogin?: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Family {
  id: string;
  familyName: string;
  headOfFamily: string;
  headOfFamilyId: string;
  members: string[];
  address: string;
  homePhone?: string;
  campus: string;
  joinDate: string;
  anniversary?: string;
  notes?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'Bank' | 'Mobile Money' | 'Cash' | 'Investment' | 'Petty Cash';
  accountNumber?: string;
  bankName?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  description?: string;
  campus: string;
  openingBalance: number;
  openingDate: string;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  category: 'Financial' | 'Legal' | 'Ministry' | 'Administrative' | 'Reports' | 'Other';
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: string;
  campus: string;
  isPublic: boolean;
  tags: string[];
  version: number;
  parentDocumentId?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'pastor' | 'leader' | 'member' | 'volunteer';
  permissions: string[];
  campus: string[];
  department?: string;
  position?: string;
  hireDate?: string;
  isActive: boolean;
  lastLogin?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}