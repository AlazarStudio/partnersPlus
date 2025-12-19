import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

import { errorHandler, notFound } from './app/middleware/error.middleware.js'
import { prisma } from './app/prisma.js'

import authRoutes from './app/auth/auth.routes.js'
import userRoutes from './app/user/user.routes.js'
import organizationRoutes from './app/organization/organization.routes.js'
import organizationTypesRoutes from './app/organizationType/organizationType.routes.js'
import uploadFileRoutes from './app/uploadFile/uploadFile.routes.js'

import cors from 'cors'
import fs from "fs"
import multer from "multer"
import https from "https"

dotenv.config()

const app = express()

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Папки для хранения файлов
const UPLOADS_DIR = 'uploads';
const IMAGES_DIR = path.join(__dirname, 'uploads', 'images');
const FILES_DIR = path.join(__dirname, 'uploads', 'files');

// Создаем папки, если их нет
[UPLOADS_DIR, IMAGES_DIR, FILES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use(cors())

// Middleware для статических файлов должен быть после определения пути
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	// Маршруты
	app.use('/api/auth', authRoutes)
	app.use('/api/users', userRoutes)
	app.use('/api/organizations', organizationRoutes)
	app.use('/api/organizationTypes', organizationTypesRoutes)
	
	// Здесь была ошибка - не хватало косой черты в начале
	app.use('/api/uploadFile', uploadFileRoutes)
	
	// Middleware для обработки ошибок multer
	app.use((err, req, res, next) => {
	  if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
		  return res.status(400).json({ 
			error: 'Файл слишком большой. Максимальный размер: 50MB' 
		  });
		}
		if (err.code === 'LIMIT_FILE_COUNT') {
		  return res.status(400).json({ 
			error: 'Слишком много файлов. Максимум: 10' 
		  });
		}
		return res.status(400).json({ error: err.message });
	  }
	  
	  if (err) {
		return res.status(400).json({ error: err.message });
	  }
	  
	  next()
	})
	
	app.use(notFound)
	app.use(errorHandler)
	
// 	const PORT = process.env.PORT || 443

// 	const sslOptions = {
//     key: fs.readFileSync(
//       '../../../etc/letsencrypt/live/backend.tppkchr.ru/privkey.pem'
//     ),
//     cert: fs.readFileSync(
//       '../../../etc/letsencrypt/live/backend.tppkchr.ru/fullchain.pem'
//     )
//   }

//   https.createServer(sslOptions, app).listen(PORT, () => {
//     console.log(`HTTPS server running on port ${PORT}`)
//   })

	const PORT = process.env.PORT || 5000


	app.listen(
		PORT,
		console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})