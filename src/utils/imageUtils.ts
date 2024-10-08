import Resizer from 'react-image-file-resizer';

export const convertToWebP = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        blob,
        1280, 
        720, 
        'WEBP', 
        80, 
        0,
        (uri) => {
          resolve(uri as string);
        },
        'base64'
      );
    });
  } catch (error) {
    console.error('이미지 변환 오류:', error);
    return imageUrl; 
  }
};
