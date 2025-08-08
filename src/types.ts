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
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  education?: string;
  spiritualGifts?: string[];
  membershipHistory?: {
    date: string;
    status: string;
    notes?: string;
  }[];
  discipleshipLevel?: 'New Believer' | 'Growing' | 'Mature' | 'Leader' | 'Mentor';
  connectionStatus?: 'Connected' | 'Connecting' | 'Disconnected' | 'At Risk';
  followUpNeeded?: boolean;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
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
  checkOutTime?: string;
  lateArrival?: boolean;
  earlyDeparture?: boolean;
  guestCount?: number;
  notes?: string;
  weather?: string;
  specialEvent?: boolean;
  createdAt: string;
  updatedAt: string;
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
  budgetCategory?: string;
  projectId?: string;
  vendorId?: string;
  invoiceNumber?: string;
  checkNumber?: string;
  reconciled: boolean;
  reconciledDate?: string;
  reconciledBy?: string;
  exchangeRate?: number;
  originalCurrency?: string;
  originalAmount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Giving {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  type: 'tithe' | 'offering' | 'special' | 'missions' | 'building' | 'benevolence' | 'thanksgiving';
  fund: string;
  paymentMethod: string;
  campus: string;
  recurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
  taxDeductible: boolean;
  receiptSent: boolean;
  notes?: string;
  pledgeId?: string;
  campaignId?: string;
  anonymous: boolean;
  onlineGiving: boolean;
  processingFee?: number;
  netAmount: number;
  batchId?: string;
  receiptNumber?: string;
  thankYouSent: boolean;
  createdAt: string;
  updatedAt: string;
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
  type: 'Service' | 'Meeting' | 'Fellowship' | 'Outreach' | 'Conference' | 'Training' | 'Wedding' | 'Funeral' | 'Other';
  organizer: string;
  organizerId: string;
  expectedAttendance: number;
  actualAttendance?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  maxCapacity?: number;
  cost?: number;
  volunteers: VolunteerAssignment[];
  resources: EventResource[];
  recurring: boolean;
  recurringPattern?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled' | 'postponed';
  publicEvent: boolean;
  requiresApproval: boolean;
  approvedBy?: string;
  approvalDate?: string;
  budget?: number;
  actualCost?: number;
  feedback?: EventFeedback[];
  photos?: string[];
  livestreamUrl?: string;
  recordingUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface EventResource {
  id: string;
  name: string;
  type: 'Equipment' | 'Room' | 'Vehicle' | 'Material' | 'Other';
  quantity: number;
  reserved: boolean;
  cost?: number;
}

export interface EventFeedback {
  id: string;
  memberId: string;
  memberName: string;
  rating: number;
  comments: string;
  date: string;
}

export interface VolunteerAssignment {
  id: string;
  eventId: string;
  eventTitle: string;
  memberId: string;
  memberName: string;
  role: string;
  department: string;
  campus: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'no-show' | 'cancelled';
  notes?: string;
  skills?: string[];
  trainingRequired?: boolean;
  trainingCompleted?: boolean;
  reminderSent?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  hoursServed?: number;
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SmallGroup {
  id: string;
  name: string;
  description: string;
  leader: string;
  leaderId: string;
  assistantLeaders?: string[];
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
  curriculum?: string;
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly';
  childcareProvided: boolean;
  openGroup: boolean;
  cost?: number;
  materials?: string[];
  attendance?: GroupAttendance[];
  prayer_requests?: PrayerRequest[];
  announcements?: GroupAnnouncement[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupAttendance {
  id: string;
  groupId: string;
  memberId: string;
  date: string;
  present: boolean;
  notes?: string;
}

export interface PrayerRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  title: string;
  description: string;
  category: 'Personal' | 'Family' | 'Health' | 'Financial' | 'Spiritual' | 'Church' | 'Community';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPrivate: boolean;
  status: 'active' | 'answered' | 'ongoing' | 'closed';
  groupId?: string;
  assignedTo?: string[];
  followUpDate?: string;
  answeredDate?: string;
  testimony?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupAnnouncement {
  id: string;
  groupId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  priority: 'low' | 'medium' | 'high';
  expiryDate?: string;
  createdAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  speakerId?: string;
  date: string;
  series?: string;
  seriesId?: string;
  scripture: string;
  description: string;
  campus: string;
  audioUrl?: string;
  videoUrl?: string;
  notesUrl?: string;
  slidesUrl?: string;
  duration?: number;
  views: number;
  downloads: number;
  likes: number;
  shares: number;
  tags: string[];
  thumbnail?: string;
  transcript?: string;
  outline?: string[];
  keyPoints?: string[];
  applicationPoints?: string[];
  discussionQuestions?: string[];
  relatedSermons?: string[];
  feedback?: SermonFeedback[];
  isPublic: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SermonSeries {
  id: string;
  title: string;
  description: string;
  speaker: string;
  startDate: string;
  endDate?: string;
  sermons: string[];
  artwork?: string;
  isActive: boolean;
  campus: string;
}

export interface SermonFeedback {
  id: string;
  sermonId: string;
  memberId: string;
  memberName: string;
  rating: number;
  comments: string;
  helpful: boolean;
  createdAt: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'push' | 'announcement' | 'newsletter' | 'alert';
  title: string;
  content: string;
  recipients: string[];
  recipientGroups: string[];
  sender: string;
  senderId: string;
  sentDate: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed' | 'cancelled';
  campus: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  readReceipts: { [memberId: string]: string };
  clickTracking?: { [memberId: string]: string };
  bounced?: string[];
  unsubscribed?: string[];
  template?: string;
  attachments?: string[];
  campaign?: string;
  automationId?: string;
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  updatedAt: string;
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
  authorizedPickup?: string[];
  specialInstructions?: string;
  incident?: boolean;
  incidentReport?: string;
  photosTaken?: boolean;
  snackProvided?: boolean;
  diaperChange?: boolean;
  napTime?: boolean;
  behaviorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentIds: string[];
  guardianIds?: string[];
  allergies?: string;
  medicalNotes?: string;
  medications?: string[];
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
    canPickup: boolean;
  }[];
  campus: string;
  classroom?: string;
  grade?: string;
  school?: string;
  photoPermission: boolean;
  internetPermission: boolean;
  fieldTripPermission: boolean;
  specialNeeds?: string;
  behaviorPlan?: string;
  preferredName?: string;
  siblings?: string[];
  checkInHistory?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  pastor: string;
  pastorId: string;
  capacity: number;
  services: {
    name: string;
    time: string;
    day: string;
    type: 'Regular' | 'Special' | 'Holiday';
    duration: number;
    description?: string;
  }[];
  facilities: CampusFacility[];
  isActive: boolean;
  timezone: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  staff?: CampusStaff[];
  budget?: number;
  yearEstablished?: number;
  denomination?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampusFacility {
  id: string;
  name: string;
  type: 'Sanctuary' | 'Classroom' | 'Office' | 'Kitchen' | 'Parking' | 'Storage' | 'Other';
  capacity?: number;
  equipment?: string[];
  availability: boolean;
  bookingRequired: boolean;
  cost?: number;
}

export interface CampusStaff {
  id: string;
  memberId: string;
  position: string;
  department: string;
  startDate: string;
  endDate?: string;
  salary?: number;
  benefits?: string[];
  isActive: boolean;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  leaderId: string;
  assistantLeaders?: string[];
  members: string[];
  campus: string;
  department: string;
  meetingSchedule: string;
  budget?: number;
  actualSpending?: number;
  isActive: boolean;
  requirements?: string[];
  trainingRequired?: boolean;
  backgroundCheckRequired?: boolean;
  ageRequirement?: {
    min?: number;
    max?: number;
  };
  timeCommitment?: string;
  seasonalMinistry?: boolean;
  season?: {
    start: string;
    end: string;
  };
  goals?: string[];
  metrics?: MinistryMetric[];
  resources?: string[];
  partnerships?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MinistryMetric {
  id: string;
  name: string;
  target: number;
  actual: number;
  period: string;
  unit: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'follow-up' | 'birthday' | 'attendance' | 'giving' | 'devotional' | 'anniversary' | 'new-member' | 'visitor';
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions: AutomationCondition[];
  isActive: boolean;
  campus: string;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AutomationTrigger {
  type: 'date' | 'event' | 'condition' | 'manual';
  schedule?: string;
  delay?: number;
  delayUnit?: 'minutes' | 'hours' | 'days' | 'weeks';
}

export interface AutomationAction {
  type: 'email' | 'sms' | 'task' | 'notification' | 'update_field';
  template?: string;
  content?: string;
  assignTo?: string;
  field?: string;
  value?: any;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'membership' | 'financial' | 'attendance' | 'giving' | 'volunteer' | 'ministry' | 'custom';
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  recipients: string[];
  lastGenerated?: string;
  campus: string;
  isPublic: boolean;
  format: 'pdf' | 'excel' | 'csv' | 'html';
  template?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ReportParameter {
  name: string;
  type: 'date' | 'select' | 'multiselect' | 'number' | 'text';
  value: any;
  options?: string[];
  required: boolean;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'pastor' | 'leader' | 'member' | 'volunteer';
  permissions: string[];
  campus: string[];
  lastLogin?: string;
  isActive: boolean;
  loginAttempts?: number;
  lockedUntil?: string;
  passwordResetToken?: string;
  passwordResetExpiry?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  sessionTimeout?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  expiryDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface Family {
  id: string;
  familyName: string;
  headOfFamily: string;
  headOfFamilyId: string;
  spouse?: string;
  spouseId?: string;
  members: string[];
  children?: string[];
  address: string;
  homePhone?: string;
  campus: string;
  joinDate: string;
  anniversary?: string;
  notes?: string;
  familyPhoto?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  income?: 'Under $25k' | '$25k-$50k' | '$50k-$75k' | '$75k-$100k' | 'Over $100k' | 'Prefer not to say';
  housingStatus?: 'Own' | 'Rent' | 'Other';
  familySize: number;
  pets?: string[];
  specialNeeds?: string;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'Bank' | 'Mobile Money' | 'Cash' | 'Investment' | 'Petty Cash' | 'Credit Card' | 'Savings';
  accountNumber?: string;
  bankName?: string;
  branchCode?: string;
  swiftCode?: string;
  routingNumber?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  description?: string;
  campus: string;
  openingBalance: number;
  openingDate: string;
  interestRate?: number;
  minimumBalance?: number;
  monthlyFee?: number;
  accountManager?: string;
  lastReconciled?: string;
  reconciledBy?: string;
  reconciliationNotes?: string;
  restrictions?: string[];
  signatories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  category: 'Financial' | 'Legal' | 'Ministry' | 'Administrative' | 'Reports' | 'Policies' | 'Forms' | 'Other';
  subcategory?: string;
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
  expiryDate?: string;
  reviewDate?: string;
  reviewedBy?: string;
  approvalRequired?: boolean;
  approvedBy?: string;
  approvalDate?: string;
  downloadCount: number;
  viewCount: number;
  lastAccessed?: string;
  accessLog?: DocumentAccess[];
  checksum?: string;
  encrypted?: boolean;
  retentionPeriod?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAccess {
  userId: string;
  userName: string;
  accessDate: string;
  action: 'view' | 'download' | 'edit' | 'delete';
  ipAddress?: string;
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
  salary?: number;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Volunteer';
  isActive: boolean;
  lastLogin?: string;
  loginCount?: number;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      desktop: boolean;
    };
    dashboard: {
      layout: string;
      widgets: string[];
    };
  };
  twoFactorEnabled?: boolean;
  securityQuestions?: SecurityQuestion[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  bio?: string;
  skills?: string[];
  certifications?: string[];
  education?: string;
  experience?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export interface Pledge {
  id: string;
  memberId: string;
  memberName: string;
  campaignId: string;
  campaignName: string;
  amount: number;
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  totalPaid: number;
  remainingBalance: number;
  status: 'active' | 'completed' | 'cancelled' | 'defaulted';
  paymentMethod: string;
  autoPayEnabled: boolean;
  reminderFrequency?: 'weekly' | 'monthly';
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'Building' | 'Missions' | 'Special Project' | 'Emergency' | 'General';
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  campus: string;
  isActive: boolean;
  publicCampaign: boolean;
  allowPledges: boolean;
  allowRecurring: boolean;
  minimumGift?: number;
  maximumGift?: number;
  updates?: CampaignUpdate[];
  milestones?: CampaignMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  photos?: string[];
}

export interface CampaignMilestone {
  id: string;
  name: string;
  targetAmount: number;
  achieved: boolean;
  achievedDate?: string;
  reward?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  taxId?: string;
  paymentTerms: string;
  preferredPaymentMethod: string;
  isActive: boolean;
  rating?: number;
  notes?: string;
  contracts?: VendorContract[];
  invoices?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VendorContract {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  value: number;
  terms: string;
  status: 'active' | 'expired' | 'cancelled';
  renewalDate?: string;
  documentUrl?: string;
}

export interface Budget {
  id: string;
  name: string;
  year: number;
  campus: string;
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
  status: 'draft' | 'approved' | 'active' | 'closed';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  subcategories?: BudgetSubcategory[];
  responsible?: string;
  notes?: string;
}

export interface BudgetSubcategory {
  id: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
  remainingAmount: number;
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  category: 'Equipment' | 'Furniture' | 'Vehicle' | 'Technology' | 'Building' | 'Other';
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Needs Repair';
  location: string;
  campus: string;
  assignedTo?: string;
  warrantyExpiry?: string;
  maintenanceSchedule?: AssetMaintenance[];
  depreciationMethod?: 'Straight Line' | 'Declining Balance';
  depreciationRate?: number;
  insuranceValue?: number;
  insuranceExpiry?: string;
  vendor?: string;
  notes?: string;
  photos?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetMaintenance {
  id: string;
  assetId: string;
  type: 'Routine' | 'Repair' | 'Inspection' | 'Upgrade';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  performedBy?: string;
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  category: string;
  campus: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[];
  attachments?: string[];
  comments?: TaskComment[];
  completedDate?: string;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface Inventory {
  id: string;
  name: string;
  description?: string;
  category: string;
  sku?: string;
  quantity: number;
  minimumStock: number;
  maximumStock?: number;
  unitCost: number;
  totalValue: number;
  location: string;
  campus: string;
  supplier?: string;
  lastRestocked?: string;
  expiryDate?: string;
  condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Damaged';
  isConsumable: boolean;
  requiresApproval: boolean;
  movements?: InventoryMovement[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason: string;
  userId: string;
  userName: string;
  date: string;
  cost?: number;
  reference?: string;
}

export interface Counseling {
  id: string;
  counselorId: string;
  counselorName: string;
  counseleeId: string;
  counseleeName: string;
  sessionDate: string;
  duration: number;
  type: 'Individual' | 'Couple' | 'Family' | 'Group';
  category: 'Spiritual' | 'Marriage' | 'Family' | 'Addiction' | 'Grief' | 'Financial' | 'Other';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  location: string;
  campus: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  referralMade?: boolean;
  referralTo?: string;
  confidential: boolean;
  sessionNumber: number;
  totalSessions?: number;
  progress?: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  memberId: string;
  membershipType: 'Full' | 'Associate' | 'Youth' | 'Child' | 'Honorary';
  status: 'Active' | 'Inactive' | 'Suspended' | 'Transferred' | 'Deceased';
  startDate: string;
  endDate?: string;
  transferredFrom?: string;
  transferredTo?: string;
  suspensionReason?: string;
  suspensionDate?: string;
  reinstatementDate?: string;
  membershipCard?: string;
  cardIssueDate?: string;
  cardExpiryDate?: string;
  votingRights: boolean;
  commitments?: MembershipCommitment[];
  disciplinaryActions?: DisciplinaryAction[];
  createdAt: string;
  updatedAt: string;
}

export interface MembershipCommitment {
  id: string;
  type: 'Attendance' | 'Giving' | 'Service' | 'Growth' | 'Other';
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'broken';
  progress?: number;
}

export interface DisciplinaryAction {
  id: string;
  type: 'Warning' | 'Suspension' | 'Probation' | 'Excommunication';
  reason: string;
  date: string;
  duration?: number;
  conditions?: string[];
  restorationPlan?: string;
  status: 'active' | 'completed' | 'lifted';
  authorizedBy: string;
  reviewDate?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'Payment' | 'Email' | 'SMS' | 'Accounting' | 'Live Stream' | 'Social Media' | 'Other';
  provider: string;
  isActive: boolean;
  configuration: { [key: string]: any };
  lastSync?: string;
  syncFrequency?: string;
  errorCount: number;
  lastError?: string;
  webhookUrl?: string;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  campus: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemSettings {
  id: string;
  category: string;
  key: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description?: string;
  isPublic: boolean;
  campus?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Backup {
  id: string;
  name: string;
  type: 'Full' | 'Incremental' | 'Differential';
  status: 'in-progress' | 'completed' | 'failed';
  size: number;
  location: string;
  createdAt: string;
  completedAt?: string;
  expiryDate: string;
  isEncrypted: boolean;
  checksum?: string;
  restorable: boolean;
}