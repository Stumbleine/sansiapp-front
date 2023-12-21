import { createSlice } from '@reduxjs/toolkit';
import API from '../Utils/conection';
import { convertToB64 } from '../Utils/Helper';
/**
 * Slice para la gestion de usuarios
 * @module usersSlice
 */
/**
 * Valores iniciales del slice
 * @constant initialState
 */
const initialState = {
	users: null,
	isLoading: false,
	filterLoading: false,
	fetchFailed: false,
	page: 0,
	total: 0,
};
/**
 * Creacion y configuracion del Slice, reducers
 * @constant usersSlice
 */
const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUsers: (state, { payload }) => {
			state.users = payload.users;
			state.total = payload.total;
			state.isLoading = false;
			state.filterLoading = false;
			state.fetchFailed = false;
		},
		setLoading: state => {
			state.isLoading = true;
			state.fetchFailed = false;
		},
		setFilterLoading: state => {
			state.filterLoading = true;
			state.fetchFailed = false;
		},
		setFetchFailed: state => {
			state.fetchFailed = true;
			state.filterLoading = false;
			state.isLoading = false;
		},
		setPage: (state, { payload }) => {
			state.page = payload;
		},
	},
});
/**
 * Endpoint, realiza la peticion para listar usuarios
 * @function {async} usersAsync
 * @param {String} token access_token del usuario
 * @property {Function} dispatch funcion que ejecuta funciones del reducer de complaintSlice
 */
export const usersAsync =
	(token, page = 0, search = 'All', rol = 'All', sesion = 'All') =>
	async dispatch => {
		search = search === '' ? 'All' : search;
		dispatch(setLoading());
		try {
			const r = await API.get(
				`/user/list?pag=${page}&search=${search}&rol=${rol}&sesion=${sesion}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			dispatch(setUsers(r.data));
			// console.log('usersData->r:', r.data);
		} catch (e) {
			dispatch(setFetchFailed());
			throw new Error(e);
		}
	};
// /**
//  * Endpoint, realiza la peticion para listar usuarios
//  * @function {async} filterUsersAsync
//  * @param {String} token access_token del usuario
//  * @param {String} search
//  * @param {String} rol
//  * @param {String} sesion
//  * @property {Function} dispatch funcion que ejecuta funciones del reducer de complaintSlice
//  */
// export const filterUsersAsync =
// 	(token, search = 'All', rol, sesion) =>
// 	async dispatch => {
// 		search = search === '' ? 'All' : search;

// 		dispatch(setFilterLoading());
// 		try {
// 			const r = await API.get(`/user/list?search=${search}&rol=${rol}&sesion=${sesion}`, {
// 				headers: { Authorization: `Bearer ${token}` },
// 			});
// 			dispatch(setUsers(r.data));
// 			// console.log('usersData->r:', r.data);
// 		} catch (e) {
// 			dispatch(setFetchFailed());
// 			throw new Error(e);
// 		}
// 	};
/**
 * Endpoint, realiza la peticion para editar informacion de un usuario
 * @function {async} updateUserAsync
 * @param {String} token access_token del usuario
 * @param {Object} values
 * @property {Function} dispatch funcion que ejecuta funciones del reducer de complaintSlice
 */
export const updateUserAsync = (token, values, imageFile) => async dispatch => {
	const b64 = imageFile ? await convertToB64(imageFile) : null;
	if (b64 !== null) {
		values = { ...values, picture: b64 };
	}
	try {
		await API.post(`user/update?id=${values.id}`, values, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(usersAsync(token));
	} catch (e) {
		throw new Error(e);
	}
};
/**
 * Endpoint, realiza la peticion para dar de baja de un usuario
 * @function {async} deleteUserAsync
 * @param {String} token access_token del usuario
 * @param {Number} id identificador de usuario
 * @property {Function} dispatch funcion que ejecuta funciones del reducer de complaintSlice
 */
export const deleteUserAsync = (token, id) => async dispatch => {
	try {
		await API.delete(`user/delete?id=${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(usersAsync(token, 0));
	} catch (e) {
		throw new Error(e);
	}
};
/**
 * Endpoint, realiza la peticion para crear un usuario
 * @function {async} createUserAsync
 * @param {String} token access_token del usuario
 * @param {Object} values datos del usuario
 * @param {File} imageFile
 * @property {Function} dispatch funcion que ejecuta funciones del reducer de complaintSlice
 */
export const createUserAsync = (token, values, imageFile) => async dispatch => {
	const b64 = imageFile ? await convertToB64(imageFile) : null;
	if (b64 !== null) {
		values = { ...values, picture: b64 };
	}
	try {
		await API.post(`user/create`, values, {
			headers: { Authorization: `Bearer ${token}` },
		});
		dispatch(usersAsync(token));
	} catch (e) {
		throw new Error(e);
	}
};

export const { setUsers, setLoading, setFetchFailed, setFilterLoading, setPage } =
	usersSlice.actions;
export default usersSlice.reducer;
