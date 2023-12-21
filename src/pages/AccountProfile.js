import { Edit } from '@mui/icons-material';
import {
	Avatar,
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Grid,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RoleLabel from '../components/label/RoleLabel';
import * as Yup from 'yup';
import { updateAccountAsync } from '../store/userSlice';
import SnackAlert from '../components/SnackAlert';
import { green } from '@mui/material/colors';
import ImagePicker from '../components/ImagePicker';
import { isEstudentEmail } from '../Utils/Validations.js';
import LoadingButton from '../components/LoadingButton';
/**
 * Pagina perfil de usuario que muestra la informacion del usuario
 * @component AccountProfile
 * @exports AccountProfile
 */
export default function AccountProfile() {
	const dispatch = useDispatch();
	const { user } = useSelector(state => state.user);
	const { accessToken } = useSelector(state => state.login);
	const [fileImage, setFileImage] = useState(null);
	const [updateAccount, setUpdateAccount] = useState(false);
	const handleChangeFile = file => {
		setFileImage(file);
	};
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
	 * Configuracion del formulario para editar la informacion del usuario
	 * propiedades:
	 * 	initialValues: inicializa valores del formulario,
	 * 	validationSchema: especifica la validacion de los campos, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			email: user?.email,
			nombres: user.nombres,
			apellidos: user.apellidos,
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
				.required('Nombres son requeridos')
				.matches(/[A-Za-z]+$/, 'No puede contener caracteres especiales y numeros.'),
			apellidos: Yup.string()
				.required('Apellidos son requeridos')
				.matches(/[A-Za-z]+$/, 'No puede contener caracteres especiales y numeros.'),
			email: Yup.string()
				.email('El correo electrónico debe ser una dirección válida')
				.required('Correo electrónico es requerido'),
		}),
		enableReinitialize: true,
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Realiza dispatch a updateAccountAsync para editar la informacion del usuario
			 * @function {async} fetch
			 */
			const fetch = async () => {
				return await dispatch(updateAccountAsync(accessToken, values, fileImage));
			};
			fetch()
				.then(r => {
					handleSnack('Cuenta actualizada exitosamente.', 'success');
					setSubmitting(false);
					setUpdateAccount(false);
					resetForm();
				})
				.catch(r => {
					handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
					setSubmitting(false);
				});
		},
	});
	const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
	return (
		<Container maxWidth="lg">
			<SnackAlert data={snack} closeSnack={closeSnack} />
			<Box>
				<Typography
					variant="h5"
					sx={{
						mb: 2,
						fontWeight: 'bold',
						color: 'text.title',
						fontStyle: 'italic',
					}}>
					Perfil de cuenta
				</Typography>
			</Box>
			<Grid spacing={2} container alignContent="center" justifyContent="center">
				{!updateAccount && (
					<Grid item xs={12} sm={10} md={6}>
						<Stack component={Card} sx={{ p: 2 }} spacing={2}>
							<Box
								sx={{
									width: '100%',
									alignItems: 'center',
									justifyContent: 'center',
									display: 'flex',
									flexDirection: 'column',
								}}>
								<Avatar
									src={user.picture}
									alt="avatar"
									sx={{ width: 150, height: 150 }}
								/>
								<Typography sx={{ mt: 1, fontWeight: 'bold' }}>{user.nombres}</Typography>
								<Typography sx={{ fontWeight: 'bold' }}>{user.apellidos}</Typography>
								<Typography>{user.email}</Typography>
								<RoleLabel />
							</Box>
							<Button
								onClick={() => {
									setUpdateAccount(true);
								}}
								color="primary"
								variant="outlined"
								startIcon={<Edit />}>
								Editar
							</Button>
						</Stack>
					</Grid>
				)}

				{updateAccount && (
					<Grid item xs={12} sm={10} md={6}>
						<FormikProvider value={formik}>
							<Form onSubmit={handleSubmit}>
								<Stack spacing={2} component={Card} sx={{ p: 2 }}>
									<ImagePicker
										label="foto"
										type="Circle"
										handleChangeFile={handleChangeFile}
										id="update-account"
										preload={user?.picture}
									/>
									<TextField
										required
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
										required
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
									<LoadingButton isLoading={isSubmitting} text="Guardar" />
									<Button
										onClick={() => {
											setUpdateAccount(false);
										}}
										color="primary"
										variant="outlined">
										Cancelar
									</Button>
								</Stack>
							</Form>
						</FormikProvider>
					</Grid>
				)}
			</Grid>
		</Container>
	);
}
