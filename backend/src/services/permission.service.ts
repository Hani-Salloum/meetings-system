// import { Prisma } from "@prisma/client";
// import { FastifyInstance } from "fastify";

// export class PermissionService {
//   static getDefaultInclude() {
//     return {
//       include: {
//         permission_role: true,
//         permission_category: true,
//         UserType: true,
//         notification_permissions: {
//           include: {
//             notification_setting: true,
//           },
//         },
//       },
//     };
//   }

//   private fastify: FastifyInstance;

//   constructor(fastify: FastifyInstance) {
//     this.fastify = fastify;
//   }

//   async findAll(
//     {
//       filters,
//     }: {
//       filters?: {
//         permission_category_ids?: number | number[];
//         permission_role_ids?: number | number[];
//         action?: string;
//         code?: string;
//         name?: string;
//         ar_name?: string;
//         description?: string;
//         ar_description?: string;
//         ar_action?: string;
//       };
//     } = {
//       filters: {},
//     },
//   ) {
//     const {
//       permission_category_ids,
//       permission_role_ids,
//       action,
//       code,
//       name,
//       ar_name,
//       description,
//       ar_description,
//       ar_action,
//     } = filters || {};

//     const where: Prisma.PermissionWhereInput = {};

//     if (permission_category_ids !== undefined) {
//       where.permission_category_id = {
//         in: Array.isArray(permission_category_ids)
//           ? permission_category_ids
//           : [permission_category_ids],
//       };
//     }

//     if (permission_role_ids !== undefined) {
//       where.permission_role_id = {
//         in: Array.isArray(permission_role_ids) ? permission_role_ids : [permission_role_ids],
//       };
//     }

//     if (action) {
//       where.en_action = {
//         contains: action,
//       };
//     }

//     if (code) {
//       where.code = {
//         contains: code,
//       };
//     }

//     if (name) {
//       where.en_name = {
//         contains: name,
//       };
//     }

//     if (ar_name) {
//       where.ar_name = {
//         contains: ar_name,
//       };
//     }

//     if (description) {
//       where.en_description = {
//         contains: description,
//       };
//     }

//     if (ar_description) {
//       where.ar_description = {
//         contains: ar_description,
//       };
//     }

//     if (ar_action) {
//       where.ar_action = {
//         contains: ar_action,
//       };
//     }

//     const permissions = await this.fastify.prisma.permission.findMany({
//       where,
//       include: {
//         permission_role: true,
//         permission_category: {
//           include: {
//             notifications: true,
//           },
//         },
//         UserType: {
//           include: {
//             notifications: true,
//           },
//         },
//       },
//       orderBy: {
//         id: "asc",
//       },
//     });

//     return permissions;
//   }

//   async findById({ id }: { id: number }) {
//     const item = await this.fastify.prisma.permission.findUnique({
//       where: { id },
//       include: {
//         permission_role: true,
//         permission_category: {
//           include: {
//             notifications: true,
//           },
//         },
//         UserType: true,
//       },
//     });

//     if (!item) return null;

//     return item;
//   }

//   async getPermissionCategories() {
//     const categories = await this.fastify.prisma.permissionCategory.findMany({
//       orderBy: {
//         id: "asc",
//       },
//     });

//     return categories;
//   }

//   async getPermissionRoles() {
//     const roles = await this.fastify.prisma.permissionRole.findMany({
//       orderBy: {
//         id: "asc",
//       },
//     });

//     return roles;
//   }

//   async getPermissionRoleIds(
//     {
//       filters,
//     }: {
//       filters?: {
//         names?: string[];
//         not_names?: string[];
//       };
//     } = {
//       filters: {},
//     },
//   ) {
//     const { names, not_names } = filters || {};

//     const where: Prisma.PermissionRoleWhereInput = {};

//     if (names && names.length > 0) {
//       where.OR = [
//         {
//           en_name: {
//             in: names,
//           },
//         },
//         {
//           ar_name: {
//             in: names,
//           },
//         },
//       ];
//     }

//     if (not_names && not_names.length > 0) {
//       where.AND = [
//         {
//           en_name: {
//             notIn: not_names,
//           },
//         },
//         {
//           ar_name: {
//             notIn: not_names,
//           },
//         },
//       ];
//     }

//     const roles = await this.fastify.prisma.permissionRole.findMany({
//       where,
//       select: {
//         id: true,
//       },
//       orderBy: {
//         id: "asc",
//       },
//     });

//     return roles.map((role) => role.id);
//   }

//   async checkUserHasAdminPermissions({
//     userId,
//     notificationCode,
//   }: {
//     userId: number;
//     notificationCode?: string;
//   }) {
//     const adminRoleIds = await this.getPermissionRoleIds({
//       filters: {
//         names: ["admin"],
//       },
//     });

//     if (adminRoleIds.length === 0) {
//       return {
//         hasAdminPermissions: false,
//         hasNotificationPermission: false,
//       };
//     }

//     const userPermissions = await this.fastify.prisma.permission.findMany({
//       where: {
//         permission_role_id: {
//           in: adminRoleIds,
//         },
//         UserType: {
//           some: {
//             users: {
//               some: {
//                 id: userId,
//               },
//             },
//             notifications: {
//               some: {
//                 code: notificationCode,
//               },
//             },
//           },
//         },
//       },
//       select: {
//         id: true,
//         code: true,
//       },
//     });

//     const hasAdminPermissions = userPermissions.length > 0;

//     let hasNotificationPermission = false;
//     if (notificationCode && hasAdminPermissions) {
//       hasNotificationPermission = userPermissions.some(
//         (permission) => permission.code === notificationCode,
//       );
//     }

//     return {
//       hasAdminPermissions,
//       hasNotificationPermission,
//     };
//   }

//   async getAdminUsersWithNotificationPermission({
//     notificationCode,
//   }: {
//     notificationCode: string;
//   }): Promise<number[]> {
//     const adminRoleIds = await this.getPermissionRoleIds({
//       filters: { names: ["admin"] },
//     });

//     if (adminRoleIds.length === 0) return [];

//     // Find users with admin role and the notification permission
//     const users = await this.fastify.prisma.user.findMany({
//       where: {
//         user_types: {
//           some: {
//             permissions: {
//               some: {
//                 permission_role_id: {
//                   in: adminRoleIds, // todo: check if this over condition
//                 },
//               },
//             },
//             notifications: {
//               some: {
//                 code: notificationCode,
//               },
//             },
//           },
//         },
//       },
//       select: { id: true },
//     });

//     return users.map((u) => u.id);
//   }

//   async getAllCategoriesWithPermissionsAndNotifications() {
//     return this.fastify.prisma.permissionCategory.findMany({
//       orderBy: { id: "asc" },
//       include: {
//         permissions: {
//           include: {
//             permission_role: true,
//           },
//         },
//         notifications: true,
//       },
//     });
//   }
// }
