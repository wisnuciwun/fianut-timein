export const req = async (
  url: string,
  method: "GET" | "POST" | "PUT" = "GET",
  data?: any,
  headers?: any
) => {
  let options: RequestInit = {
    method,
    headers: {},
  };

  if (data instanceof FormData) {
    options.body = data;
  } else {
    options.headers = headers || {
      "Content-Type": "application/json",
    };
    options.body = data ? JSON.stringify(data) : undefined;
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Expected JSON response but got ${contentType}`);
  }

  return response.json();
};
