import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Skeleton,
	Stack,
} from '@mui/material';
import { Box } from '@mui/system';
/**
 * Tarjeta esqueleto para empresas con animacion de olas, sirve para indicar que los datos se estan cargando
 * @component SkeletonCompany
 * @exports SkeletonCompany
 */
export default function SkeletonCompany() {
	return (
		<Card>
			<CardMedia>
				<Skeleton animation="wave" variant="rectangular" height={140} />
			</CardMedia>
			<CardContent sx={{ pt: 2.5 }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Skeleton animation="wave" variant="text" width={125} />
				</Box>
				<Stack direction="row" spacing={2}>
					<Skeleton animation="wave" variant="circular" width={25} height={25} />
					<Skeleton animation="wave" variant="circular" width={25} height={25} />
					<Skeleton animation="wave" variant="circular" width={25} height={25} />
					<Skeleton animation="wave" variant="circular" width={25} height={25} />
				</Stack>
			</CardContent>
			<CardActions sx={{ justifyContent: 'end' }}>
				<Skeleton animation="wave" variant="circular" width={25} height={25} />
				<Skeleton animation="wave" variant="circular" width={25} height={25} />
			</CardActions>
		</Card>
	);
}
