// emailPlugin.ts
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// Declare the decorated property for TypeScript
declare module "fastify" {
  interface FastifyInstance {
    sendEmails: (
      emails: string[],
      subject: string,
      message: string,
      attachments?: Mail.Attachment[],
    ) => Promise<boolean>;
  }
}

const emailPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: "zmamznan66@gmail.com",
      pass: "plqi amug sedn jkix", // You should add this and use environment variables
    },
  });

  const sendEmails = async ({
    emails,
    subject,
    message,
    attachments = [],
  }: {
    emails: string[];
    subject: string;
    message: string;
    attachments?: Mail.Attachment[];
  }): Promise<boolean> => {
    try {
      const mailOptions = {
        from: "info@fastify-template.com.sa",
        to: emails,
        subject: subject,
        html: message,
        attachDataUrls: true,
        ...(attachments && attachments.length > 0 && { attachments: attachments }),
      };

      await transporter.sendMail(mailOptions);
      fastify.log.info(`Email sent successfully to ${emails}`);
      return true;
    } catch (err) {
      fastify.log.error(err);
      throw new Error("Failed to send email");
    }
  };

  fastify.decorate(
    "sendEmails",
    function (
      this: FastifyInstance,
      emails: string[],
      subject: string,
      message: string,
      attachments?: Mail.Attachment[],
    ) {
      return sendEmails({ emails, subject, message, attachments });
    },
  );
};

export default emailPlugin;
