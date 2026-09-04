import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { InternshipService } from '../services/internshipService';
import { CertificateService } from '../services/certificateService';

const router = Router();

// Admin list with filters (search, domain, status, certificate state, pagination, sort)
router.get('/', authenticateToken, isAdmin, async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await InternshipService.list({
      search: (req.query.search as string) || undefined,
      domain: (req.query.domain as string) || undefined,
      status: (req.query.status as string) || undefined,
      certificate: (req.query.certificate as string) || undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sort: (req.query.sort as 'asc' | 'desc') || 'desc',
    });
    res.json(result);
  } catch (error) { next(error); }
});

// Admin create
router.post('/', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, email, ...data } = req.body;
    const internship = await InternshipService.create(data, { userId, email });
    res.status(201).json(internship);
  } catch (error) { next(error); }
});

// Student: own internships (must be declared before GET /:id)
router.get('/mine', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const internships = await InternshipService.listMine(req.user.id);
    res.json(internships);
  } catch (error) { next(error); }
});

// Admin-or-owner read
router.get('/:id', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const internship = await InternshipService.getById(req.params.id);
    if (req.user.role !== 'ADMIN' && internship.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    res.json(internship);
  } catch (error) { next(error); }
});

// Admin update
router.put('/:id', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internship = await InternshipService.update(req.params.id as string, req.body, { confirm: req.body.confirm });
    res.json(internship);
  } catch (error) { next(error); }
});

// Admin delete
router.delete('/:id', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await InternshipService.remove(req.params.id as string);
    res.json({ success: true });
  } catch (error) { next(error); }
});

// Admin: mark completed + certificate-eligible (never auto-issues a certificate)
router.post('/:id/complete', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internship = await InternshipService.complete(req.params.id as string);
    res.json({ success: true, internship });
  } catch (error) { next(error); }
});

// Admin: issue (or reuse) an internship certificate -> PENDING
router.post('/:id/certificate', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await CertificateService.generateInternshipCertificate(req.params.id as string);
    res.json(payload);
  } catch (error) { next(error); }
});

export default router;
