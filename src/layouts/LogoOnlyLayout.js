import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { AppBar, Container, Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

/**
 * Componente barra de navegacion para paginas publicas como error 404 que utiliza el componente Appbar de MUI,
 * @component LogoOnlyLayout
 * @exports LogoOnlyLayout
 */
export default function LogoOnlyLayout() {
	/**
	 * Contenedor estilizado
	 * @constant ContainerStyle
	 */
	const ContainerStyle = styled('div')(({ theme }) => ({
		// flexGrow: 1,
		overflow: 'auto',
		minHeight: '93vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	}));
	return (
		<>
			<AppBar
				position="static"
				elevation={1}
				sx={{
					background: 'white',
					zIndex: 'tooltip',
				}}>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Box
							component="div"
							noWrap
							sx={{
								flexGrow: 1,
								mr: 2,
							}}>
							<Logo />
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<ContainerStyle>
				<Outlet />
				<Footer />
			</ContainerStyle>
		</>
	);
}
