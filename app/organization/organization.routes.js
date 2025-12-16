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

router.route('/').post(createNewOrganization).get(getOrganizations)

router
	.route('/:id')
	.get(getOrganization)
	.put(updateOrganization)
	.delete(deleteOrganization)



export default router
