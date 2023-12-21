import { Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterBar from '../../components/FilterBar';
import LocationForm from '../../components/forms/LocationForm';
import RoleLabel from '../../components/label/RoleLabel';
import SnackAlert from '../../components/SnackAlert';
import LocationsTable from '../../components/tables/LocationsTable';
import { getLocationsAsync } from '../../store/umssSlice';
import '../../styles/scroll.css';
import Sponsor from '../../components/cards/Sponsor';
/**
 * Pagina para gestionar las locaciones registradas
 * @component LocationsPage
 * @exports LocationsPage
 */
export default function LocationsPage() {
	const { user, isAdmin } = useSelector(state => state.user);
	const { accessToken } = useSelector(state => state.login);
	const dispatch = useDispatch();
	useEffect(() => {
		document.title = 'beneficios | locaciones';
		dispatch(getLocationsAsync(accessToken));
	}, []);
	/**
	 * Buscador de locaciones por caracteres
	 * @function handleSearch
	 * @param {Object} values
	 */
	const handleSearch = values => {
		dispatch(getLocationsAsync(accessToken, values.search));
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

	return (
		<Container maxWidth="xl">
			<SnackAlert data={snack} closeSnack={closeSnack} />
			<Sponsor user={user} isAdmin={isAdmin} showWelcomeText={false} />
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
						Locaciones de la universidad
					</Typography>
				</Box>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6} lg={7}>
						<FilterBar handleSearch={handleSearch} />
						<LocationsTable handleSnack={handleSnack} />
					</Grid>
					<Grid item xs={12} md={6} lg={5}>
						<LocationForm handleSnack={handleSnack} />
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
