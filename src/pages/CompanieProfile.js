import {
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RoleLabel from '../components/label/RoleLabel';
import ProfileOffers from '../components/lists/ProfileOffers';
import ProfileSucursals from '../components/lists/ProfileSucursals';
import ProfileProducts from '../components/lists/ProfileProducts';
import ProfileUsers from '../components/lists/ProfileUsers';
import {
	approveCompanieAsync,
	getProveedores,
	getRubros,
	profileCompanieAsync,
	setCompanieProfile,
} from '../store/companiesSlice';
import SkeletonProfile from '../components/skeletons/SkeletonProfile';
import ProfileInformation from '../components/ProfileInformation';
import WarningLabel from '../components/label/WarningLabel';
import RejectCompany from '../components/dialogs/RejectCompany';
import SnackAlert from '../components/SnackAlert';
import { green } from '@mui/material/colors';
import LoadingButton from '../components/LoadingButton';
import Sponsor from '../components/cards/Sponsor';
/**
 * Pagina perfil de empresa, que muestra toda la informacion de la empresa
 * @component CompanieProfile
 * @exports CompanieProfile
 */
export default function CompanieProfile() {
	const dispatch = useDispatch();
	const { idCompanie } = useParams();
	const { user, isAdmin } = useSelector(state => state.user);
	const { accessToken } = useSelector(state => state.login);
	const [isSubmitting, setSubmitting] = useState(false);
	const { profile, isLoadingProfile, profileFailed } = useSelector(
		state => state.companies
	);
	const [reload, setReload] = useState(false);
	/**
	 * Carga la informacion de la empresa
	 * @function  useEffect
	 */
	useEffect(() => {
		document.title = 'beneficios | empresa';
		if (idCompanie) {
			dispatch(profileCompanieAsync(accessToken, idCompanie));
		} else if (user.companie && !isAdmin) {
			dispatch(profileCompanieAsync(accessToken, user.companie));
		} else {
			dispatch(setCompanieProfile(null));
		}
		dispatch(getProveedores(accessToken));
		dispatch(getRubros(accessToken));
	}, [reload]);

	useEffect(() => {
		if (profile) {
			document.title = 'beneficios | ' + profile?.companie?.razon_social;
		}
	}, [profile]);
	/**
	 * Componente para indicar que la empresa no ha sido registrado
	 * @constant {Component} msgCompanieNull
	 */
	const msgCompanieNull = () => {
		return (
			<Stack maxWidth="lg" spacing={2} alignItems="center" sx={{ mt: 2 }}>
				<Typography>No ha registrado su empresa</Typography>
				<Typography color="textSecondary">
					Registrar su empresa ayudará a que sus ofertas sean fácilmente relacionadas con
					su empresa{' '}
				</Typography>
				<Button component={Link} to={`/main/registerCompanie`} variant="contained">
					Registrar Empresa
				</Button>
			</Stack>
		);
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
	 * Realiza dispatch hacia approveCompanieAsync para aprobar una empresa
	 * @function submitApprove
	 */
	const submitApprove = () => {
		setSubmitting(true);
		/**
		 * @function {async} approve
		 */
		const approve = async () => {
			await dispatch(approveCompanieAsync(accessToken, profile?.companie.id_empresa));
		};
		approve()
			.then(() => {
				handleSnack('Se aprobó la empresa exitosamente.', 'success');
				setSubmitting(false);
				setReload(!reload);
			})
			.catch(() => {
				handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
				setSubmitting(false);
			});
	};
	return (
		<Container maxWidth="lg">
			<SnackAlert data={snack} closeSnack={closeSnack} />
			{!isAdmin && <Sponsor user={user} isAdmin={isAdmin} showWelcomeText={true} />}
			<Box>
				<Typography
					variant="h5"
					sx={{
						mb: 2,
						fontWeight: 'bold',
						color: 'text.title',
						fontStyle: 'italic',
					}}>
					Perfil{' '}
					{profile?.companie.razon_social && 'de ' + profile?.companie.razon_social}
				</Typography>
				{!isAdmin &&
					(user?.companieVerified === false || profile?.companie?.verified === false) && (
						<WarningLabel>En proceso de verificación.</WarningLabel>
					)}
				{isLoadingProfile && isAdmin ? (
					<SkeletonProfile />
				) : profile ? (
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12} md={6} lg={6}>
							<Paper sx={{ p: 2, borderRadius: 2 }}>
								<Stack spacing={1}>
									<ProfileInformation
										companie={profile?.companie}
										handleSnack={handleSnack}
									/>
									<ProfileSucursals
										sucursales={profile?.branch_offices}
										handleSnack={handleSnack}
									/>
								</Stack>
							</Paper>
						</Grid>

						<Grid item xs={12} sm={12} md={6} lg={6}>
							<Paper sx={{ p: 2, borderRadius: 2 }}>
								<Stack spacing={1}>
									<ProfileUsers users={profile?.users} handleSnack={handleSnack} />
									{/* lista de productos */}
									<ProfileProducts products={profile?.products} />
									{/* lista de ofertas */}
									<ProfileOffers offers={profile?.offers} />
									{isAdmin && !profile?.companie.verified && !profile?.companie.rejected && (
										<>
											<Typography sx={{ fontWeight: 'bold' }}>
												Responder a solicitud
											</Typography>
											<Box sx={{ display: 'flex', justifyContent: 'end' }}>
												<LoadingButton
													isLoading={isSubmitting}
													text="Aprobar"
													onClick={submitApprove}
												/>
												<RejectCompany
													companie={profile?.companie}
													handleSnack={handleSnack}
													setReload={setReload}
													reaload={reload}
												/>
											</Box>
										</>
									)}
								</Stack>
							</Paper>
						</Grid>
					</Grid>
				) : isLoadingProfile ? (
					<SkeletonProfile />
				) : profileFailed ? (
					<>
						<Box
							sx={{
								textAlign: 'center',
							}}>
							<Typography align="center">No se encontró la empresa.</Typography>
							<Button
								sx={{ mt: 2 }}
								variant="outlined"
								onClick={() => {
									setReload(true);
								}}>
								Recargar
							</Button>
						</Box>
					</>
				) : (
					msgCompanieNull()
				)}
			</Box>
		</Container>
	);
}
