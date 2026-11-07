-- CreateTable
CREATE TABLE `client_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'BLOCKED') NOT NULL,
    `country_code` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `verification_code` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `client_profile_email_key`(`email`),
    INDEX `client_profile_status_created_at_idx`(`status`, `created_at`),
    INDEX `client_profile_country_code_phone_idx`(`country_code`, `phone`),
    INDEX `client_profile_email_idx`(`email`),
    UNIQUE INDEX `client_profile_country_code_phone_key`(`country_code`, `phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_request_pages` (
    `domain` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`domain`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `type` ENUM('EMAIL', 'WHATSAPP') NOT NULL,

    UNIQUE INDEX `notification_profiles_id_value_key`(`id`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_profile_id` INTEGER NOT NULL,
    `description` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `service_request_page_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `week_day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `employees_availability_employee_id_week_day_idx`(`employee_id`, `week_day`),
    INDEX `employees_availability_week_day_idx`(`week_day`),
    UNIQUE INDEX `employees_availability_employee_id_week_day_key`(`employee_id`, `week_day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_availability_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_availability_id` INTEGER NOT NULL,
    `day_part` ENUM('HOUR_0', 'HOUR_1', 'HOUR_2', 'HOUR_3', 'HOUR_4', 'HOUR_5', 'HOUR_6', 'HOUR_7', 'HOUR_8', 'HOUR_9', 'HOUR_10', 'HOUR_11', 'HOUR_12', 'HOUR_13', 'HOUR_14', 'HOUR_15', 'HOUR_16', 'HOUR_17', 'HOUR_18', 'HOUR_19', 'HOUR_20', 'HOUR_21', 'HOUR_22', 'HOUR_23') NOT NULL,

    INDEX `employees_availability_hours_employee_availability_id_day_pa_idx`(`employee_availability_id`, `day_part`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_profile_id` INTEGER NULL,
    `projects_request_page_pathname` VARCHAR(191) NULL,
    `meetings_scheduled_by_id` INTEGER NOT NULL,
    `status` ENUM('REQUESTED', 'SCHEDULED', 'REJECTED', 'CANCELLED', 'COMPLETED') NOT NULL,
    `guest_attendees` JSON NULL,
    `description` LONGTEXT NULL,
    `start_at` DATETIME(3) NOT NULL,
    `end_at` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `scheduled_by_employee_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `meetings_meetings_scheduled_by_id_key`(`meetings_scheduled_by_id`),
    INDEX `meetings_status_start_at_idx`(`status`, `start_at`),
    INDEX `meetings_client_profile_id_status_idx`(`client_profile_id`, `status`),
    INDEX `meetings_projects_request_page_pathname_status_idx`(`projects_request_page_pathname`, `status`),
    INDEX `meetings_start_at_end_at_idx`(`start_at`, `end_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects_request_pages` (
    `title` VARCHAR(191) NOT NULL,
    `pathname` VARCHAR(191) NOT NULL,
    `project_id` INTEGER NOT NULL,
    `description` LONGTEXT NULL,
    `image` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `duration` INTEGER NOT NULL,
    `maximum_attendees` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_request_pages_pathname_key`(`pathname`),
    INDEX `projects_request_pages_status_duration_idx`(`status`, `duration`),
    INDEX `projects_request_pages_project_id_status_idx`(`project_id`, `status`),
    INDEX `projects_request_pages_pathname_status_idx`(`pathname`, `status`),
    PRIMARY KEY (`title`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects_meeting_participant_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projects_request_page_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects_meeting_participant_group_employees` (
    `project_meeting_participant_group_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `required` BOOLEAN NOT NULL,

    PRIMARY KEY (`project_meeting_participant_group_id`, `employee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NotificationProfileToServiceRequestPage` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_NotificationProfileToServiceRequestPage_AB_unique`(`A`, `B`),
    INDEX `_NotificationProfileToServiceRequestPage_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_requests` ADD CONSTRAINT `service_requests_client_profile_id_fkey` FOREIGN KEY (`client_profile_id`) REFERENCES `client_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_requests` ADD CONSTRAINT `service_requests_service_request_page_name_fkey` FOREIGN KEY (`service_request_page_name`) REFERENCES `service_request_pages`(`domain`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees_availability_hours` ADD CONSTRAINT `employees_availability_hours_employee_availability_id_fkey` FOREIGN KEY (`employee_availability_id`) REFERENCES `employees_availability`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_client_profile_id_fkey` FOREIGN KEY (`client_profile_id`) REFERENCES `client_profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_projects_request_page_pathname_fkey` FOREIGN KEY (`projects_request_page_pathname`) REFERENCES `projects_request_pages`(`pathname`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects_meeting_participant_groups` ADD CONSTRAINT `projects_meeting_participant_groups_projects_request_page_i_fkey` FOREIGN KEY (`projects_request_page_id`) REFERENCES `projects_request_pages`(`pathname`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects_meeting_participant_group_employees` ADD CONSTRAINT `projects_meeting_participant_group_employees_project_meetin_fkey` FOREIGN KEY (`project_meeting_participant_group_id`) REFERENCES `projects_meeting_participant_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotificationProfileToServiceRequestPage` ADD CONSTRAINT `_NotificationProfileToServiceRequestPage_A_fkey` FOREIGN KEY (`A`) REFERENCES `notification_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotificationProfileToServiceRequestPage` ADD CONSTRAINT `_NotificationProfileToServiceRequestPage_B_fkey` FOREIGN KEY (`B`) REFERENCES `service_request_pages`(`domain`) ON DELETE CASCADE ON UPDATE CASCADE;
