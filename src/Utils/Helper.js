/**
 * Convierte un archivo file a Base 64, usado para imagenes principalmente
 * @function convertToB64
 */
export const convertToB64 = file => {
	return new Promise((resolve, reject) => {
		(async () => {
            const reader = new FileReader();

            if (file[0].size > 500000) { // Comprimir si la imagen pesa más de 750KB
                const img = await comprimirImagen(file[0], 10)
                reader.readAsDataURL(new File([img], file[0].name, {
                    type: img.type,
                  }));
            } else {
                reader.readAsDataURL(file[0]);
            }

            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = error => {
                reject(error);
            };
        })()
	});
};

const comprimirImagen = (imagenComoArchivo, porcentajeCalidad) => {
    return new Promise((resolve, reject) => {
        const $canvas = document.createElement("canvas");
        const imagen = new Image();
        imagen.onload = () => {
            $canvas.width = imagen.width;
            $canvas.height = imagen.height;
            $canvas.getContext("2d").drawImage(imagen, 0, 0);
            $canvas.toBlob(
                (blob) => {
                    if (blob === null) {
                        return reject(blob);
                    } else {
                        resolve(blob);
                    }
                },
                "image/jpeg",
                porcentajeCalidad / 100
            );
        };
        imagen.src = URL.createObjectURL(imagenComoArchivo);
    });
};
