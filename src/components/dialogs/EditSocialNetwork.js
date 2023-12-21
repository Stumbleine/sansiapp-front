import { AddRounded, Edit } from '@mui/icons-material';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Tooltip,
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSocialAsync } from '../../store/companiesSlice';
import { Transition } from '../../Utils/Transitions';
import * as Yup from 'yup';
import LoadingButton from '../LoadingButton';

/**
 * Dialogo con formulario para añadir o editar las redes sociales de la empresa
 * @component EditSocialNetwork
 * @property {Object} companie datos de la empresa
 * @property {String} mode indica de que forma se comportara el formulario
 * @property {Function} handleSnack function que llama al componente snackbar (alerta)
 * @example
 * const mode = "add";
 * const mode = "edit";
 * @exports EditSocialNetwork
 */
export default function EditSocialNetwork({ companie, mode, handleSnack }) {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const [open, setOpen] = useState(false);
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
	 * Creacion y configuracion del formulario para añadir o editar redes sociales
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario con los datos actuales de la oferta o vacios si se trata de agregar,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			facebook: companie?.facebook || '',
			instagram: companie?.instagram || '',
			sitio_web: companie?.sitio_web || '',
			email: companie?.email || '',
		},
		validationSchema: Yup.object().shape({
			facebook: Yup.string().matches(
				/(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-.]*\/)*([\w\-.]*)/gi,
				'El link ingresado debe ser una url de facebook.'
			),
			instagram: Yup.string().matches(
				/(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim,
				'El link ingresado debe ser de una url de instagram.'
			),
			email: Yup.string().email('El email es invalido.'),
			sitio_web: Yup.string().matches(
				/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
				'El link ingresado debe ser de tipo url.'
			),
		}),
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia updateSocialAsync para actualizar las redes sociales
			 * @function {async} update
			 */
			const add = async () => {
				return await dispatch(
					updateSocialAsync(accessToken, values, companie.id_empresa)
				);
			};
			add()
				.then(() => {
					handleSnack('Link actualizado exitosamente.', 'success');
					setSubmitting(false);
					handleClose();
				})
				.catch(() => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					handleClose();
					setSubmitting(false);
				});
		},
	});
	const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

	return (
		<>
			<Tooltip title={mode === 'edit' ? 'Editar' : 'Agregar'}>
				<IconButton size="small" sx={{ ml: 1, p: 0 }} onClick={handleClickOpen}>
					{mode === 'edit' ? (
						<Edit
							sx={{
								fontSize: 20,
								color: 'text.icon',
								'&:hover': {
									color: 'warning.light',
								},
							}}
						/>
					) : (
						<AddRounded
							sx={{
								fontSize: 22,

								color: 'text.icon',
								'&:hover': {
									color: 'primary',
								},
							}}
						/>
					)}
				</IconButton>
			</Tooltip>
			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}>
				<DialogTitle>{mode === 'edit' ? 'Editar' : 'Agregar'} redes sociales</DialogTitle>

				<DialogContent sx={{ minWidth: 400 }}>
					<FormikProvider value={formik}>
						<Form onSubmit={handleSubmit}>
							<Stack spacing={2} sx={{ mt: 1 }}>
								<TextField
									variant="outlined"
									size="small"
									label="Facebook"
									{...getFieldProps('facebook')}
									error={Boolean(touched.facebook && errors.facebook)}
									helperText={touched.facebook && errors.facebook}
								/>
								<TextField
									variant="outlined"
									size="small"
									multiline
									label="Instagram"
									{...getFieldProps('instagram')}
									error={Boolean(touched.instagram && errors.instagram)}
									helperText={touched.instagram && errors.instagram}
								/>
								<TextField
									variant="outlined"
									size="small"
									label="Sitio web"
									{...getFieldProps('sitio_web')}
									error={Boolean(touched.sitio_web && errors.sitio_web)}
									helperText={touched.sitio_web && errors.sitio_web}
								/>
								<TextField
									variant="outlined"
									size="small"
									label="Correo electrónico"
									{...getFieldProps('email')}
									error={Boolean(touched.email && errors.email)}
									helperText={touched.email && errors.email}
								/>
								<DialogActions sx={{ p: 0 }}>
									<Button onClick={handleClose}>Cancelar</Button>
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
