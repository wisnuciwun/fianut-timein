const imageLink = (link = "") => {
  const cleaned = link?.split(",")[0].trim();

  if (!cleaned) return "";

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  const relativePath = cleaned.startsWith("public/fianut/")
    ? cleaned.replace("public/fianut/", "")
    : cleaned;

  return `${process.env.NEXT_PUBLIC_FIANUT_IMG_URL}/${relativePath}`;
};

export default imageLink;
