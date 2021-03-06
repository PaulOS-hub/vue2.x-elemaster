import axios, { get, post } from '../util/axios'
export const getRightList = p => get(`/rights/${p}`)
export const getRoleList = () => get(`/roles`)
export const deleteRole = p => axios.delete(`roles/${p.roleId}/rights/${p.rightId}`)
export const updateRole = (id, p) => post(`roles/${id}/rights`, p)
export const updateUserRole = (id, p) => axios.put(`users/${id}/role`,  p )
export const deleteRoleById = id=>axios.delete(`roles/${id}`)