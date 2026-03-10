const DEFAULT_LOCALITY = "Paso de la Patria, Corrientes, Argentina";

function buildNormalizedMapQuery(rawAddress = "") {
  const normalizedAddress = String(rawAddress).trim();
  if (!normalizedAddress) return DEFAULT_LOCALITY;

  const lowerAddress = normalizedAddress.toLowerCase();
  const lowerLocality = DEFAULT_LOCALITY.toLowerCase();
  if (lowerAddress.includes(lowerLocality) || lowerAddress.includes("paso de la patria")) {
    return normalizedAddress;
  }

  return `${normalizedAddress}, ${DEFAULT_LOCALITY}`;
}

export function buildGoogleMapsEmbedUrl(rawAddress = "") {
  const query = buildNormalizedMapQuery(rawAddress);
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function buildGoogleMapsSearchUrl(rawAddress = "") {
  const query = buildNormalizedMapQuery(rawAddress);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
