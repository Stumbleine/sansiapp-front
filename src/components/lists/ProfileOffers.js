import { LocalOffer } from '@mui/icons-material';
import {
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
/**
 * Componente lista para mostrar las principales ofertas en el perfil de una empresa
 * @component ProfileOffers
 * @property {Array} offers lista de ofertas de la empresa
 * @exports ProfileOffers
 */
export default function ProfileOffers({ offers }) {
	return (
		<Box>
			<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
				Ofertas
			</Typography>
			<List
				disablePadding
				sx={{
					width: '100%',
					maxHeight: 300,
					overflowY: 'auto',

					borderRadius: 2,
				}}>
				{offers ? (
					offers?.map((o, index) => (
						<ListItem key={index} alignItems="flex-start" sx={{ py: 0, px: 2 }}>
							<ListItemIcon sx={{ mt: 2 }}>
								<LocalOffer sx={{ color: 'text.icon' }} />
							</ListItemIcon>
							<ListItemText
								primary={o.title}
								secondary={
									o.discount +
									(o.discount_type === 'Porcentual' ? ' %' : ' Bs.') +
									' de descuento'
								}
							/>
						</ListItem>
					))
				) : (
					<Typography variant="body2" color="textSecondary" align="center">
						No tiene ofertas registradas.
					</Typography>
				)}
				{offers && (
					<Box sx={{ textAlign: 'end', width: '100%' }}>
						<Button component={Link} to="/main/offers">
							Ver más ofertas
						</Button>
					</Box>
				)}
			</List>
		</Box>
	);
}
