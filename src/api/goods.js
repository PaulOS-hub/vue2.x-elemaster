import axios, { get, post } from '../util/axios'
export const getcategories = p => get("/categories", p)
export const addcategories = p => post("/categories", p)
export const delteCat = id => axios.delete(`categories/${id}`)