import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewOrganizationType,
	deleteOrganizationType,
	getOrganizationType,
	getOrganizationTypes,
	updateOrganizationType
} from './organizationType.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewOrganizationType).get(getOrganizationTypes)

router
	.route('/:id')
	.get(getOrganizationType)
	.put(protect, updateOrganizationType)
	.delete(protect, deleteOrganizationType)

export default router
