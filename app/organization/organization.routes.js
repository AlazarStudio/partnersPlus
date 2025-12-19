import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewOrganization,
	deleteOrganization,
	getOrganization,
	getOrganizations,
	updateOrganization
} from './organization.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewOrganization).get(getOrganizations)

router
	.route('/:id')
	.get(getOrganization)
	.put(protect, updateOrganization)
	.delete(protect, deleteOrganization)



export default router
