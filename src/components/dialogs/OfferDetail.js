import { Check } from '@mui/icons-material';
import {
	Button,
	CardActionArea,
	Dialog,
	DialogActions,
	DialogContent,
	CardMedia,
	Typography,
	Avatar,
	List,
	ListItem,
	ListItemText,
	Divider,
	ListItemIcon,
	Chip,
	Stack,
	Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React from 'react';
import OfferStatusLabel from '../label/OfferStatusLabel';
import { Transition } from '../../Utils/Transitions';

/**
 * Dialogo que muestra la informacion sobre una oferta, que se abre al hacer click sobre el componente <CardActionArea/>
 * @component OfferDetail
 * @property {Object} offer datos de la oferta a modificar.
 * @property {Component} children recive un componente <CardActionArea/>
 * @exports OfferDetail
 */
export default function OfferDetail({ offer, children }) {
	moment.locale('es');
	const [open, setOpen] = React.useState(false);
	/**
	 * Cambia el estado open a true (abre el dialogo)
	 * @function handleClickOpen
	 */
	const handleClickOpen = () => {
		setOpen(true);
	};
	/**
	 * Cambia el estado open a false (cierra el dialogo)
	 * @function handleClose
	 */
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<>
			<CardActionArea onClick={handleClickOpen}>{children}</CardActionArea>
			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}>
				<Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
					<Avatar alt="logo" src={offer.companie?.logo} sx={{ width: 32, height: 32 }} />
					<Typography component="div" sx={{ fontWeight: 'bold', ml: 1, flexGrow: 1 }}>
						{offer.companie?.razon_social}
					</Typography>
					<Tooltip title="Cantidad canjeados">
						<Typography sx={{ fontSize: 19, fontWeight: 'bold', mr: 2 }}>
							{offer?.cant_redeemed}
						</Typography>
					</Tooltip>
					<OfferStatusLabel status={offer?.status} />
				</Box>

				<CardMedia
					height="200"
					component="img"
					sx={{ objectFit: !offer.image && 'fill' }}
					onError={({ target }) => {
						target.onError = null;
						target.src = '/imgs/defaultImg.svg';
					}}
					image={offer?.image || '/imgs/defaultImg.svg'}
				/>
				<DialogContent sx={{ px: 2, py: 1, minWidth: 420, maxWidth: 450 }}>
					<Stack spacing={0.5}>
						<Box sx={{}}>
							<Typography
								component="div"
								variant="subtitle1"
								noWrap
								sx={{ fontWeight: 'bold', flexGrow: 1 }}>
								{offer?.title}
							</Typography>
							<Typography color="textSecondary">
								{offer?.discount}{' '}
								{offer?.discount_type === 'Porcentual'
									? '% de descuento'
									: 'Bs. de descuento'}
							</Typography>
						</Box>
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								Stock
							</Typography>
							<Typography component="div" color="textSecondary">
								{offer?.stock}
							</Typography>
						</Box>
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								Duración
							</Typography>
							<Typography component="div" color="textSecondary">
								{moment(offer?.start_date).format('LL') +
									' hasta ' +
									moment(offer?.end_date).format('LL')}
							</Typography>
						</Box>
						{offer?.conditions ? (
							<Box>
								<Typography sx={{ fontWeight: 'bold' }}>
									Descripción/Condiciones
								</Typography>

								<Typography color="textSecondary" component="div">
									{offer?.conditions}
								</Typography>
							</Box>
						) : null}
						<Typography
							component="div"
							variant="subtitle1"
							noWrap
							sx={{ fontWeight: 'bold' }}>
							Productos incluidos
							{!offer?.products && (
								<Typography color="textSecondary">Todos los productos</Typography>
							)}
						</Typography>
						<Box>
							{offer.products?.map((p, index) => (
								<Chip key={index} label={p.name} sx={{ mr: 1 }} />
							))}
						</Box>
						<Typography
							component="div"
							variant="subtitle1"
							noWrap
							sx={{ fontWeight: 'bold' }}>
							Disponible en{' '}
							{!offer?.branch_offices && (
								<Typography color="textSecondary">Todas las sucursales</Typography>
							)}
						</Typography>
						<List sx={{ width: '100%', borderRadius: 2 }} disablePadding>
							{offer.branch_offices?.map((branch, index) => (
								<Box key={index}>
									<ListItem
										alignItems="flex-start"
										sx={{ alignItems: 'center', py: 0, px: 1 }}>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText
											primary={<Typography variant="body1">{branch?.name}</Typography>}
											secondary={
												<Typography color="textSecondary" variant="body2">
													{branch?.address}
												</Typography>
											}
										/>
									</ListItem>
									{index !== offer.branch_offices?.length - 1 && (
										<Divider variant="inset" />
									)}
								</Box>
							))}
						</List>
						<Box>
							<Typography sx={{ fontWeight: 'bold' }}>Frecuencia de canje</Typography>
							<Typography color="textSecondary">
								{offer?.frequency_redeem === 'no-redeem' && 'Sin canje'}
								{offer?.frequency_redeem === 'unlimited' && 'Ilimitado'}
								{offer?.frequency_redeem === 'one' && 'Una vez'}
							</Typography>
						</Box>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cerrar</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
