import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

import OfferForm from '../components/forms/OfferForm';
import RoleLabel from '../components/label/RoleLabel';
import SnackAlert from '../components/SnackAlert';
/**
 * Pagina con formulario para la creacion de ofertas
 * @component CreateOfferPage
 * @exports CreateOfferPage
 */
export default function CreateOfferPage() {
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
						Crear nueva oferta
					</Typography>
				</Box>

				<OfferForm handleSnack={handleSnack} />
			</Box>
		</Container>
	);
}
