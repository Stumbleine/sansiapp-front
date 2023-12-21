import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FastField, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

import {
	Box,
	Button,
	Paper,
	Grid,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	InputLabel,
	OutlinedInput,
	FormControl,
	CircularProgress,
} from '@mui/material';
import { green } from '@mui/material/colors';
import FormHelperText from '@mui/material/FormHelperText';

import CompanyBranch from '../cards/CompanyBranch';
import {
	createCompanieAsync,
	getProveedores,
	getRubros,
} from '../../store/companiesSlice';
import ImagePicker from '../ImagePicker';
import LoadingButton from '../LoadingButton';

/**
 * Formulario para registar empresas
 * @component CompanieRegisterForm
 * @property {Function} handleSnack llama al componente snackbar (alerta)
 * @exports CompanieRegisterForm
 */
export default function CompanieRegisterForm({ handleSnack }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAdmin } = useSelector(state => state.user);
	const { accessToken } = useSelector(state => state.login);
	const { providers, selectRubros } = useSelector(state => state.companies);
	const [fileLogo, setFileLogo] = useState(null);
	const [fileError, setFileError] = useState('');
	/**
	 * Inicializa una sucursal por defecto para cada empresa
	 * @constant defaultBranch
	 */
	const defaultBranch = {
		nombre: 'Sucursal central',
		direccion: '',
		latitud: '',
		longitud: '',
	};
	const [branchs, setBranchs] = useState([defaultBranch]);

	useEffect(() => {
		isAdmin && dispatch(getProveedores(accessToken));
		dispatch(getRubros(accessToken));
	}, []);
	/**
	 * Asigna el archivo logo de empresa proveniente de ImagePicker
	 * @function handleChangeFile
	 */
	const handleChangeFile = file => {
		setFileLogo(file);
		let _error = '';
		if (file) {
			if (file[0].type.split('/')[0] !== 'image') {
				_error = 'Debe seleccionar un formato de imagen.';
			} else if (file[0].size > 1000000) {
				_error = 'La imagen debe pesar menos de 1 MB.';
			}
		}
		setFileError(_error);
	};
	/**
	 * Actualiza el arreglo de sucursales añadidos
	 * @function updateListBranchs
	 */
	const updateListBranchs = data => {
		setBranchs(data);
	};
	/**
	 * Creacion y configuracion del formulario el registro de una empresa
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			razon_social: '',
			descripcion: '',
			telefono: '',
			rubro: '',
			nit: '',
			id_proveedor: '',
			branch: '',
		},

		/* 		validate: () => {
			let errors = {};
			if (branchs[0].latitud === '' || branchs[0].longitud === '') {
				errors.branch = 'Debe añadir coordenadas a su sucursal';
			}
			return errors;
		}, */
		validationSchema: Yup.object().shape({
			razon_social: Yup.string()
				.required('Razón social es requerido')
				.max(50, 'Cantidad de caracteres maxima permitida es de 50'),
			descripcion: Yup.string()
				.required('Descripción es requerido')
				.max(250, 'Cantidad de caracteres maxima permitida es de 250'),
			rubro: Yup.string().required('Rubro es requerido'),
			telefono: Yup.number()
				.typeError('Teléfono/Celular no válido')
				.positive('Teléfono/Celular no válido')
				.max(99999999, 'Teléfono/Celular permite como máximo 8 dígitos')
				.required('Teléfono/Celular es requerido'),
			nit: Yup.number()
				.typeError('NIT no válido')
				.max(999999999999999, 'NIT solo permite 15 dígitos'),
			id_proveedor: isAdmin && Yup.number().required('Debe asignar al responsable'),
		}),
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia createCompanieAsync con valores del form para registrar empresa
			 * @function {async} post
			 */
			if (!fileError) {
				async function post() {
					return await dispatch(
						createCompanieAsync(accessToken, values, fileLogo, branchs)
					);
				}
				post()
					.then(() => {
						handleSnack('Empresa registrado exitosamente.', 'success');
						setSubmitting(false);
						resetForm();
					})
					.catch(() => {
						handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
						setSubmitting(false);
					});
			} else {
				setSubmitting(false);
			}
		},
	});
	const { isSubmitting, handleSubmit, errors } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<Form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Stack component={Paper} sx={{ p: 2, borderRadius: 2 }} spacing={2}>
								<ImagePicker
									label="logo"
									type="Circle"
									handleChangeFile={handleChangeFile}
									id="register-companie"
									error={fileError}
								/>
								<Typography sx={{ fontWeight: 'bold' }}>Información</Typography>
								<FastField name="razon_social">
									{({ field, form, meta }) => (
										<TextField
											fullWidth
											variant="outlined"
											size="small"
											multiline
											label="Razón social *"
											placeholder="Razón social de la empresa"
											{...field}
											error={Boolean(meta.touched && meta.error)}
											helperText={meta.touched && meta.error}
										/>
									)}
								</FastField>

								<FastField name="descripcion">
									{({ field, form, meta }) => (
										<TextField
											fullWidth
											variant="outlined"
											label="Descripción  *"
											size="small"
											multiline
											placeholder="Descripción"
											{...field}
											error={Boolean(meta.touched && meta.error)}
											helperText={meta.touched && meta.error}
										/>
									)}
								</FastField>
								<FastField name="telefono">
									{({ field, form, meta }) => (
										<TextField
											fullWidth
											variant="outlined"
											label="Teléfono/Celular  *"
											size="small"
											placeholder="Teléfono/Celular"
											{...field}
											error={Boolean(meta.touched && meta.error)}
											helperText={meta.touched && meta.error}
										/>
									)}
								</FastField>
							</Stack>
						</Grid>
						<Grid item xs={12} md={6}>
							{/* segundo panel */}

							<Stack component={Paper} sx={{ p: 2, borderRadius: 2 }} spacing={2}>
								<FastField name="rubro">
									{({ field, form, meta }) => (
										<FormControl
											fullWidth
											size="small"
											error={meta.touched && meta.error}>
											<InputLabel id="rubro-label">Rubro *</InputLabel>
											<Select
												labelId="rubro-label"
												id="select-rubro-c"
												input={<OutlinedInput id="select-rubro-c" label="Rubro *" />}
												{...field}>
												{selectRubros?.map(r => (
													<MenuItem key={r.nombre} value={r.nombre}>
														{r.nombre}
													</MenuItem>
												))}
											</Select>
											<FormHelperText>{meta.error}</FormHelperText>
										</FormControl>
									)}
								</FastField>

								<FastField name="nit">
									{({ field, form, meta }) => (
										<TextField
											fullWidth
											variant="outlined"
											label="NIT"
											size="small"
											placeholder="NIT del negocio"
											{...field}
											error={Boolean(meta.touched && meta.error)}
											helperText={meta.touched && meta.error}
										/>
									)}
								</FastField>
								{isAdmin && (
									<FastField name="id_proveedor">
										{({ field, form, meta }) => (
											<FormControl
												fullWidth
												size="small"
												error={meta.touched && meta.error}>
												<InputLabel id="resp-label">Responsable *</InputLabel>
												<Select
													{...field}
													labelId="resp-label"
													id="select-resp-c"
													input={
														<OutlinedInput id="select-resp-c" label="Responsable *" />
													}>
													{providers?.map(r => (
														<MenuItem key={r.id} value={r.id}>
															{r.nombres} {r.apellidos}
														</MenuItem>
													))}
												</Select>
												<FormHelperText>{meta.error}</FormHelperText>
											</FormControl>
										)}
									</FastField>
								)}
								{/* Agregar sucurusales */}

								<CompanyBranch
									updateListBranchs={updateListBranchs}
									sucursales={branchs}
								/>
								{/* <Typography className="text-error">{errors.branch}</Typography> */}

								<Stack direction="row" spacing={2} justifyContent="end">
									<Button
										onClick={() => {
											navigate(-1);
										}}>
										Cancelar
									</Button>
									<LoadingButton isLoading={isSubmitting} text="Guardar" />
								</Stack>
							</Stack>
						</Grid>
					</Grid>
				</Form>
			</FormikProvider>
		</>
	);
}
