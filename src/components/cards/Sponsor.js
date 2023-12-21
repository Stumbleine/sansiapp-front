import { Box, Button, Dialog, Divider, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Transition } from '../../Utils/Transitions';
import { useState } from 'react';

function Sponsor({ user, isAdmin, showWelcomeText = false }) {
	return (
		<Stack
			spacing={2}
			sx={{ bgcolor: 'primary.main', borderRadius: 2.5, my: 2, py: 2.5 }}
			alignItems="center">
			<Stack spacing={1} direction="row">
				<Typography
					color="white"
					sx={{
						fontWeight: 'bold',
						lineHeight: 1,
						textAlign: { xs: 'center', md: 'left' },
						fontSize: 40,
						fontFamily: 'Roboto condensed',
					}}>
					AMIGOS DE
				</Typography>
				<Typography
					color="secondary"
					sx={{
						fontWeight: 'bold',
						lineHeight: 1,
						textAlign: { xs: 'center', md: 'left' },
						fontSize: 40,
						fontFamily: 'Roboto condensed',
					}}>
					SAN SIMÓN
				</Typography>
			</Stack>
			{showWelcomeText && (
				<Stack>
					<Typography
						color="textSecondary"
						variant="h5"
						fontWeight="bold"
						textAlign="center">
						¡Hola {user.nombres}, Bienvenido!
					</Typography>
					{user?.companie == null && !isAdmin && <DialogSteps user={user} />}
				</Stack>
			)}
		</Stack>
	);
}

export default Sponsor;

function DialogSteps({ user }) {
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
	return (
		<>
			<Typography
				component={Button}
				onClick={handleClickOpen}
				variant="overline"
				color="textSecondary"
				sx={{
					textAlign: 'end',
					textDecorationLine: 'underline',
					textTransform: 'capitalize',
				}}>
				Mostrar tips
			</Typography>
			<Dialog
				PaperProps={{ style: { borderRadius: 15 } }}
				open={open}
				onClose={handleClose}
				disableEscapeKeyDown={true}
				TransitionComponent={Transition}>
				<Stack spacing={2} maxWidth="md" alignItems="center">
					<Box sx={{ p: 2, width: '100%' }}>
						<Typography variant="h6">#1 Registrar su empresa</Typography>
						<Typography color="textSecondary">
							Antes de publicar su ofertas, es necesario registrar su empresa y ser
							aprobado por los administradores, de esta forma los estudiantes conocerán
							más sobre su empresa.
						</Typography>
						<Box sx={{ textAlign: 'end', mt: 2 }}>
							<Button
								component={Link}
								to={
									user.companieVerified
										? '/main/profileCompanie'
										: `/main/registerCompanie`
								}
								variant="contained">
								Registrar Empresa
							</Button>
						</Box>
					</Box>
					<Box sx={{ p: 2, width: '100%' }}>
						<Typography variant="h6">#2 Registrar productos</Typography>
						<Typography color="textSecondary">
							Registrar los productos o servicios que ofrece su empresa (paso opcional)
						</Typography>
						<Box sx={{ textAlign: 'end', mt: 2 }}>
							<Button component={Link} to={`/main/products`} variant="contained">
								Agregar Producto
							</Button>
						</Box>
					</Box>
					<Box sx={{ p: 2, width: '100%' }}>
						<Typography variant="h6">#3 Publicar sus ofertas</Typography>
						<Typography color="textSecondary">
							Al publicar sus ofertas se mostrarán a los beneficiarios con todos los
							detalles acerca de su empresa y productos.
						</Typography>
						<Box sx={{ textAlign: 'end', mt: 2 }}>
							<Button component={Link} to={`/main/createOffer`} variant="contained">
								Publicar oferta
							</Button>
						</Box>
					</Box>
				</Stack>
			</Dialog>
		</>
	);
}
