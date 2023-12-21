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
import { editLinkAsync } from '../../store/umssSlice';
import ImagePicker from '../ImagePicker';
import { green } from '@mui/material/colors';
import { Transition } from '../../Utils/Transitions';
import LoadingButton from '../LoadingButton';

/**
 * Dialogo para editar informacion de un link
 * @component EditLink
 * @property {Object} link datos del link a modificar.
 * @property {Function} handleSnack function que llama al componente snackbar (alerta)
 * @exports EditLink
 */
export default function EditLink({ link, handleSnack }) {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const [open, setOpen] = useState(false);
	const [editFile, setEditFile] = useState(false);
	const [fileImage, setFileImage] = useState(null);
	/**
	 * Cambia el estado fileImage asigna la imagen recibido del componente ImagePicker
	 * @function handleChangeFile
	 * @param {File} file
	 */
	const handleChangeFile = file => {
		setEditFile(true);
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
	 * Creacion y configuracion del formulario edicion de link
	 * propiedades:
	 * 	initialValues que inicializa valores del formulario con los datos actuales del link,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			title: link.title || '',
			description: link.description || '',
			url: link.url || '',
			priority: link.priority || '',
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			title: Yup.string()
				.required('El titulo del sitio es necesario')
				.max(50, 'Cantidad de caracteres maxima permitida es de 50'),
			description: Yup.string().max(
				250,
				'Cantidad de caracteres maxima permitida es de 250'
			),
			url: Yup.string()
				.matches(
					/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
					'El link ingresado debe ser de tipo url.'
				)
				.required('Especifique el URL'),

			priority: Yup.number().required('Prioridad es requerido.'),
		}),
		onSubmit: (values, { resetForm }) => {
			/**
			 * Ejecuta el dispatch hacia editLinkAsync con valores del form y la imagen para editar el link
			 * @function {async} edit
			 */
			const edit = async () => {
				return await dispatch(
					editLinkAsync(accessToken, values, link.id, fileImage, editFile)
				);
			};
			edit()
				.then(() => {
					handleSnack('Link actualizado exitosamente.', 'success');
					handleClose();
					resetForm();
				})
				.catch(() => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					isSubmitting(false);
				});
		},
	});
	const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

	return (
		<>
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

			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}>
				<DialogTitle>{'Editar ' + link.title}</DialogTitle>

				<DialogContent sx={{ minWidth: 400 }}>
					<FormikProvider value={formik}>
						<Form onSubmit={handleSubmit}>
							<Stack spacing={2}>
								<ImagePicker
									handleChangeFile={handleChangeFile}
									id="update-link"
									preload={link.image}
									label="imagen"
									type="Circle"
								/>
								<TextField
									variant="outlined"
									size="small"
									label="Titulo del sitio web"
									{...getFieldProps('title')}
									error={Boolean(touched.title && errors.title)}
									helperText={touched.title && errors.title}
								/>
								<TextField
									variant="outlined"
									size="small"
									multiline
									label="Descripción"
									{...getFieldProps('description')}
									error={Boolean(touched.description && errors.description)}
									helperText={touched.description && errors.description}
								/>
								<TextField
									variant="outlined"
									size="small"
									label="Url"
									{...getFieldProps('url')}
									error={Boolean(touched.url && errors.url)}
									helperText={touched.url && errors.url}
								/>
								<TextField
									variant="outlined"
									size="small"
									label="Prioridad"
									{...getFieldProps('priority')}
									error={Boolean(touched.priority && errors.priority)}
									helperText={touched.priority && errors.priority}
								/>
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
