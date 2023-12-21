import {
	Avatar,
	Button,
	Card,
	CircularProgress,
	Container,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { amber, green, red } from '@mui/material/colors';
import { Box } from '@mui/system';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import RoleLabel from '../components/label/RoleLabel';
import Student from '../components/cards/Student';
import * as Yup from 'yup';
import { Warning } from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { deleteUserAsync } from '../store/usersSlice';
import SnackAlert from '../components/SnackAlert';
import SkeletonList from '../components/skeletons/SkeletonList';
import DeleteItem from '../components/dialogs/DeleteItem';
import { hasPrivilege } from '../Utils/RBAC';
import { cashiersAsync, redeemAsync } from '../store/cashierSlice';
import LoadingButton from '../components/LoadingButton';
import Sponsor from '../components/cards/Sponsor';
/**
 * Pagina para el cajero
 * @component RedeemPage
 * @exports RedeemPage
 */
export default function RedeemPage() {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const { cashiers, isLoading, fetchFailed, redeemResponse } = useSelector(
		state => state.cashier
	);
	const { user, isAdmin } = useSelector(state => state.user);
	const [reload, setReload] = useState(false);
	const [redeemError, setRedeemError] = useState(false);
	const [redeemSuccess, setRedeemSuccess] = useState(false);

	useEffect(() => {
		document.title = 'beneficios | cajero';
		!isAdmin && dispatch(cashiersAsync(accessToken));
	}, [reload]);

	const formik = useFormik({
		initialValues: {
			code: '',
		},
		validationSchema: Yup.object().shape({
			code: Yup.string().required('Es necesario introducirse un codigo'),
		}),
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Realiza dispatch a redeemAsync para canjear un codigo de canje
			 * @function {async} redeem
			 */
			const redeem = async () => {
				return await dispatch(redeemAsync(accessToken, values));
			};
			redeem()
				.then(r => {
					setRedeemSuccess(true);
					resetForm();
					setRedeemError(false);
					setSubmitting(false);
				})
				.catch(e => {
					setRedeemError(true);
					setRedeemSuccess(false);
					setSubmitting(false);
				});
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
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
	 * Realiza dispatch hacia deleteUserAsync para eliminar un cajero
	 * @function deleteAsync
	 */
	const deleteAsync = id => {
		/**
		 * @function {async} delet
		 */
		const delet = async () => {
			await dispatch(deleteUserAsync(accessToken, id));
		};
		delet()
			.then(r => {
				handleSnack('Cajero eliminado exitosamente.', 'success');
				setReload(!reload);
			})
			.catch(e => {
				handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
			});
	};
	/**
	 * Componente que muestra cuando existe un error con el codigo ingresado
	 * @constant {Component} codeError
	 */
	const codeError = () => {
		return (
			<Box width={1} sx={{ borderRadius: 3, background: red[100], p: 2, mt: 2 }}>
				<Typography color="error" textAlign="center">
					¡El código no está relacionado con sus ofertas, o no existe!
				</Typography>
			</Box>
		);
	};
	/**
	 * Componente que muestra cuando el codigo ya fue canjeado por un estudiante
	 * @constant {Component} codeErrorRedeemed
	 */
	const codeErrorRedeemed = () => {
		return (
			<Box width={1} sx={{ borderRadius: 3, background: amber[200], p: 2, mt: 2 }}>
				<Typography color="warning" textAlign="center">
					¡El código ya fue canjeado anteriormente!
				</Typography>
				<Typography color="warning" textAlign="center">
					por el estudiante:{' '}
					{redeemResponse?.student.nombres + ' ' + redeemResponse?.student.apellidos}
				</Typography>
			</Box>
		);
	};
	return (
		<Container maxWidth="lg">
			<Sponsor user={user} isAdmin={isAdmin} showWelcomeText={false} />
			<SnackAlert data={snack} closeSnack={closeSnack} />

			<Box>
				<Box>
					<Typography
						variant="h5"
						sx={{
							mb: 3,
							fontWeight: 'bold',
							color: 'text.title',
							fontStyle: 'italic',
						}}>
						Cajero
					</Typography>
				</Box>
				<Grid container spacing={2} justifyContent="center">
					<Grid item xs={12} md={8}>
						<FormikProvider value={formik}>
							<Form onSubmit={handleSubmit}>
								<Stack component={Card} sx={{ p: 2 }} spacing={2}>
									{/* panel resumen */}
									<Typography variant="h6" fontWeight="bold" textAlign="center">
										Formulario de canje
									</Typography>
									<TextField
										label="Codigo"
										size="small"
										placeholder="introduce el codigo de canje"
										maxRows={10}
										{...getFieldProps('code')}
										error={Boolean(touched.code && errors.code)}
										helperText={touched.code && errors.code}
									/>
									<LoadingButton isLoading={isSubmitting} text="Verificar codigo" />
								</Stack>
								{redeemError
									? codeError()
									: redeemResponse?.redeemed
									? codeErrorRedeemed(redeemResponse?.redeemed)
									: redeemSuccess && (
											<Paper sx={{ p: 2, mt: 2 }}>
												<Student
													offer={redeemResponse?.offer}
													student={redeemResponse?.student}
												/>
											</Paper>
									  )}
							</Form>
						</FormikProvider>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
