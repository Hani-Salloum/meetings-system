import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import env from "../../src/config/env";
import { permissions } from "../../src/constants/permissions";

export const services = [
  {
    ar_name: "تطوير الويب",
    en_name: "Web Development",
    ar_description: "خدمات تطوير المواقع الإلكترونية والتطبيقات",
    en_description: "Web development and application services",
  },
  {
    ar_name: "تطوير التطبيقات المحمولة",
    en_name: "Mobile App Development",
    ar_description: "تطوير تطبيقات الهواتف الذكية",
    en_description: "Smartphone application development",
  },
  {
    ar_name: "التجارة الإلكترونية",
    en_name: "E-commerce",
    ar_description: "حلول التجارة الإلكترونية والبيع عبر الإنترنت",
    en_description: "E-commerce solutions and online selling",
  },
  {
    ar_name: "الخدمات السحابية",
    en_name: "Cloud Services",
    ar_description: "خدمات الحوسبة السحابية والهجرة",
    en_description: "Cloud computing and migration services",
  },
  {
    ar_name: "تصميم واجهات المستخدم",
    en_name: "UI/UX Design",
    ar_description: "تصميم واجهات المستخدم وتجربة المستخدم",
    en_description: "User interface and user experience design",
  },
] as const;

export const serviceRequestPage = [
  {
    domain: "contact.datatime4it.com",
  },
  {
    domain: "contact.rs4it.com",
  },
];

export const serviceRequests = [
  {
    client_profile_id: 1,
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    phone: "555-0101",
    country_code: "+1",
    description:
      "We need help with our e-commerce website development. Looking for a modern, responsive design with payment integration and inventory management system.",
    service_request_page_name: "contact.datatime4it.com",
  },
  {
    client_profile_id: 1,
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    phone: "555-0101",
    country_code: "+1",
    description:
      "Our current website is slow and needs optimization. We'd like to improve page load times and overall performance.",
    service_request_page_name: "contact.datatime4it.com",
  },
  {
    client_profile_id: 2,
    name: "StartupHub Inc",
    email: "hello@startuphub.io",
    phone: "555-0102",
    country_code: "+1",
    description:
      "Planning to develop a mobile app for our fitness startup. Need consultation on technology stack, development timeline, and cost estimation.",
    service_request_page_name: "contact.rs4it.com",
  },
  {
    client_profile_id: 3,
    name: "Ecommerce Plus",
    email: "info@ecommerceplus.com",
    phone: "555-0103",
    country_code: "+1",
    description:
      "Our online store needs a complete redesign. Current conversion rates are low and we want to improve user experience and mobile responsiveness.",
    service_request_page_name: "contact.datatime4it.com",
  },
  {
    client_profile_id: 3,
    name: "Ecommerce Plus",
    email: "info@ecommerceplus.com",
    phone: "555-0103",
    country_code: "+1",
    description:
      "Looking for help with SEO optimization and digital marketing strategies to increase our online visibility and sales.",
    service_request_page_name: "contact.rs4it.com",
  },
  {
    client_profile_id: 4,
    name: "Design Studio Pro",
    email: "studio@designpro.co",
    phone: "555-0104",
    country_code: "+1",
    description:
      "Need assistance with our design system and UI/UX processes. Want to conduct a workshop with our team to improve our design workflow.",
    service_request_page_name: "contact.datatime4it.com",
  },
  {
    client_profile_id: 5,
    name: "CloudTech Solutions",
    email: "cloud@techsolutions.com",
    phone: "555-0105",
    country_code: "+1",
    description:
      "Planning to migrate our on-premise infrastructure to the cloud. Need expert guidance on AWS migration strategy and cost optimization.",
    service_request_page_name: "contact.rs4it.com",
  },
  {
    client_profile_id: 5,
    name: "CloudTech Solutions",
    email: "cloud@techsolutions.com",
    phone: "555-0105",
    country_code: "+1",
    description:
      "Our SaaS platform needs performance improvements and scalability enhancements. Looking for architectural review and optimization recommendations.",
    service_request_page_name: "contact.datatime4it.com",
  },
] as const;

export const clients = [
  {
    ip: "192.168.1.100",
    name: "TechCorp Solutions",
    status: "ACTIVE",
    country_code: "+1",
    phone: "555-0101",
    email: "contact@techcorp.com",
    verification_code: "VC001",
    access_token: "AT001",
  },
  {
    ip: "192.168.1.101",
    name: "StartupHub Inc",
    status: "ACTIVE",
    country_code: "+1",
    phone: "555-0102",
    email: "hello@startuphub.io",
    verification_code: "VC002",
    access_token: "AT002",
  },
  {
    ip: "192.168.1.102",
    name: "Ecommerce Plus",
    status: "ACTIVE",
    country_code: "+1",
    phone: "555-0103",
    email: "info@ecommerceplus.com",
    verification_code: "VC003",
    access_token: "AT003",
  },
  {
    ip: "192.168.1.103",
    name: "Design Studio Pro",
    status: "ACTIVE",
    country_code: "+1",
    phone: "555-0104",
    email: "studio@designpro.co",
    verification_code: "VC004",
    access_token: "AT004",
  },
  {
    ip: "192.168.1.104",
    name: "CloudTech Solutions",
    status: "ACTIVE",
    country_code: "+1",
    phone: "555-0105",
    email: "cloud@techsolutions.com",
    verification_code: "VC005",
    access_token: "AT005",
  },
] as const;

export const users = async () => {
  const hashedPassword = await bcrypt.hash(env.PASSWORD, 10);
  return [
    {
      first_name: "Ahmed",
      last_name: "Al-Rashid",
      email: env.USER_NAME,
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "AR",
      user_types: [1],
    },
    {
      first_name: "Sarah",
      last_name: "Johnson",
      email: "employee1@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "EN",
      user_types: [2],
    },
    {
      first_name: "محمد",
      last_name: "الزهراني",
      email: "employee2@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "AR",
      user_types: [2],
    },
    {
      first_name: "Michael",
      last_name: "Chen",
      email: "employee3@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "EN",
      user_types: [2],
    },
    {
      first_name: "فاطمة",
      last_name: "العتيبي",
      email: "employee4@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "AR",
      user_types: [2],
    },
    {
      first_name: "David",
      last_name: "Rodriguez",
      email: "employee5@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "EN",
      user_types: [2],
    },
    {
      first_name: "نورا",
      last_name: "الغامدي",
      email: "employee6@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "AR",
      user_types: [2],
    },
    {
      first_name: "Emily",
      last_name: "Williams",
      email: "employee7@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "EN",
      user_types: [2],
    },
    {
      first_name: "عبدالله",
      last_name: "السعيد",
      email: "employee8@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "AR",
      user_types: [2],
    },
    {
      first_name: "James",
      last_name: "Anderson",
      email: "employee9@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "EN",
      user_types: [2],
    },
    {
      first_name: "ريم",
      last_name: "القحطاني",
      email: "employee10@rs4it.com",
      confirmed_email: true,
      email_confirmation_code: null,
      active: true,
      password: hashedPassword,
      reset_password_code: null,
      available: true,
      language: "AR",
      user_types: [2],
    },
  ] as const;
};

export const projectRequestPages = [
  {
    title: "Web Development Consultation",
    pathname: "web-development",
    service_id: 1,
    description:
      "Get expert consultation for your web development project. We'll discuss requirements, timeline, and budget to create the perfect solution for your business.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    status: "ACTIVE",
    duration: 60,
    maximum_attendees: 5,
  },
  {
    title: "Mobile App Strategy Session",
    pathname: "mobile-app-strategy",
    service_id: 2,
    description:
      "Plan your mobile app development with our experienced team. We'll analyze market trends, user needs, and technical requirements.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    status: "ACTIVE",
    duration: 90,
    maximum_attendees: 8,
  },
  {
    title: "E-commerce Platform Review",
    pathname: "ecommerce-review",
    service_id: 3,
    description:
      "Comprehensive review of your e-commerce platform. We'll identify optimization opportunities and growth strategies.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    status: "ACTIVE",
    duration: 45,
    maximum_attendees: 4,
  },
  {
    title: "Cloud Migration Planning",
    pathname: "cloud-migration",
    service_id: 4,
    description:
      "Plan your cloud migration journey with our cloud experts. We'll assess current infrastructure and create a roadmap.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    status: "INACTIVE",
    duration: 120,
    maximum_attendees: 6,
  },
  {
    title: "UI/UX Design Workshop",
    pathname: "uiux-workshop",
    service_id: 5,
    description:
      "Interactive workshop to improve your product's user experience. Learn best practices and get hands-on feedback.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    status: "ACTIVE",
    duration: 180,
    maximum_attendees: 12,
  },
] as const;

export const meetingParticipantGroups = [
  {
    meeting_request_page_id: 1,
  },
  {
    meeting_request_page_id: 2,
  },
  {
    meeting_request_page_id: 3,
  },
  {
    meeting_request_page_id: 4,
  },
  {
    meeting_request_page_id: 5,
  },
] as const;

export const projectsMeetingParticipantGroupEmployees = [
  {
    meeting_meeting_participant_group_id: 1,
    employee_id: 1,
    required: true,
  },
  {
    meeting_meeting_participant_group_id: 1,
    employee_id: 2,
    required: false,
  },
  {
    meeting_meeting_participant_group_id: 2,
    employee_id: 3,
    required: true,
  },
  {
    meeting_meeting_participant_group_id: 2,
    employee_id: 4,
    required: true,
  },
  {
    meeting_meeting_participant_group_id: 3,
    employee_id: 5,
    required: true,
  },
  {
    meeting_meeting_participant_group_id: 4,
    employee_id: 6,
    required: true,
  },
  {
    meeting_meeting_participant_group_id: 5,
    employee_id: 7,
    required: true,
  },
  {
    meeting_meeting_participant_group_id: 5,
    employee_id: 8,
    required: true,
  },
] as const;

export const meetingRequests = [
  {
    client_profile_id: 1,
    meeting_request_page_pathname: "web-development",
    status: "REQUESTED",
    guest_attendees: ["John Smith", "Sarah Johnson"],
    description:
      "We need a new e-commerce website for our retail business. Looking to discuss requirements and get a quote.",
    start_at: new Date("2024-02-15T10:00:00Z"),
    end_at: new Date("2024-02-15T11:00:00Z"),
    duration: 60,
    scheduled_by_user_id: 1,
    participant_employees: [
      { id: 1, required: true },
      { id: 2, required: false },
    ],
  },
  {
    client_profile_id: 2,
    meeting_request_page_pathname: "mobile-app-strategy",
    status: "SCHEDULED",
    guest_attendees: ["Mike Wilson"],
    description:
      "Planning to launch a fitness tracking app. Need guidance on technology stack and development approach.",
    start_at: new Date("2024-02-16T14:00:00Z"),
    end_at: new Date("2024-02-16T15:30:00Z"),
    duration: 90,
    scheduled_by_user_id: 2,
    participant_employees: [
      { id: 3, required: true },
      { id: 4, required: true },
    ],
  },
  {
    client_profile_id: 3,
    meeting_request_page_pathname: "ecommerce-review",
    status: "REQUESTED",
    guest_attendees: ["Emma Davis", "Tom Brown"],
    description:
      "Our online store needs optimization. Looking to improve conversion rates and user experience.",
    start_at: new Date("2024-02-17T09:00:00Z"),
    end_at: new Date("2024-02-17T09:45:00Z"),
    duration: 45,
    scheduled_by_user_id: 3,
    participant_employees: [{ id: 5, required: true }],
  },
  {
    client_profile_id: 4,
    meeting_request_page_pathname: "uiux-workshop",
    status: "SCHEDULED",
    guest_attendees: ["Anna Lee", "Chris Chen", "Sophie Kim"],
    description: "Team workshop to improve our design system and user experience processes.",
    start_at: new Date("2024-02-18T13:00:00Z"),
    end_at: new Date("2024-02-18T16:00:00Z"),
    duration: 180,
    scheduled_by_user_id: 4,
    participant_employees: [
      { id: 6, required: true },
      { id: 7, required: true },
    ],
  },
  {
    client_profile_id: 5,
    meeting_request_page_pathname: "web-development",
    status: "COMPLETED",
    guest_attendees: ["Robert Taylor"],
    description:
      "Completed consultation for our SaaS platform. Great insights and clear next steps.",
    start_at: new Date("2024-02-10T11:00:00Z"),
    end_at: new Date("2024-02-10T12:00:00Z"),
    duration: 60,
    scheduled_by_user_id: 5,
    participant_employees: [{ id: 1, required: true }],
  },
] as const;

export const availabilities = [
  {
    user_id: 1,
    week_day: "MONDAY",
    hours: ["HOUR_9", "HOUR_10", "HOUR_11", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 1,
    week_day: "TUESDAY",
    hours: ["HOUR_9", "HOUR_10", "HOUR_11", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 1,
    week_day: "WEDNESDAY",
    hours: ["HOUR_9", "HOUR_10", "HOUR_11", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 1,
    week_day: "THURSDAY",
    hours: ["HOUR_9", "HOUR_10", "HOUR_11", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 1,
    week_day: "FRIDAY",
    hours: ["HOUR_9", "HOUR_10", "HOUR_11", "HOUR_13", "HOUR_14", "HOUR_15"],
  },
  {
    user_id: 2,
    week_day: "MONDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_14", "HOUR_15", "HOUR_16", "HOUR_17"],
  },
  {
    user_id: 2,
    week_day: "TUESDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_14", "HOUR_15", "HOUR_16", "HOUR_17"],
  },
  {
    user_id: 2,
    week_day: "WEDNESDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_14", "HOUR_15", "HOUR_16", "HOUR_17"],
  },
  {
    user_id: 2,
    week_day: "THURSDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_14", "HOUR_15", "HOUR_16", "HOUR_17"],
  },
  {
    user_id: 2,
    week_day: "FRIDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 3,
    week_day: "MONDAY",
    hours: ["HOUR_8", "HOUR_9", "HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15"],
  },
  {
    user_id: 3,
    week_day: "TUESDAY",
    hours: ["HOUR_8", "HOUR_9", "HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15"],
  },
  {
    user_id: 3,
    week_day: "WEDNESDAY",
    hours: ["HOUR_8", "HOUR_9", "HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15"],
  },
  {
    user_id: 3,
    week_day: "THURSDAY",
    hours: ["HOUR_8", "HOUR_9", "HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15"],
  },
  {
    user_id: 3,
    week_day: "FRIDAY",
    hours: ["HOUR_8", "HOUR_9", "HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14"],
  },
  {
    user_id: 4,
    week_day: "MONDAY",
    hours: [
      "HOUR_9",
      "HOUR_10",
      "HOUR_11",
      "HOUR_12",
      "HOUR_13",
      "HOUR_14",
      "HOUR_15",
      "HOUR_16",
      "HOUR_17",
    ],
  },
  {
    user_id: 4,
    week_day: "TUESDAY",
    hours: [
      "HOUR_9",
      "HOUR_10",
      "HOUR_11",
      "HOUR_12",
      "HOUR_13",
      "HOUR_14",
      "HOUR_15",
      "HOUR_16",
      "HOUR_17",
    ],
  },
  {
    user_id: 4,
    week_day: "WEDNESDAY",
    hours: [
      "HOUR_9",
      "HOUR_10",
      "HOUR_11",
      "HOUR_12",
      "HOUR_13",
      "HOUR_14",
      "HOUR_15",
      "HOUR_16",
      "HOUR_17",
    ],
  },
  {
    user_id: 4,
    week_day: "THURSDAY",
    hours: [
      "HOUR_9",
      "HOUR_10",
      "HOUR_11",
      "HOUR_12",
      "HOUR_13",
      "HOUR_14",
      "HOUR_15",
      "HOUR_16",
      "HOUR_17",
    ],
  },
  {
    user_id: 4,
    week_day: "FRIDAY",
    hours: ["HOUR_9", "HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 5,
    week_day: "MONDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 5,
    week_day: "TUESDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 5,
    week_day: "WEDNESDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 5,
    week_day: "THURSDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15", "HOUR_16"],
  },
  {
    user_id: 5,
    week_day: "FRIDAY",
    hours: ["HOUR_10", "HOUR_11", "HOUR_12", "HOUR_13", "HOUR_14", "HOUR_15"],
  },
] as const;

export const availabilityHours = [
  // Employee 1 - Monday
  { employee_availability_id: 1, day_part: "HOUR_9" },
  { employee_availability_id: 1, day_part: "HOUR_10" },
  { employee_availability_id: 1, day_part: "HOUR_11" },
  { employee_availability_id: 1, day_part: "HOUR_13" },
  { employee_availability_id: 1, day_part: "HOUR_14" },
  { employee_availability_id: 1, day_part: "HOUR_15" },
  { employee_availability_id: 1, day_part: "HOUR_16" },

  // Employee 1 - Tuesday
  { employee_availability_id: 2, day_part: "HOUR_9" },
  { employee_availability_id: 2, day_part: "HOUR_10" },
  { employee_availability_id: 2, day_part: "HOUR_11" },
  { employee_availability_id: 2, day_part: "HOUR_13" },
  { employee_availability_id: 2, day_part: "HOUR_14" },
  { employee_availability_id: 2, day_part: "HOUR_15" },
  { employee_availability_id: 2, day_part: "HOUR_16" },

  // Employee 1 - Wednesday
  { employee_availability_id: 3, day_part: "HOUR_9" },
  { employee_availability_id: 3, day_part: "HOUR_10" },
  { employee_availability_id: 3, day_part: "HOUR_11" },
  { employee_availability_id: 3, day_part: "HOUR_13" },
  { employee_availability_id: 3, day_part: "HOUR_14" },
  { employee_availability_id: 3, day_part: "HOUR_15" },
  { employee_availability_id: 3, day_part: "HOUR_16" },

  // Employee 1 - Thursday
  { employee_availability_id: 4, day_part: "HOUR_9" },
  { employee_availability_id: 4, day_part: "HOUR_10" },
  { employee_availability_id: 4, day_part: "HOUR_11" },
  { employee_availability_id: 4, day_part: "HOUR_13" },
  { employee_availability_id: 4, day_part: "HOUR_14" },
  { employee_availability_id: 4, day_part: "HOUR_15" },
  { employee_availability_id: 4, day_part: "HOUR_16" },

  // Employee 1 - Friday
  { employee_availability_id: 5, day_part: "HOUR_9" },
  { employee_availability_id: 5, day_part: "HOUR_10" },
  { employee_availability_id: 5, day_part: "HOUR_11" },
  { employee_availability_id: 5, day_part: "HOUR_13" },
  { employee_availability_id: 5, day_part: "HOUR_14" },
  { employee_availability_id: 5, day_part: "HOUR_15" },

  // Employee 2 - Monday
  { employee_availability_id: 6, day_part: "HOUR_10" },
  { employee_availability_id: 6, day_part: "HOUR_11" },
  { employee_availability_id: 6, day_part: "HOUR_12" },
  { employee_availability_id: 6, day_part: "HOUR_14" },
  { employee_availability_id: 6, day_part: "HOUR_15" },
  { employee_availability_id: 6, day_part: "HOUR_16" },
  { employee_availability_id: 6, day_part: "HOUR_17" },

  // Employee 2 - Tuesday
  { employee_availability_id: 7, day_part: "HOUR_10" },
  { employee_availability_id: 7, day_part: "HOUR_11" },
  { employee_availability_id: 7, day_part: "HOUR_12" },
  { employee_availability_id: 7, day_part: "HOUR_14" },
  { employee_availability_id: 7, day_part: "HOUR_15" },
  { employee_availability_id: 7, day_part: "HOUR_16" },
  { employee_availability_id: 7, day_part: "HOUR_17" },

  // Employee 2 - Wednesday
  { employee_availability_id: 8, day_part: "HOUR_10" },
  { employee_availability_id: 8, day_part: "HOUR_11" },
  { employee_availability_id: 8, day_part: "HOUR_12" },
  { employee_availability_id: 8, day_part: "HOUR_14" },
  { employee_availability_id: 8, day_part: "HOUR_15" },
  { employee_availability_id: 8, day_part: "HOUR_16" },
  { employee_availability_id: 8, day_part: "HOUR_17" },

  // Employee 2 - Thursday
  { employee_availability_id: 9, day_part: "HOUR_10" },
  { employee_availability_id: 9, day_part: "HOUR_11" },
  { employee_availability_id: 9, day_part: "HOUR_12" },
  { employee_availability_id: 9, day_part: "HOUR_14" },
  { employee_availability_id: 9, day_part: "HOUR_15" },
  { employee_availability_id: 9, day_part: "HOUR_16" },
  { employee_availability_id: 9, day_part: "HOUR_17" },

  // Employee 2 - Friday
  { employee_availability_id: 10, day_part: "HOUR_10" },
  { employee_availability_id: 10, day_part: "HOUR_11" },
  { employee_availability_id: 10, day_part: "HOUR_12" },
  { employee_availability_id: 10, day_part: "HOUR_14" },
  { employee_availability_id: 10, day_part: "HOUR_15" },
  { employee_availability_id: 10, day_part: "HOUR_16" },

  // Employee 3 - Monday
  { employee_availability_id: 11, day_part: "HOUR_8" },
  { employee_availability_id: 11, day_part: "HOUR_9" },
  { employee_availability_id: 11, day_part: "HOUR_10" },
  { employee_availability_id: 11, day_part: "HOUR_11" },
  { employee_availability_id: 11, day_part: "HOUR_12" },
  { employee_availability_id: 11, day_part: "HOUR_13" },
  { employee_availability_id: 11, day_part: "HOUR_14" },
  { employee_availability_id: 11, day_part: "HOUR_15" },

  // Employee 3 - Tuesday
  { employee_availability_id: 12, day_part: "HOUR_8" },
  { employee_availability_id: 12, day_part: "HOUR_9" },
  { employee_availability_id: 12, day_part: "HOUR_10" },
  { employee_availability_id: 12, day_part: "HOUR_11" },
  { employee_availability_id: 12, day_part: "HOUR_12" },
  { employee_availability_id: 12, day_part: "HOUR_13" },
  { employee_availability_id: 12, day_part: "HOUR_14" },
  { employee_availability_id: 12, day_part: "HOUR_15" },

  // Employee 3 - Wednesday
  { employee_availability_id: 13, day_part: "HOUR_8" },
  { employee_availability_id: 13, day_part: "HOUR_9" },
  { employee_availability_id: 13, day_part: "HOUR_10" },
  { employee_availability_id: 13, day_part: "HOUR_11" },
  { employee_availability_id: 13, day_part: "HOUR_12" },
  { employee_availability_id: 13, day_part: "HOUR_13" },
  { employee_availability_id: 13, day_part: "HOUR_14" },
  { employee_availability_id: 13, day_part: "HOUR_15" },

  // Employee 3 - Thursday
  { employee_availability_id: 14, day_part: "HOUR_8" },
  { employee_availability_id: 14, day_part: "HOUR_9" },
  { employee_availability_id: 14, day_part: "HOUR_10" },
  { employee_availability_id: 14, day_part: "HOUR_11" },
  { employee_availability_id: 14, day_part: "HOUR_12" },
  { employee_availability_id: 14, day_part: "HOUR_13" },
  { employee_availability_id: 14, day_part: "HOUR_14" },
  { employee_availability_id: 14, day_part: "HOUR_15" },

  // Employee 3 - Friday
  { employee_availability_id: 15, day_part: "HOUR_8" },
  { employee_availability_id: 15, day_part: "HOUR_9" },
  { employee_availability_id: 15, day_part: "HOUR_10" },
  { employee_availability_id: 15, day_part: "HOUR_11" },
  { employee_availability_id: 15, day_part: "HOUR_12" },
  { employee_availability_id: 15, day_part: "HOUR_13" },
  { employee_availability_id: 15, day_part: "HOUR_14" },

  // Employee 4 - Monday
  { employee_availability_id: 16, day_part: "HOUR_9" },
  { employee_availability_id: 16, day_part: "HOUR_10" },
  { employee_availability_id: 16, day_part: "HOUR_11" },
  { employee_availability_id: 16, day_part: "HOUR_12" },
  { employee_availability_id: 16, day_part: "HOUR_13" },
  { employee_availability_id: 16, day_part: "HOUR_14" },
  { employee_availability_id: 16, day_part: "HOUR_15" },
  { employee_availability_id: 16, day_part: "HOUR_16" },
  { employee_availability_id: 16, day_part: "HOUR_17" },

  // Employee 4 - Tuesday
  { employee_availability_id: 17, day_part: "HOUR_9" },
  { employee_availability_id: 17, day_part: "HOUR_10" },
  { employee_availability_id: 17, day_part: "HOUR_11" },
  { employee_availability_id: 17, day_part: "HOUR_12" },
  { employee_availability_id: 17, day_part: "HOUR_13" },
  { employee_availability_id: 17, day_part: "HOUR_14" },
  { employee_availability_id: 17, day_part: "HOUR_15" },
  { employee_availability_id: 17, day_part: "HOUR_16" },
  { employee_availability_id: 17, day_part: "HOUR_17" },

  // Employee 4 - Wednesday
  { employee_availability_id: 18, day_part: "HOUR_9" },
  { employee_availability_id: 18, day_part: "HOUR_10" },
  { employee_availability_id: 18, day_part: "HOUR_11" },
  { employee_availability_id: 18, day_part: "HOUR_12" },
  { employee_availability_id: 18, day_part: "HOUR_13" },
  { employee_availability_id: 18, day_part: "HOUR_14" },
  { employee_availability_id: 18, day_part: "HOUR_15" },
  { employee_availability_id: 18, day_part: "HOUR_16" },
  { employee_availability_id: 18, day_part: "HOUR_17" },

  // Employee 4 - Thursday
  { employee_availability_id: 19, day_part: "HOUR_9" },
  { employee_availability_id: 19, day_part: "HOUR_10" },
  { employee_availability_id: 19, day_part: "HOUR_11" },
  { employee_availability_id: 19, day_part: "HOUR_12" },
  { employee_availability_id: 19, day_part: "HOUR_13" },
  { employee_availability_id: 19, day_part: "HOUR_14" },
  { employee_availability_id: 19, day_part: "HOUR_15" },
  { employee_availability_id: 19, day_part: "HOUR_16" },
  { employee_availability_id: 19, day_part: "HOUR_17" },

  // Employee 4 - Friday
  { employee_availability_id: 20, day_part: "HOUR_9" },
  { employee_availability_id: 20, day_part: "HOUR_10" },
  { employee_availability_id: 20, day_part: "HOUR_11" },
  { employee_availability_id: 20, day_part: "HOUR_12" },
  { employee_availability_id: 20, day_part: "HOUR_13" },
  { employee_availability_id: 20, day_part: "HOUR_14" },
  { employee_availability_id: 20, day_part: "HOUR_15" },
  { employee_availability_id: 20, day_part: "HOUR_16" },

  // Employee 5 - Monday
  { employee_availability_id: 21, day_part: "HOUR_10" },
  { employee_availability_id: 21, day_part: "HOUR_11" },
  { employee_availability_id: 21, day_part: "HOUR_12" },
  { employee_availability_id: 21, day_part: "HOUR_13" },
  { employee_availability_id: 21, day_part: "HOUR_14" },
  { employee_availability_id: 21, day_part: "HOUR_15" },
  { employee_availability_id: 21, day_part: "HOUR_16" },

  // Employee 5 - Tuesday
  { employee_availability_id: 22, day_part: "HOUR_10" },
  { employee_availability_id: 22, day_part: "HOUR_11" },
  { employee_availability_id: 22, day_part: "HOUR_12" },
  { employee_availability_id: 22, day_part: "HOUR_13" },
  { employee_availability_id: 22, day_part: "HOUR_14" },
  { employee_availability_id: 22, day_part: "HOUR_15" },
  { employee_availability_id: 22, day_part: "HOUR_16" },

  // Employee 5 - Wednesday
  { employee_availability_id: 23, day_part: "HOUR_10" },
  { employee_availability_id: 23, day_part: "HOUR_11" },
  { employee_availability_id: 23, day_part: "HOUR_12" },
  { employee_availability_id: 23, day_part: "HOUR_13" },
  { employee_availability_id: 23, day_part: "HOUR_14" },
  { employee_availability_id: 23, day_part: "HOUR_15" },
  { employee_availability_id: 23, day_part: "HOUR_16" },

  // Employee 5 - Thursday
  { employee_availability_id: 24, day_part: "HOUR_10" },
  { employee_availability_id: 24, day_part: "HOUR_11" },
  { employee_availability_id: 24, day_part: "HOUR_12" },
  { employee_availability_id: 24, day_part: "HOUR_13" },
  { employee_availability_id: 24, day_part: "HOUR_14" },
  { employee_availability_id: 24, day_part: "HOUR_15" },
  { employee_availability_id: 24, day_part: "HOUR_16" },

  // Employee 5 - Friday
  { employee_availability_id: 25, day_part: "HOUR_10" },
  { employee_availability_id: 25, day_part: "HOUR_11" },
  { employee_availability_id: 25, day_part: "HOUR_12" },
  { employee_availability_id: 25, day_part: "HOUR_13" },
  { employee_availability_id: 25, day_part: "HOUR_14" },
  { employee_availability_id: 25, day_part: "HOUR_15" },
] as const;

export const userTypes = [
  {
    name: "admin",
    permissions: Object.keys(permissions).map((_, index) => index + 1),
    users: [1],
  },
  {
    name: "employee",
    permissions: (() => {
      const toFind = [
        "availability:manage",
        "meeting-requests:read-own",
        "meeting-requests:accept",
        "meeting-requests:complete",
      ];
      const idsByEntries = Object.entries(permissions).map(([key], index) => ({
        key,
        id: index + 1,
      }));
      const ids = toFind
        .map((permission) => idsByEntries.find((id) => id.key === permission)?.id)
        .filter(Boolean) as number[];
      return ids;
    })(),
    users: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
];

export const PermissionsUpsert = Object.entries(permissions).map(([key, permission], index) => {
  const formattedPermissionData: Prisma.PermissionCreateInput = {
    code: key,
    en_name: permission.en_name,
    ar_name: permission.ar_name,
    en_description: permission.en_description,
    ar_description: permission.ar_description,
    permission_category: {
      connectOrCreate: {
        where: {
          en_name: permission.category.en,
        },
        create: {
          en_name: permission.category.en,
          ar_name: permission.category.ar,
          en_description: permission.category.description.en,
          ar_description: permission.category.description.ar,
        },
      },
    },
  };

  return {
    create: formattedPermissionData,
    where: {
      id: index + 1,
    },
    update: formattedPermissionData,
  } satisfies Prisma.PermissionUpsertArgs;
});
