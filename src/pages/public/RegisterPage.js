import {
	Button,
	CircularProgress,
	Container,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/system';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { registerAsync } from '../../store/loginSlice';
import { green } from '@mui/material/colors';
import SnackAlert from '../../components/SnackAlert';
import { isEstudentEmail } from '../../Utils/Validations';
import LoadingButton from '../../components/LoadingButton';
/**
 * Pagina con formulario para registrarse como proveedor en el sistema
 * @component RegisterPage
 * @exports RegisterPage
 */
export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const dispatch = useDispatch();
	/**
	 * Creacion y configuracion del formulario para registrarse en el sistema
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			picture: 'null',
			nombres: '',
			apellidos: '',
			email: '',
			password: '',
			confirm: '',
			rol: 'proveedor',
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
				.required('El campo nombres es obligatorio.')
				.max(35, 'Cantidad de caracteres maxima permitida es de 35')
				.matches(
					/^(?![ .]+$)[a-zA-Z .]*$/,
					'No puede contener caracteres especiales y numeros.'
				),
			apellidos: Yup.string()
				.required('El campo apellidos es obligatorio.')
				.max(35, 'Cantidad de caracteres maxima permitida es de 35')
				.matches(
					/^(?![ .]+$)[a-zA-Z .]*$/,
					'No puede contener caracteres especiales y numeros.'
				),
			email: Yup.string()
				.email('El email es invalido.')
				.required('El campo email es obligatorio.'),
			password: Yup.string()
				.required('El campo contraseña es obligatorio.')
				.matches(
					/^(?=.*[A-Za-z])(?=.*\d)(?=.)[A-Za-z\d]{8,}$/,
					'Debe contener almenos 8 Caracteres, 1 mayuscula, 1 minuscula, 1 numero.'
				),
			confirm: Yup.string()
				.oneOf([Yup.ref('password'), null], 'Las contraseñas deben ser iguales')
				.required('El campo confirmar contraseña es obligatorio.'),
		}),
		onSubmit: async (values, { resetForm, setSubmitting }) => {
			const register = async () => {
				await dispatch(registerAsync(values));
			};
			register()
				.then(r => {
					handleSnack('Registro exitoso, redirigiendo...', 'success', '/login');
					resetForm();
					setSubmitting(false);
				})
				.catch(e => {
					if (e?.response?.status === 409) {
						handleSnack(e?.response.data.message, 'error');
					} else {
						handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					}
					setSubmitting(false);
				});
		},
	});
	const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

	const [snack, setSnack] = useState({
		open: false,
		msg: '',
		severity: 'success',
		redirectPath: null,
	});
	/**
	 * Cierra una alerta <SnackAlert/>
	 * @function closeSnack
	 */
	const closeSnack = () => {
		setSnack({ ...snack, open: false });
	};
	/**
	 * Muestra una alerta <SnackAlert/> con su mensaje
	 * @function handleSnack
	 * @param {String} msg mensaje que se mostrara en la alerta
	 * @param {String} sv tipo de severidad/evento afecta al color de la alerta.
	 * @param {String} [path] ruta de redireccion
	 */
	const handleSnack = (msg, sv, path) => {
		setSnack({ ...snack, open: true, msg: msg, severity: sv, redirectPath: path });
	};

	return (
		<Container maxWidth="sm">
			<Box>
				<Button component={RouterLink} to="/" startIcon={<ArrowBack></ArrowBack>}>
					Inicio
				</Button>
				<Box sx={{ my: 3 }}>
					<Typography color="textPrimary" variant="h4" gutterBottom>
						Registrarse
					</Typography>
					<Typography sx={{ color: 'text.secondary' }}>Ingrese sus datos.</Typography>
				</Box>
				<FormikProvider value={formik}>
					<Form onSubmit={handleSubmit} autoComplete="off">
						<Stack spacing={3}>
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
								<TextField
									sx={{ borderRadius: 2 }}
									fullWidth
									multiline
									label="Nombres"
									{...getFieldProps('nombres')}
									error={Boolean(touched.nombres && errors.nombres)}
									helperText={touched.nombres && errors.nombres}
								/>

								<TextField
									fullWidth
									multiline
									label="Apellidos"
									{...getFieldProps('apellidos')}
									error={Boolean(touched.apellidos && errors.apellidos)}
									helperText={touched.apellidos && errors.apellidos}
								/>
							</Stack>

							<TextField
								sx={{ borderRadius: 2 }}
								fullWidth
								autoComplete="email"
								type="email"
								label="Correo electrónico"
								{...getFieldProps('email')}
								error={Boolean(touched.email && errors.email)}
								helperText={touched.email && errors.email}
							/>

							<TextField
								sx={{ borderRadius: 2 }}
								fullWidth
								autoComplete="current-password"
								type={showPassword ? 'text' : 'password'}
								label="Contraseña"
								{...getFieldProps('password')}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												edge="end"
												onClick={() => setShowPassword(prev => !prev)}>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									),
								}}
								error={Boolean(touched.password && errors.password)}
								helperText={touched.password && errors.password}
							/>
							<TextField
								sx={{ borderRadius: 2 }}
								fullWidth
								autoComplete="current-password"
								type={showPassword ? 'text' : 'password'}
								label="Confirmar contraseña"
								{...getFieldProps('confirm')}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												edge="end"
												onClick={() => setShowPassword(prev => !prev)}>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									),
								}}
								error={Boolean(touched.confirm && errors.confirm)}
								helperText={touched.confirm && errors.confirm}
							/>
							<LoadingButton isLoading={isSubmitting} text="Registrarse" size="large" />
						</Stack>
					</Form>
				</FormikProvider>
				<SnackAlert data={snack} closeSnack={closeSnack} />
			</Box>
		</Container>
	);
}
