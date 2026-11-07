# Modular Prisma Schema

This directory contains a modular Prisma schema structure that makes it easier to organize and maintain your database models by topic.

## 📁 File Structure

```
prisma/schema/
├── enums.prisma           # All enum definitions
├── client.prisma          # Client-related models
├── employee.prisma        # Employee-related models
├── project.prisma         # Project-related models
├── meeting.prisma         # Meeting-related models
├── schema.prisma          # Main schema file (generator + datasource)
└── README.md              # This file
```

## 🚀 Usage

### Development Workflow

1. **Edit individual schema files** in the `prisma/schema/` directory
2. **Build the combined schema** using the build script
3. **Generate Prisma client** or push to database

### Available Scripts

```bash
# Build the combined schema from modular files
npm run build:schema

# Generate Prisma client (includes building schema)
npm run db:generate

# Push schema to database (includes building schema)
npm run db:push
```

### Manual Build

```bash
node prisma/build-schema.js
```

## 📋 Schema Organization

### **Enums** (`enums.prisma`)
- `ClientProfileStatus` - Client account statuses
- `NotificationProfileType` - Notification channel types
- `MeetingStatus` - Meeting lifecycle statuses
- `WeekDay` - Days of the week
- `DayPart` - Hour-based time slots
- `ProjectRequestPageStatus` - Project page statuses

### **Client Models** (`client.prisma`)
- `ClientProfile` - Client information and authentication
- `ServiceRequestPage` - Service request page configurations
- `NotificationProfile` - Notification channel configurations
- `ServiceRequest` - Client service requests

### **Employee Models** (`employee.prisma`)
- `Employee` - Employee records
- `EmployeesAvailability` - Weekly availability schedules
- `EmployeesAvailabilityHours` - Daily hour availability

### **Project Models** (`project.prisma`)
- `Project` - Project records
- `ProjectsRequestPage` - Project-specific request pages
- `ProjectsMeetingParticipantGroup` - Meeting participant groups
- `ProjectsMeetingParticipantGroupEmployee` - Employee group assignments

### **Meeting Models** (`meeting.prisma`)
- `Meeting` - Meeting records and details
- `MeetingsScheduledBy` - Meeting scheduling information

## 🔧 Benefits

1. **Better Organization** - Related models grouped by topic
2. **Easier Maintenance** - Find and modify specific model types quickly
3. **Team Collaboration** - Multiple developers can work on different model areas
4. **Clearer Structure** - Self-documenting organization
5. **Easier Testing** - Test specific model groups in isolation

## ⚠️ Important Notes

- **Always run `npm run build:schema`** before generating Prisma client or pushing to database
- **Don't edit the generated `prisma/schema.prisma`** file directly - it gets overwritten
- **Edit only the modular files** in the `prisma/schema/` directory
- **The build script maintains the correct order** of model definitions for relationships

## 🔄 Workflow Example

```bash
# 1. Edit a model in prisma/schema/client.prisma
# 2. Build the combined schema
npm run build:schema

# 3. Generate Prisma client
npm run db:generate

# 4. Or push to database
npm run db:push
```

## 🐛 Troubleshooting

If you encounter issues:

1. **Check file syntax** - Ensure all `.prisma` files have valid syntax
2. **Verify file paths** - Make sure all schema files exist in the `prisma/schema/` directory
3. **Run build script** - Always run `npm run build:schema` first
4. **Check console output** - The build script will show warnings for missing files

## 📚 Related Commands

```bash
# View current database schema
npx prisma db pull

# Reset database (⚠️ destructive)
npx prisma db push --force-reset

# Open Prisma Studio
npx prisma studio
```
