import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logOut, setCredentials } from "../features/auth/authSlice";

const AUTH_URLS = [
  "/auth/signIn",
  "/auth/signUp",
  "/auth/logout",
  "/auth/refresh",
];

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().auth.token;
    const userId = getState().auth.userInfo?._id;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (userId) {
      headers.set("x-client-id", userId);
    }

    // Chỉ set Content-Type là application/json nếu không phải là upload file
    if (!endpoint?.includes("upload")) {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
  timeout: 30000,
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  try {
    let result = await baseQuery(args, api, extraOptions);

    const { token, userInfo } = api.getState().auth;
    const isLoggedIn = token && userInfo;

    const shouldSkipAuthCheck = AUTH_URLS.some((url) => args.url.includes(url));

    if (
      isLoggedIn &&
      !shouldSkipAuthCheck &&
      result.error &&
      result.error.status === 401
    ) {
      if (!window.isRefreshing) {
        window.isRefreshing = true;

        try {
          const refreshResult = await baseQuery(
            {
              url: `${BASE_URL}/auth/refresh`,
              method: "POST",
            },
            api,
            extraOptions
          );

          window.isRefreshing = false;

          if (refreshResult?.data) {
            const newToken = refreshResult.data;
            api.dispatch(
              setCredentials({ user: userInfo, accessToken: newToken })
            );

            return await baseQuery(args, api, extraOptions);
          } else {
            await baseQuery(
              {
                url: `${BASE_URL}/auth/logout`,
                method: "POST",
              },
              api,
              extraOptions
            );

            api.dispatch(logOut());
            return result;
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          window.isRefreshing = false;
          api.dispatch(logOut());
          return result;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await baseQuery(args, api, extraOptions);
      }
    }

    if (result.error) {
      const { status, data } = result.error;
      const errorMessage = data?.message || "Đã xảy ra lỗi";

      switch (status) {
        case 403:
          console.warn("Không có quyền truy cập:", errorMessage);
          break;

        case 404:
          console.warn("Không tìm thấy tài nguyên:", errorMessage);
          break;

        case 429:
          console.warn(
            "Quá nhiều yêu cầu, vui lòng thử lại sau:",
            errorMessage
          );
          break;

        case 500:
        case 502:
        case 503:
          console.error("Lỗi máy chủ:", errorMessage);
          break;

        default:
          if (!status) {
            console.error(
              "Lỗi kết nối mạng, vui lòng kiểm tra kết nối của bạn"
            );
          }
          break;
      }
    }

    return result;
  } catch (unexpectedError) {
    console.error("Lỗi không mong muốn trong interceptor:", unexpectedError);
    return {
      error: { status: "FETCH_ERROR", error: "Lỗi kết nối không mong muốn" },
    };
  }
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Product", "Order", "User", "Category", "Cart", "Address", "Review"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
