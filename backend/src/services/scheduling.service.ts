// import { Prisma, PrismaClient, ScheduledJob, ScheduledJobStatus } from "@prisma/client";

// import { scheduleJob } from "node-schedule";

// import { DefaultArgs } from "@prisma/client/runtime/library";
// import { endOfMinute, startOfMinute } from "date-fns";
// import { FastifyInstance } from "fastify";
// import { Job } from "node-schedule";
// import env from "src/config/env";

// export class SchedulingService {
//   private userAvailabilityJobs: Map<number, Job> = new Map();

//   constructor(private fastify: FastifyInstance) {}

//   async startSchedulers() {
//     await this.fastify.prisma.user.updateMany({
//       data: { available: false },
//     });

//     scheduleJob("checkJobs", env.SCHEDULER_CHECK_INTERVAL, async () => {
//       this.fastify.log.info("=".repeat(60));
//       await this.checkPendingJobs();
//       this.fastify.log.info("=".repeat(60));
//     });
//   }

//   private async checkPendingJobs() {
//     const now = new Date();

//     const startOfCurrentMinute = startOfMinute(now); // بداية الدقيقة (مثل 10:15:00.000)
//     const endOfCurrentMinute = endOfMinute(now); // نهاية الدقيقة (مثل 10:15:59.999)

//     this.fastify.log.info(
//       `Checking jobs within minute range:\n ${startOfCurrentMinute} to ${endOfCurrentMinute}\n interval set at ${env.SCHEDULER_CHECK_INTERVAL}`,
//     );

//     const pendingJobs = await this.fastify.prisma.scheduledJob.findMany({
//       where: {
//         date: {
//           gte: startOfCurrentMinute, // أكبر من أو يساوي بداية الدقيقة
//           lte: endOfCurrentMinute, // أقل من أو يساوي نهاية الدقيقة
//         },
//       },
//     });
//     for (const job of pendingJobs) {
//       try {
//         //  execute job depending on job_type

//         await this.fastify.prisma.scheduledJob.delete({
//           where: { id: job.id },
//         });
//       } catch (error) {
//         this.fastify.log.error(`Error processing job ${job.id}:`, error);
//         await this.logJobHistory({
//           job,
//           status: ScheduledJobStatus.FAILED,
//           failureReason: String(error),
//         });
//         await this.fastify.prisma.scheduledJob.delete({
//           where: { id: job.id },
//         });
//       }
//     }
//   }

//   private async logJobHistory({
//     job,
//     status,
//     failureReason,
//     variables,
//   }: {
//     job: ScheduledJob;
//     status: ScheduledJobStatus;
//     failureReason?: string;
//     variables?: Record<string, string | number | boolean | null | undefined>;
//   }) {
//     await this.fastify.prisma.scheduledJobHistory.create({
//       data: {
//         date: job.date,
//         job_type: job.job_type,
//         status,
//         failure_reason: failureReason,
//         variables,
//         unique_code: job.unique_code,
//       },
//     });
//   }

//   async cancelScheduledJob(props: {
//     job_type: string;
//     failureReason?: string;
//     transaction_prisma?: Omit<
//       PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//       "$extends" | "$transaction" | "$disconnect" | "$connect" | "$on" | "$use"
//     >;
//     unique_code: string;
//   }) {
//     if (!props.transaction_prisma) {
//       await this.fastify.prisma.$transaction([
//         this.fastify.prisma.scheduledJob.deleteMany({
//           where: { job_type: props.job_type },
//         }),

//         this.fastify.prisma.scheduledJobHistory.createMany({
//           data: {
//             date: new Date(),
//             job_type: props.job_type,
//             status: ScheduledJobStatus.CANCELLED,
//             failure_reason: props.failureReason,
//             unique_code: props.unique_code,
//           },
//         }),
//       ]);
//     } else {
//       // إذا تم تمرير معاملة، استخدامها مباشرة
//       await props.transaction_prisma.scheduledJob.deleteMany({
//         where: { job_type: props.job_type },
//       });
//       await props.transaction_prisma.scheduledJobHistory.createMany({
//         data: {
//           date: new Date(),
//           job_type: props.job_type,
//           status: ScheduledJobStatus.CANCELLED,
//           failure_reason: props.failureReason,
//           unique_code: props.unique_code,
//         },
//       });
//     }
//   }

//   async scheduleUserAvailabilityCheck(userId: number) {
//     //** التحقق من وجود جدولة نشطة لهذا المستخدم */
//     const existingJob = this.userAvailabilityJobs.get(userId);
//     if (existingJob) {
//       existingJob.cancel();
//       this.userAvailabilityJobs.delete(userId);
//     }

//     const checkTime = new Date(Date.now() + env.USER_AVAILABILITY_TIMEOUT_MINUTES * 60 * 1000);
//     const job = scheduleJob(checkTime, async () => {
//       try {
//         await this.fastify.prisma.user.update({
//           where: { id: userId },
//           data: { available: false },
//         });
//         this.userAvailabilityJobs.delete(userId);
//       } catch (error) {
//         this.fastify.log.error(`Failed to update availability for user ${userId}: ${error}`);
//       }
//     });

//     this.userAvailabilityJobs.set(userId, job);
//   }
// }
