import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/config/env";

/** provides secured access to the api endpoints of the backend server */
async function handler(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const endpoint = `${pathname.replace("/api/server", "")}${search}`;

  // Check API_URL
  const apiUrl = ENV.API_URL;
  console.log("api url: ", apiUrl);
  if (!apiUrl) {
    return NextResponse.json(
      { error: "API_URL environment variable is not set" },
      { status: 500 }
    );
  }

  console.log("endpoint: ", endpoint);
  if (endpoint) {
    const headers: any = {
      "Content-Type": "application/json",
    };

    // Parse request body
    let body = undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        body = await request.json();
      } catch (error) {
        // Use undefined if body is missing or cannot be parsed
      }
    }

    try {
      // Send request to backend API
      const response = await axios.request({
        url: endpoint,
        method: request.method,
        data: body,
        baseURL: apiUrl,
        headers: headers,
        validateStatus: () => true, // Accept all status codes
      });

      console.log("response: ", "I am alive!");
      return NextResponse.json(response.data, { status: response.status });
    } catch (e) {
      const axiosError = e as AxiosError;

      // Return appropriate status code on error
      const errorMessage =
        axiosError.response?.data ||
        axiosError.message ||
        "Internal Server Error";

      return NextResponse.json(
        { error: errorMessage },
        {
          status: axiosError.response?.status || 500,
        }
      );
    }
  } else {
    return NextResponse.json({ data: "Api Not Found" }, { status: 404 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
