import { Button, Container, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import RoleLabel from '../components/label/RoleLabel';
import CompanieRegisterForm from '../components/forms/CompanieRegisterForm';
import { ArrowBack } from '@mui/icons-material';
import WarningLabel from '../components/label/WarningLabel';
import { Link } from 'react-router-dom';
import SnackAlert from '../components/SnackAlert';
/**
 * Pagina con formulario registrar una empresa
 * @component CreateCompanyPage
 * @exports CreateCompanyPage
 */
export default function CreateCompanyPage() {
	const { user, isAdmin } = useSelector(state => state.user);
	useEffect(() => {
		document.title = 'beneficios | registro empresa';
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
						{isAdmin ? 'Añadir empresa proveedora' : 'Registrar empresa'}
					</Typography>
				</Box>
				{isAdmin || user.companie === null ? (
					<CompanieRegisterForm handleSnack={handleSnack} />
				) : (
					<Stack spacing={2} alignItems="center">
						<Typography>
							Su empresa fue registrado, ahora puede crear ofertas y productos para
							beneficiar estudiantes.
						</Typography>
						{(!user.companieVerified || !isAdmin) && (
							<WarningLabel>
								AVISO: Los administradores revisarán la solicitud de afiliación de su
								empresa a los beneficios estudiantiles, este proceso dura aproximadamente
								48 Hrs. Nos pondremos en contacto a su correo electrónico una vez
								terminada la revisión.
							</WarningLabel>
						)}
						<Button
							component={Link}
							variant="outlined"
							to="/"
							startIcon={<ArrowBack></ArrowBack>}>
							Volver a Inicio
						</Button>
					</Stack>
				)}
			</Box>
		</Container>
	);
}
