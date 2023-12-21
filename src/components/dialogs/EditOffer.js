import { Edit } from '@mui/icons-material';
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from '../ImagePicker';
import { green } from '@mui/material/colors';
import { updateOfferAsync } from '../../store/offersSlice';
import { Transition } from '../../Utils/Transitions';
import LoadingButton from '../LoadingButton';

/**
 * Dialogo con formulario para editar informacion de una oferta,
 * excepto productos incluidos y sucursales disponibles
 * @component EditOffer
 * @property {Object} offer datos de la oferta a modificar.
 * @property {Function} handleSnack function que llama al componente snackbar (alerta)
 * @property {Array} [companies] lista de empresas para la opcion de reasignar info.
 * @exports EditOffer
 */
export default function EditOffer({ offer, handleSnack, companies }) {
	const sdate = offer.start_date?.split(' ')[0];
	const edate = offer.end_date?.split(' ')[0];
	const dispatch = useDispatch();
	const { isAdmin } = useSelector(state => state.user);
	const [changeCompanie, setCCompanie] = useState(false);

	const { accessToken } = useSelector(state => state.login);
	const [open, setOpen] = useState(false);
	const [fileImage, setFileImage] = useState(null);
	const [codes, setCodes] = useState('');
	/**
	 * Asigna el archivo imagen proveniente de ImagePicker
	 * @function handleChangeFile
	 */
	const handleChangeFile = file => {
		setFileImage(file);
	};
	/**
	 * Cambia el estado open a true (abre el dialogo)
	 * @function handleClickOpen
	 */
	const handleClickOpen = () => {
		setOpen(true);
	};
	/**
	 * Cambia el estado open a false (cierra el dialogo)
	 * @function handleClose
	 */
	const handleClose = () => {
		setOpen(false);
	};
	/**
	 * Actualiza el estado codes
	 * @param {Object} e evento del input de códigos pregenerados
	 */
	const handleCodes = e => {
		const file = e.target.files.length > 0 ? e.target.files[0] : null;
		if (file) {
			const reader = new FileReader();
			reader.onload = e => {
				const csv = e.target.result;
				setCodes(csv);
			};

			reader.readAsText(file, 'UTF-8');
		}
	};
	/**
	 * Creacion y configuracion del formulario para editar la oferta
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario con los datos actuales de la oferta,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const formik = useFormik({
		initialValues: {
			id_beneficio: offer.id_offer,
			titulo: offer.title || '',
			fecha_inicio: sdate || '',
			fecha_fin: edate || '',
			tipo_descuento: offer.discount_type || 'Porcentual',
			descuento: offer.discount || '',
			condiciones: offer.conditions || '',
			id_empresa: offer.companie.id_empresa || '',
			total_codes: offer.total_codes,
			rest_codes: offer.rest_codes,
			cod_pregenerado: offer.cod_pregenerado,
			stock: offer.stock || '',
		},
		validationSchema: Yup.object().shape({
			titulo: Yup.string()
				.required('Título de oferta es requerido')
				.max(50, 'Cantidad de caracteres maxima permitida es de 50'),
			condiciones: Yup.string().max(
				250,
				'Cantidad de caracteres maxima permitida es de 250'
			),
			fecha_inicio: Yup.date().required('El campo fecha inicial es requerido'),
			fecha_fin: Yup.date('Debe ser mayor a la fecha inicial').required(
				'El campo fecha fin es requerido'
			),
			tipo_descuento: Yup.string(),
			descuento: Yup.number()
				.required('El campo descuento es requerido')
				.when('tipo_descuento', {
					is: 'Monetario',
					then: Yup.number().test(
						'Is positive?',
						'Ingrese numeros mayor a 0',
						value => value > 0
					),
				})
				.when('tipo_descuento', {
					is: 'Porcentual',
					then: Yup.number().test(
						'Is positive?',
						'Ingrese porcentajes mayor a 0 y menor a 100',
						value => value > 0 && value <= 100
					),
				})
				.when('tipo_descuento', {
					is: 'Descripcion',
					then: Yup.string(),
				}),
			id_empresa: isAdmin
				? Yup.number().required('Es necesario asignar la oferta a una empresa')
				: '',
			stock: Yup.number()
				.required('Es necesario introducir la cantidad disponible')
				.min(1, 'El valor del stock debe ser mayor a 0'),
		}),
		enableReinitialize: true,
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia updateOfferAsync con valores del form para editar la oferta
			 * @function {async} update
			 */
			const update = async () => {
				const _values = { ...values, ...(values.cod_pregenerado && { codes }) };
				return await dispatch(updateOfferAsync(accessToken, _values, fileImage));
			};
			update()
				.then(r => {
					handleSnack('Oferta actualizada exitosamente.', 'success');
					resetForm();
					setSubmitting(false);
					handleClose();
				})
				.catch(e => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					setSubmitting(false);
					handleClose();
				});
		},
	});
	const { errors, values, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

	return (
		<>
			<Tooltip title="Editar informacion">
				<IconButton size="small" onClick={handleClickOpen}>
					<Edit
						sx={{
							color: 'text.icon',
							'&:hover': {
								color: 'warning.light',
							},
						}}
					/>
				</IconButton>
			</Tooltip>

			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}>
				<DialogTitle>{'Editar ' + offer?.title}</DialogTitle>

				<DialogContent sx={{ minWidth: 400 }}>
					<FormikProvider value={formik}>
						<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
							<Stack spacing={2}>
								<ImagePicker
									handleChangeFile={handleChangeFile}
									id="update-offer"
									preload={offer?.image}
									label="imagen"
									type="Rectangle"
								/>

								<TextField
									variant="outlined"
									size="small"
									label="Título"
									placeholder="Título de oferta"
									{...getFieldProps('titulo')}
									error={Boolean(touched.titulo && errors.titulo)}
									helperText={touched.titulo && errors.titulo}
								/>
								<TextField
									fullWidth
									variant="outlined"
									label="Descripción/Condiciones"
									multiline
									{...getFieldProps('condiciones')}
									size="small"
									error={Boolean(touched.condiciones && errors.condiciones)}
									helperText={touched.condiciones && errors.condiciones}
								/>
								<Stack spacing={2} direction="row">
									<Box sx={{ width: '50%' }}>
										<InputLabel>Fecha inicio *</InputLabel>
										<TextField
											size="small"
											variant="outlined"
											type="date"
											{...getFieldProps('fecha_inicio')}
											error={Boolean(touched.fecha_inicio && errors.fecha_inicio)}
											helperText={touched.fecha_inicio && errors.fecha_inicio}
											sx={{ width: '100%', mt: 1 }}
										/>
									</Box>

									<Box sx={{ width: '50%' }}>
										<InputLabel>Fecha fin *</InputLabel>
										<TextField
											size="small"
											variant="outlined"
											type="date"
											{...getFieldProps('fecha_fin')}
											error={Boolean(touched.fecha_fin && errors.fecha_fin)}
											helperText={touched.fecha_fin && errors.fecha_fin}
											sx={{ width: '100%', mt: 1 }}
										/>
									</Box>
								</Stack>
								<Stack>
									<InputLabel style={{ marginBottom: '.5rem' }}>Descuento *</InputLabel>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											gap: 2,
										}}>
										<FormControl sx={{ width: '35%' }}>
											<Select
												fullWidth
												size="small"
												{...getFieldProps('tipo_descuento')}
												error={Boolean(touched.tipo_descuento && errors.tipo_descuento)}
												inputProps={{ 'aria-label': 'Without label' }}>
												<MenuItem value="Porcentual">Porcentaje</MenuItem>
												<MenuItem value="Monetario">Monto</MenuItem>
												<MenuItem value="Descripcion">Descriptivo</MenuItem>
											</Select>
										</FormControl>
										<TextField
											size="small"
											variant="outlined"
											{...getFieldProps('descuento')}
											placeholder={
												values.tipo_descuento === 'Descripcion' ? 'ejem: lleva 2x1..' : ''
											}
											InputProps={{
												startAdornment:
													values.tipo_descuento === 'Porcentual' ? (
														<InputAdornment position="start">%</InputAdornment>
													) : (
														values.tipo_descuento === 'Monetario' && (
															<InputAdornment position="start">Bs.</InputAdornment>
														)
													),
											}}
											error={Boolean(touched.descuento && errors.descuento)}
											sx={{ width: '65%' }}
										/>
									</Box>
								</Stack>
								<Box sx={{ width: '100%' }}>
									<InputLabel sx={{ mb: 1 }}>
										Introduzca la disponibilidad de la oferta.
									</InputLabel>
									<TextField
										fullWidth
										variant="outlined"
										label="Stock"
										multiline
										{...getFieldProps('stock')}
										size="small"
										error={Boolean(touched.stock && errors.stock)}
										helperText={touched.stock && errors.stock}
									/>
								</Box>

								{isAdmin && (
									<FormControl fullWidth size="small">
										<InputLabel id="comp-edit-label">Empresa</InputLabel>
										<Select
											labelId="comp-edit-label"
											label="Empresa"
											fullWidth
											size="small"
											{...getFieldProps('id_empresa')}
											disabled={!companies}
											error={Boolean(touched.id_empresa && errors.id_empresa)}>
											{companies?.map(item => (
												<MenuItem key={item.id_empresa} value={item.id_empresa}>
													{item.razon_social}
												</MenuItem>
											))}
										</Select>
										{!companies && <Typography variant="caption">Cargando.. </Typography>}
									</FormControl>
								)}

								<DialogActions sx={{ p: 0 }}>
									<Button sx={{ mr: 1 }} onClick={handleClose}>
										Cancelar
									</Button>
									<LoadingButton isLoading={isSubmitting} text="Guardar" />
								</DialogActions>
							</Stack>
						</Form>
					</FormikProvider>
				</DialogContent>
			</Dialog>
		</>
	);
}
