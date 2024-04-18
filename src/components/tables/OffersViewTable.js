import {
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { offersViewAsync, setPage } from '../../store/statisticsSlice';
import SkeletonTable from '../skeletons/SkeletonTable';
/**
 * Tabla de ofertas con mas visualizaciones
 * @component OffersViewTable
 * @exports OffersViewTable
 */
export default function OffersViewTable() {
	const dispatch = useDispatch();

	const { accessToken } = useSelector(state => state.login);
	const { isAdmin } = useSelector(state => state.user);
	const { offersView, page, total } = useSelector(state => state.statics);
	const { selectRubros } = useSelector(state => state.companies);
	const [statusFetch, setStatusFetch] = useState({
		error: false,
		success: false,
		isLoading: false,
	});
	const [status, setStatus] = useState('All');
	const [rubro, setRubro] = useState('All');

	const handleStatus = event => {
		setStatus(event.target.value);
		dispatch(offersViewAsync(accessToken, page, rubro, event.target.value));
	};

	useEffect(() => {
		dispatch(getRubros(accessToken));
		/**
		 * Ejecuta el dispatch hacia la peticion offersViewAsync que devuelve una lista de ofertas top.
		 * @function {async} fetch
		 */
		const fetch = async () => {
			setStatusFetch({ error: false, success: false, isLoading: true });
			return await dispatch(offersViewAsync(accessToken, page, rubro, status));
		};
		fetch()
			.then(r => {
				setStatusFetch({ isLoading: false, error: false, success: true });
			})
			.catch(e => {
				setStatusFetch({ isLoading: false, error: true, success: false });
			});
	}, []);

	const TABLE_HEAD = [{ id: 'oferta', label: 'Oferta' },{ id: 'status', label: 'Estado' } ];
	isAdmin && TABLE_HEAD.push({ id: 'empresa', label: 'Empresa' });
	isAdmin && TABLE_HEAD.push({ id: 'rubro', label: 'Rubro' });
	TABLE_HEAD.push({ id: 'vis', label: 'Vistas' });
	TABLE_HEAD.push({ id: 'canjeados', label: 'Canjeados' });

	const count = Math.ceil(total / 10);
	const handlePageActual = (event, value) => {
		dispatch(setPage(parseInt(value) - 1));
	};
	const handleRubro = event => {
		setRubro(event.target.value);
		dispatch(offersViewAsync(accessToken, page, event.target.value, status));
	};
	return (
		<Box>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				alignItems="center"
				sx={{
					mb: 3,
				}}
				spacing={2}>
				<FormControl sx={{ minWidth: { xs: 1, sm: 160 } }} size="small">
					<InputLabel id="offerStatus-label">Estado</InputLabel>
					<Select
						labelId="offerStatus-label"
						id="offerStatus-filter"
						defaultValue={'All'}
						onChange={handleStatus}
						input={<OutlinedInput id="offerStatus-filter" label="Estado" />}>
						<MenuItem value="All">Todos</MenuItem>
						<MenuItem value="VIGENTE">Vigente</MenuItem>
						<MenuItem value="EXPIRADO">Expirado</MenuItem>
					</Select>
				</FormControl>
				<FormControl sx={{ minWidth: { xs: 1, sm: 160 } }} size="small">
					<InputLabel id="rubro-label">Rubro</InputLabel>
					<Select
						labelId="rubro-label"
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
			</Stack>
			<TableContainer component={Paper} sx={{ borderRadius: 2 }}>
				<Table size="small">
					<TableHead sx={{ bgcolor: 'primary.main' }}>
						<TableRow>
							{TABLE_HEAD.map(cell => (
								<TableCell align="center" key={cell.id} sx={{ color: 'white', py: 1 }}>
									<Typography noWrap> {cell.label}</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{offersView
							? offersView?.map(offer => (
								<TableRow key={offer.id_beneficio} hover>
									<TableCell component="th" scope="row">
										<Stack alignItems="center" direction="row" spacing={1}>
											<Box
												component="img"
												alt={offer.titulo}
												onError={({ target }) => {
													target.onError = null;
													target.src = '/imgs/defaultImg.svg';
												}}
												src={offer?.image || '/imgs/defaultImg.svg'}
												sx={{
													maxWidth: 55,
													borderRadius: 2,
													objectFit: !offer.image && 'fill',
												}}
											/>
											<Typography
												style={{
													maxWidth: 150,
													whiteSpace: 'nowrap',
													textOverflow: 'ellipsis',
													overflow: 'hidden',
												}}>
												{offer.titulo}
											</Typography>
										</Stack>
									</TableCell>
									<TableCell align="center">
										<Typography
											variant="body2"
											sx={{ color: 'text.secondary' }}
											noWrap>
											{offer.status}
										</Typography>
									</TableCell>

									{isAdmin && <TableCell align="center">{offer.company.razon_social}</TableCell>}
									{isAdmin && <TableCell align="center">{offer.company.rubro}</TableCell>}
									<TableCell align="center">
										<Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
											{offer.count}
										</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
											{offer.count_redeemed}
										</Typography>
									</TableCell>
								</TableRow>
							))
							: statusFetch.isLoading && <SkeletonTable head={TABLE_HEAD} />}
					</TableBody>
				</Table>

				{(statusFetch.error || (!offersView && !statusFetch.isLoading)) && (
					<Box width={1} sx={{ py: 2 }}>
						<Typography textAlign="center" color="textSecondary">
							No hay datos para mostrar.
						</Typography>
					</Box>
				)}
			</TableContainer>
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
	);
}
