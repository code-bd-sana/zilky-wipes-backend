import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { pageName } = req.params;

    let dest = `uploads/crm/${pageName || 'common'}`;
    if (pageName === 'products' || pageName === 'users') {
      dest = `uploads/${pageName}`;
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

export const getFileUrl = (req: any, filePath: string): string => {
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\//, '');
  const customUrl = process.env.BACKEND_URL || process.env.SERVER_URL || process.env.BASE_URL;
  if (customUrl) {
    return `${customUrl.replace(/\/$/, '')}/${normalizedPath}`;
  }
  const protocol = (req.headers && req.headers['x-forwarded-proto']) || req.protocol || 'http';
  const host = (req.get && req.get('host')) || 'localhost:5000';
  return `${protocol}://${host}/${normalizedPath}`;
};
