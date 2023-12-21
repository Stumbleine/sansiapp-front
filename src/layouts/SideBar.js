import { useTheme } from '@emotion/react';
import { Avatar, Drawer, Link, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';

/**
 * Componente barra de navegacion SideBar que utiliza el componente Drawer de MUI,
 * Se muestra como barra de navegacion alternativa en pantallas pequeñas, aparece el lado izquierdo, cuando se presione sobre el boton Menu
 * @component SideBar
 * @property { Boolean } openSideBar parametro que indica cuando se abre el sideBar.
 * @property { Function } onCloseSideBar funcion para cerrar el sideBar..
 * @exports SideBar
 */

export default function SideBar({ openSideBar, onCloseSideBar }) {
	const theme = useTheme();
	const { pathname } = useLocation();
	const { user } = useSelector(state => state.user);
	const navlinks = useSelector(state => state.setting.navlinks);
	useEffect(() => {
		if (openSideBar) {
			onCloseSideBar();
		}
	}, [pathname]);
	return (
		<Drawer open={openSideBar} onClose={onCloseSideBar}>
			<Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
				<Logo />
			</Box>
			<Box sx={{ mb: 5, mx: 2 }}>
				<Link underline="none" component={RouterLink} to="#">
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							p: 2,
							background: theme.palette.background.default,
							borderRadius: 3,
						}}>
						<Avatar src={user.picture} alt="photoURL" />
						<Box
							sx={{
								ml: 2,
							}}>
							<Typography variant="subtitle2" noWrap sx={{ color: 'text.primary' }}>
								{user.nombres + ' ' + user.apellidos}
							</Typography>
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								{user?.email}
							</Typography>
						</Box>
					</Box>
				</Link>
			</Box>
			{/* contenido */}
			<Box sx={{ px: 2.5 }}>
				{navlinks.map(item => (
					<MenuItem
						key={item.name}
						sx={{
							py: 2,
							px: 2,
							borderRadius: 2,
							color: 'text.secondary',
						}}
						component={RouterLink}
						to={item.path}>
						<Box
							component="img"
							src={`/svgs/icons/nav/${item.icon}.svg`}
							style={{ color: 'red' }}
							sx={{
								marginRight: '20px',
								width: 26,
								height: 26,
							}}
						/>
						{item.name}
					</MenuItem>
				))}
			</Box>
		</Drawer>
	);
}
