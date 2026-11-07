// import { Prisma, PrismaClient } from "@prisma/client";
// import { DefaultArgs } from "@prisma/client/runtime/library";
// import { FastifyInstance, FastifyPluginAsync } from "fastify";
// import Firebase from "firebase-admin";
// import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
// import { notifications, notificationsType, Variables } from "src/constants/notifications";

// function replaceVariables(message: string, variables?: Record<string, string | number>): string {
//   if (!variables) return message;
//   let result = message;
//   for (const [key, value] of Object.entries(variables)) {
//     result = result.replace(`{{${key}}}`, value.toString());
//   }
//   return result;
// }

// type tx = Omit<
//   PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//   "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
// >;

// // تعريف الـ plugin
// const notificationsPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
//   // دالة إرسال الإشعارات
//   fastify.decorate(
//     "sendNotification",
//     async <T extends keyof notificationsType>({
//       userId,
//       notification,
//       variables,
//       customMessage,
//       tx,
//     }: {
//       userId: number | string | number[];
//       notification: T;
//       variables?: Variables<T>;
//       customMessage?: { ar?: string; en?: string };
//       tx?: tx;
//     }) => {
//       const prisma = tx || fastify.prisma;
//       const users = [];

//       const notificationData = notifications[notification];
//       if (userId === "admin") {
//         const ids = (
//           await prisma.user.findMany({
//             where: {
//               user_types: {
//                 some: {
//                   notifications: { some: { code: notificationData.code } },
//                 },
//               },
//             },
//             select: { id: true },
//           })
//         ).map((user) => user.id);

//         const admins = await prisma.user.findMany({
//           where: { id: { in: ids } },
//           select: { language: true, id: true, devices: { select: { fcmTokens: true } } },
//         });

//         users.push(
//           ...admins.map((admin) => ({
//             id: admin.id,
//             language: String(admin.language),
//             devices: admin.devices
//               .filter((d) => d.fcmTokens !== null)
//               .map((d) => ({ fcmTokens: d.fcmTokens as string })),
//           })),
//         );
//       }

//       if (Array.isArray(userId)) {
//         const fetchedUsers = await prisma.user.findMany({
//           where: { id: { in: userId } },
//           select: { language: true, id: true, devices: { select: { fcmTokens: true } } },
//         });
//         users.push(
//           ...fetchedUsers.map((user) => ({
//             id: user.id,
//             language: String(user.language),
//             devices: user.devices
//               .filter((d) => d.fcmTokens !== null)
//               .map((d) => ({ fcmTokens: d.fcmTokens as string })),
//           })),
//         );
//       } else {
//         const user = await prisma.user.findUnique({
//           where: { id: Number(userId) },
//           select: { language: true, id: true, devices: { select: { fcmTokens: true } } },
//         });
//         if (user) {
//           users.push({
//             ...user,
//             devices: user.devices.filter((d) => d.fcmTokens !== null) as { fcmTokens: string }[],
//           });
//         }
//       }

//       if (users.length < 1) {
//         return;
//       }

//       // استبدال المتغيرات في الرسائل أو استخدام الرسالة المخصصة
//       const messageWithVariables = {
//         ar:
//           customMessage?.ar ||
//           (notificationData.message.ar
//             ? replaceVariables(notificationData.message.ar, variables)
//             : undefined),
//         en:
//           customMessage?.en ||
//           (notificationData.message.en
//             ? replaceVariables(notificationData.message.en, variables)
//             : undefined),
//       };

//       // تخزين الإشعار في قاعدة البيانات
//       await prisma.notification.createMany({
//         data: users.map((user) => ({
//           user_id: user.id,
//           code: notificationData.code,
//           ar_message: messageWithVariables.ar,
//           en_message: messageWithVariables.en,
//           variables: variables ? variables : undefined,
//         })),
//       });

//       const tokens = users.flatMap((user) =>
//         user.devices.map((device) => device.fcmTokens).filter((item) => item !== null),
//       );
//       if (!tokens.length) {
//         fastify.log.error(
//           `User ${userId} has no devices tokens to send notification ${notificationData.code}`,
//         );
//         return;
//       }
//       // إرسال الإشعار عبر FCM
//       try {
//         const en_message: MulticastMessage = {
//           notification: {
//             title: messageWithVariables.en || "New Notification",
//             body: messageWithVariables.en || "You have a new message!",
//           },
//           data: {
//             code: notificationData.code,
//             ar_message: messageWithVariables.ar || "",
//             en_message: messageWithVariables.en || "",
//             ...(variables
//               ? Object.fromEntries(
//                   Object.entries(variables).map(([key, value]) => [key, value.toString()]),
//                 )
//               : {}),
//           },
//           tokens,
//         };
//         const ar_message: MulticastMessage = {
//           notification: {
//             title: messageWithVariables.ar || "اشعار جديد",
//             body: messageWithVariables.ar || "لديك اشعار جديدة غير مقروء",
//           },
//           data: {
//             code: notificationData.code,
//             ar_message: messageWithVariables.ar || "",
//             en_message: messageWithVariables.en || "",
//             ...(variables
//               ? Object.fromEntries(
//                   Object.entries(variables).map(([key, value]) => [key, value.toString()]),
//                 )
//               : {}),
//           },
//           tokens,
//         };

//         await Promise.all(
//           users.map(async (user) => {
//             if (user.language === "AR") {
//               await Firebase.messaging().sendEachForMulticast({
//                 ...ar_message,
//                 tokens: user.devices.map((d) => d.fcmTokens),
//               });
//             } else {
//               await Firebase.messaging().sendEachForMulticast({
//                 ...en_message,
//                 tokens: user.devices.map((d) => d.fcmTokens),
//               });
//             }
//             fastify.log.info(`FCM notification sent to user ${user.id}: ${notificationData.code}`);
//           }),
//         );
//       } catch (error: unknown) {
//         fastify.log.error(error);
//       }
//     },
//   );
// };

// // تصدير الـ plugin مع تعريف الديكوريتر
// export default notificationsPlugin;

// declare module "fastify" {
//   interface FastifyInstance {
//     sendNotification<T extends keyof notificationsType>(params: {
//       userId: number;
//       notification: T;
//       variables?: Variables<T>;
//       customMessage?: { ar?: string; en?: string };
//       tx?: tx;
//     }): Promise<void>;
//   }
// }
