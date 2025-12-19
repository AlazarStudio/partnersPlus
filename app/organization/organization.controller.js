import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import axios from 'axios'
import { response } from 'express'


// @desc    Get _emptys
// @route   GET /api/organizations
// @access  Public
export const getOrganizations = asyncHandler(async (req, res) => {
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
	const organization = await prisma.organization.findUnique({
		include: {
			TypeOrganization: {
				select: {
					name: true
				}
			}
		},
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
	const organizationsList = req.body

	const organizations = []

	for (let org of organizationsList) {
		// if ("avatar" in org) {
		// 	const orgWithAvatar = org
		// 	const response = await axios.post("http://localhost:5000/api/uploadFile/upload", org["avatar"], {
		// 		headers: {
		// 			'Content-type': 'multipart/form-data'
		// 		}
		// 	})

		// 	Object.assign(orgWithAvatar, { "avatar": response["data"]["file"]["url"] } )

		// 	organizations.push(await prisma.organization.create({
		// 		data: org
		// 	}))
		// }
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
	const { name, subtitle, link, linkName, condition, attachments, avatar, typeOrganizationId, order } = req.body

	try {
		const organization = await prisma.organization.update({
			where: {
				id: +req.params.id
			},
			data: {
				name,
				subtitle, 
				link, 
				linkName,
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
