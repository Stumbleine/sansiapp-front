import {
	Card,
	CircularProgress,
	Container,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CodeGenerated from '../components/charts/CodeGenerated';
import CodeRedeemed from '../components/charts/CodeRedeemed';
import OffersViewTable from '../components/tables/OffersViewTable';
import RoleLabel from '../components/label/RoleLabel';
import { summaryAsync } from '../store/statisticsSlice';
import OffersViewed from '../components/charts/OffersViewed';
import Sponsor from '../components/cards/Sponsor';
/**
 * Pagina que muestras graficos de estadisticas sobre el consumo, visualizacion de ofertas
 * @component StaticsPage
 * @exports StaticsPage
 */
export default function StaticsPage() {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const { summary } = useSelector(state => state.statics);
	const { user, isAdmin } = useSelector(state => state.user);
	const [status, setStatus] = useState({
		error: false,
		success: false,
		isLoading: false,
	});

	useEffect(() => {
		document.title = 'beneficios | estadísticas';
		/**
		 * Realiza dispatch a summaryAsync para cargar los totales de estadisticas
		 * @function {async} fetch
		 */
		const fetch = async () => {
			setStatus({ ...status, isLoading: true });
			return await dispatch(summaryAsync(accessToken));
		};
		fetch()
			.then(r => {
				setStatus({ isLoading: false, error: false, success: true });
			})
			.catch(e => {
				setStatus({ isLoading: false, error: true, success: false });
			});
	}, []);

	return (
		<Container maxWidth="xl">
			<Sponsor user={user} isAdmin={isAdmin} showWelcomeText={false} />

			<Box>
				<Box>
					<Typography
						variant="h5"
						sx={{
							mb: 2,
							fontWeight: 'bold',
							color: 'text.title',
							fontStyle: 'italic',
						}}>
						Estadísticas
					</Typography>
				</Box>
				<Stack
					sx={{ mb: 2, justifyContent: 'center' }}
					spacing={2}
					direction={{ xs: 'column', sm: 'row' }}>
					<Box sx={{ textAlign: 'center', p: 2 }} component={Card}>
						{status.isLoading ? (
							<CircularProgress
								size={24}
								sx={{
									color: green[500],
								}}
							/>
						) : (
							<Typography sx={{ fontSize: 30, lineHeight: 1, fontWeight: 'bold' }}>
								{summary?.total_views || summary?.total_views === 0
									? summary.total_views
									: status.error && '0'}
							</Typography>
						)}
						<Typography variant="body2" color="textSecondary">
							Visualizaciones totales
						</Typography>
					</Box>
					<Box sx={{ textAlign: 'center', alingItems: 'center', p: 2 }} component={Card}>
						{status.isLoading ? (
							<CircularProgress
								size={24}
								sx={{
									color: green[500],
								}}
							/>
						) : (
							<Typography sx={{ fontSize: 30, lineHeight: 1, fontWeight: 'bold' }}>
								{summary?.total_codes || summary?.total_codes === 0
									? summary.total_codes
									: status.error && '0'}
							</Typography>
						)}
						<Typography variant="body2" color="textSecondary">
							Códigos generados totales
						</Typography>
					</Box>
					<Box sx={{ textAlign: 'center', p: 2 }} component={Card}>
						{status.isLoading ? (
							<CircularProgress
								size={24}
								sx={{
									color: green[500],
								}}
							/>
						) : (
							<Typography sx={{ fontSize: 30, lineHeight: 1, fontWeight: 'bold' }}>
								{summary?.total_redeemed || summary?.total_redeemed === 0
									? summary.total_redeemed
									: status.error && '0'}
							</Typography>
						)}
						<Typography color="textSecondary" variant="body2">
							Códigos canjeados totales
						</Typography>
					</Box>
				</Stack>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<OffersViewTable />
					</Grid>
					<Grid item xs={12}>
						<OffersViewed />
					</Grid>
					<Grid item xs={12} md={6}>
						<CodeGenerated />
					</Grid>
					<Grid item xs={12} md={6}>
						<CodeRedeemed />
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
