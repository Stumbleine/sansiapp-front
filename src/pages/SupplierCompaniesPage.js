import { Add, Pending } from '@mui/icons-material';
import {
	Container,
	Grid,
	Typography,
	Stack,
	Button,
	Chip,
	FormControl,
	InputLabel,
	Select,
	OutlinedInput,
	MenuItem,
	CircularProgress,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import RoleLabel from '../components/label/RoleLabel';
import Company from '../components/cards/Company';
import { hasPrivilege } from '../Utils/RBAC';
import {
	compNotVerifiedAsync,
	filterCompaniesAsync,
	getCompaniesAsync,
	getRubros,
} from '../store/companiesSlice';
import CompanyNotVerified from '../components/cards/CompanyNotVerified';
import SkeletonCompany from '../components/skeletons/SkeletonCompany';
import FilterBar from '../components/FilterBar';
import SnackAlert from '../components/SnackAlert';
import { green } from '@mui/material/colors';
import Sponsor from '../components/cards/Sponsor';
/**
 * Pagina que enlista las empresas registradas, aprobadas y que enviaron solicitud de afiliación
 * @component SupplierCompaniesPage
 * @exports SupplierCompaniesPage
 */
export default function SupplierCompaniesPage() {
	const dispatch = useDispatch();
	const { isLoading, companies, companiesNV, selectRubros, filterLoading, fetchFailed } =
		useSelector(state => state.companies);
	const { user, isAdmin } = useSelector(state => state.user);
	const { accessToken } = useSelector(state => state.login);
	const [showButton, setShowButton] = useState(false);
	const [showNVCompanies, setNVCompanies] = useState(false);
	const [search, setSearch] = useState('All');
	const [rubro, setRubro] = useState('All');

	useEffect(() => {
		document.title = 'beneficios | empresas';
		if (hasPrivilege(['crear empresa', 'gestionar empresas'], user.permisos) || isAdmin) {
			setShowButton(true);
		}
		dispatch(getCompaniesAsync(accessToken));
		dispatch(compNotVerifiedAsync(accessToken));
		dispatch(getRubros(accessToken));
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
	 * Muestra la lista de empresa no verificadas y rechazadas
	 * @function handleClick
	 */
	const handleClick = () => setNVCompanies(!showNVCompanies);
	/**
	 * Realiza dispatch a filterCompaniesAsync para filtrar empresas segun su rubro
	 * @function handleRubro
	 * @param {Object} event
	 */
	const handleRubro = event => {
		setRubro(event.target.value);
		dispatch(filterCompaniesAsync(accessToken, search, event.target.value));
	};
	/**
	 * Realiza dispatch hacia filterCompaniesAsync para una busqueda de empresas por caracteres ingresados
	 * @function handleSearch
	 * @param {Object} values
	 *
	 */
	const handleSearch = values => {
		setSearch(values.search);
		dispatch(filterCompaniesAsync(accessToken, values.search, rubro));
	};
	/**
	 * Muestra un mensaje en caso de no existir empresas.
	 * @constant {Component} MsgCompaniesNull
	 */
	const MsgCompaniesNull = props => {
		return (
			<Stack spacing={2} justifyContent="center" sx={{ mt: 2, width: 1 }}>
				<Typography align="center">{props.children}</Typography>
			</Stack>
		);
	};
	/**
	 * Lista de empresas no verificadas.
	 * @constant {Component} listCompaniesNV
	 */
	const listCompaniesNV = () => {
		return (
			<>
				{companiesNV.pending.length >= 0 && !filterLoading && !fetchFailed
					? companiesNV?.pending.map((companie, index) => (
							<Grid item key={index} xs={6} sm={4} md={3}>
								<CompanyNotVerified companie={companie} handleSnack={handleSnack} />
							</Grid>
					  ))
					: (isLoading || filterLoading) &&
					  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]?.map((sk, index) => (
							<Grid item key={index} xs={6} sm={4} md={3}>
								<SkeletonCompany />
							</Grid>
					  ))}
				{(fetchFailed ||
					(companiesNV.pending.length === 0 && !isLoading && !filterLoading)) && (
					<MsgCompaniesNull>No hay solicitudes de afiliación</MsgCompaniesNull>
				)}
				{companiesNV?.rejected.map((companie, index) => (
					<Grid item key={index} xs={6} sm={4} md={3}>
						<CompanyNotVerified companie={companie} handleSnack={handleSnack} />
					</Grid>
				))}
			</>
		);
	};
	/**
	 * Lista de empresas aprobadas.
	 * @constant {Component} listCompanies
	 */
	const listCompanies = () => {
		return (
			<>
				{companies && !filterLoading && !fetchFailed
					? companies.map((companie, index) => (
							<Grid item key={index} xs={6} sm={4} md={3} xl={3}>
								<Company handleSnack={handleSnack} companie={companie} />
							</Grid>
					  ))
					: (isLoading || filterLoading) &&
					  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]?.map((sk, index) => (
							<Grid item key={index} xs={6} sm={4} md={3}>
								<SkeletonCompany />
							</Grid>
					  ))}
				{(fetchFailed || (!companies && !isLoading && !filterLoading)) && (
					<MsgCompaniesNull>No se han registrado empresas.</MsgCompaniesNull>
				)}
			</>
		);
	};
	return (
		<Container maxWidth="lg">
			<SnackAlert data={snack} closeSnack={closeSnack} />
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
						Empresas
					</Typography>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						alignItems="center"
						sx={{ mb: 3 }}
						spacing={2}>
						<FilterBar handleSearch={handleSearch}>
							<FormControl sx={{ minWidth: { xs: 1, sm: 160 } }} size="small">
								<InputLabel id="rubrof-label">Rubro</InputLabel>
								<Select
									labelId="rubrof-label"
									id="rubro-filter"
									defaultValue={'All'}
									onChange={handleRubro}
									input={<OutlinedInput id="rubro-filter" label="Rubro" />}>
									<MenuItem value="All">Todos</MenuItem>
									{selectRubros?.map(r => (
										<MenuItem key={r.nombre} value={r.nombre}>
											{r.nombre}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Chip
								label={
									<Typography variant="body2" component="span">
										Pendientes ({companiesNV ? companiesNV.pending?.length : '0'})
									</Typography>
								}
								variant={showNVCompanies ? 'filled' : 'outlined'}
								onClick={handleClick}
								icon={<Pending></Pending>}
							/>
						</FilterBar>

						{showButton && (
							<Button
								sx={{ width: { xs: '100%', md: 'auto' } }}
								component={Link}
								to="/main/registerCompanie"
								startIcon={<Add />}
								variant="contained">
								Empresa
							</Button>
						)}
					</Stack>
				</Box>
				<Grid container spacing={2}>
					{showNVCompanies === true ? listCompaniesNV() : listCompanies()}
				</Grid>
			</Box>
		</Container>
	);
}
