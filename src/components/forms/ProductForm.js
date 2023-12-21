import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

import {
	Button,
	Card,
	CircularProgress,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	FormControl,
	FormHelperText,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { Box } from '@mui/system';

import { addProductAsync } from '../../store/productsSlice';
import ImagePicker from '../ImagePicker';
import LoadingButton from '../LoadingButton';

/**
 * Formulario para registrar ofertas de una empresa
 * @component ProductForm
 * @property {Array} companies Lista de empresas para asignar producto.
 * @property {Function} handleSnack llama al componente snackbar (alerta)
 * @exports ProductForm
 */
export default function ProductForm({ handleSnack, companies }) {
	const [fileImage, setFileImage] = useState(null);
	const dispatch = useDispatch();
	const { isAdmin } = useSelector(state => state.user);
	const { accessToken } = useSelector(state => state.login);
	const [fileError, setFileError] = useState('');
	/**
	 * Asigna el archivo imagen proveniente de <ImagePicker/>
	 * @function handleChangeFile
	 */
	const handleChangeFile = file => {
		setFileImage(file);
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
	 * Creacion y configuracion del formulario para añadir un producto
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
			precio: '',
			tipo: 'producto',
			id_empresa: 'none',
		},
		validationSchema: Yup.object().shape({
			nombre: Yup.string()
				.required('El nombre es requerido')
				.max(35, 'Cantidad de caracteres maxima permitida es de 35'),
			descripcion: Yup.string().max(
				250,
				'Cantidad de caracteres maxima permitida es de 250'
			),
			precio: Yup.number()
				.required('El precio es requerido')
				.test('Is positive?', 'Ingrese numeros mayor a 0', value => value > 0),
			tipo: Yup.string().required('El tipo de producto es requerido'),
			id_empresa: isAdmin
				? Yup.number().typeError('Debe asignar el producto a una empresa').required()
				: '',
		}),
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia addProductAsync con valores del form para añadir un producto
			 * @function {async} add
			 */
			if (!fileError) {
				const add = async () => {
					return await dispatch(addProductAsync(accessToken, values, fileImage));
				};
				add()
					.then(() => {
						handleSnack('Producto agregado exitosamente.', 'success');
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

	const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

	return (
		<Card sx={{ p: 2 }}>
			<ImagePicker
				label="imagen"
				handleChangeFile={handleChangeFile}
				type="Rectangle"
				error={fileError}
			/>
			<FormikProvider value={formik}>
				<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<Stack spacing={2} sx={{ mt: 2 }}>
						<Typography sx={{ fontWeight: 'bold' }}>Información</Typography>
						<TextField
							required
							variant="outlined"
							size="small"
							label="Nombre"
							multiline
							placeholder="Nombre del producto"
							{...getFieldProps('nombre')}
							error={Boolean(touched.nombre && errors.nombre)}
							helperText={touched.nombre && errors.nombre}
						/>
						<TextField
							variant="outlined"
							size="small"
							multiline
							label="Descripción"
							placeholder="Descripción"
							{...getFieldProps('descripcion')}
							error={Boolean(touched.descripcion && errors.descripcion)}
							helperText={touched.descripcion && errors.descripcion}
						/>
						<TextField
							required
							variant="outlined"
							size="small"
							label="Precio"
							type="number"
							placeholder="Precio en Bs."
							{...getFieldProps('precio')}
							error={Boolean(touched.precio && errors.precio)}
							helperText={touched.precio && errors.precio}
						/>
						<Box>
							<Typography color="textSecondary">Especificar el tipo *</Typography>
							<Select
								sx={{ width: '100%', mt: 1 }}
								size="small"
								inputProps={{ 'aria-label': 'Without label' }}
								{...getFieldProps('tipo')}
								error={Boolean(touched.tipo && errors.tipo)}>
								<MenuItem value="producto">Producto</MenuItem>
								<MenuItem value="servicio">Servicio</MenuItem>
							</Select>
						</Box>
						{isAdmin && (
							<FormControl
								fullWidth
								size="small"
								error={touched.id_empresa && errors.id_empresa}>
								<Typography color="textSecondary">Asignar a una empresa *</Typography>
								<Select
									sx={{ width: '100%', mt: 1 }}
									size="small"
									inputProps={{ 'aria-label': 'Without label' }}
									{...getFieldProps('id_empresa')}>
									{companies?.map(item => (
										<MenuItem key={item.id_empresa} value={item.id_empresa}>
											{item.razon_social}
										</MenuItem>
									))}
									<MenuItem value="none">None</MenuItem>
								</Select>
								<FormHelperText>{errors.id_empresa}</FormHelperText>
							</FormControl>
						)}
						<LoadingButton isLoading={isSubmitting} text="Añadir" />
					</Stack>
				</Form>
			</FormikProvider>
		</Card>
	);
}
