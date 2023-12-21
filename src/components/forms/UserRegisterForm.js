import {
	Button,
	Card,
	CircularProgress,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { Box } from '@mui/system';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { createUserAsync } from '../../store/usersSlice';
import ImagePicker from '../ImagePicker';
import { isEstudentEmail } from '../../Utils/Validations';
import LoadingButton from '../LoadingButton';
/**
 * Formulario para registar usuarios con rol
 * @component UserRegisterForm
 * @property {Function} handleSnack llama al componente snackbar (alerta)
 * @exports UserRegisterForm
 */
function UserRegisterForm({ handleSnack, isSADM, isADM }) {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const [fileImage, setFileImage] = useState(null);

	/**
	 * Asigna el archivo imagen proveniente de <ImagePicker/>
	 * @function handleChangeFile
	 * @param {File} file
	 */
	const handleChangeFile = file => {
		setFileImage(file);
	};

	/**
	 * Creacion y configuracion del formulario para crear un usuario
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			nombres: '',
			apellidos: '',
			email: '',
			rol: isSADM === true ? '' : 'PRV',
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
			rol: Yup.string().required('Es necesario asginar un rol al usuario.'),
		}),
		enableReinitialize: true,
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia createUserAsync con valores del form para crear un usario
			 * @function {async} create
			 */
			const create = async () => {
				return await dispatch(createUserAsync(accessToken, values, fileImage));
			};
			create()
				.then(() => {
					handleSnack(
						isSADM
							? 'Usuario creado exitosamente'
							: 'Proveedor' + ' creado exitosamente.',
						'success'
					);
					resetForm();
					setFileImage(null);
					setSubmitting(false);
				})
				.catch(() => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					setSubmitting(false);
				});
		},
	});
	const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Stack component={Card} sx={{ p: 2 }} spacing={2}>
					<ImagePicker
						id="create-user"
						label="foto"
						type="Circle"
						handleChangeFile={handleChangeFile}
					/>
					<TextField
						required
						fullWidth
						variant="outlined"
						size="small"
						label="Nombres"
						multiline
						placeholder="nombres"
						{...getFieldProps('nombres')}
						error={Boolean(touched.nombres && errors.nombres)}
						helperText={touched.nombres && errors.nombres}
					/>
					<TextField
						required
						fullWidth
						variant="outlined"
						size="small"
						label="Apellidos"
						multiline
						placeholder="Apellidos"
						{...getFieldProps('apellidos')}
						error={Boolean(touched.apellidos && errors.apellidos)}
						helperText={touched.apellidos && errors.apellidos}
					/>
					<TextField
						required
						fullWidth
						variant="outlined"
						size="small"
						label="Email"
						placeholder="Correo electrónico"
						{...getFieldProps('email')}
						error={Boolean(touched.email && errors.email)}
						helperText={touched.email && errors.email}
					/>
					{isSADM && (
						<FormControl fullWidth size="small">
							<InputLabel id="role-label">Rol</InputLabel>
							<Select
								labelId="role-label"
								label="Rol"
								fullWidth
								{...getFieldProps('rol')}
								error={Boolean(touched.rol && errors.rol)}
								size="small"
								inputProps={{}}>
								{rols.map(rol => (
									<MenuItem key={rol.rol} value={rol.rol}>
										{rol.label}
									</MenuItem>
								))}
							</Select>
							<FormHelperText sx={{ color: 'error.main' }}>
								{touched.rol && errors.rol}
							</FormHelperText>
						</FormControl>
					)}
					<Typography variant="body2" color="textSecondary">
						Nota: La contraseña se enviará al correo electrónico.
					</Typography>
					<LoadingButton
						isLoading={isSubmitting}
						text={isSADM ? 'Crear Usuario' : isADM && 'Crear Proveedor'}
					/>
				</Stack>
			</Form>
		</FormikProvider>
	);
}
export const rols = [
	{ id_rol: 2, rol: 'ADM', label: 'Administrador' },
	{ id_rol: 1, rol: 'PRV', label: 'Proveedor' },
];

export default UserRegisterForm;
