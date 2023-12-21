import { Card, Stack, TextField, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { createRubroAsync } from '../../store/rubrosSlice';
import ImagePicker from '../ImagePicker';
import LoadingButton from '../LoadingButton';
/**
 * Formulario para registar rubros
 * @component RubroForm
 * @property {Function} handleSnack llama al componente snackbar (alerta)
 * @exports RubroForm
 */
export default function RubroForm({ handleSnack }) {
	const [fileImage, setFileImage] = useState(null);
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	/**
	 * Asigna el archivo icono proveniente de <ImagePicker/>
	 * @function handleChangeFile
	 */
	const handleChangeFile = file => {
		setFileImage(file);
	};
	/**
	 * Verifica que se haya subido un archivo icono
	 * @function handleChangeFile
	 */
	const validateIcon = values => {
		let errors = {};
		if (fileImage === null) {
			errors.icon = 'Es necesario subir un icono que identifique al rubro.';
		}
		return errors;
	};
	/**
	 * Creacion y configuracion del formulario para crear un rubro
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario,
	 * 	validationSchema: configura la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			nombre: '',
			descripcion: '',
		},
		validationSchema: Yup.object().shape({
			nombre: Yup.string()
				.required('Nombre de rubro es requerido.')
				.max(30, 'Cantidad de caracteres maxima permitida es de 30'),
			descripcion: Yup.string().max(
				250,
				'Cantidad de caracteres maxima permitida es de 250'
			),
		}),
		validate: validateIcon,
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia createRubroAsync con valores del form para crear un nuevo link
			 * @function {async} add
			 */
			const add = async () => {
				return await dispatch(createRubroAsync(accessToken, values, fileImage));
			};
			add()
				.then(() => {
					handleSnack('Rubro agregado exitosamente.', 'success');
					setSubmitting(false);
					resetForm();
				})
				.catch(() => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					setSubmitting(false);
				});
		},
	});
	const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
	return (
		<Card sx={{ p: 2 }}>
			<FormikProvider value={formik}>
				<Form onSubmit={handleSubmit}>
					<Stack spacing={2}>
						<Typography align="center" sx={{ fontWeight: 'bold' }}>
							Registro de rubro
						</Typography>
						<ImagePicker label="icono" handleChangeFile={handleChangeFile} type="Circle">
							{errors.icon && (
								<Typography
									textAlign="center"
									sx={{ mt: 1 }}
									color="error"
									variant="caption">
									{errors.icon}
								</Typography>
							)}
						</ImagePicker>
						<TextField
							required
							fullWidth
							variant="outlined"
							size="small"
							type="text"
							label="Nombre rubro"
							placeholder="Nombre del rubro"
							{...getFieldProps('nombre')}
							error={Boolean(touched.nombre && errors.nombre)}
							helperText={touched.nombre && errors.nombre}
						/>
						<TextField
							fullWidth
							variant="outlined"
							size="small"
							type="text"
							label="Descripcion"
							placeholder="Descripción"
							{...getFieldProps('descripcion')}
							error={Boolean(touched.descripcion && errors.descripcion)}
							helperText={touched.descripcion && errors.descripcion}
						/>
						<LoadingButton isLoading={isSubmitting} text="Añadir" />
					</Stack>
				</Form>
			</FormikProvider>
		</Card>
	);
}
