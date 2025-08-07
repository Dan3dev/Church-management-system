import { Member, AttendanceRecord, FinancialTransaction, Event, Giving, Sermon } from '../types';

export const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Faith Street, Grace City, GC 12345',
    dateOfBirth: '1980-05-15',
    membershipStatus: 'Active',
    joinDate: '2020-03-10',
    ministry: ['Worship Team', 'Youth Ministry'],
    campus: 'Main Campus',
    role: 'member',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      communicationLanguage: 'English'
    },
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 123-4568',
      relationship: 'Spouse'
    }
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    address: '456 Hope Avenue, Grace City, GC 12345',
    dateOfBirth: '1975-08-22',
    membershipStatus: 'Active',
    joinDate: '2019-06-15',
    ministry: ['Children\'s Ministry', 'Women\'s Group'],
    campus: 'Main Campus',
    role: 'leader',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      communicationLanguage: 'English'
    },
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(555) 234-5679',
      relationship: 'Husband'
    }
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'mike.davis@email.com',
    phone: '(555) 345-6789',
    address: '789 Love Lane, Grace City, GC 12345',
    dateOfBirth: '1992-12-03',
    membershipStatus: 'Active',
    joinDate: '2021-01-20',
    ministry: ['Men\'s Group'],
    campus: 'Main Campus',
    role: 'member',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      communicationLanguage: 'English'
    },
    emergencyContact: {
      name: 'Lisa Davis',
      phone: '(555) 345-6790',
      relationship: 'Wife'
    }
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Wilson',
    email: 'emily.wilson@email.com',
    phone: '(555) 456-7890',
    address: '321 Peace Plaza, Grace City, GC 12345',
    dateOfBirth: '1988-04-18',
    membershipStatus: 'Visitor',
    joinDate: '2024-01-05',
    ministry: [],
    campus: 'Main Campus',
    role: 'member',
    preferences: {
      emailNotifications: false,
      smsNotifications: false,
      communicationLanguage: 'English'
    },
    emergencyContact: {
      name: 'Tom Wilson',
      phone: '(555) 456-7891',
      relationship: 'Brother'
    }
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@email.com',
    phone: '(555) 567-8901',
    address: '654 Joy Junction, Grace City, GC 12345',
    dateOfBirth: '1965-11-30',
    membershipStatus: 'Active',
    joinDate: '2018-09-12',
    ministry: ['Finance Committee', 'Men\'s Group'],
    campus: 'Main Campus',
    role: 'leader',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      communicationLanguage: 'English'
    },
    emergencyContact: {
      name: 'Mary Brown',
      phone: '(555) 567-8902',
      relationship: 'Spouse'
    }
  }
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', memberId: '1', memberName: 'John Smith', date: '2024-01-07', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '2', memberId: '2', memberName: 'Sarah Johnson', date: '2024-01-07', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '3', memberId: '3', memberName: 'Michael Davis', date: '2024-01-07', service: 'Sunday Morning', campus: 'Main Campus', present: false },
  { id: '4', memberId: '4', memberName: 'Emily Wilson', date: '2024-01-07', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '5', memberId: '5', memberName: 'Robert Brown', date: '2024-01-07', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '6', memberId: '1', memberName: 'John Smith', date: '2024-01-14', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '7', memberId: '2', memberName: 'Sarah Johnson', date: '2024-01-14', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '8', memberId: '3', memberName: 'Michael Davis', date: '2024-01-14', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '9', memberId: '4', memberName: 'Emily Wilson', date: '2024-01-14', service: 'Sunday Morning', campus: 'Main Campus', present: false },
  { id: '10', memberId: '5', memberName: 'Robert Brown', date: '2024-01-14', service: 'Sunday Morning', campus: 'Main Campus', present: true },
  { id: '11', memberId: '1', memberName: 'John Smith', date: '2024-01-10', service: 'Wednesday Prayer', campus: 'Main Campus', present: true },
  { id: '12', memberId: '2', memberName: 'Sarah Johnson', date: '2024-01-10', service: 'Wednesday Prayer', campus: 'Main Campus', present: false },
  { id: '13', memberId: '3', memberName: 'Michael Davis', date: '2024-01-10', service: 'Wednesday Prayer', campus: 'Main Campus', present: true },
];

export const mockTransactions: FinancialTransaction[] = [
  {
    id: '1',
    type: 'Income',
    category: 'Tithe',
    amount: 2500.00,
    date: '2024-01-07',
    description: 'Sunday Morning Tithe Collection',
    paymentMethod: 'Cash',
    memberName: 'Collection',
    campus: 'Main Campus',
    taxDeductible: true,
    receiptSent: false
  },
  {
    id: '2',
    type: 'Income',
    category: 'Offering',
    amount: 800.00,
    date: '2024-01-07',
    description: 'Sunday Morning Offering',
    paymentMethod: 'Cash',
    memberName: 'Collection',
    campus: 'Main Campus',
    taxDeductible: true,
    receiptSent: false
  },
  {
    id: '3',
    type: 'Expense',
    category: 'Utilities',
    amount: 450.00,
    date: '2024-01-05',
    description: 'Electric Bill - January',
    paymentMethod: 'Check',
    campus: 'Main Campus',
    taxDeductible: false,
    receiptSent: false
  },
  {
    id: '4',
    type: 'Income',
    category: 'Special Offering',
    amount: 1200.00,
    date: '2024-01-14',
    description: 'Missions Fund Special Collection',
    paymentMethod: 'Mixed',
    memberName: 'Collection',
    campus: 'Main Campus',
    taxDeductible: true,
    receiptSent: false
  },
  {
    id: '5',
    type: 'Expense',
    category: 'Maintenance',
    amount: 350.00,
    date: '2024-01-12',
    description: 'HVAC System Repair',
    paymentMethod: 'Check',
    campus: 'Main Campus',
    taxDeductible: false,
    receiptSent: false
  },
  {
    id: '6',
    type: 'Income',
    category: 'Donations',
    amount: 500.00,
    date: '2024-01-15',
    description: 'Anonymous Donation',
    paymentMethod: 'Bank Transfer',
    campus: 'Main Campus',
    taxDeductible: true,
    receiptSent: false
  },
  {
    id: '7',
    type: 'Expense',
    category: 'Office Supplies',
    amount: 125.00,
    date: '2024-01-08',
    description: 'Printer Paper and Supplies',
    paymentMethod: 'Card',
    campus: 'Main Campus',
    taxDeductible: false,
    receiptSent: false
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Sunday Morning Worship',
    description: 'Weekly Sunday worship service with communion',
    date: '2024-01-21',
    time: '10:00',
    location: 'Main Sanctuary',
    type: 'Service',
    endTime: '11:30',
    campus: 'Main Campus',
    organizer: 'Pastor John Smith',
    expectedAttendance: 150,
    registrationRequired: false,
    volunteers: [],
    resources: [],
    recurring: true,
    status: 'planned'
  },
  {
    id: '2',
    title: 'Youth Fellowship Night',
    description: 'Monthly youth gathering with games and devotion',
    date: '2024-01-25',
    time: '19:00',
    location: 'Youth Center',
    type: 'Fellowship',
    endTime: '21:00',
    campus: 'Main Campus',
    organizer: 'Sarah Johnson',
    expectedAttendance: 40,
    registrationRequired: true,
    volunteers: [],
    resources: [],
    recurring: true,
    status: 'planned'
  },
  {
    id: '3',
    title: 'Men\'s Bible Study',
    description: 'Weekly men\'s Bible study and prayer meeting',
    date: '2024-01-23',
    time: '07:00',
    location: 'Conference Room A',
    type: 'Meeting',
    endTime: '08:00',
    campus: 'Main Campus',
    organizer: 'Michael Davis',
    expectedAttendance: 20,
    registrationRequired: false,
    volunteers: [],
    resources: [],
    recurring: true,
    status: 'planned'
  },
  {
    id: '4',
    title: 'Community Outreach',
    description: 'Food distribution and community service project',
    date: '2024-01-27',
    time: '09:00',
    location: 'Community Center',
    type: 'Outreach',
    endTime: '15:00',
    campus: 'Main Campus',
    organizer: 'Emily Wilson',
    expectedAttendance: 60,
    registrationRequired: true,
    volunteers: [],
    resources: [],
    recurring: false,
    status: 'planned'
  },
  {
    id: '5',
    title: 'Prayer and Worship Night',
    description: 'Special evening of prayer and worship',
    date: '2024-02-02',
    time: '19:30',
    location: 'Main Sanctuary',
    type: 'Service',
    endTime: '21:00',
    campus: 'Main Campus',
    organizer: 'Robert Brown',
    expectedAttendance: 100,
    registrationRequired: false,
    volunteers: [],
    resources: [],
    recurring: false,
    status: 'planned'
  }
];

export const mockGiving: Giving[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'John Smith',
    amount: 500.00,
    date: '2024-01-07',
    type: 'tithe',
    fund: 'General Fund',
    paymentMethod: 'Bank Transfer',
    campus: 'Main Campus',
    recurring: true,
    recurringFrequency: 'weekly',
    taxDeductible: true,
    receiptSent: true
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Sarah Johnson',
    amount: 200.00,
    date: '2024-01-07',
    type: 'offering',
    fund: 'Missions Fund',
    paymentMethod: 'Cash',
    campus: 'Main Campus',
    recurring: false,
    taxDeductible: true,
    receiptSent: false
  }
];

export const mockSermons: Sermon[] = [
  {
    id: '1',
    title: 'Walking in Faith',
    speaker: 'Pastor John Smith',
    date: '2024-01-07',
    series: 'Faith Journey',
    scripture: 'Hebrews 11:1-6',
    description: 'Exploring what it means to walk by faith and not by sight in our daily lives.',
    campus: 'Main Campus',
    audioUrl: 'https://example.com/audio/sermon1.mp3',
    videoUrl: 'https://example.com/video/sermon1.mp4',
    duration: 35,
    views: 245,
    downloads: 67,
    tags: ['faith', 'trust', 'spiritual growth']
  },
  {
    id: '2',
    title: 'Love in Action',
    speaker: 'Pastor Sarah Johnson',
    date: '2024-01-14',
    series: 'Faith Journey',
    scripture: '1 John 4:7-21',
    description: 'Understanding how God\'s love transforms us and flows through us to others.',
    campus: 'Main Campus',
    audioUrl: 'https://example.com/audio/sermon2.mp3',
    duration: 42,
    views: 189,
    downloads: 43,
    tags: ['love', 'relationships', 'service']
  }
];