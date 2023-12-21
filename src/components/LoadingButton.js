import { Box, Button, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';

export default function LoadingButton({ isLoading, text, onClick, size }) {
	return (
		<Box sx={{ position: 'relative' }}>
			<Button
				color="primary"
				fullWidth
				size={size}
				type="submit"
				disabled={isLoading}
				onClick={onClick}
				variant="contained">
				{text}
			</Button>
			{isLoading && (
				<CircularProgress
					size={24}
					sx={{
						color: green[500],
						position: 'absolute',
						top: '50%',
						left: '50%',
						marginTop: '-12px',
						marginLeft: '-12px',
					}}
				/>
			)}
		</Box>
	);
}
