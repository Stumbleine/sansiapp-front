import { CalendarMonth, Refresh, Today, Warning } from '@mui/icons-material';
import {
	Box,
	Button,
	Card,
	CardHeader,
	Chip,
	CircularProgress,
	IconButton,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { offersViewChartAsync } from '../../store/statisticsSlice';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
/**
 * Grafico lineal para las visualizaciones de ofertas
 * @component OffersViewed
 * @exports OffersViewed
 */
export default function OffersViewed() {
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const { offersViewChart } = useSelector(state => state.statics);
	const [chartMode, setChartMode] = useState('daily');
	const [showRangeComponent, setShowRangeComponent] = useState(false);
	const [reload, setReload] = useState(false);
	const [status, setStatus] = useState({
		error: false,
		success: false,
		isLoading: false,
	});
	const end = moment().format('YYYY-MM-DD');
	const startMonthly = moment().subtract(1, 'year').format('YYYY-MM-DD');
	const startDaily = moment().subtract(1, 'month').format('YYYY-MM-DD');
	useEffect(() => {
		/**
		 * Ejecuta el dispatch hacia la peticion offersViewChartAsync que datos para el grafico
		 * @function {async} fetch
		 */
		const fetch = async () => {
			setStatus({ error: false, success: false, isLoading: true });
			return await dispatch(
				offersViewChartAsync(accessToken, startDaily, startMonthly, end)
			);
		};
		fetch()
			.then(r => {
				setStatus({ isLoading: false, error: false, success: true });
			})
			.catch(e => {
				setStatus({ isLoading: false, error: true, success: false });
			});
	}, [reload]);
	/**
	 * Configuracion de datos del grafico en yaxis por meses o dias.
	 * @constant data
	 */
	const data = [
		{
			name: 'Ofertas vistas',
			data: offersViewChart
				? chartMode === 'daily'
					? offersViewChart.daily?.data || []
					: offersViewChart.monthly?.data || []
				: [],
		},
	];

	/**
	 * Configuracion de propiedades del grafico de tipo Area
	 * @constant chartOptions
	 */
	const chartViewOptions = {
		chart: {
			type: 'area',
			zoom: {
				enabled: false,
			},
		},
		dataLabels: {
			enabled: true,
		},
		stroke: {
			curve: 'smooth',
		},
		grid: {
			row: {
				colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
				opacity: 0.5,
			},
		},
		xaxis: {
			categories: offersViewChart
				? chartMode === 'daily'
					? offersViewChart?.daily.labels
					: offersViewChart?.monthly.labels
				: null,
		},
		noData: {
			text: 'No hay datos para mostrar.',
			align: 'center',
			verticalAlign: 'middle',
			offsetX: 0,
			offsetY: 0,
			style: {
				color: '#547290',
				fontSize: '16px',
				// fontFamily: 'Helvetica',
			},
		},
	};
	/**
	 * Creacion y configuracion de formik para validaciones del formulario rango de fechas.
	 * propiedades:
	 * 	initialValues que inicializa valores del formulario,
	 * 	validationSchema: que especifica como deben sera los datos ingresado en un campo, usando la libreria yup
	 * 	onSubmit: Funcion que se ejecuta con el evento "submit"
	 * @constant formik
	 */
	const formik = useFormik({
		initialValues: {
			startDate: '',
			endDate: '',
		},
		validationSchema: Yup.object().shape({
			startDate: Yup.string().required(),
			endDate: Yup.string().required(),
		}),
		enableReinitialize: true,
		onSubmit: (values, { resetForm, setSubmitting }) => {
			/**
			 * Ejecuta el dispatch hacia la redeemedChartAsync con parametros indicados en los campos
			 * startDate, endDate
			 * @function {async} offersViewChartAsync
			 */
			const fetchDateRange = async () => {
				setStatus({ error: false, success: false, isLoading: true });
				return await dispatch(
					offersViewChartAsync(
						accessToken,
						values.startDate,
						values.startDate,
						values.endDate
					)
				);
			};
			fetchDateRange()
				.then(r => {
					setStatus({ isLoading: false, error: false, success: true });
					setSubmitting(false);
				})
				.catch(e => {
					setStatus({ isLoading: false, error: true, success: false });
					setSubmitting(false);
				});
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

	// useEffect(() => {
	// 	console.log(status);
	// }, [status]);

	return (
		<Stack component={Card}>
			<CardHeader
				title={
					<Typography
						component="span"
						display="flex"
						sx={{ fontSize: 17, fontWeight: 'bold', alignItems: 'center' }}>
						Ofertas visualizadas
						<Typography sx={{ fontSize: 14, ml: 1, color: 'text.secondary' }}>
							(Datos del último mes/año)
						</Typography>
					</Typography>
				}
			/>
			<Stack spacing={2} direction="row" sx={{ px: 3, pt: 1 }}>
				<Button
					size="small"
					variant="outlined"
					onClick={() => {
						setShowRangeComponent(!showRangeComponent);
					}}>
					{showRangeComponent ? 'Ocultar Rangos' : 'Elegir Rango'}
				</Button>
				<Chip
					sx={{ px: 1 }}
					label={chartMode === 'daily' ? 'Diariamente' : 'Mensualmente'}
					variant={chartMode === 'daily' ? 'filled' : 'outlined'}
					onClick={() => {
						setChartMode(chartMode === 'daily' ? 'monthly' : 'daily');
					}}
					icon={
						chartMode === 'daily' ? (
							<Today sx={{ color: 'text.icon' }} />
						) : (
							<CalendarMonth sx={{ color: 'text.icon' }} />
						)
					}
				/>
				<IconButton
					size="small"
					onClick={() => {
						setReload(!reload);
					}}>
					<Refresh />
				</IconButton>
			</Stack>
			{showRangeComponent && (
				<FormikProvider value={formik}>
					<Form onSubmit={handleSubmit}>
						<Stack
							spacing={1}
							direction="row"
							sx={{ mx: 3, mt: 1, background: grey[100], borderRadius: 1, p: 1 }}>
							<TextField
								size="small"
								type="date"
								{...getFieldProps('startDate')}
								error={Boolean(touched.startDate && errors.startDate)}
							/>
							<TextField
								size="small"
								type="date"
								{...getFieldProps('endDate')}
								error={Boolean(touched.endDate && errors.endDate)}
							/>
							<Button
								size="small"
								type="submit"
								disabled={isSubmitting}
								variant="contained">
								Consultar
							</Button>
						</Stack>
					</Form>
				</FormikProvider>
			)}
			<Box
				sx={{
					p: 1,
					minHeight: 390,
				}}>
				{status.isLoading === true ? (
					<Box
						width={1}
						sx={{
							py: 2,
							height: 390,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<CircularProgress
							size={24}
							sx={{
								color: green[500],
							}}
						/>
					</Box>
				) : (
					<ReactApexChart
						type="area"
						series={data}
						options={chartViewOptions}
						height={450}
					/>
				)}

				{/* {!offersViewChart && !status.isLoading && !status.error && (
					<ReactApexChart
						type="area"
						series={data}
						options={chartViewOptions}
						height={450}
					/>
				)} */}

				{/* {!status.isLoading && status.error && status.success && (
					<Box
						width={1}
						sx={{
							py: 2,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							background: 'pink',
						}}>
						<Typography textAlign="center">No hay datos para mostrar.</Typography>
					</Box>
				)} */}
			</Box>
		</Stack>
	);
}
