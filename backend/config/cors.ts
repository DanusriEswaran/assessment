import type { CorsConfig } from "@ioc:Adonis/Core/Cors";

const corsConfig: CorsConfig = {
  enabled: true,

  origin: true,

  methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"],

  /*
  |--------------------------------------------------------------------------
  | Headers
  |--------------------------------------------------------------------------
  |
  | List of headers to be allowed for `Access-Control-Allow-Headers` header.
  | The value can be one of the following:
  |
  | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers
  |
  | Boolean(true)     - Allow all headers mentioned in `Access-Control-Request-Headers`.
  | Boolean(false)    - Disallow all headers.
  | String            - Comma separated list of allowed headers.
  | Array             - An array of allowed headers.
  | Function          - Receives the current header and should return one of the above values.
  |
  */
  headers: true,

  /*
  |--------------------------------------------------------------------------
  | Expose Headers
  |--------------------------------------------------------------------------
  |
  | A list of headers to be exposed by setting `Access-Control-Expose-Headers`.
  | header. By default following 6 simple response headers are exposed.
  |
  | Cache-Control
  | Content-Language
  | Content-Type
  | Expires
  | Last-Modified
  | Pragma
  |
  | In order to add more headers, simply define them inside the following array.
  |
  | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
  |
  */
  exposeHeaders: [
    "cache-control",
    "content-language",
    "content-type",
    "expires",
    "last-modified",
    "pragma",
  ],

  /*
  |--------------------------------------------------------------------------
  | Credentials
  |--------------------------------------------------------------------------
  |
  | Toggle `Access-Control-Allow-Credentials` header. If value is set to `true`,
  | then header will be set, otherwise not.
  |
  | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  |
  */
  credentials: true,

  /*
  |--------------------------------------------------------------------------
  | MaxAge
  |--------------------------------------------------------------------------
  |
  | Define `Access-Control-Max-Age` header in seconds.
  | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
  |
  */
  maxAge: 90,
};

export default corsConfig;
