import asyncHandler from 'express-async-handler'
import multer from "multer"
import path from "path"
import fs from "fs"
import sharp from "sharp"
import { fileURLToPath } from 'url'

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем пути к директориям
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const FILES_DIR = path.join(UPLOADS_DIR, 'files');

// Создаем папки, если их нет
[UPLOADS_DIR, IMAGES_DIR, FILES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Определяем папку назначения в зависимости от типа файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, IMAGES_DIR);
    } else {
      cb(null, FILES_DIR);
    }
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    // Используем оригинальное имя без пробелов и специальных символов
    const originalName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const nameWithoutExt = path.basename(originalName, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// Фильтр для проверки типов файлов
const fileFilter = (req, file, cb) => {
  // Разрешенные типы файлов
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'];
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/rtf',
    'text/plain',
    'text/csv'
  ];

  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Неподдерживаемый тип файла: ${file.mimetype}`), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB максимум
  }
});

// Функция для конвертации изображений в WebP
async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .webp({ quality: quality })
      .toFile(outputPath);
    
    // Удаляем оригинальный файл
    fs.unlinkSync(inputPath);
    
    return true;
  } catch (error) {
    console.error('Ошибка при конвертации:', error);
    return false;
  }
}

// Маршрут для загрузки файла /upload
export const uploadFile = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const file = req.file;
    const result = {
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    };

    // Если это изображение - конвертируем в WebP
    if (file.mimetype.startsWith('image/')) {
      const originalPath = file.path;
      const webpPath = path.join(
        path.dirname(originalPath),
        path.basename(originalPath, path.extname(originalPath)) + '.webp'
      );

      const converted = await convertToWebP(originalPath, webpPath);
      
      if (converted) {
        result.filename = path.basename(webpPath);
        result.path = webpPath;
        result.mimetype = 'image/webp';
        result.convertedToWebP = true;
      }
    }

    // Формируем URL для доступа к файлу
    // Нужно определить относительный путь от uploads директории
    const relativePath = path.relative(UPLOADS_DIR, result.path);
    result.url = `/uploads/${relativePath.replace(/\\/g, '/')}`;

    res.json({
      success: true,
      message: 'Файл успешно загружен',
      file: result
    });

  } catch (error) {
    console.error('Ошибка загрузки:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при загрузке файла' 
    });
  }
})

// Маршрут для множественной загрузки файлов  /upload-multiple
export const uploadFiles = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Файлы не загружены' });
    }

    const results = [];

    for (const file of req.files) {
      const fileResult = {
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      };

      // Конвертируем изображения в WebP
      if (file.mimetype.startsWith('image/')) {
        const originalPath = file.path;
        const webpPath = path.join(
          path.dirname(originalPath),
          path.basename(originalPath, path.extname(originalPath)) + '.webp'
        );

        const converted = await convertToWebP(originalPath, webpPath);
        
        if (converted) {
          fileResult.filename = path.basename(webpPath);
          fileResult.path = webpPath;
          fileResult.mimetype = 'image/webp';
          fileResult.convertedToWebP = true;
        }
      }

      // Формируем URL
      const relativePath = path.relative(UPLOADS_DIR, fileResult.path);
      fileResult.url = `/uploads/${relativePath.replace(/\\/g, '/')}`;
      results.push(fileResult);
    }

    res.json({
      success: true,
      message: 'Файлы успешно загружены',
      files: results,
      count: results.length
    });

  } catch (error) {
    console.error('Ошибка загрузки:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при загрузке файлов' 
    });
  }
})

// Маршрут для удаления файла
export const deleteFile = asyncHandler(async (req, res) => {
  try {
    const filename = req.params.filename;
    const possiblePaths = [
      path.join(UPLOADS_DIR, filename),
      path.join(IMAGES_DIR, filename),
      path.join(FILES_DIR, filename)
    ];
    
    let deleted = false;
    let deletedPath = '';
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted = true;
        deletedPath = filePath;
        break;
      }
    }
    
    if (deleted) {
      // Также удаляем webp версию, если она существует
      const dir = path.dirname(deletedPath);
      const baseName = path.basename(deletedPath, path.extname(deletedPath));
      const webpPath = path.join(dir, baseName + '.webp');
      
      if (fs.existsSync(webpPath)) {
        fs.unlinkSync(webpPath);
      }
      
      res.json({ 
        success: true, 
        message: 'Файл успешно удален' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Файл не найден' 
      });
    }
  } catch (error) {
    console.error('Ошибка удаления:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при удалении файла' 
    });
  }
})



