import { Card, CardMedia, Grid, Stack, Typography } from '@mui/material';
import { green, grey, orange } from '@mui/material/colors';
import { Box } from '@mui/system';

/**
 * Tarjeta para mostrar los datos del estudiante que ha canjeado el codigo, realizado mediante el formulario del cajero.
 * @component Student
 * @property {Object} offer datos de la oferta relacionada con el codigo de canje.
 * @property {Object} student datos del estudiante que genero el codigo.
 * @exports Student
 */
export default function Student({ offer, student }) {
	return (
		<Grid container justifyContent="center">
			<Grid item sm={6} xs={12}>
				<Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }} width={1}>
					<Box
						component="img"
						src={student?.picture}
						sx={{ borderRadius: 5, minWidth: 200, height: 'auto' }}></Box>
				</Box>
			</Grid>
			<Grid item sm={6} xs={12}>
				<Stack sx={{ p: 1 }} spacing={1}>
					<Box>
						<Typography sx={{ fontWeight: 'bold' }}>Universitario</Typography>
						<Typography> {student?.nombres + ' ' + student?.apellidos}</Typography>
					</Box>
					<Box>
						<Typography sx={{ fontWeight: 'bold' }}>Correo </Typography>
						<Typography>{student?.email}</Typography>
					</Box>
					<Box>
						<Typography sx={{ fontWeight: 'bold' }}>Codigo valido para</Typography>
						<Card elevation={0} sx={{ background: grey[200], mt: 1, display: 'flex' }}>
							<CardMedia component="img" image={offer?.image} sx={{ maxWidth: 100 }} />
							<Box sx={{ p: 1 }}>
								<Typography>{offer?.title}</Typography>
								{offer?.type_discount === 'Porcentual' && (
									<Typography color="textSecondary">
										descuento: {offer?.discount} %
									</Typography>
								)}
								{offer?.type_discount === 'Monetario' && (
									<Typography color="textSecondary">
										descuento: Bs. {offer?.discount}
									</Typography>
								)}
								{offer?.type_discount === 'Descripcion' && (
									<Typography color="textSecondary">{offer?.discount}</Typography>
								)}
								<Typography color="textSecondary">stock: {offer?.stock}</Typography>
							</Box>
						</Card>
					</Box>
					<Box
						sx={{
							fontWeight: 'bold',
							color: green[500],
							textAlign: 'center',
							width: 1,
							p: 1,
						}}>
						¡Código canjeado!
					</Box>
					{offer.stock < 5 && (
						<Box
							sx={{
								fontWeight: 'bold',
								background: orange[700],
								textAlign: 'center',
								width: 1,
								p: 1,
								borderRadius: 5,
							}}>
							<Typography color="white">
								Aviso: El stock de su oferta es baja, tome precauciones para evitar
								confusiones sobre la disponibilidad.
							</Typography>
						</Box>
					)}
				</Stack>
			</Grid>
		</Grid>
	);
}
