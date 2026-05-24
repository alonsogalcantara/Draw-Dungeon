export const getImageUrl = (campaign: string, type: string, imageName: string) =>
  `/images/${campaign}/${type}/${imageName}.png`;
