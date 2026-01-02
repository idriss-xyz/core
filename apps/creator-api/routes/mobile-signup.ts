import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { AppDataSource, MobileSignupEmail } from '@idriss-xyz/db';
import { sendSignupGuideEmail } from '../services/email.service';
import { tightCors } from '../config/cors';

const router = Router();

// Rate limit: 5 requests per IP per hour
const mobileSignupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  tightCors,
  mobileSignupLimiter,
  [body('email').isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { email } = req.body;
      const mobileSignupRepo = AppDataSource.getRepository(MobileSignupEmail);

      // Check if email already exists
      const existingSignup = await mobileSignupRepo.findOne({
        where: { email },
      });

      if (existingSignup) {
        // Email already registered, return success without creating duplicate
        res.status(200).json({
          message: 'Email registered successfully',
          alreadyRegistered: true,
        });
        return;
      }

      // Create new mobile signup email entry
      const mobileSignup = new MobileSignupEmail();
      mobileSignup.email = email;

      const savedSignup = await mobileSignupRepo.save(mobileSignup);

      // Send the signup guide email
      const emailSent = await sendSignupGuideEmail(email);

      if (emailSent) {
        await mobileSignupRepo.update(
          { id: savedSignup.id },
          { emailSent: true, emailSentAt: new Date() },
        );
      }

      res.status(201).json({
        message: 'Email registered successfully',
        alreadyRegistered: false,
      });
    } catch (error) {
      console.error('Error registering mobile signup email:', error);
      res.status(500).json({ error: 'Failed to register email' });
    }
  },
);

export default router;
