import { Edit } from '@mui/icons-material';
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	TextField,
	Tooltip,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { Box } from '@mui/system';
import { FastField, Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import ImagePicker from '../ImagePicker';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateInfoAsync } from '../../store/companiesSlice';
import { Transition } from '../../Utils/Transitions';
import LoadingButton from '../LoadingButton';

/**
 * Dialogo para editar informacion de una empresa
 * @component EditCompanie
 * @property {Object} companie datos de empresa.
 * @property {Function} handleSnack function que llama al componente snackbar (alerta)
 *
 * @exports EditCompanie
 */
export default function EditCompanie({ companie, handleSnack }) {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const { selectRubros } = useSelector(state => state.companies);

	const [open, setOpen] = useState(false);
	const [fileImage, setFileImage] = useState(null);
	/**
	 * Cambia el estado fileImage asigna el logo recibido del componente ImagePicker
	 * @function handleChangeFile
	 * @param {File} file
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
	 * Creacion y configuracion del formulario edicion de empresa
	 * propiedades:
	 * 	initialValues que inicializa valores del formulario con los datos actuales de la empresa,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			razon_social: companie?.razon_social,
			descripcion: companie?.descripcion,
			telefono: companie?.telefono,
			rubro: companie?.rubro,
			nit: companie?.nit,
			id_empresa: companie.id_empresa,
		},
		validationSchema: Yup.object().shape({
			razon_social: Yup.string()
				.required('Razón social es requerido')
				.max(50, 'Cantidad de caracteres maxima permitida es de 50'),
			descripcion: Yup.string()
				.required('Descripción es requerido')
				.max(250, 'Cantidad de caracteres maxima permitida es de 250'),
			telefono: Yup.number()
				.typeError('Teléfono/Celular no válido')
				.positive('Teléfono/Celular no válido')
				.max(99999999, 'Teléfono/Celular permite como máximo 8 dígitos')
				.required('Teléfono/Celular es requerido'),
			nit: Yup.number()
				.typeError('NIT no válido')
				.max(999999999999999, 'NIT solo permite 15 dígitos'),
		}),
		enableReinitialize: true,
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia updateInfoAsync con valores del form y el logo para editar la empresa
			 * @function {async} edit
			 */
			const edit = async () => {
				return await dispatch(updateInfoAsync(accessToken, values, fileImage));
			};
			edit()
				.then(() => {
					handleSnack('Empresa actualizada exitosamente.', 'success');
					resetForm();
					handleClose();
					setSubmitting(false);
				})
				.catch(() => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					setSubmitting(false);
					handleClose();
				});
		},
	});
	const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

	return (
		<>
			<Tooltip title="Editar informacion">
				<IconButton size="small" sx={{ ml: 1, p: 0 }} onClick={handleClickOpen}>
					<Edit
						sx={{
							fontSize: 22,
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
				<DialogTitle>{'Editar ' + companie?.razon_social}</DialogTitle>

				<DialogContent sx={{ minWidth: 400 }}>
					<FormikProvider value={formik}>
						<Form onSubmit={handleSubmit}>
							<Stack spacing={2}>
								<ImagePicker
									handleChangeFile={handleChangeFile}
									id="update-companie-info"
									preload={companie?.logo}
									label="logo"
									type="Circle"
								/>
								<TextField
									variant="outlined"
									size="small"
									label="Razón social *"
									{...getFieldProps('razon_social')}
									error={Boolean(touched.razon_social && errors.razon_social)}
									helperText={touched.razon_social && errors.razon_social}
								/>
								<TextField
									variant="outlined"
									size="small"
									multiline
									label="Descripcion *"
									{...getFieldProps('descripcion')}
									error={Boolean(touched.descripcion && errors.descripcion)}
									helperText={touched.descripcion && errors.descripcion}
								/>
								<TextField
									variant="outlined"
									size="small"
									label="Teléfono *"
									{...getFieldProps('telefono')}
									error={Boolean(touched.telefono && errors.telefono)}
									helperText={touched.telefono && errors.telefono}
								/>
								<TextField
									variant="outlined"
									size="small"
									label="NIT"
									{...getFieldProps('nit')}
									error={Boolean(touched.nit && errors.nit)}
									helperText={touched.nit && errors.nit}
								/>
								<FormControl fullWidth size="small">
									<InputLabel id="rubro-label-e">Rubro</InputLabel>
									<FastField name="rubro">
										{({ field, form, meta }) => (
											<Select
												labelId="rubro-label-e"
												id="select-rubro-e"
												input={<OutlinedInput id="select-rubro-e" label="Rubro" />}
												{...field}
												error={Boolean(meta.touched && meta.errors)}>
												{selectRubros?.map(r => (
													<MenuItem key={r.nombre} value={r.nombre}>
														{r.nombre}
													</MenuItem>
												))}
											</Select>
										)}
									</FastField>
								</FormControl>
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
