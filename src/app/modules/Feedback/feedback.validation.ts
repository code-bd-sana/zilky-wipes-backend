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



const createMarketResearch = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().email('Must be a valid email.').optional().or(z.literal('')),
    ageRange: z.string().optional(),
    gender: z.string().optional(),
    navigationEase: z.number({ message: 'Navigation ease is required.' }).min(1).max(10),
    informationFound: z.string({ message: 'Information found is required.' }),
    visualAppeal: z.number({ message: 'Visual appeal is required.' }).min(1).max(5),
    recommendLikelihood: z.number({ message: 'Recommend likelihood is required.' }).min(0).max(10),
    usefulSections: z.array(z.string()).optional(),
    improvementSuggest: z.string().optional(),
    issuesEncountered: z.string().optional(),
    overallRating: z.number({ message: 'Overall rating is required.' }).min(1).max(5),
    additionalComments: z.string().optional(),
    attachmentUrls: z.array(z.string().url()).optional(),
  }),
});

export const FeedbackValidation = {
  createGeneralFeedback,
  createMarketResearch,
};
