import { Business, Visibility, VisibilityOff, WarningAmber } from '@mui/icons-material';
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
	Avatar,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import OfferDetail from '../dialogs/OfferDetail';
import EditOffer from '../dialogs/EditOffer';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOfferAsync, soldOfferAsync } from '../../store/offersSlice';
import DeleteItem from '../dialogs/DeleteItem';
import EditOfferPB from '../dialogs/EditOfferPB';
import OfferStatusLabel from '../label/OfferStatusLabel';
import { hasPrivilege } from '../../Utils/RBAC';
import { useState } from 'react';
import { Transition } from '../../Utils/Transitions';

/**
 * Tarjeta de oferta que muestra informacion de una oferta, con la imagen, titulo, descuento y estado.
 * Ademas de incluir las acciones de editar y eliminar.
 * @component Offer
 * @property {Object} offer datos de la oferta, que incluye datos de la empresa a la que pertenece.
 * @property {Object} companies conjunto de empresas con id y razon social, es necesario para ustilizarlo en los componentes de edicion.
 * @property {Function} handleSnack funcion que llamar a un SnackBar Alert, para mostrar el resultado de una accion
 * @exports Offer
 */
export default function Offer({ offer, handleSnack, companies }) {
	/**
	 * Componente Box estilizado con el theme de MUI que es un contenedor del logo de empresa de una oferta,
	 * ubicada sobre el componente Image, con posicion absolute.
	 * @component BorderAvatar
	 * @property {Object} theme objeto de funciones que devuelven valores predeterminados del tema de MUI
	 * @exports BorderAvatar
	 */
	const BorderAvatar = styled(Box)(({ theme }) => ({
		width: 45,
		height: 45,
		zIndex: 9,
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		left: theme.spacing(2.8),
		bottom: theme.spacing(9.5),
		borderRadius: '50%',
		background: theme.palette.text.secondary,
	}));
	const dispatch = useDispatch();
	const { accessToken } = useSelector(state => state.login);
	const { user } = useSelector(state => state.user);

	/**
	 * Ejecuta el dispatch hacia la funcion deleteOfferAsync que hace la peticion DELETE para una oferta.
	 * @funcion deleteAsync
	 */
	const deleteAsync = id => {
		const delet = async () => {
			await dispatch(deleteOfferAsync(accessToken, id));
		};
		delet()
			.then(r => {
				handleSnack('Oferta eliminada exitosamente.', 'success');
			})
			.catch(e => {
				handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
			});
	};

	const soldAsync = id => {
		const sold = async () => {
			await dispatch(soldOfferAsync(accessToken, id));
		};
		sold()
			.then(r => {
				handleSnack('Oferta actualizada exitosamente.', 'success');
			})
			.catch(e => {
				handleSnack('Algo salió mal, vuelva a intentarlo.', 'error');
			});
	};

	const privilegeEdit = hasPrivilege(
		['gestionar ofertas', 'editar oferta'],
		user.permisos
	);

	const privilegeDelete = hasPrivilege(
		['gestionar ofertas', 'eliminar oferta'],
		user.permisos
	);
	return (
		<Card
			sx={{
				bgcolor: 'background.paper',
			}}>
			<OfferDetail offer={offer}>
				<CardMedia
					component="img"
					alt={offer.title}
					height="140"
					sx={{ objectFit: !offer.image && 'fill' }}
					onError={({ target }) => {
						target.onError = null;
						target.src = '/imgs/defaultImg.svg';
					}}
					image={offer?.image || '/imgs/defaultImg.svg'}
				/>
				<OfferStatusLabel elevated={true} status={offer?.status} />
				<BorderAvatar>
					<Avatar sx={{ width: 37, height: 37 }} src={offer.companie.logo}>
						<Business />
					</Avatar>
				</BorderAvatar>
				<CardContent sx={{ mt: 2 }}>
					<Typography
						gutterBottom
						component="div"
						variant="subtitle2"
						noWrap
						sx={{ fontWeight: 'bold' }}>
						{offer.title}
					</Typography>
					<Typography
						variant="body2"
						noWrap
						sx={{ overflow: 'hidden', color: 'text.secondary' }}>
						{offer.discount}
						{offer.discount_type === 'Porcentual' ? '%' : 'Bs.'} de descuento.
					</Typography>
					<Typography
						variant="body2"
						noWrap
						sx={{ overflow: 'hidden', color: 'text.secondary' }}>
						{offer.stock} disponibles en stock.
					</Typography>
				</CardContent>
			</OfferDetail>
			<CardActions sx={{ justifyContent: 'end' }}>
				<SoldOut
					soldAsync={soldAsync}
					id={offer.id_offer}
					status={offer.status}></SoldOut>
				{privilegeEdit && (
					<>
						<EditOfferPB offer={offer} handleSnack={handleSnack} />
						<EditOffer companies={companies} offer={offer} handleSnack={handleSnack} />
					</>
				)}
				{privilegeDelete && (
					<DeleteItem
						deleteAsync={deleteAsync}
						id={offer.id_offer}
						itemName={offer.title}
					/>
				)}
			</CardActions>
		</Card>
	);
}

export function SoldOut({ soldAsync, id, status }) {
	const [open, setOpen] = useState(false);
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
	/**
	 * Ejecuta la funcion de eliminacion.
	 * @function {async} submit
	 */
	const submit = async () => {
		await soldAsync(id);
	};

	return (
		<>
			<Tooltip title={status === 'AGOTADO' ? 'Mostrar' : 'Ocultar'}>
				<IconButton disabled={false} size="small" onClick={handleClickOpen}>
					{status === 'AGOTADO' ? (
						<VisibilityOff
							sx={{
								color: 'text.icon',
								'&:hover': {
									color: 'error.light',
								},
							}}
						/>
					) : (
						<Visibility
							sx={{
								color: 'text.icon',
								'&:hover': {
									color: 'error.light',
								},
							}}
						/>
					)}
				</IconButton>
			</Tooltip>
			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={open}
				TransitionComponent={Transition}
				onClose={handleClose}>
				<DialogTitle>
					{status === 'AGOTADO'
						? 'Esta seguro de mostrar esta oferta?'
						: 'Esta seguro de ocultar esta oferta?'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText display="flex" alignItems="center">
						<WarningAmber color="error" sx={{ mr: 1 }} />
						{status === 'AGOTADO'
							? 'Esta acción hara que la oferta se muestre a los estudiantes nuevamente.'
							: 'Esta acción hara que la oferta pase al estado AGOTADO, y no se mostrara a los estudiantes.'}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button sx={{ mr: 1 }} onClick={handleClose}>
						Cancelar
					</Button>
					<Button
						color="error"
						onClick={() => {
							submit().then(e => {
								handleClose();
							});
						}}>
						{status === 'AGOTADO' ? 'Mostrar' : 'Ocultar'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
