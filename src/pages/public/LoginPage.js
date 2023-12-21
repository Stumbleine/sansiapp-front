import { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
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
import { Box } from '@mui/system';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../store/loginSlice';
import LoadingButton from '../../components/LoadingButton';
/**
 * Pagina con formulario para iniciar sesion
 * @component LoginPage
 * @exports LoginPage
 */
export default function LoginPage() {
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState(false);

	/**
	 * Creacion y configuracion del formulario para iniciar sesion
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			remember: true,
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email('El correo electrónico debe ser una dirección válida')
				.required('Correo electrónico es requerido'),
			password: Yup.string().required('Contraseña es requerido'),
		}),
		onSubmit: (values, { resetForm, setSubmitting }) => {
			const login = async () => {
				return await dispatch(loginAsync(values));
			};
			login()
				.then(r => {
					setLoginError(false);
					resetForm();
					setSubmitting(false);
				})
				.catch(e => {
					setLoginError(true);
					setSubmitting(false);
					// setMsgError(e.response.data);
				});
		},
	});
	const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;
	/**
	 * Muestra la contraseña oculta o vicerversa.
	 * @constant handleShowPassword
	 */
	const handleShowPassword = () => {
		setShowPassword(show => !show);
	};
	return (
		<Container maxWidth="sm">
			<FormikProvider value={formik}>
				<Form onSubmit={handleSubmit}>
					<Button component={Link} to="/" startIcon={<ArrowBack></ArrowBack>}>
						Inicio
					</Button>
					<Box sx={{ my: 2 }}>
						<Typography variant="h4">Iniciar Sesión</Typography>
						<Typography>Ingrese sus datos</Typography>
					</Box>
					<Stack spacing={3}>
						<TextField
							fullWidth
							autoComplete="username"
							margin="normal"
							label="Correo electrónico"
							type="email"
							variant="outlined"
							{...getFieldProps('email')}
							error={Boolean(touched.email && errors.email)}
							helperText={touched.email && errors.email}
						/>
						<TextField
							fullWidth
							margin="normal"
							label="Contraseña"
							variant="outlined"
							autoComplete="current-password"
							type={showPassword ? 'text' : 'password'}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={handleShowPassword}>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								),
							}}
							{...getFieldProps('password')}
							error={Boolean(touched.password && errors.password)}
							helperText={touched.password && errors.password}
						/>
						<LoadingButton isLoading={isSubmitting} text="Iniciar Sesion" size="large" />
						<Stack direction="row" justifyContent="flex-end">
							<Typography
								component={Link}
								to="/forgot-password"
								variant="body2"
								color="textSecondary"
								sx={{ textDecorationLine: 'underline' }}>
								¿olvidó su contraseña?
							</Typography>
						</Stack>
						{loginError && (
							<Typography color="error" variant="body2" textAlign="center">
								Las credenciales no son válidas, vuelva a intentarlo
							</Typography>
						)}
					</Stack>
				</Form>
			</FormikProvider>
		</Container>
	);
}
