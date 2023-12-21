import { Edit } from '@mui/icons-material';
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from '../ImagePicker';
import { green } from '@mui/material/colors';
import { updateUserAsync } from '../../store/usersSlice';
import { Transition } from '../../Utils/Transitions';
import { isEstudentEmail } from '../../Utils/Validations.js';
import LoadingButton from '../LoadingButton';

/**
 * Dialogo con formulario para editar informacion de un usuario,
 * @component Edituser
 * @property {Object} user datos del usuario a modificar.
 * @property {Function} handleSnack function que llama al componente snackbar (alerta)
 * @exports Edituser
 */
export default function Edituser({ user, handleSnack, disabled }) {
	// console.log(user);

	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const [open, setOpen] = useState(false);
	const [fileImage, setFileImage] = useState(null);
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
	 * Creacion y configuracion del formulario para editar un usuario
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario con los datos actuales del usuario,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			id: user?.id || '',
			nombres: user?.nombres || '',
			apellidos: user?.apellidos || '',
			email: user?.email || '',
			// rol: '',
		},
		validate: values => {
			let errors = {};
			if (isEstudentEmail(values.email)) {
				errors.email = 'El correo no puede ser de un estudiante';
			}
			return errors;
		},
		validationSchema: Yup.object().shape({
			nombres: Yup.string()
				.required('Los nombres son requeridos.')
				.max(35, 'Cantidad de caracteres maxima permitida es de 35')
				.matches(
					/^(?![ .]+$)[a-zA-Z .]*$/,
					'No puede contener caracteres especiales y numeros.'
				),
			apellidos: Yup.string()
				.required('Los apellidos son requeridos.')
				.max(35, 'Cantidad de caracteres maxima permitida es de 35')
				.matches(
					/^(?![ .]+$)[a-zA-Z .]*$/,
					'No puede contener caracteres especiales y numeros.'
				),
			email: Yup.string().email().required('Correo electrónico es requerido.'),
			// rol: Yup.string().required('Es necesario asginar un rol al usuario.'),
		}),
		enableReinitialize: true,
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia updateOfferAsync con valores del form para editar el usuario
			 * @function {async} update
			 */
			const update = async () => {
				return await dispatch(updateUserAsync(accessToken, values, fileImage));
			};
			update()
				.then(r => {
					handleSnack('Usuario actualizado exitosamente.', 'success');
					handleClose();
					setSubmitting(false);
					resetForm();
				})
				.catch(e => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					setSubmitting(false);
				});
		},
	});
	const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

	return (
		<>
			<IconButton disabled={disabled} size="small" onClick={handleClickOpen}>
				<Edit
					sx={{
						color: disabled ? '' : 'text.icon',
						'&:hover': {
							color: 'warning.light',
						},
					}}
				/>
			</IconButton>

			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={open}
				onClose={handleClose}
				disableEscapeKeyDown={true}
				TransitionComponent={Transition}>
				<DialogTitle>{'Editar ' + user?.nombres}</DialogTitle>

				<DialogContent sx={{ minWidth: 400 }}>
					<FormikProvider value={formik}>
						<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
							<Stack spacing={2}>
								<ImagePicker
									handleChangeFile={handleChangeFile}
									id="update-user"
									preload={user?.picture}
									label="foto"
									type="Circle"
								/>
								<TextField
									fullWidth
									variant="outlined"
									size="small"
									label="Nombres"
									placeholder="nombres"
									{...getFieldProps('nombres')}
									error={Boolean(touched.nombres && errors.nombres)}
									helperText={touched.nombres && errors.nombres}
								/>
								<TextField
									fullWidth
									variant="outlined"
									size="small"
									label="Apellidos"
									placeholder="Apellidos"
									{...getFieldProps('apellidos')}
									error={Boolean(touched.apellidos && errors.apellidos)}
									helperText={touched.apellidos && errors.apellidos}
								/>
								<TextField
									fullWidth
									variant="outlined"
									size="small"
									label="Email"
									placeholder="Correo electrónico"
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
