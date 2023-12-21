import { useState } from 'react';
import { Image } from '@mui/icons-material';
import { Box, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
/**
 * Menu para mostrar notificaciones del sistema
 * @component Notifications
 * @property {Function} handleChangeFile envia el archivo imagen
 * @property {String} id indentificador del componente.
 * @property {String} type tipo de input 'Circle' o 'Rectangle'
 * @property {File} [preload] archivo imagen para previsualizar, si es necesario.
 * @property {Component} [children]
 * @exports Notifications
 */
export default function ImagePicker({
	handleChangeFile,
	id,
	type,
	label,
	preload,
	children,
	error,
}) {
	const [uploadHover, setUploadHover] = useState(false);
	const [logo, setLogo] = useState(preload !== undefined ? preload : null);
	/**
	 * Guarda el archivo imagen subido desde el input file
	 * @function handleChangeLogo
	 */
	const handleChangeLogo = e => {
		handleChangeFile(e.target.files);
		setLogo(URL.createObjectURL(e.target?.files[0]));
	};
	/**
	 * Estilos para el componente segun el type
	 * @constant styles
	 */
	const styles = {
		BoxContainerCircle: {
			width: '100%',
			minHeight: 210,
			display: 'center',
			justifyContent: 'center',
			alignItems: 'center',
		},
		BoxContainerRectangle: {
			width: '100%',
			minHeight: 210,
		},
		BoxContainer2Circle: {
			width: 200,
			height: 200,
			border: 1,
			borderStyle: 'dashed',
			borderRadius: '50%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		BoxMouseoverRectangle: {
			width: 'inherit',
			height: 250,
			display: 'flex',
			justifyContent: 'center',
			cursor: 'pointer',
			alignItems: 'center',
			borderRadius: 5,
			position: 'relative',
			background: grey[200],
			overflowY: 'hidden',
		},
		BoxMouseoverCircle: {
			width: '90%',
			height: '90%',
			display: 'flex',
			justifyContent: 'center',
			cursor: 'pointer',
			alignItems: 'center',
			borderRadius: '50%',
			position: 'relative',
			background: grey[200],
		},
		BoxImageRectangle: {
			width: '100%',
			height: '100%',
			borderRadius: 5,
			objectFit: 'cover',
		},
		BoxImageCircle: {
			width: '100%',
			height: '100%',
			borderRadius: '100%',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		},
	};
	return (
		<>
			<Box
				sx={type === 'Circle' ? styles.BoxContainerCircle : styles.BoxContainerRectangle}>
				<label htmlFor={id}>
					<TextField
						type={'file'}
						multiple
						id={id}
						onChange={handleChangeLogo}
						sx={{ display: 'none' }}
						inputProps={{ accept: 'image/*' }}
					/>
					<Box sx={type === 'Circle' ? styles.BoxContainer2Circle : null}>
						<Box
							component="span"
							onMouseOver={() => setUploadHover(true)}
							onMouseLeave={() => setUploadHover(false)}
							sx={
								type === 'Circle'
									? styles.BoxMouseoverCircle
									: styles.BoxMouseoverRectangle
							}>
							{logo === null ? (
								<Box
									sx={{
										textAlign: 'center',
									}}>
									<Image></Image>
									<Typography>Subir {label}</Typography>
								</Box>
							) : (
								<Box
									component="img"
									src={logo}
									style={
										type === 'Circle' ? styles.BoxImageCircle : styles.BoxImageRectangle
									}
									sx={{ zIndex: 'modal' }}></Box>
							)}
							{uploadHover && logo != null ? (
								<Box
									sx={{
										width: '100%',
										height: '100%',
										background: 'rgba(31, 30, 31, 0.3)',
										zIndex: 'tooltip',
										borderRadius: type === 'Circle' ? '50%' : 'inherit',
										position: 'absolute',
										textAlign: 'center',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<Box>
										<Image sx={{ color: 'white' }}></Image>
										<Typography sx={{ color: 'white' }}>Cambiar {label}</Typography>
									</Box>
								</Box>
							) : (
								<></>
							)}
						</Box>
					</Box>
				</label>
			</Box>

			{children}
			<Box sx={{ width: '100%', textAlign: 'center', my: 1 }}>
				<Typography variant="body2" color="textSecondary">
					Recomendación: subir imágenes de dimensiones{' '}
					{type === 'Circle' ? '4:3' : '16:9'} y formato *.png *.jpg
					{error && <div className="text-error">{error}</div>}
				</Typography>
			</Box>
		</>
	);
}
