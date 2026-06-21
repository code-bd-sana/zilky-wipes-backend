import { Router } from 'express';
import { upload } from '../../utils/fileUpload';
import auth from '../../middlewares/auth';
import sendResponse from '../../utils/sendResponse';

const router = Router();

router.post('/:pageName', auth('ADMIN'), upload.array('files', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const fileUrls = files.map(file => {
    const normalizedPath = file.path.replace(/\\/g, '/');
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${normalizedPath}`;
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Files uploaded successfully',
    data: fileUrls
  });
  return;
});

export const UploadRoutes = router;
