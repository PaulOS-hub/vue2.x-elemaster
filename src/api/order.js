import axios, { get, post } from '../util/axios'
export const getOrderList = p => get("orders", p)
export const getwuliuMessage = id => get(`/kuaidi/${id}`)
export const getReports = () => get('reports/type/1')