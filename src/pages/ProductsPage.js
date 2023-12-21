import { Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductForm from '../components/forms/ProductForm';
import ProductsTable from '../components/tables/ProductsTable';
import RoleLabel from '../components/label/RoleLabel';
import { productsAsync } from '../store/productsSlice';
import { hasPrivilege } from '../Utils/RBAC';
import WarningLabel from '../components/label/WarningLabel';
import SnackAlert from '../components/SnackAlert';
import API from '../Utils/conection';
import Sponsor from '../components/cards/Sponsor';
/**
 * Pagina que muestra una tabla de productos y formulario para agregar nuevos productos
 * @component ProductsPage
 * @exports ProductsPage
 */

export default function ProductsPage() {
	const { user, isAdmin } = useSelector(state => state.user);
	const { profile } = useSelector(state => state.companies);
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const privilegeCreate = hasPrivilege(
		['gestionar productos', 'crear producto'],
		user.permisos
	);
	const [companies, setCompanies] = useState(null);

	useEffect(() => {
		dispatch(productsAsync(accessToken));
		document.title = 'beneficios | productos';
		/**
		 * Hace peticion al servidor para traer empresas, que es usado en el filtro
		 * @function {async} getCompanies
		 */
		const getCompanies = async () => {
			const r = await API.get('select/companies', {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			setCompanies(r.data);
		};
		isAdmin && getCompanies();
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
	return (
		<Container maxWidth="lg">
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
						{isAdmin ? 'Productos' : 'Mis productos'}
					</Typography>
				</Box>
				{!isAdmin &&
					(user?.companieVerified === false || profile?.companie?.verified === false) && (
						<WarningLabel>
							¡Sus productos no son visibles para estudiantes, debido a que su empresa a
							un no fue verificado!
						</WarningLabel>
					)}

				<Grid container spacing={2}>
					<Grid item xs={12} md={privilegeCreate ? 7 : 12}>
						<ProductsTable handleSnack={handleSnack} companies={companies} />
					</Grid>
					{privilegeCreate && (
						<Grid item xs={12} md={5}>
							<ProductForm handleSnack={handleSnack} companies={companies} />
						</Grid>
					)}
				</Grid>
			</Box>
		</Container>
	);
}
