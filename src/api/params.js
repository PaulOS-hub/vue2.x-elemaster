import axios, { get, post } from '../util/axios'
export const getParamsList = (id, p) => get(`categories/${id}/attributes`, p)
export const addParams = (id, p) => post(`categories/${id}/attributes`, p)
export const deleteParam = (id, pid) => axios.delete(`categories/${id}/attributes/${pid}`)
export const editParam = (id, pid, p) => axios.put(`categories/${id}/attributes/${pid}`, p)
// goods
export const getgoodsList = p => get("goods", p)
export const delgoosdList = id => axios.delete(`goods/${id}`)
export const getAttributesList = (id, p) => get(`categories/${id}/attributes`, p)

export const addFormGoods = p => post('goods', p)