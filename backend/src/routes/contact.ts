import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// Default fallback settings in case database settings are missing
const DEFAULT_SETTINGS: Record<string, string> = {
  COMPANY_NAME: 'EduNexus Pro',
  WEBSITE_URL: 'https://edunexus.kibm.in',
  CONTACT_EMAIL: 'edunexuspro@gmail.com',
  CONTACT_PHONE: '+91 99999 99999',
  CONTACT_HOURS: 'Monday to Saturday | 10:00 AM – 6:00 PM (IST)'
};

// GET /api/contact/settings - Fetch contact settings (Public)
router.get('/settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settingsList = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = { ...DEFAULT_SETTINGS };

    for (const setting of settingsList) {
      settingsMap[setting.key] = setting.value;
    }

    res.json(settingsMap);
  } catch (error) {
    next(error);
  }
});

// POST /api/contact - Submit a contact message (Public)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required fields.' });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message
      }
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    next(error);
  }
});

// GET /api/contact/messages - List all messages (Admin Only)
router.get('/messages', authenticateToken, isAdmin, async (req: any, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/contact/messages/:id - Delete a message (Admin Only)
router.delete('/messages/:id', authenticateToken, isAdmin, async (req: any, res: Response, next: NextFunction) => {
  try {
    const messageId = parseInt(req.params.id as string);

    if (isNaN(messageId)) {
      return res.status(400).json({ message: 'Invalid message ID.' });
    }

    await prisma.contactMessage.delete({
      where: { id: messageId }
    });

    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/contact/settings - Update contact details (Admin Only)
router.put('/settings', authenticateToken, isAdmin, async (req: any, res: Response, next: NextFunction) => {
  try {
    const settings = req.body; // Key-value object (e.g. { CONTACT_PHONE: "+91..." })

    if (typeof settings !== 'object' || settings === null) {
      return res.status(400).json({ message: 'Invalid payload format. Expected settings object.' });
    }

    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await Promise.all(updatePromises);

    res.json({ success: true, message: 'System settings updated successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
