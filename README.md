# ChurchHub - Complete Church Management System

A comprehensive, full-stack Church Management System (ChMS) built with React, TypeScript, and Supabase. This system provides both admin and member interfaces for managing all aspects of church operations.

## Features

### Core Management
- **Member Management**: Complete member profiles, status tracking, ministry assignments
- **Attendance Tracking**: Service attendance, check-in/out, automated follow-ups
- **Financial Management**: Donations, tithes, expenses, budgeting, tax reporting
- **Event Planning**: Service scheduling, special events, resource management
- **Giving Management**: Tithe and offering tracking, recurring gifts, tax statements

### Advanced Features
- **Volunteer Scheduling**: Department-based scheduling, role assignments, confirmation tracking
- **Communication Center**: Email, SMS, push notifications, announcements
- **Child Check-In System**: Secure check-in/out, allergy tracking, parent notifications
- **Sermon Management**: Audio/video uploads, series tracking, download analytics
- **Small Group Management**: Group creation, member assignments, leader tools
- **Multi-Campus Support**: Campus-specific data, unified reporting

### Technical Features
- **Role-Based Access Control**: Admin, pastor, leader, member, volunteer roles
- **Responsive Design**: Mobile-first design, works on all devices
- **Real-time Updates**: Live data synchronization across all users
- **Automated Workflows**: Birthday reminders, attendance follow-ups, devotionals
- **Comprehensive Reporting**: Financial reports, attendance analytics, member insights
- **Secure Data Handling**: Encrypted data, secure authentication, privacy controls

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd church-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase project:
   - Create a new Supabase project
   - Copy your project URL and anon key to `.env`
   - Run the database migrations (see Database Setup)

5. Start the development server:
```bash
npm run dev
```

## Database Setup

The system uses Supabase for the backend. You'll need to set up the following tables:

- `members` - Member information and profiles
- `attendance` - Attendance records
- `financial_transactions` - Financial data
- `giving` - Donation and tithe records
- `events` - Event and service information
- `volunteers` - Volunteer scheduling
- `communications` - Message history
- `children` - Child profiles for check-in
- `child_checkins` - Check-in/out records
- `sermons` - Sermon library
- `small_groups` - Small group management
- `campuses` - Multi-campus support

## User Roles

### Admin
- Full system access
- User management
- System configuration
- All reports and analytics

### Pastor
- Member management
- Communication tools
- Sermon management
- Reports and analytics

### Leader
- Department-specific access
- Volunteer coordination
- Event management
- Limited reporting

### Member
- Personal profile management
- Event registration
- Giving history
- Communication preferences

### Volunteer
- Schedule viewing
- Availability management
- Task assignments
- Basic communication

## Key Components

### Dashboard
- Real-time metrics and KPIs
- Quick actions and shortcuts
- Recent activity feed
- Upcoming events and tasks

### Member Management
- Comprehensive member profiles
- Ministry and small group assignments
- Communication preferences
- Emergency contact information

### Financial Management
- Income and expense tracking
- Budget management
- Tax-deductible giving reports
- Multi-fund accounting

### Communication Center
- Mass email and SMS campaigns
- Targeted messaging by groups
- Automated follow-up sequences
- Message scheduling and analytics

### Volunteer Scheduling
- Department-based organization
- Role-specific assignments
- Availability tracking
- Automated reminders

### Child Check-In
- Secure check-in/out process
- Allergy and medical alerts
- Parent notifications
- Security code system

## Mobile Support

The system is fully responsive and provides an excellent mobile experience:
- Touch-friendly interface
- Optimized layouts for small screens
- Fast loading and smooth animations
- Offline capability for critical functions

## Security Features

- **Authentication**: Secure email/password authentication
- **Authorization**: Role-based access control
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Audit Logging**: Complete audit trail of all system actions
- **Privacy Controls**: GDPR-compliant data handling

## Automation Features

- **Birthday Reminders**: Automatic birthday notifications
- **Attendance Follow-ups**: Automated outreach for missed services
- **New Member Workflow**: Automated welcome sequences
- **Giving Reminders**: Gentle reminders for recurring gifts
- **Event Notifications**: Automatic event reminders and updates

## Reporting & Analytics

- **Member Reports**: Growth, retention, engagement metrics
- **Financial Reports**: Income, expenses, giving trends
- **Attendance Analytics**: Service attendance patterns
- **Volunteer Reports**: Scheduling and participation metrics
- **Custom Reports**: Build your own reports with filters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced automation workflows
- [ ] Integration with accounting software
- [ ] Advanced reporting dashboard
- [ ] Multi-language support
- [ ] API for third-party integrations