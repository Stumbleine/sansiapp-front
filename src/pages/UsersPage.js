import { Add } from '@mui/icons-material';
import {
	Button,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Pagination,
	Select,
	Stack,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import RoleLabel from '../components/label/RoleLabel';
import UsersTable from '../components/tables/UsersTable';
import { setPage, usersAsync } from '../store/usersSlice';
import { hasPrivilege } from '../Utils/RBAC';
import API from '../Utils/conection';
import Sponsor from '../components/cards/Sponsor';
/**
 * Pagina que muestra la tabla de usuarios del sistema
 * @component UsersPage
 * @exports UsersPage
 */
export default function UsersPage() {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const { page, total } = useSelector(state => state.users);
	const { user, isAdmin } = useSelector(state => state.user);
	const [isSADM, setSADM] = useState(false);
	const [isADM, setADM] = useState(false);
	const recognizeRole = () => {
		user?.roles.forEach(r => {
			if (r.name === 'SADM') {
				setSADM(true);
			}
			if (r.name === 'ADM') {
				setADM(true);
			}
		});
	};

	useEffect(() => {
		recognizeRole();
	}, [isSADM]);

	const [roles, setRoles] = useState([
		{ name: 'PRV', label: 'Proveedor' },
		{ name: 'ADM', label: 'Administrador' },
		{ name: 'SADM', label: 'SuperAdministrador' },
		{ name: 'EST', label: 'Estudiante' },
	]);

	const [search, setSearch] = useState('All');
	const [rol, setRol] = useState('All');
	const [sesion, setSesion] = useState('All');

	const privilegeCreate = hasPrivilege(
		['gestionar usuarios', 'crear usuario'],
		user.permisos
	);

	useEffect(() => {
		document.title = 'beneficios | usuarios';
		dispatch(usersAsync(accessToken, page, search, rol, sesion));
		/**
		 * Realiza una peticion para traer roles del sistema para usarlo en el filtrador
		 * @function {async} getRoles
		 */
	}, [page]);

	useEffect(() => {
		const getRoles = async () => {
			const r = await API.get('select/roles', {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			setRoles(r.data);
		};
		getRoles();
	}, []);

	/**
	 * Realiza dispatch hacia filterUsersAsync para filtrar usuarios por ROL
	 * @function handleRol
	 * @param {Object} event
	 */
	const handleRol = event => {
		setRol(event.target.value);
		dispatch(usersAsync(accessToken, page, search, event.target.value, sesion));
	};
	/**
	 * Realiza dispatch hacia filterUsersAsync para filtrar usuarios por estado de sesion
	 * @function handleSesion
	 * @param {Object} event
	 */
	const handleSesion = event => {
		setSesion(event.target.value);
		dispatch(usersAsync(accessToken, page, search, rol, event.target.value));
	};
	/**
	 * Realiza dispatch hacia filterUsersAsync para buscar usuarios por caracteres ingresado
	 * @function handleSearch
	 * @param {Object} event
	 */
	const handleSearch = values => {
		setSearch(values.search);
		dispatch(usersAsync(accessToken, page, values.search, rol, sesion));
	};

	// let { pageUrl } = useParams();
	const count = Math.ceil(total / 20);

	// useEffect(() => {
	// 	if (pageUrl != undefined) {
	// 		dispatch(setPageActual(pageUrl));
	// 	}
	// }, [pageUrl]);

	const handlePageActual = (event, value) => {
		dispatch(setPage(parseInt(value) - 1));
	};

	return (
		<Container maxWidth="lg">
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
						Usuarios
					</Typography>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						alignItems="center"
						sx={{
							mb: 3,
						}}
						spacing={2}>
						<FilterBar handleSearch={handleSearch}>
							<FormControl sx={{ minWidth: { xs: 1, sm: 160 } }} size="small">
								<InputLabel id="role-label">Rol</InputLabel>
								<Select
									labelId="role-label"
									id="role-filter"
									defaultValue={'All'}
									onChange={handleRol}
									input={<OutlinedInput id="role-filter" label="Rol" />}>
									<MenuItem value="All">Todos</MenuItem>
									{roles?.map(r => (
										<MenuItem key={r.name} value={r.name}>
											{r.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl sx={{ minWidth: { xs: 1, sm: 160 } }} size="small">
								<InputLabel id="sesion-label">Estado</InputLabel>
								<Select
									labelId="sesion-label"
									id="sesion-filter"
									defaultValue={'All'}
									onChange={handleSesion}
									input={<OutlinedInput id="sesion-filter" label="Estado" />}>
									<MenuItem value="All">Todos</MenuItem>
									<MenuItem value="online">Online</MenuItem>
									<MenuItem value="offline">Offline</MenuItem>
								</Select>
							</FormControl>
						</FilterBar>
						{privilegeCreate && (
							<Button
								to={`/main/createUser`}
								component={Link}
								sx={{ textDecoration: 'none', width: { xs: '100%', md: 'auto' } }}
								startIcon={<Add />}
								variant="contained">
								{isSADM ? 'Usuario' : isADM && 'Proveedor'}
							</Button>
						)}
					</Stack>
				</Box>
				<UsersTable></UsersTable>
				<Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
					<Pagination
						count={count}
						variant="outlined"
						shape="rounded"
						page={parseInt(page) + 1}
						onChange={handlePageActual}
					/>
				</Stack>
			</Box>
		</Container>
	);
}
