import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	uploadFile,
	uploadFiles,
	deleteFile, 
	upload
} from './uploadFile.controller.js'

const router = express.Router()

router.route('/upload').post(upload.single('file'), uploadFile)

router.route('/upload-multiple').post(upload.array('files', 10), uploadFiles)

router.route('/:filename').delete(deleteFile)



export default router
