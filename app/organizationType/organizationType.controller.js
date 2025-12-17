import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


// @desc    Get _emptys
// @route   GET /api/_emptys
// @access  Private
export const getOrganizationTypes = asyncHandler(async (req, res) => {
	const organizationTypes = await prisma.typeOrganization.findMany({
		include: {
			organizations: true
		},
		orderBy: {
			order: 'desc'
		}
	})
	res.json(organizationTypes)
})


// @desc    Get _empty
// @route   GET /api/_emptys/:id
// @access  Private
export const getOrganizationType = asyncHandler(async (req, res) => {
	const organizationType = await prisma.typeOrganization.findUnique({
		include: {
			organizations: true
		},
		where: { id: +req.params.id }
	})

	if (!organizationType) {
		res.status(404)
		throw new Error('organizationType not found!')
	}

	res.json({ ...organizationType })
})


// @desc    Create new _empty
// @route 	POST /api/_emptys
// @access  Private
export const createNewOrganizationType = asyncHandler(async (req, res) => {
	const { name } = req.body

	const organizationType = await prisma.typeOrganization.create({
		data: {
			name
		}
	})

	res.json(organizationType)
})


// @desc    Update _empty
// @route 	PUT /api/_emptys/:id
// @access  Private
export const updateOrganizationType = asyncHandler(async (req, res) => {
	const { name } = req.body

	try {
		const organizationType = await prisma.typeOrganization.update({
			where: {
				id: +req.params.id
			},
			data: {
				
			}
		})

		res.json(organizationType)
	} catch (error) {
		res.status(404)
		throw new Error('organizationType not found!')
	}
})


// @desc    Delete _empty
// @route 	DELETE /api/_emptys/:id
// @access  Private
export const deleteOrganizationType = asyncHandler(async (req, res) => {
	try {
		const organizationType = await prisma.typeOrganization.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'organizationType deleted!' })
	} catch (error) {
		res.status(404)
		throw new Error('organizationType not found!')
	}
})
