import {
	Avatar,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../../store/loginSlice';
import { GoogleLogout } from 'react-google-login';
import { Lock, Logout, Person } from '@mui/icons-material';
import { logoutAsync } from '../../store/userSlice';
import { setNavlinks, setNotifications } from '../../store/settingSlice';
import { setCleanStatics } from '../../store/statisticsSlice';
/**
 * Menu de cuenta de usuario, muestra las configuraciones, seguridad y cerrar sesion
 * @component MenuAccount
 * @exports MenuAccount
 */
function MenuAccount() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	const { accessToken } = useSelector(state => state.login);

	const [anchorElUser, setAnchorElUser] = useState(null);
	const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
	/**
	 * Abre el menu
	 * @function handleOpenUserMenu
	 */
	const handleOpenUserMenu = event => {
		setAnchorElUser(event.currentTarget);
	};
	/**
	 * cierra el menu
	 * @function handleCloseUserMenu
	 */
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	/**
	 * limpia los datos del usuario y la sesion del usuario
	 * @function logOut
	 */
	const logOut = () => {
		dispatch(setCleanStatics());
		dispatch(setLogout());
		dispatch(setNavlinks([]));
		dispatch(setNotifications([]));
		dispatch(logoutAsync(accessToken));
		handleCloseUserMenu();
		// renderProps.onClick();
	};
	return (
		<Box sx={{ position: 'relative' }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					alignContent: 'center',
					position: 'relative',
				}}>
				<Tooltip title="Abrir perfil" sx={{}}>
					<IconButton
						onClick={handleOpenUserMenu}
						sx={{
							p: 0,
						}}>
						<Avatar alt={user.nombres} src={user?.picture} />
					</IconButton>
				</Tooltip>
			</Box>

			<Menu
				sx={{
					mt: '40px',
					mr: '10px',
					minWidth: 250,
					// borderRadius: 10,
					// background: 'pink',
				}}
				PaperProps={{ style: { borderRadius: 15 } }}
				id="menu-appbar"
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}>
				<Box sx={{ my: 1, px: 2.5 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} noWrap>
						{user.nombres} {user.apellidos}
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
						{user.email}
					</Typography>
				</Box>
				<Divider sx={{ my: 1 }} />

				<MenuItem
					sx={{ typography: 'body2', py: 1, px: 2.5 }}
					component={RouterLink}
					onClick={handleCloseUserMenu}
					to="profile">
					<Person
						sx={{
							mr: 2,
							width: 24,
							height: 24,
							color: 'text.secondary',
						}}
					/>{' '}
					Perfil
				</MenuItem>
				<MenuItem
					sx={{ typography: 'body2', py: 1, px: 2.5 }}
					component={RouterLink}
					onClick={handleCloseUserMenu}
					to="security">
					<Lock
						sx={{
							mr: 2,
							width: 24,
							height: 24,
							color: 'text.secondary',
						}}
					/>{' '}
					Seguridad
				</MenuItem>
				<GoogleLogout
					clientId={clientId}
					render={renderProps => (
						<MenuItem
							sx={{ typography: 'body2', py: 1, px: 2.5 }}
							onClick={() => logOut()}>
							<Logout
								sx={{
									mr: 2,
									width: 24,
									height: 24,
									color: 'text.secondary',
								}}
							/>{' '}
							Cerrar Sesión
						</MenuItem>
					)}
				/>
			</Menu>
		</Box>
	);
}

export default MenuAccount;
