import { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../store/loginSlice';
import {
	Box,
	Button,
	CircularProgress,
	Container,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AlternateEmail, ArrowBack } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import SnackAlert from '../../components/SnackAlert';
import LoadingButton from '../../components/LoadingButton';
/**
 * Pagina donde se puede pedir recuperar la cuenta mediane un correo, al cual se enviara su contraseña
 * @component ForgotPasswordPage
 * @exports ForgotPasswordPage
 */
export default function ForgotPasswordPage() {
	const dispatch = useDispatch();
	const [forgot, setForgot] = useState(false);
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
	/**
	 * Creacion y configuracion del formulario para ingresar el correo
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email('El correo electrónico debe ser una dirección válida')
				.required('Correo electrónico es requerido'),
		}),
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Realiza dispatch a forgotPassword para solicitar una contraseña e instrucciones
			 * @function {async} fetch
			 */
			const fetch = async () => {
				return await dispatch(forgotPassword(values));
			};
			fetch()
				.then(r => {
					setForgot(true);
					handleSnack('Email enviado exitosamente.', 'success');
					resetForm();
					setSubmitting(false);
				})
				.catch(r => {
					handleSnack('Algo salió mal, vuelva a intentarlo', 'error');
					setSubmitting(false);
				});
		},
	});
	const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

	return (
		<Container maxWidth="sm">
			<SnackAlert data={snack} closeSnack={closeSnack} />
			<Button component={Link} to="/login" startIcon={<ArrowBack></ArrowBack>}>
				Volver
			</Button>
			{!forgot ? (
				<FormikProvider value={formik}>
					<Form onSubmit={handleSubmit}>
						<Box sx={{ my: 3 }}>
							<Typography variant="h4">Restablecer contraseña</Typography>
							<Typography color="textSecondary" sx={{ mt: 1 }}>
								Ingrese el correo electrónico asociado con su cuenta de
								beneficiosestudiantiles y nosotros enviaremos un correo con las
								instrucciones para restablecer su contraseña.
							</Typography>
						</Box>
						<TextField
							fullWidth
							margin="normal"
							label="Correo electrónico"
							type="email"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AlternateEmail />
									</InputAdornment>
								),
							}}
							sx={{ mb: 2 }}
							size="medium"
							variant="outlined"
							{...getFieldProps('email')}
							error={Boolean(touched.email && errors.email)}
							helperText={touched.email && errors.email}
						/>
						<LoadingButton isLoading={isSubmitting} text="Enviar" size="large" />
					</Form>
				</FormikProvider>
			) : (
				<Stack spacing={2}>
					<Box>
						<Typography variant="h4">Email enviado</Typography>
						<Typography color="textSecondary" sx={{ mt: 1 }}>
							Revisa tu correo
						</Typography>
					</Box>
					<Box
						component="img"
						src="/svgs/emailsent.svg"
						sx={{ height: 100, width: 'auto' }}
					/>
					<Button
						color="primary"
						fullWidth
						onClick={() => {
							setForgot(false);
						}}
						size="large"
						type="submit"
						variant="contained">
						Reenviar
					</Button>
				</Stack>
			)}
		</Container>
	);
}
