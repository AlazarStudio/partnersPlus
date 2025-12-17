import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


// @desc    Get _emptys
// @route   GET /api/organizations
// @access  Public
export const getOrganizations = asyncHandler(async (req, res) => {
	console.log(req.params)
	const organizations = await prisma.organization.findMany({
		orderBy: {
			order: 'desc'
		}
	})
	res.json(organizations)
})



// @desc    Get _empty
// @route   GET /api/organizations/:id
// @access  Public
export const getOrganization = asyncHandler(async (req, res) => {
	console.log(req.params.id)
	const organization = await prisma.organization.findUnique({
		where: { id: +req.params.id }
	})

	if (!organization) {
		res.status(404)
		throw new Error('organization not found!')
	}

	res.json({ ...organization })
})



// @desc    Create new organization
// @route 	POST /api/organizations
// @access  Private
export const createNewOrganization = asyncHandler(async (req, res) => {
	// const { name, subtitle, link, condition, attachments, avatar, typeOrganizationId, order } = req.body

	// const organization = await prisma.organization.create({
	// 	data: {
	// 		name,
	// 		subtitle, 
	// 		link, 
	// 		condition, 
	// 		attachments, 
	// 		avatar, 
	// 		typeOrganizationId, 
	// 		order
	// 	}
	// })

	// res.json(organization)

	const organizationsList = req.body

	const organizations = []

	for (let org of organizationsList) {
		organizations.push(await prisma.organization.create({
			data: org
		}))
	}
	

	 res.json(organizations)
})


// @desc    Update organization
// @route 	PUT /api/organizations/:id
// @access  Private
export const updateOrganization = asyncHandler(async (req, res) => {
	const { name, subtitle, link, condition, attachments, avatar, typeOrganizationId, order } = req.body

	try {
		const organization = await prisma.organization.update({
			where: {
				id: +req.params.id
			},
			data: {
				name,
				subtitle, 
				link, 
				condition, 
				attachments, 
				avatar, 
				typeOrganizationId, 
				order
		}
		})

		res.json(organization)
	} catch (error) {
		res.status(404)
		throw new Error('organization not found!')
	}
})


// @desc    Delete organization
// @route 	DELETE /api/organization/:id
// @access  Private
export const deleteOrganization = asyncHandler(async (req, res) => {
	try {
		const organization = await prisma.organization.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'organization deleted!' })
	} catch (error) {
		res.status(404)
		throw new Error('organization not found!')
	}
})
