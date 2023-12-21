import {
	Box,
	Button,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	Stack,
	TableCell,
	Typography,
} from '@mui/material';
import moment from 'moment';
import React from 'react';
import { Transition } from '../../Utils/Transitions';

export default function ProductDetail({ product, children }) {
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
			<TableCell onClick={handleClickOpen}>{children}</TableCell>
			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={false}
				TransitionComponent={Transition}
				onClose={handleClose}>
				<Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
					<Typography component="div" sx={{ fontWeight: 'bold', ml: 1, flexGrow: 1 }}>
						{product?.name}
					</Typography>
				</Box>
				<CardMedia
					height="200"
					component="img"
					sx={{ objectFit: !product?.image && 'fill' }}
					onError={({ target }) => {
						target.onError = null;
						target.src = '/imgs/defaultImg.svg';
					}}
					image={product?.image || '/imgs/defaultImg.svg'}
				/>
				<DialogContent sx={{ px: 2, py: 1, minWidth: 420, maxWidth: 450 }}>
					<Stack spacing={0.5}>
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								Descripción
							</Typography>
							<Typography component="div" color="textSecondary" noWrap>
								{product?.description}
							</Typography>
						</Box>
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								Precio
							</Typography>
							<Typography component="div" color="textSecondary" noWrap>
								Bs. {product?.price}
							</Typography>
						</Box>
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								Empresa
							</Typography>
							<Typography component="div" color="textSecondary" noWrap>
								{product?.companie}
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
