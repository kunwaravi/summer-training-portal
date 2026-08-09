import { Router, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { validateBody } from '../middleware/validate';

const router = Router();

// GET /api/forum - Fetch all discussion forum threads
router.get('/', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { courseId, search, page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, parseInt(limit as string));
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};
    if (courseId) {
      whereClause.courseId = courseId;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [discussions, total] = await Promise.all([
      prisma.discussion.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                  role: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.discussion.count({ where: whereClause })
    ]);

    res.json({
      discussions,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    logger.error('Fetch forum threads error:', error);
    next(error);
  }
});

// GET /api/forum/:postId - Fetch a single discussion post with comments
router.get('/:postId', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { postId } = req.params;
    const postIdNum = parseInt(postId);

    if (isNaN(postIdNum)) {
      return res.status(400).json({ message: 'Invalid discussion post ID.' });
    }

    const discussion = await prisma.discussion.findUnique({
      where: { id: postIdNum },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion post not found.' });
    }

    res.json({
      discussion,
    });
  } catch (error: any) {
    logger.error('Fetch single thread error:', error);
    next(error);
  }
});

// POST /api/forum - Create a new discussion post
router.post(
  '/',
  authenticateToken,
  validateBody(['title', 'content']),
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { title, content, courseId } = req.body;
      const userId = req.user.id;

      // P2 (#69): only enrolled users (or admins) may post in a course forum.
      // A course-scoped post requires a VERIFIED payment for that course.
      if (courseId) {
        const isAdmin = req.user.role === 'ADMIN';
        const enrolled = await prisma.payment.findFirst({
          where: { userId, courseId, status: 'VERIFIED' }
        });
        if (!isAdmin && !enrolled) {
          return res.status(403).json({ message: 'You must be enrolled in this course to post in its forum.' });
        }
      }

      const newPost = await prisma.discussion.create({
        data: {
          title,
          content,
          userId,
          courseId: courseId || null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
            },
          },
          comments: true,
        },
      });

      logger.info(`User ${userId} created discussion post: "${title}"`);

      res.status(201).json(newPost);
    } catch (error: any) {
      logger.error('Create forum post error:', error);
      next(error);
    }
  }
);

// POST /api/forum/:postId/comment - Add a comment/reply to a discussion thread
router.post(
  '/:postId/comment',
  authenticateToken,
  validateBody(['content']),
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { postId } = req.params;
      const postIdNum = parseInt(postId);
      const { content } = req.body;
      const userId = req.user.id;

      if (isNaN(postIdNum)) {
        return res.status(400).json({ message: 'Invalid discussion post ID.' });
      }

      // Verify that discussion post exists
      const discussion = await prisma.discussion.findUnique({
        where: { id: postIdNum },
      });

      if (!discussion) {
        return res.status(404).json({ message: 'Discussion post not found.' });
      }

      const comment = await prisma.forumComment.create({
        data: {
          content,
          postId: postIdNum,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      });

      logger.info(`User ${userId} replied to discussion post ID ${postIdNum}`);

      res.status(201).json(comment);
    } catch (error: any) {
      logger.error('Create forum reply error:', error);
      next(error);
    }
  }
);

// ADMIN CRUD - DELETE /api/forum/:postId (Delete post)
router.delete('/:postId', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { postId } = req.params;
    const postIdNum = parseInt(postId);
    const userId = req.user.id;
    const userRole = req.user.role;

    if (isNaN(postIdNum)) {
      return res.status(400).json({ message: 'Invalid ID.' });
    }

    const post = await prisma.discussion.findUnique({
      where: { id: postIdNum },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Only Admin or the post creator can delete
    if (userRole !== 'ADMIN' && post.userId !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await prisma.discussion.delete({
      where: { id: postIdNum },
    });

    logger.info(`Discussion post ID ${postIdNum} successfully deleted.`);
    res.json({ message: 'Discussion post deleted successfully.' });
  } catch (error: any) {
    logger.error('Delete forum post error:', error);
    next(error);
  }
});

// DELETE /api/forum/comment/:commentId - Delete a comment/reply
router.delete('/comment/:commentId', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { commentId } = req.params;
    const commentIdNum = parseInt(commentId);
    const userId = req.user.id;
    const userRole = req.user.role;

    if (isNaN(commentIdNum)) {
      return res.status(400).json({ message: 'Invalid comment ID.' });
    }

    const comment = await prisma.forumComment.findUnique({
      where: { id: commentIdNum },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Only Admin or the comment creator can delete
    if (userRole !== 'ADMIN' && comment.userId !== userId) {
      return res.status(403).json({ message: 'Access denied: You are not authorized to delete this comment.' });
    }

    await prisma.forumComment.delete({
      where: { id: commentIdNum },
    });

    logger.info(`Forum comment ID ${commentIdNum} successfully deleted by user ${userId}.`);
    res.json({ success: true, message: 'Comment deleted successfully.' });
  } catch (error: any) {
    logger.error('Delete forum comment error:', error);
    next(error);
  }
});

export default router;
