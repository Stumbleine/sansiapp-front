import { Container, Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterBar from '../../components/FilterBar';
import RoleLabel from '../../components/label/RoleLabel';
import SnackAlert from '../../components/SnackAlert';
import LinksTable from '../../components/tables/LinksTable';
import { getSitesAsync } from '../../store/umssSlice';
import LinkForm from '../../components/forms/LinkForm';
import Sponsor from '../../components/cards/Sponsor';
/**
 * Pagina para gestionar links del sistema
 * @component WebLinksPage
 * @exports WebLinksPage
 */
export default function WebLinksPage() {
	const { accessToken } = useSelector(state => state.login);
	const dispatch = useDispatch();
	const { user, isAdmin } = useSelector(state => state.user);

	useEffect(() => {
		document.title = 'beneficios | links';
		dispatch(getSitesAsync(accessToken, 'All'));
	}, []);

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
	 * Realiza la busqueda de links segun los caracteres ingresados
	 * @function closeSnack
	 * @param {Object} values
	 */
	const handleSearch = values => {
		dispatch(getSitesAsync(accessToken, values.search));
	};
	return (
		<Container maxWidth="xl">
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
						Links de la universidad
					</Typography>
				</Box>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6} lg={7}>
						<FilterBar handleSearch={handleSearch} />
						<LinksTable handleSnack={handleSnack} />
					</Grid>
					<Grid item xs={12} md={6} lg={5}>
						<LinkForm handleSnack={handleSnack} />
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
