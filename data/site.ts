// Site-wide settings.

// TODO: the ID of your CV on Google Drive (Spanish). In the share link
// https://drive.google.com/file/d/<ID>/view it is the <ID> part. Share it as "Anyone with the link".
// While it is empty the Download CV button is hidden.
export const CV_DRIVE_FILE_ID = "";

export const cvUrl = CV_DRIVE_FILE_ID ? `https://drive.google.com/uc?export=download&id=${CV_DRIVE_FILE_ID}` : "";
