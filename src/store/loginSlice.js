import { createSlice } from '@reduxjs/toolkit';
import { getUserAsync } from './userSlice';
import API from '../Utils/conection';
/**
 * Slice para las funciones de autenticacion, login, register, forgotPassword
 * @module loginSlice
 */
/**
 * Valores iniciales del slice
 * @constant initialState
 */
const initialState = {
	isAuth: false,
	isLoading: false,
	isAuthFailed: false,
	accessToken: null,
	registerSuccess: false,
	registerFailed: false,
};
/**
 * Creacion y configuracion del Slice, reducers
 * @constant complaintSlice
 */
const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setAuth: state => {
			state.isAuth = true;
			state.isLoading = false;
			state.isAuthFailed = false;
		},
		setLoading: state => {
			state.isLoading = true;
		},
		setAuthFailed: state => {
			state.isAuth = false;
			state.isLoading = false;
			state.isAuthFailed = true;
		},
		setToken: (state, { payload }) => {
			state.accessToken = payload;
		},
		setLogout: state => {
			state.accessToken = null;
			state.isAuth = false;
		},
		setRegister: state => {
			state.registerSuccess = true;
			state.registerFailed = false;
			state.isLoading = false;
		},
		setRegisterFailed: state => {
			state.registerSuccess = false;
			state.registerFailed = true;
			state.isLoading = false;
		},
	},
});
/**
 * Endpoint, realiza la peticion para iniciar sesion en el sistema
 * @function {async} loginAsync
 * @param {Object} user email y contraseña
 * @property {Function} dispatch funcion que ejecuta funciones del reducer
 */
export const loginAsync = user => async dispatch => {
	dispatch(setLoading());
	try {
		const r = await API.post('auth/login', user);
		dispatch(setToken(r.data.token));
		await dispatch(getUserAsync(r.data.token));
		dispatch(setAuth());
	} catch (e) {
		dispatch(setAuthFailed(true));
		throw new Error(e);
	}
};
/**
 * Endpoint, realiza la peticion para iniciar sesion mediante el uso de una cuenta Google
 * @function {async} loginGoogleAsync
 * @param {Object} user data de google
 * @property {Function} dispatch funcion que ejecuta funciones del reducer
 */
export const loginGoogleAsync = user => async dispatch => {
	const data = {
		username: user.email,
		email: user.email,
		picture: user.imageUrl,
		nombres: user.givenName,
		apellidos: user.familyName,
	};
	try {
		const r = await API.post('auth/auth-google', data);
		// console.log('login->r :', r);
		dispatch(setToken(r.data.token));
		await dispatch(getUserAsync(r.data.token));
		dispatch(setAuth());
	} catch (e) {
		throw new Error(e);
	}
};
/**
 * Endpoint, realiza la peticion para registrarse
 * @function {async} registerAsync
 * @param {Object} user datos del usuario
 * @property {Function} dispatch funcion que ejecuta funciones del reducer
 */
export const registerAsync = user => async dispatch => {
	await API.post('auth/register', user);
};
/**
 * Endpoint, realiza la peticion para recuperar contraseña
 * @function {async} forgotPassword
 * @param {Object} values email de la cuenta
 * @property {Function} dispatch funcion que ejecuta funciones del reducer
 */
export const forgotPassword = values => async dispatch => {
	dispatch(setLoading());
	try {
		await API.post('auth/forgot-password', values);
		dispatch(setRegister());
	} catch (e) {
		throw new Error(e);
	}
};

export const {
	setLoading,
	setAuth,
	setAuthFailed,
	setLogout,
	setToken,
	setRegister,
	setRegisterFailed,
} = loginSlice.actions;
export default loginSlice.reducer;
