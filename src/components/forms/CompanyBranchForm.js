import { Add, Edit } from '@mui/icons-material';
import {
	Dialog,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
	IconButton,
} from '@mui/material';
import { Box } from '@mui/system';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import MapView from '../MapView';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addBranchAsync, updateBranchAsync } from '../../store/companiesSlice';
import { Transition } from '../../Utils/Transitions';
import LoadingButton from '../LoadingButton';

/**
 * Dialogo con formulario para añadir o editar una sucursal, ya sea de modo local o haciendo una peticion hacia el servidor
 * @component CompanyBranchForm
 * @property {Function} handleAddSucursal añade la lista de sucursales en el componente padre
 * @property {String} actionType modo de comportamiento del formulario.
 * @property {Function} [handleEditSucursal] edita un sucursal de la lista de sucursales en el componente padre
 * @property {Object} [editData] datos de la sucursal a editar
 * @property {Function} handleSnack function que llama al componente snackbar (alerta)
 * @property {Number} idEmpresa
 * @exports CompanyBranchForm
 */
export default function CompanyBranchForm({
	handleAddSucursal,
	actionType,
	handleEditSucursal,
	editData,
	handleSnack,
	idEmpresa,
}) {
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);

	const [position, setPosition] = useState(
		actionType !== 'add' ? { lat: editData?.latitud, lng: editData?.longitud } : null
	);

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
	 * Recibe la posicion desde el componente <MapView/>
	 * @function sendPosition
	 * @param {Object} pos coordenadas: lat, lng
	 */
	const sendPosition = pos => {
		setPosition(pos);
	};
	/**
	 * Verifica que se seleccionado una ubicacion en el componente <MapView/>
	 * @function validateMap
	 */
	const validateMap = () => {
		let errores = {};
		// console.log(position)
		if (position === null || position.lat === '' || position.lng === '') {
			errores.pos = 'No se ha elegido la ubicacion';
		}
		return errores;
	};
	/**
	 * Creacion y configuracion del formulario para añadir o editar una sucursal
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario con los datos actuales del sucursal en caso de editar
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit", realiza una accion segun actionType
	 * validate: recibe una funcion personalizada de validacion de coordenadas
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			name: editData?.nombre || '',
			address: editData?.direccion || '',
			pos: '',
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string()
				.required('Nombre de sucursal es requerido')
				.max(50, 'Cantidad de caracteres maxima permitida es de 50'),
			address: Yup.string()
				.required('Direccion es requerido')
				.max(100, 'Cantidad de caracteres maxima permitida es de 100'),
		}),
		validate: validateMap,
		onSubmit: (valores, { resetForm, setSubmitting }) => {
			const sucursal = {
				nombre: valores.name,
				direccion: valores.address,
				latitud: position.lat.toString(),
				longitud: position.lng.toString(),
			};
			if (actionType === 'edit') {
				handleEditSucursal(sucursal, editData.index);
				resetForm();
				setPosition(null);
				handleClose();
			} else if (actionType === 'add') {
				handleAddSucursal(sucursal);
				setPosition(null);
				resetForm();
				handleClose();
			} else if (actionType === 'update-fetch') {
				/**
				 * Realiza dispatch hacia addBranchAsync para editar una sucursal
				 * @function {async} editAsync
				 */
				const editAsync = async () => {
					return await dispatch(
						updateBranchAsync(
							accessToken,
							sucursal,
							editData.id_sucursal,
							editData.id_empresa
						)
					);
				};
				editAsync()
					.then(() => {
						handleSnack('Sucursal actualizado exitosamente.', 'success');
						resetForm();
						handleClose();
					})
					.catch(() => {
						handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
						setSubmitting(false);
						handleClose();
					});
			} else if (actionType === 'add-fetch') {
				/**
				 * Realiza dispatch hacia addBranchAsync para añadir una sucursal
				 * @function {async} addAsync
				 */
				const addAsync = async () => {
					return await dispatch(addBranchAsync(accessToken, sucursal, idEmpresa));
				};
				addAsync()
					.then(() => {
						handleSnack('Sucursal añadido exitosamente.', 'success');
						resetForm();
						handleClose();
					})
					.catch(() => {
						handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
						setSubmitting(false);
						handleClose();
					});
			}
		},
	});
	const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
	return (
		<>
			{actionType === 'add' || actionType === 'add-fetch' ? (
				<Button onClick={handleClickOpen} startIcon={<Add></Add>}>
					Sucursal
				</Button>
			) : (
				<IconButton onClick={handleClickOpen}>
					<Edit
						sx={{
							color: 'text.icon',
							'&:hover': {
								color: 'warning.light',
							},
						}}
					/>
				</IconButton>
			)}

			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				PaperProps={{ style: { borderRadius: 15 } }}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
				sx={{ minWidth: 500 }}>
				<DialogTitle sx={{ color: 'primary.main' }}>
					{actionType === 'edit' ? 'Editar Sucursal' : 'Nueva Sucursal'}
				</DialogTitle>
				<DialogContent>
					<FormikProvider value={formik}>
						<Form noValidate onSubmit={handleSubmit}>
							<Box>
								<TextField
									autoFocus
									variant="outlined"
									size="small"
									label="Nombre *"
									multiline
									InputProps={{
										style: {
											color: grey[900],
										},
									}}
									sx={{ width: '100%', mt: 2 }}
									{...getFieldProps('name')}
									error={Boolean(touched.name && errors.name)}
									helperText={touched.name && errors.name}
								/>
								<TextField
									variant="outlined"
									label="Dirección *"
									size="small"
									multiline
									placeholder="Ejemplo: Av. Ayacucho #723"
									InputProps={{
										style: {
											color: grey[900],
										},
									}}
									sx={{ width: '100%', mt: 2 }}
									{...getFieldProps('address')}
									error={Boolean(touched.address && errors.address)}
									helperText={touched.address && errors.address}
								/>
							</Box>
							<Typography variant="body2" sx={{ mt: 2 }}>
								Seleccione la ubicación
							</Typography>
							<Box sx={{ width: '100%', height: 250, background: 'pink', mt: 1 }}>
								<MapView sendPosition={sendPosition}></MapView>
							</Box>
							<Box sx={{ display: 'flex' }}>
								<TextField
									required
									disabled
									size="small"
									variant="outlined"
									placeholder="latitud"
									InputProps={{
										style: {
											color: grey[900],
										},
									}}
									sx={{ width: '50%', mt: 2 }}
									name="pos"
									error={Boolean(errors.pos)}
									helperText={position == null || position.lat === '' ? errors.pos : ''}
									value={position != null ? position.lat : ''}
								/>
								<TextField
									required
									size="small"
									variant="outlined"
									disabled
									placeholder="longitud"
									value={position != null ? position.lng : ''}
									autoFocus
									InputProps={{
										style: {
											color: grey[900],
										},
									}}
									sx={{ width: '50%', mt: 2 }}
								/>
							</Box>
							<DialogActions sx={{ p: 0, mt: 1 }}>
								<Button onClick={handleClose}>Cancelar</Button>
								<LoadingButton
									isLoading={isSubmitting}
									text={
										actionType === 'edit' || actionType === 'update-fetch'
											? 'Guardar'
											: 'Añadir'
									}
								/>
							</DialogActions>
						</Form>
					</FormikProvider>
				</DialogContent>
			</Dialog>
		</>
	);
}
