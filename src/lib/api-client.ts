// export async function apiClient<T>(
//   url: string,
//   options?: RequestInit,
// ): Promise<T> {
//   const res = await fetch(url, {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     ...options,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Something went wrong");
//   }

//   return data.data;
// }

// src/lib/api-client.ts
export async function apiClient<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    credentials: "include", // ← This is very important
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error ${res.status}`);
  }

  const data = await res.json();
  return data.data !== undefined ? data.data : data;
}
