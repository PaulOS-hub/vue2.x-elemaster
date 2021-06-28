
import { get, post } from '../util/axios'
import axios from '../util/axios'
export const getSideBar = p => get('/menus', p);
export const getUserList = p => get("/users", p)
export const addUserList = p => post("/users", p)
export const changeState = p => axios.put(`users/${p.id}/state/${p.type}`)
export const getUserInfo = id => get(`users/${id}`)
export const changUserInfo = (id, p) => axios.put(`users/${id}`,p)
export const deleteUser = (id) => axios.delete(`users/${id}`)