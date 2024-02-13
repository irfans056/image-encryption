const fs = require('fs');
const crypto = require('crypto');
const readlineSync = require('readline-sync');

function generateKey() {
    // Generate a random key using a secure method
    return crypto.randomBytes(32);
}

function encryptImage(imagePath, key) {
    const imageBuffer = fs.readFileSync(imagePath);

    // Create an IV (Initialization Vector)
    const iv = crypto.randomBytes(16);

    // Create a cipher using AES-256-CBC algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the image buffer
    const encryptedImage = Buffer.concat([cipher.update(imageBuffer), cipher.final()]);

    // Save the IV and encrypted image to a new file
    const encryptedPath = `${imagePath.split('.')[0]}_encrypted.${imagePath.split('.')[1]}`;
    fs.writeFileSync(encryptedPath, Buffer.concat([iv, encryptedImage]));

    console.log(`Image encrypted successfully. Save this key for decryption: ${key.toString('base64')}`);
}

function decryptImage(encryptedPath, key) {
    const encryptedData = fs.readFileSync(encryptedPath);

    // Extract the IV and encrypted image from the file
    const iv = encryptedData.slice(0, 16);
    const encryptedImage = encryptedData.slice(16);

    // Create a decipher using AES-256-CBC algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the image buffer
    const decryptedImage = Buffer.concat([decipher.update(encryptedImage), decipher.final()]);

    // Save the decrypted image to a new file
    const decryptedPath = `${encryptedPath.split('_encrypted')[0]}_decrypted.${encryptedPath.split('.')[1]}`;
    fs.writeFileSync(decryptedPath, decryptedImage);

    console.log('Image decrypted successfully.');
}

function main() {
    const action = readlineSync.question('Enter action (encrypt/decrypt): ');

    if (action === 'encrypt' || action === 'decrypt') {
        const imagePath = readlineSync.question('Enter the path to the image file: ');

        if (!fs.existsSync(imagePath)) {
            console.error('Error: Image file not found.');
            return;
        }

        if (action === 'encrypt') {
            const key = generateKey();
            encryptImage(imagePath, key);
        } else {
            const keyBase64 = readlineSync.question('Enter the decryption key: ');
            const key = Buffer.from(keyBase64, 'base64');
            decryptImage(imagePath, key);
        }
    } else {
        console.error('Error: Invalid action. Please use "encrypt" or "decrypt".');
    }
}

main();
