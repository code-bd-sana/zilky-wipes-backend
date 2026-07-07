import { z } from 'zod';

const createGeneralFeedback = z.object({
  body: z.object({
    firstName: z.string({ message: 'First name is required.' }),
    lastName: z.string({ message: 'Last name is required.' }),
    email: z
      .string({ message: 'Email is required.' })
      .email('Must be a valid email.'),
    feedbackType: z.enum(['website', 'product', 'subscription', 'design', 'other'], {
      message: 'Feedback type is required.',
    }),
    experienceOverall: z.enum(['excellent', 'good', 'okay', 'needs-improvement'], {
      message: 'Experience rating is required.',
    }),
    message: z.string({ message: 'Message is required.' }),
    contactConsent: z.boolean().optional(),
    attachmentUrls: z.array(z.string().url()).optional(),
  }),
});

export const FeedbackValidation = {
  createGeneralFeedback,
};
