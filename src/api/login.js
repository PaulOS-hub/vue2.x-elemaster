
import { post } from '../util/axios'
export const login = p => post('/login', p);