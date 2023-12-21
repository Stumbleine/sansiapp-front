import CryptoJS from 'crypto-js';

export const isEstudentEmail = email => {
	const array = email.split('@');
	return array[1] === 'est.umss.edu';
};

export const decrypt = encryptedData => {
	const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPT_SECRET_KEY);
	return JSON.parse(bytes, toString(CryptoJS.enc.Utf8));
};

export const encrypt = data => {
	return CryptoJS.AES.encrypt(JSON.stringify(data, process.env.ENCRYPT_SECRET_KEY));
};
