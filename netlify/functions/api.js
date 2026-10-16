"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/@netlify/runtime-utils/dist/main.cjs
var require_main = __commonJS({
  "node_modules/@netlify/runtime-utils/dist/main.cjs"(exports2, module2) {
    "use strict";
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var main_exports = {};
    __export(main_exports, {
      base64Decode: () => base64Decode,
      base64Encode: () => base64Encode,
      getEnvironment: () => getEnvironment
    });
    module2.exports = __toCommonJS(main_exports);
    var getString = (input) => typeof input === "string" ? input : JSON.stringify(input);
    var base64Decode = globalThis.Buffer ? (input) => Buffer.from(input, "base64").toString() : (input) => atob(input);
    var base64Encode = globalThis.Buffer ? (input) => Buffer.from(getString(input)).toString("base64") : (input) => btoa(getString(input));
    var getEnvironment = () => {
      const { Deno, Netlify, process: process2 } = globalThis;
      return Netlify?.env ?? Deno?.env ?? {
        delete: (key) => delete process2?.env[key],
        get: (key) => process2?.env[key],
        has: (key) => Boolean(process2?.env[key]),
        set: (key, value) => {
          if (process2?.env) {
            process2.env[key] = value;
          }
        },
        toObject: () => process2?.env ?? {}
      };
    };
  }
});

// node_modules/@netlify/otel/dist/main.cjs
var require_main2 = __commonJS({
  "node_modules/@netlify/otel/dist/main.cjs"(exports2, module2) {
    "use strict";
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var main_exports = {};
    __export(main_exports, {
      getTracer: () => getTracer,
      shutdownTracers: () => shutdownTracers,
      withActiveSpan: () => withActiveSpan
    });
    module2.exports = __toCommonJS(main_exports);
    var GET_TRACER = "__netlify__getTracer";
    var SHUTDOWN_TRACERS = "__netlify__shutdownTracers";
    var getTracer = (name, version) => {
      return globalThis[GET_TRACER]?.(name, version);
    };
    var shutdownTracers = async () => {
      return globalThis[SHUTDOWN_TRACERS]?.();
    };
    function withActiveSpan(tracer, name, optionsOrFn, contextOrFn, fn) {
      const func = typeof contextOrFn === "function" ? contextOrFn : typeof optionsOrFn === "function" ? optionsOrFn : fn;
      if (!func) {
        throw new Error("function to execute with active span is missing");
      }
      if (!tracer) {
        return func();
      }
      return tracer.withActiveSpan(name, optionsOrFn, contextOrFn, func);
    }
  }
});

// node_modules/@netlify/blobs/dist/main.cjs
var require_main3 = __commonJS({
  "node_modules/@netlify/blobs/dist/main.cjs"(exports2, module2) {
    "use strict";
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var main_exports = {};
    __export(main_exports, {
      connectLambda: () => connectLambda2,
      getDeployStore: () => getDeployStore,
      getStore: () => getStore2,
      listStores: () => listStores,
      setEnvironmentContext: () => setEnvironmentContext
    });
    module2.exports = __toCommonJS(main_exports);
    var import_runtime_utils = require_main();
    var getEnvironmentContext = () => {
      const context = globalThis.netlifyBlobsContext || (0, import_runtime_utils.getEnvironment)().get("NETLIFY_BLOBS_CONTEXT");
      if (typeof context !== "string" || !context) {
        return {};
      }
      const data = (0, import_runtime_utils.base64Decode)(context);
      try {
        return JSON.parse(data);
      } catch {
      }
      return {};
    };
    var setEnvironmentContext = (context) => {
      const encodedContext = (0, import_runtime_utils.base64Encode)(JSON.stringify(context));
      (0, import_runtime_utils.getEnvironment)().set("NETLIFY_BLOBS_CONTEXT", encodedContext);
    };
    var MissingBlobsEnvironmentError = class extends Error {
      constructor(requiredProperties) {
        super(
          `The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: ${requiredProperties.join(
            ", "
          )}`
        );
        this.name = "MissingBlobsEnvironmentError";
      }
    };
    var import_runtime_utils2 = require_main();
    var connectLambda2 = (event) => {
      const rawData = (0, import_runtime_utils2.base64Decode)(event.blobs);
      const data = JSON.parse(rawData);
      const environmentContext = {
        deployID: event.headers["x-nf-deploy-id"],
        edgeURL: data.url,
        siteID: event.headers["x-nf-site-id"],
        token: data.token
      };
      setEnvironmentContext(environmentContext);
    };
    var BlobsConsistencyError = class extends Error {
      constructor() {
        super(
          `Netlify Blobs has failed to perform a read using strong consistency because the environment has not been configured with a 'uncachedEdgeURL' property`
        );
        this.name = "BlobsConsistencyError";
      }
    };
    var import_runtime_utils3 = require_main();
    var BASE64_PREFIX = "b64;";
    var METADATA_HEADER_INTERNAL = "x-amz-meta-user";
    var METADATA_HEADER_EXTERNAL = "netlify-blobs-metadata";
    var METADATA_MAX_SIZE = 2 * 1024;
    var encodeMetadata = (metadata) => {
      if (!metadata) {
        return null;
      }
      const encodedObject = (0, import_runtime_utils3.base64Encode)(JSON.stringify(metadata));
      const payload = `b64;${encodedObject}`;
      if (METADATA_HEADER_EXTERNAL.length + payload.length > METADATA_MAX_SIZE) {
        throw new Error("Metadata object exceeds the maximum size");
      }
      return payload;
    };
    var decodeMetadata = (header) => {
      if (!header?.startsWith(BASE64_PREFIX)) {
        return {};
      }
      const encodedData = header.slice(BASE64_PREFIX.length);
      const decodedData = (0, import_runtime_utils3.base64Decode)(encodedData);
      const metadata = JSON.parse(decodedData);
      return metadata;
    };
    var getMetadataFromResponse = (response) => {
      if (!response.headers) {
        return {};
      }
      const value = response.headers.get(METADATA_HEADER_EXTERNAL) || response.headers.get(METADATA_HEADER_INTERNAL);
      try {
        return decodeMetadata(value);
      } catch {
        throw new Error(
          "An internal error occurred while trying to retrieve the metadata for an entry. Please try updating to the latest version of the Netlify Blobs client."
        );
      }
    };
    var REGION_AUTO = "auto";
    var regions = {
      "us-east-1": true,
      "us-east-2": true,
      "eu-central-1": true,
      "ap-southeast-1": true,
      "ap-southeast-2": true
    };
    var isValidRegion = (input) => Object.keys(regions).includes(input);
    var InvalidBlobsRegionError = class extends Error {
      constructor(region) {
        super(
          `${region} is not a supported Netlify Blobs region. Supported values are: ${Object.keys(regions).join(", ")}.`
        );
        this.name = "InvalidBlobsRegionError";
      }
    };
    var import_runtime_utils4 = require_main();
    var DEFAULT_RETRY_DELAY = (0, import_runtime_utils4.getEnvironment)().get("NODE_ENV") === "test" ? 1 : 5e3;
    var MIN_RETRY_DELAY = 1e3;
    var MAX_RETRY = 5;
    var RATE_LIMIT_HEADER = "X-RateLimit-Reset";
    var fetchAndRetry = async (fetch, url, options, attemptsLeft = MAX_RETRY, getRetryUrl) => {
      try {
        const res = await fetch(url, options);
        const isRetryable = res.status === 429 || res.status >= 500 || getRetryUrl !== void 0 && res.status === 403;
        if (attemptsLeft > 0 && isRetryable) {
          const delay = getDelay(res.headers.get(RATE_LIMIT_HEADER));
          await sleep(delay);
          const retryUrl = getRetryUrl ? await getRetryUrl() : url;
          return fetchAndRetry(fetch, retryUrl, options, attemptsLeft - 1, getRetryUrl);
        }
        return res;
      } catch (error) {
        if (attemptsLeft === 0) {
          throw error;
        }
        const delay = getDelay();
        await sleep(delay);
        const retryUrl = getRetryUrl ? await getRetryUrl() : url;
        return fetchAndRetry(fetch, retryUrl, options, attemptsLeft - 1, getRetryUrl);
      }
    };
    var getDelay = (rateLimitReset) => {
      if (!rateLimitReset) {
        return DEFAULT_RETRY_DELAY;
      }
      return Math.max(Number(rateLimitReset) * 1e3 - Date.now(), MIN_RETRY_DELAY);
    };
    var sleep = (ms) => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    var import_node_process = __toESM(require("process"), 1);
    var import_otel = require_main2();
    var NF_ERROR = "x-nf-error";
    var NF_REQUEST_ID = "x-nf-request-id";
    var DEPLOY_STORE_PREFIX = "deploy:";
    var SITE_STORE_PREFIX = "site:";
    var isDeniedWrite = (res, { method, storeName }) => (res.status === 401 || res.status === 403) && (method === "put" || method === "delete") && storeName !== void 0 && !storeName.startsWith(DEPLOY_STORE_PREFIX);
    var blobsErrorMessage = (res, context, responseBody) => {
      let details = res.headers.get(NF_ERROR) || `${res.status} status code`;
      if (res.headers.has(NF_REQUEST_ID)) {
        details += `, ID: ${res.headers.get(NF_REQUEST_ID)}`;
      }
      if (isDeniedWrite(res, context)) {
        const storeName = context.storeName?.startsWith(SITE_STORE_PREFIX) ? context.storeName.slice(SITE_STORE_PREFIX.length) : context.storeName;
        return `Netlify Blobs could not write to store '${storeName}' (${details}). Builds and build plugins can only write to deploy-specific stores: use 'getDeployStore' instead of 'getStore', or pass a 'token' with write access to the store. If this code is not running in a build, check that the token and site ID are valid. See https://docs.netlify.com/build/data-and-storage/netlify-blobs/#deploy-specific-stores`;
      }
      let message = `Netlify Blobs has generated an internal error (${details})`;
      if (!res.headers.get(NF_ERROR) && responseBody) {
        message += `: ${responseBody}`;
      }
      return message;
    };
    var BlobsInternalError = class extends Error {
      constructor(res, context = {}, responseBody) {
        super(blobsErrorMessage(res, context, responseBody));
        this.name = "BlobsInternalError";
        this.status = res.status;
        this.responseBody = responseBody;
      }
    };
    var createBlobsInternalError = async (res, context = {}) => {
      const responseBody = await res.clone().text().catch(() => void 0);
      return new BlobsInternalError(res, context, responseBody);
    };
    var collectIterator = async (iterator) => {
      const result = [];
      for await (const item of iterator) {
        result.push(item);
      }
      return result;
    };
    function withSpan(span, name, fn) {
      if (span) return fn(span);
      return (0, import_otel.withActiveSpan)((0, import_otel.getTracer)(), name, (span2) => {
        return fn(span2);
      });
    }
    var SIGNED_URL_ACCEPT_HEADER = "application/json;type=signed-url";
    var Client = class {
      constructor({ apiURL, consistency, edgeURL, fetch, region, siteID, token, uncachedEdgeURL }) {
        this.apiURL = apiURL;
        this.consistency = consistency ?? "eventual";
        this.edgeURL = edgeURL;
        this.fetch = fetch ?? globalThis.fetch;
        this.region = region;
        this.siteID = siteID;
        this.token = token;
        this.uncachedEdgeURL = uncachedEdgeURL;
        if (!this.fetch) {
          throw new Error(
            "Netlify Blobs could not find a `fetch` client in the global scope. You can either update your runtime to a version that includes `fetch` (like Node.js 18.0.0 or above), or you can supply your own implementation using the `fetch` property."
          );
        }
      }
      async getFinalRequest({
        consistency: opConsistency,
        key,
        metadata,
        method,
        parameters = {},
        storeName
      }) {
        const encodedMetadata = encodeMetadata(metadata);
        const consistency = opConsistency ?? this.consistency;
        let urlPath = `/${this.siteID}`;
        if (storeName) {
          urlPath += `/${storeName}`;
        }
        if (key) {
          urlPath += `/${key}`;
        }
        if (this.edgeURL) {
          if (consistency === "strong" && !this.uncachedEdgeURL) {
            throw new BlobsConsistencyError();
          }
          const headers = {
            authorization: `Bearer ${this.token}`
          };
          if (encodedMetadata) {
            headers[METADATA_HEADER_INTERNAL] = encodedMetadata;
          }
          if (this.region) {
            urlPath = `/region:${this.region}${urlPath}`;
          }
          const url2 = new URL(urlPath, consistency === "strong" ? this.uncachedEdgeURL : this.edgeURL);
          for (const key2 in parameters) {
            url2.searchParams.set(key2, parameters[key2]);
          }
          return {
            headers,
            url: url2.toString()
          };
        }
        const apiHeaders = { authorization: `Bearer ${this.token}` };
        const url = new URL(`/api/v1/blobs${urlPath}`, this.apiURL ?? "https://api.netlify.com");
        for (const key2 in parameters) {
          url.searchParams.set(key2, parameters[key2]);
        }
        if (this.region) {
          url.searchParams.set("region", this.region);
        }
        if (storeName === void 0 || key === void 0) {
          return {
            headers: apiHeaders,
            url: url.toString()
          };
        }
        if (encodedMetadata) {
          apiHeaders[METADATA_HEADER_EXTERNAL] = encodedMetadata;
        }
        if (method === "head" || method === "delete") {
          return {
            headers: apiHeaders,
            url: url.toString()
          };
        }
        const res = await this.fetch(url.toString(), {
          headers: { ...apiHeaders, accept: SIGNED_URL_ACCEPT_HEADER },
          method
        });
        if (res.status !== 200) {
          throw await createBlobsInternalError(res, { method, storeName });
        }
        const { url: signedURL } = await res.json();
        const userHeaders = encodedMetadata ? { [METADATA_HEADER_INTERNAL]: encodedMetadata } : void 0;
        return {
          headers: userHeaders,
          url: signedURL
        };
      }
      async makeRequest({
        body,
        conditions = {},
        consistency,
        headers: extraHeaders,
        key,
        metadata,
        method,
        parameters,
        storeName
      }) {
        const { headers: baseHeaders = {}, url } = await this.getFinalRequest({
          consistency,
          key,
          metadata,
          method,
          parameters,
          storeName
        });
        const headers = {
          ...baseHeaders,
          ...extraHeaders
        };
        if (method === "put") {
          headers["cache-control"] = "max-age=0, stale-while-revalidate=60";
        }
        if ("onlyIfMatch" in conditions && conditions.onlyIfMatch) {
          headers["if-match"] = conditions.onlyIfMatch;
        } else if ("onlyIfNew" in conditions && conditions.onlyIfNew) {
          headers["if-none-match"] = "*";
        }
        const options = {
          body,
          headers,
          method
        };
        if (body instanceof ReadableStream) {
          options.duplex = "half";
        }
        const usesSignedUrl = !this.edgeURL && key !== void 0 && storeName !== void 0 && method !== "head" && method !== "delete";
        let getRetryUrl;
        if (usesSignedUrl) {
          getRetryUrl = async () => {
            const finalRequest = await this.getFinalRequest({ consistency, key, metadata, method, parameters, storeName });
            return finalRequest.url;
          };
        }
        return fetchAndRetry(this.fetch, url, options, void 0, getRetryUrl);
      }
    };
    var getClientOptions = (options, contextOverride) => {
      const context = contextOverride ?? getEnvironmentContext();
      const siteID = context.siteID ?? options.siteID;
      const token = context.token ?? options.token;
      if (!siteID || !token) {
        throw new MissingBlobsEnvironmentError(["siteID", "token"]);
      }
      if (options.region !== void 0 && !isValidRegion(options.region)) {
        throw new InvalidBlobsRegionError(options.region);
      }
      const clientOptions = {
        apiURL: context.apiURL ?? options.apiURL,
        consistency: options.consistency,
        edgeURL: context.edgeURL ?? options.edgeURL,
        fetch: options.fetch,
        region: options.region,
        siteID,
        token,
        uncachedEdgeURL: context.uncachedEdgeURL ?? options.uncachedEdgeURL
      };
      return clientOptions;
    };
    var LEGACY_STORE_INTERNAL_PREFIX = "netlify-internal/legacy-namespace/";
    var STATUS_OK = 200;
    var STATUS_PRE_CONDITION_FAILED = 412;
    var Store = class _Store {
      constructor(options) {
        this.client = options.client;
        if ("deployID" in options) {
          _Store.validateDeployID(options.deployID);
          let name = DEPLOY_STORE_PREFIX + options.deployID;
          if (options.name) {
            name += `:${options.name}`;
          }
          this.name = name;
        } else if (options.name.startsWith(LEGACY_STORE_INTERNAL_PREFIX)) {
          const storeName = options.name.slice(LEGACY_STORE_INTERNAL_PREFIX.length);
          _Store.validateStoreName(storeName);
          this.name = storeName;
        } else {
          _Store.validateStoreName(options.name);
          this.name = SITE_STORE_PREFIX + options.name;
        }
      }
      async delete(key) {
        const res = await this.client.makeRequest({ key, method: "delete", storeName: this.name });
        if (![200, 204, 404].includes(res.status)) {
          throw new BlobsInternalError(res, { method: "delete", storeName: this.name });
        }
      }
      async deleteAll() {
        let totalDeletedBlobs = 0;
        let hasMore = true;
        while (hasMore) {
          const res = await this.client.makeRequest({ method: "delete", storeName: this.name });
          if (res.status !== 200) {
            throw new BlobsInternalError(res, { method: "delete", storeName: this.name });
          }
          const data = await res.json();
          if (typeof data.blobs_deleted !== "number") {
            throw new BlobsInternalError(res);
          }
          totalDeletedBlobs += data.blobs_deleted;
          hasMore = typeof data.has_more === "boolean" && data.has_more;
        }
        return {
          deletedBlobs: totalDeletedBlobs
        };
      }
      async get(key, options) {
        return withSpan(options?.span, "blobs.get", async (span) => {
          const { consistency, type } = options ?? {};
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.type": type,
            "blobs.method": "GET",
            "blobs.consistency": consistency
          });
          const res = await this.client.makeRequest({
            consistency,
            key,
            method: "get",
            storeName: this.name
          });
          span?.setAttributes({
            "blobs.response.body.size": res.headers.get("content-length") ?? void 0,
            "blobs.response.status": res.status
          });
          if (res.status === 404) {
            return null;
          }
          if (res.status !== 200) {
            throw new BlobsInternalError(res);
          }
          if (type === void 0 || type === "text") {
            return res.text();
          }
          if (type === "arrayBuffer") {
            return res.arrayBuffer();
          }
          if (type === "blob") {
            return res.blob();
          }
          if (type === "json") {
            return res.json();
          }
          if (type === "stream") {
            return res.body;
          }
          throw new BlobsInternalError(res);
        });
      }
      async getMetadata(key, options = {}) {
        return withSpan(options?.span, "blobs.getMetadata", async (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "HEAD",
            "blobs.consistency": options.consistency
          });
          const res = await this.client.makeRequest({
            consistency: options.consistency,
            key,
            method: "head",
            storeName: this.name
          });
          span?.setAttributes({
            "blobs.response.status": res.status
          });
          if (res.status === 404) {
            return null;
          }
          if (res.status !== 200 && res.status !== 304) {
            throw new BlobsInternalError(res);
          }
          const etag = res?.headers.get("etag") ?? void 0;
          const metadata = getMetadataFromResponse(res);
          const result = {
            etag,
            metadata
          };
          return result;
        });
      }
      async getWithMetadata(key, options) {
        return withSpan(options?.span, "blobs.getWithMetadata", async (span) => {
          const { consistency, etag: requestETag, type } = options ?? {};
          const headers = requestETag ? { "if-none-match": requestETag } : void 0;
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "GET",
            "blobs.consistency": options?.consistency,
            "blobs.type": type,
            "blobs.request.etag": requestETag
          });
          const res = await this.client.makeRequest({
            consistency,
            headers,
            key,
            method: "get",
            storeName: this.name
          });
          const responseETag = res?.headers.get("etag") ?? void 0;
          span?.setAttributes({
            "blobs.response.body.size": res.headers.get("content-length") ?? void 0,
            "blobs.response.etag": responseETag,
            "blobs.response.status": res.status
          });
          if (res.status === 404) {
            return null;
          }
          if (res.status !== 200 && res.status !== 304) {
            throw new BlobsInternalError(res);
          }
          const metadata = getMetadataFromResponse(res);
          const result = {
            etag: responseETag,
            metadata
          };
          if (res.status === 304 && requestETag) {
            return { data: null, ...result };
          }
          if (type === void 0 || type === "text") {
            return { data: await res.text(), ...result };
          }
          if (type === "arrayBuffer") {
            return { data: await res.arrayBuffer(), ...result };
          }
          if (type === "blob") {
            return { data: await res.blob(), ...result };
          }
          if (type === "json") {
            return { data: await res.json(), ...result };
          }
          if (type === "stream") {
            return { data: res.body, ...result };
          }
          throw new Error(`Invalid 'type' property: ${type}. Expected: arrayBuffer, blob, json, stream, or text.`);
        });
      }
      list(options = {}) {
        return withSpan(options.span, "blobs.list", (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.method": "GET",
            "blobs.list.paginate": options.paginate ?? false
          });
          const iterator = this.getListIterator(options);
          if (options.paginate) {
            return iterator;
          }
          return collectIterator(iterator).then(
            (items) => items.reduce(
              (acc, item) => ({
                blobs: [...acc.blobs, ...item.blobs],
                directories: [...acc.directories, ...item.directories]
              }),
              { blobs: [], directories: [] }
            )
          );
        });
      }
      async set(key, data, options = {}) {
        return withSpan(options.span, "blobs.set", async (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "PUT",
            "blobs.data.size": typeof data == "string" ? data.length : data instanceof Blob ? data.size : data.byteLength,
            "blobs.data.type": typeof data == "string" ? "string" : data instanceof Blob ? "blob" : "arrayBuffer",
            "blobs.atomic": Boolean(options.onlyIfMatch ?? options.onlyIfNew)
          });
          _Store.validateKey(key);
          const conditions = _Store.getConditions(options);
          const res = await this.client.makeRequest({
            conditions,
            body: data,
            key,
            metadata: options.metadata,
            method: "put",
            storeName: this.name
          });
          const etag = res.headers.get("etag") ?? "";
          span?.setAttributes({
            "blobs.response.etag": etag,
            "blobs.response.status": res.status
          });
          if (conditions) {
            return res.status === STATUS_PRE_CONDITION_FAILED ? { modified: false } : { etag, modified: true };
          }
          if (res.status === STATUS_OK) {
            return {
              etag,
              modified: true
            };
          }
          throw await createBlobsInternalError(res, { method: "put", storeName: this.name });
        });
      }
      async setJSON(key, data, options = {}) {
        return withSpan(options.span, "blobs.setJSON", async (span) => {
          span?.setAttributes({
            "blobs.store": this.name,
            "blobs.key": key,
            "blobs.method": "PUT",
            "blobs.data.type": "json",
            "blobs.atomic": Boolean(options.onlyIfMatch ?? options.onlyIfNew)
          });
          _Store.validateKey(key);
          const conditions = _Store.getConditions(options);
          const payload = JSON.stringify(data);
          const headers = {
            "content-type": "application/json"
          };
          const res = await this.client.makeRequest({
            conditions,
            body: payload,
            headers,
            key,
            metadata: options.metadata,
            method: "put",
            storeName: this.name
          });
          const etag = res.headers.get("etag") ?? "";
          span?.setAttributes({
            "blobs.response.etag": etag,
            "blobs.response.status": res.status
          });
          if (conditions) {
            return res.status === STATUS_PRE_CONDITION_FAILED ? { modified: false } : { etag, modified: true };
          }
          if (res.status === STATUS_OK) {
            return {
              etag,
              modified: true
            };
          }
          throw new BlobsInternalError(res, { method: "put", storeName: this.name });
        });
      }
      static formatListResultBlob(result) {
        if (!result.key) {
          return null;
        }
        return {
          etag: result.etag,
          key: result.key
        };
      }
      static getConditions(options) {
        if ("onlyIfMatch" in options && "onlyIfNew" in options) {
          throw new Error(
            `The 'onlyIfMatch' and 'onlyIfNew' options are mutually exclusive. Using 'onlyIfMatch' will make the write succeed only if there is an entry for the key with the given content, while 'onlyIfNew' will make the write succeed only if there is no entry for the key.`
          );
        }
        if ("onlyIfMatch" in options && options.onlyIfMatch) {
          if (typeof options.onlyIfMatch !== "string") {
            throw new Error(`The 'onlyIfMatch' property expects a string representing an ETag.`);
          }
          return {
            onlyIfMatch: options.onlyIfMatch
          };
        }
        if ("onlyIfNew" in options && options.onlyIfNew) {
          if (typeof options.onlyIfNew !== "boolean") {
            throw new Error(
              `The 'onlyIfNew' property expects a boolean indicating whether the write should fail if an entry for the key already exists.`
            );
          }
          return {
            onlyIfNew: true
          };
        }
      }
      static validateKey(key) {
        if (key === "") {
          throw new Error("Blob key must not be empty.");
        }
        if (key.startsWith("/") || key.startsWith("%2F")) {
          throw new Error("Blob key must not start with forward slash (/).");
        }
        if (new TextEncoder().encode(key).length > 600) {
          throw new Error(
            "Blob key must be a sequence of Unicode characters whose UTF-8 encoding is at most 600 bytes long."
          );
        }
      }
      static validateDeployID(deployID) {
        if (!/^\w{1,24}$/.test(deployID)) {
          throw new Error(`'${deployID}' is not a valid Netlify deploy ID.`);
        }
      }
      static validateStoreName(name) {
        if (name.includes("/") || name.includes("%2F")) {
          throw new Error("Store name must not contain forward slashes (/).");
        }
        if (new TextEncoder().encode(name).length > 64) {
          throw new Error(
            "Store name must be a sequence of Unicode characters whose UTF-8 encoding is at most 64 bytes long."
          );
        }
      }
      getListIterator(options) {
        const { client, name: storeName } = this;
        const parameters = {};
        if (options?.prefix) {
          parameters.prefix = options.prefix;
        }
        if (options?.directories) {
          parameters.directories = "true";
        }
        return {
          [Symbol.asyncIterator]() {
            let currentCursor = null;
            let done = false;
            return {
              async next() {
                return withSpan(options?.span, "blobs.list.next", async (span) => {
                  span?.setAttributes({
                    "blobs.store": storeName,
                    "blobs.method": "GET",
                    "blobs.list.paginate": options?.paginate ?? false,
                    "blobs.list.done": done,
                    "blobs.list.cursor": currentCursor ?? void 0
                  });
                  if (done) {
                    return { done: true, value: void 0 };
                  }
                  const nextParameters = { ...parameters };
                  if (currentCursor !== null) {
                    nextParameters.cursor = currentCursor;
                  }
                  const res = await client.makeRequest({
                    method: "get",
                    parameters: nextParameters,
                    storeName
                  });
                  span?.setAttributes({
                    "blobs.response.status": res.status
                  });
                  let blobs = [];
                  let directories = [];
                  if (![200, 204, 404].includes(res.status)) {
                    throw new BlobsInternalError(res);
                  }
                  if (res.status === 404) {
                    done = true;
                  } else {
                    const page = await res.json();
                    if (page.next_cursor) {
                      currentCursor = page.next_cursor;
                    } else {
                      done = true;
                    }
                    blobs = (page.blobs ?? []).map(_Store.formatListResultBlob).filter(Boolean);
                    directories = page.directories ?? [];
                  }
                  return {
                    done: false,
                    value: {
                      blobs,
                      directories
                    }
                  };
                });
              }
            };
          }
        };
      }
    };
    var getDeployStoreRegion = (clientOptions, context) => {
      if (clientOptions.region) {
        return clientOptions.region;
      }
      if (clientOptions.edgeURL || clientOptions.uncachedEdgeURL) {
        if (!context.primaryRegion) {
          throw new Error(
            "When accessing a deploy store, the Netlify Blobs client needs to be configured with a region, and one was not found in the environment. To manually set the region, set the `region` property in the store options. If you are using the Netlify CLI, you may have an outdated version; run `npm install -g netlify-cli@latest` to update and try again."
          );
        }
        return context.primaryRegion;
      }
      return REGION_AUTO;
    };
    var getDeployStore = (input = {}, options) => {
      const context = getEnvironmentContext();
      const mergedOptions = typeof input === "string" ? { ...options, name: input } : input;
      const deployID = mergedOptions.deployID ?? context.deployID;
      if (!deployID) {
        throw new MissingBlobsEnvironmentError(["deployID"]);
      }
      const clientOptions = getClientOptions(mergedOptions, context);
      clientOptions.region = getDeployStoreRegion(clientOptions, context);
      const client = new Client(clientOptions);
      return new Store({ client, deployID, name: mergedOptions.name });
    };
    var getStore2 = (input, options) => {
      if (typeof input === "string") {
        const contextOverride = options?.siteID && options?.token ? { siteID: options?.siteID, token: options?.token } : void 0;
        const clientOptions = getClientOptions(options ?? {}, contextOverride);
        const client = new Client(clientOptions);
        return new Store({ client, name: input });
      }
      if (typeof input?.name === "string") {
        const { name } = input;
        const contextOverride = input?.siteID && input?.token ? { siteID: input?.siteID, token: input?.token } : void 0;
        const clientOptions = getClientOptions(input, contextOverride);
        if (!name) {
          throw new MissingBlobsEnvironmentError(["name"]);
        }
        const client = new Client(clientOptions);
        return new Store({ client, name });
      }
      if (typeof input?.deployID === "string") {
        const context = getEnvironmentContext();
        const clientOptions = getClientOptions(input, context);
        const { deployID } = input;
        if (!deployID) {
          throw new MissingBlobsEnvironmentError(["deployID"]);
        }
        clientOptions.region = getDeployStoreRegion(clientOptions, context);
        const client = new Client(clientOptions);
        return new Store({ client, deployID });
      }
      throw new Error(
        "The `getStore` method requires the name of the store as a string or as the `name` property of an options object"
      );
    };
    function listStores(options = {}) {
      const context = getEnvironmentContext();
      const clientOptions = getClientOptions(options, context);
      const client = new Client(clientOptions);
      const iterator = getListIterator(client, SITE_STORE_PREFIX);
      if (options.paginate) {
        return iterator;
      }
      return collectIterator(iterator).then((results) => ({ stores: results.flatMap((page) => page.stores) }));
    }
    var formatListStoreResponse = (stores) => stores.filter((store2) => !store2.startsWith(DEPLOY_STORE_PREFIX)).map((store2) => store2.startsWith(SITE_STORE_PREFIX) ? store2.slice(SITE_STORE_PREFIX.length) : store2);
    var getListIterator = (client, prefix) => {
      const parameters = {
        prefix
      };
      return {
        [Symbol.asyncIterator]() {
          let currentCursor = null;
          let done = false;
          return {
            async next() {
              if (done) {
                return { done: true, value: void 0 };
              }
              const nextParameters = { ...parameters };
              if (currentCursor !== null) {
                nextParameters.cursor = currentCursor;
              }
              const res = await client.makeRequest({
                method: "get",
                parameters: nextParameters
              });
              if (res.status === 404) {
                return { done: true, value: void 0 };
              }
              const page = await res.json();
              if (page.next_cursor) {
                currentCursor = page.next_cursor;
              } else {
                done = true;
              }
              return {
                done: false,
                value: {
                  ...page,
                  stores: formatListStoreResponse(page.stores)
                }
              };
            }
          };
        }
      };
    };
  }
});

// ../netlify-site/netlify/functions/src/default-content.json
var require_default_content = __commonJS({
  "../netlify-site/netlify/functions/src/default-content.json"(exports2, module2) {
    module2.exports = {
      site: {
        brand_first: "ABIR HUSEN",
        brand_last: "SHIAM",
        brand_mark: "AHS",
        logo_image: "",
        favicon: "",
        title_suffix: "Abir Husen Shiam | Digital Marketer & Growth Strategist",
        footer_about: "Digital marketing specialist helping brands grow through smarter paid advertising, search visibility and content strategy.",
        copyright: "Abir Husen Shiam. All rights reserved."
      },
      theme: {
        c1: "#35E0F0",
        c2: "#7B5CFF",
        c3: "#FF7A59",
        bg: "#070A12"
      },
      contact: {
        email: "abirhusenshiam500@gmail.com",
        phone: "+880 1755-747232",
        whatsapp: "8801755747232",
        facebook: "",
        linkedin: "",
        youtube: "",
        instagram: "https://www.instagram.com/abir.husenshiam1"
      },
      home: {
        pill: "Available for new projects",
        heading: "Abir Husen Shiam",
        role_static: "Digital Marketer & Growth Strategist",
        roles: [
          "YouTube Promotion Expert",
          "Google Ads Strategist",
          "Music Promotion Specialist",
          "YouTube SEO Specialist",
          "Social Media Marketer"
        ],
        tagline_a: "Driving Growth Through",
        tagline_b: "Smarter Digital Marketing",
        intro: "I help brands, startups and local businesses turn ad spend into measurable revenue. From high-converting paid campaigns to search visibility that compounds over time \u2014 every strategy I build is data-led, ROI-focused and designed to scale.",
        hero_image: "assets/img/abir-portrait.png",
        float_cards: [
          {
            value: "4.8x",
            label: "Avg. ROAS"
          },
          {
            value: "Top 3",
            label: "Google Rankings"
          }
        ],
        stats: [
          {
            prefix: "",
            value: "250",
            suffix: "+",
            label: "Projects Completed"
          },
          {
            prefix: "",
            value: "120",
            suffix: "+",
            label: "Happy Clients"
          },
          {
            prefix: "",
            value: "7",
            suffix: "+",
            label: "Years of Experience"
          },
          {
            prefix: "$",
            value: "1.2",
            suffix: "M+",
            label: "Ad Spend Managed"
          }
        ],
        services_eyebrow: "What I Do",
        services_title_a: "Services Built for",
        services_title_b: "Measurable Growth",
        services_sub: "A complete digital marketing stack \u2014 paid, organic and everything that makes them work together.",
        work_eyebrow: "Featured Work",
        work_title_a: "Case Studies With",
        work_title_b: "Real Numbers",
        work_sub: "A selection of campaigns where strategy, creative and data came together to produce compounding results.",
        about_eyebrow: "About Me",
        about_title_a: "Marketing That Respects",
        about_title_b: "Your Budget",
        about_image: "assets/img/abir-portrait.png",
        about_badge_num: "7+",
        about_badge_text: "Years<br>Experience",
        about_paras: [
          "I'm a digital marketer who treats every advertising dollar like it's my own. I work with e-commerce brands, local service businesses and content creators, and I care more about what a campaign returns than what it looks like in a report.",
          "My approach is simple: understand the business before touching the ad account, track everything that matters, and make decisions from data instead of guesswork. Replace this paragraph with your own story from the Admin Panel."
        ],
        about_points: [
          "Data-driven strategy, not guesswork",
          "Transparent reporting every single month",
          "ROI-focused \u2014 profit over vanity metrics",
          "Direct communication, no account managers"
        ],
        tools_eyebrow: "Tools & Expertise",
        tools_title_a: "The",
        tools_title_b: "Stack",
        tools_title_c: "Behind the Results",
        tools_sub: "Platforms and tools I use daily to plan, launch, measure and scale campaigns.",
        tools: [
          {
            icon: "M",
            name: "Meta Ads Manager"
          },
          {
            icon: "G",
            name: "Google Ads"
          },
          {
            icon: "A",
            name: "Google Analytics 4"
          },
          {
            icon: "S",
            name: "Search Console"
          },
          {
            icon: "A",
            name: "Ahrefs"
          },
          {
            icon: "S",
            name: "Semrush"
          },
          {
            icon: "Y",
            name: "YouTube Studio"
          },
          {
            icon: "T",
            name: "TubeBuddy"
          },
          {
            icon: "L",
            name: "Looker Studio"
          },
          {
            icon: "G",
            name: "Google Tag Manager"
          },
          {
            icon: "C",
            name: "Canva"
          },
          {
            icon: "M",
            name: "Mailchimp"
          }
        ],
        marquee: [
          "YouTube Promotion",
          "Google Ads",
          "Music Promotion",
          "YouTube SEO",
          "Social Media Marketing",
          "Creative & Content Support",
          "Conversion Tracking",
          "Funnel Strategy",
          "Retargeting"
        ],
        cta_eyebrow: "Let's Work Together",
        cta_title_a: "Ready to Turn Your Marketing",
        cta_title_b: "Growth Engine?",
        cta_text: "Tell me about your business and your goals. I'll review your current setup and come back with an honest assessment of what's working, what isn't, and what I'd do differently \u2014 no obligation.",
        cta_button: "Book a Free Strategy Call",
        cta_note: "Usually replies within 24 hours"
      },
      about: {
        eyebrow: "About Me",
        title_a: "The Person Behind",
        title_b: "The Campaigns",
        intro: "I'm a digital marketer who would rather explain a decision than hide behind a dashboard. Here's how I work, what I've built, and what you can expect if we work together.",
        image: "assets/img/abir-portrait.png",
        lead: "Most marketing goes wrong long before the first ad goes live \u2014 in the assumptions nobody questioned and the tracking nobody checked.",
        paras: [
          "That's where I start. Whether it's a Meta account that's been scaling the wrong campaign for months, a Google Ads budget quietly leaking into broad-match searches, or a YouTube channel publishing good videos nobody can find \u2014 the fix usually begins with an honest audit rather than a bigger budget.",
          "I work across <strong>YouTube Promotion, Google Ads, Music Promotion, YouTube SEO, Social Media Marketing and Creative & Content Support</strong>. Some clients need one of those; most need two or three working together. I'd rather tell you which one matters right now than sell you a bundle you don't need.",
          "Teaching keeps me honest \u2014 it's hard to explain a shortcut to someone learning from scratch without admitting it's a shortcut. Replace this paragraph with your own from the Admin Panel.",
          "If you work with me, you get direct communication \u2014 no account managers in between \u2014 clear monthly reporting, and someone who treats your ad budget the way he'd treat his own."
        ],
        sign_role: "Digital Marketer & Growth Strategist",
        cta_title_a: "Think We'd Work Well",
        cta_title_b: "Together?",
        cta_text: "Tell me about your business and what's not working right now. I'll give you an honest read on where the problem actually is \u2014 even if the answer isn't one of my services."
      },
      services_page: {
        eyebrow: "What I Offer",
        title_a: "Digital Marketing",
        title_b: "Services",
        intro: "Every service below is delivered the same way \u2014 understand the business first, set up clean tracking, then execute and report transparently. Browse by category, or explore all the core services and pick the one that matches where you are right now.",
        cta_title_a: "Not Sure Which Service",
        cta_title_b: "You Actually Need?",
        cta_text: "Tell me about your business and where you're stuck. I'll look at your current setup and recommend the service that makes the most sense to start with \u2014 even if that means starting smaller than you expected."
      },
      services: [
        {
          id: "svc1",
          title: "YouTube Promotion",
          category: "Paid Advertising",
          icon: "facebook",
          desc: "Full-funnel Meta advertising across Facebook and Instagram \u2014 built around audience research, disciplined creative testing and clean conversion tracking rather than guesswork.",
          items: [
            "Ad account audit & campaign structure",
            "Audience research and targeting strategy",
            "Creative & copy testing framework",
            "Pixel, Conversions API & event tracking",
            "Retargeting funnels and scaling plan"
          ],
          note: "Pricing on request"
        },
        {
          id: "svc2",
          title: "Google Ads",
          category: "Paid Advertising",
          icon: "google",
          desc: "Search, Performance Max, Display and YouTube campaigns designed to capture high-intent demand at a cost per acquisition your business can sustain and scale.",
          items: [
            "Keyword & competitor research",
            "Search and Performance Max campaign builds",
            "Ad copy writing and extension setup",
            "Negative keyword and search-term management",
            "Bid strategy, budget pacing & scaling"
          ],
          note: "Pricing on request"
        },
        {
          id: "svc3",
          title: "Music Promotion",
          category: "Paid Advertising",
          icon: "tiktok",
          desc: "Short-form video advertising that fits how people actually scroll on TikTok \u2014 native-feeling creative, tight audience testing and tracking set up properly from day one.",
          items: [
            "Ads Manager & Business Centre setup",
            "Campaign structure and objective planning",
            "Short-form creative direction & hooks",
            "TikTok Pixel and Events API tracking",
            "Audience testing, retargeting & scaling"
          ],
          note: "Pricing on request"
        },
        {
          id: "svc4",
          title: "YouTube SEO",
          category: "Video & Search",
          icon: "youtube",
          desc: "Channel and video optimization that grows watch time, subscribers and search impressions \u2014 so your content keeps working long after upload day.",
          items: [
            "Channel audit & positioning review",
            "Video keyword and topic research",
            "Title, description & tag optimization",
            "Thumbnail and click-through strategy",
            "Back-catalogue optimization & growth roadmap"
          ],
          note: "Pricing on request"
        },
        {
          id: "svc5",
          title: "Social Media Marketing",
          category: "Social & Content",
          icon: "social",
          desc: "A consistent, on-brand presence across Facebook, Instagram and LinkedIn \u2014 content systems that build trust with your audience and give your paid campaigns something worth clicking.",
          items: [
            "Profile setup & brand positioning",
            "Content strategy and monthly calendar",
            "Post copywriting & creative direction",
            "Community management & engagement",
            "Monthly performance reporting"
          ],
          note: "Pricing on request"
        },
        {
          id: "svc6",
          title: "Creative & Content Support",
          category: "E-commerce",
          icon: "shopify",
          desc: "Store setup, configuration and optimization on Creative & Content Support \u2014 a storefront that is quick to buy from and properly connected to every channel you advertise on.",
          items: [
            "Store setup & theme customization",
            "Product and collection structure",
            "Payment, shipping & checkout configuration",
            "Essential app integration",
            "Analytics, pixels & channel connection"
          ],
          note: "Pricing on request"
        }
      ],
      portfolio_page: {
        eyebrow: "Selected Work",
        title_a: "My",
        title_b: "Work",
        intro: "A selection of the campaigns, channels and storefronts I've worked on. Click any screenshot to see it full size.",
        cta_title_a: "Want Work Like This",
        cta_title_b: "For Your Business?",
        cta_text: "Tell me what you're working on and where you want to get to. I'll review your current setup and come back with an honest view of what I'd do first."
      },
      projects: [
        {
          id: "p1",
          title: "YouTube Channel Growth — 158K+ Views",
          image: "assets/img/youtube-growth-158k.jpg",
          text: "A full Meta advertising build for an online clothing store \u2014 account structure, audience testing and a creative rotation designed to keep cost per purchase stable."
        },
        {
          id: "p2",
          title: "YouTube SEO — Before & After",
          image: "assets/img/youtube-seo-before-after.jpg",
          text: "Search and Performance Max campaigns built around high-intent local keywords, with call and form tracking wired up before a single click was paid for."
        },
        {
          id: "p3",
          title: "Google Ads — Video Campaign",
          image: "assets/img/google-ads-10124.jpg",
          text: "A launch campaign built for short-form video \u2014 native-feeling creative, fast hook testing and a retargeting layer for everyone who watched but didn't buy."
        },
        {
          id: "p4",
          title: "SoundCloud Artist Growth Campaign",
          image: "assets/img/soundcloud-atargo-results.png",
          text: "A channel-wide optimization pass \u2014 keyword-led topic planning, rewritten metadata and a thumbnail system built to lift click-through on the back catalogue."
        },
        {
          id: "p5",
          title: "YouTube Video Performance Growth",
          image: "assets/img/youtube-analytics-5575.jpg",
          text: "A monthly content system across Facebook and Instagram \u2014 calendar, copy, creative direction and community management kept consistently on brand."
        },
        {
          id: "p6",
          title: "YouTube Promotion Campaign",
          image: "assets/img/youtube-promotion-71k.jpeg",
          text: "A complete storefront build \u2014 theme setup, product structure, checkout configuration and tracking connected across every marketing channel from day one."
        },
        {
          id: "p7",
          title: "SoundCloud Track Promotion",
          image: "assets/img/soundcloud-darkone-results.png",
          text: "Intent-clustered search campaigns paired with landing pages mapped to each keyword theme, so the message matched what people actually searched for."
        },
        {
          id: "p8",
          title: "Google Ads — Targeted Video Views",
          image: "assets/img/google-ads-1208.jpg",
          text: "A Meta acquisition campaign for an app launch \u2014 event tracking mapped to real in-app actions instead of installs alone, then scaled on what actually retained."
        },
        {
          id: "p9",
          title: "Creative & Content Support Store Redesign & Optimization",
          image: "assets/img/instagram-growth.jpg",
          text: "A storefront refresh focused on the buying path \u2014 clearer navigation, rebuilt product pages and a checkout flow with fewer places to drop off."
        }
      ],
      testimonials_page: {
        eyebrow: "Client Feedback",
        title_a: "What Clients",
        title_b: "Say About My Work",
        intro: "The part of the job I care about most isn't the dashboard \u2014 it's whether the person paying for it understands what's happening and feels it was worth it. Here's what a few of them have said.",
        cta_title_a: "Ready to Write the",
        cta_title_b: "Next One?",
        cta_text: "Tell me about your business and your goals. I'll review your current setup and come back with an honest assessment of what's working, what isn't, and what I'd do differently."
      },
      testimonials: [
        {
          id: "t1",
          svc: "YouTube Promotion",
          name: "Michael Carter",
          role: "Founder, Northline Apparel",
          initials: "MC",
          a: "#35E0F0",
          b: "#7B5CFF",
          text: "He restructured our entire Meta ad account in the first two weeks. What impressed me most wasn't the results \u2014 it was how clearly he explained every decision. We finally understood where our money was going, and the revenue followed."
        },
        {
          id: "t2",
          svc: "Google Ads",
          name: "Sarah Whitfield",
          role: "Marketing Director, Nexlify",
          initials: "SW",
          a: "#7B5CFF",
          b: "#FF7A59",
          text: "We had tried three agencies before. He was the first person who audited our tracking before spending a single dollar. Six months later our cost per lead is less than half what it used to be and the leads actually convert."
        },
        {
          id: "t3",
          svc: "YouTube SEO",
          name: "Daniel Brooks",
          role: "Content Creator & Educator",
          initials: "DB",
          a: "#FF7A59",
          b: "#35E0F0",
          text: "My channel was stuck at 2,000 subscribers for over a year. He rebuilt my keyword strategy and metadata, and within months the old videos started getting more views than my new ones. That changed everything for my business."
        },
        {
          id: "t4",
          svc: "Social Media Marketing",
          name: "Emily Harper",
          role: "Director, Brightpath Clinic",
          initials: "EH",
          a: "#35E0F0",
          b: "#4ADE80",
          text: "Reliable, transparent and genuinely invested in the outcome. The monthly reports are the clearest I've ever received from a marketer \u2014 no jargon, just what happened, what it cost and what we're doing next."
        },
        {
          id: "t5",
          svc: "Music Promotion",
          name: "Olivia Bennett",
          role: "Co-founder, Glow Lab",
          initials: "OB",
          a: "#FF4D6D",
          b: "#7B5CFF",
          text: "He understood short-form content better than the creators we were already paying. The ads stopped looking like ads, and that alone changed how people responded to them."
        },
        {
          id: "t6",
          svc: "Creative & Content Support",
          name: "James Whitaker",
          role: "Owner, Craft & Co",
          initials: "JW",
          a: "#4ADE80",
          b: "#35E0F0",
          text: "Our store was live but nothing was connected properly \u2014 no pixel, no events, no reporting. He rebuilt the whole setup and, for the first time, I could actually see which products were selling and why."
        },
        {
          id: "t7",
          svc: "YouTube Promotion",
          name: "Thomas Reid",
          role: "Manager, Skyline Properties",
          initials: "TR",
          a: "#7B5CFF",
          b: "#35E0F0",
          text: "What I appreciate most is that he tells me when something isn't worth spending on. That's rare. It's the reason we've kept working together instead of shopping around every few months."
        },
        {
          id: "t8",
          svc: "Google Ads",
          name: "Charlotte Hayes",
          role: "Founder, LearnBridge",
          initials: "CH",
          a: "#FFC155",
          b: "#FF7A59",
          text: "He takes the time to explain the reasoning behind each change, so I've actually learned a lot about my own marketing along the way. It never feels like a black box."
        },
        {
          id: "t9",
          svc: "Creative & Content Support",
          name: "Ethan Walsh",
          role: "E-commerce Lead, Harbor Goods",
          initials: "EW",
          a: "#35E0F0",
          b: "#4ADE80",
          text: "The storefront looked fine, but the buying path was leaking customers at every step. He reworked the navigation and product pages, and the difference showed up in the numbers within weeks."
        }
      ],
      contact_page: {
        eyebrow: "Get in Touch",
        title_a: "Let's Talk About",
        title_b: "Your Growth",
        intro: "Tell me what you're working on and where it's stuck. I'll look at your current setup and come back with an honest read on what I'd fix first \u2014 no obligation, no sales script.",
        form_title: "Send a Message",
        form_sub: "Fill this in and I'll get back to you personally."
      }
    };
  }
});

// ../netlify-site/netlify/functions/src/api.js
var crypto = require("crypto");
var { getStore, connectLambda } = require_main3();
var DEFAULT_CONTENT = require_default_content();
var SITE = "ak-site";
var MEDIA = "ak-media";
var K_CONTENT = "content.json";
var K_AUTH = "auth.json";
var K_MSG = "messages.json";
var K_THROTTLE = "throttle.json";
var DEFAULT_USER = "admin";
var DEFAULT_PASS = "-YPYLqpMyr6PhZCz";
var SESSION_HOURS = 8;
var MAX_TRIES = 5;
var LOCK_MINUTES = 5;
var MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;
var IMAGE_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif"
};
function json(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: Object.assign({
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }, extraHeaders || {}),
    body: JSON.stringify(body)
  };
}
var ok = (b, h) => json(200, Object.assign({ ok: true }, b || {}), h);
var bad = (code, error) => json(code, { ok: false, error });
var STRONG = null;
function strongAvailable() {
  if (STRONG !== null) return STRONG;
  STRONG = false;
  try {
    const raw = process.env.NETLIFY_BLOBS_CONTEXT;
    if (raw) {
      const d = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
      STRONG = Boolean(d.uncachedEdgeURL || d.url_uncached);
    }
  } catch (e) {
    STRONG = false;
  }
  return STRONG;
}
function store(name) {
  return strongAvailable() ? getStore({ name, consistency: "strong" }) : getStore({ name });
}
function site() {
  return store(SITE);
}
function media() {
  return store(MEDIA);
}
async function readJson(store2, key, fallback) {
  try {
    const v = await store2.get(key, { type: "json" });
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
function verOf(content) {
  return crypto.createHash("sha1").update(JSON.stringify(content)).digest("hex").slice(0, 12);
}
function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64url(s) {
  return Buffer.from(String(s).replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function hashPassword(pass, salt) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(String(pass), s, 64).toString("hex");
  return { salt: s, hash: h };
}
function verifyPassword(pass, rec) {
  if (!rec || !rec.salt || !rec.hash) return false;
  const h = crypto.scryptSync(String(pass), rec.salt, 64).toString("hex");
  const a = Buffer.from(h, "hex"), b = Buffer.from(rec.hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
async function auth() {
  const st = site();
  let rec = await readJson(st, K_AUTH, null);

  if (!rec || !rec.hash) {
    const tempPassword = "ShiamAdmin2026!";

    rec = Object.assign(
      {
        user: "admin",
        secret: crypto.randomBytes(32).toString("hex"),
        isDefault: true
      },
      hashPassword(tempPassword)
    );

    await st.setJSON(K_AUTH, rec);
  }

  if (!rec.secret) {
    rec.secret = crypto.randomBytes(32).toString("hex");
    await st.setJSON(K_AUTH, rec);
  }

  return rec;
}
function sign(payload, secret) {
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  return body + "." + sig;
}
function readToken(token, secret) {
  if (!token || token.indexOf(".") < 0) return null;
  const [body, sig] = token.split(".");
  const want = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  const a = Buffer.from(sig || ""), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(unb64url(body).toString("utf8"));
    if (!p.exp || p.exp < Date.now()) return null;
    return p;
  } catch (e) {
    return null;
  }
}
function cookieFrom(headers) {
  const raw = headers && (headers.cookie || headers.Cookie) || "";
  const out = {};
  raw.split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}
function setCookie(token, maxAge) {
  const bits = ["ak_sess=" + encodeURIComponent(token), "Path=/", "HttpOnly", "SameSite=Lax", "Secure"];
  bits.push("Max-Age=" + maxAge);
  return { "Set-Cookie": bits.join("; ") };
}
async function requireAuth(event) {
  const rec = await auth();
  const token = cookieFrom(event.headers).ak_sess;
  const p = readToken(token, rec.secret);
  if (!p || p.u !== rec.user || p.g !== (rec.gen || 0)) return null;
  return { rec, session: p };
}
async function throttleState() {
  return await readJson(site(), K_THROTTLE, { fails: 0, until: 0 });
}
async function throttleFail() {
  const st = site();
  const t = await throttleState();
  t.fails = (t.fails || 0) + 1;
  if (t.fails >= MAX_TRIES) {
    t.until = Date.now() + LOCK_MINUTES * 6e4;
    t.fails = 0;
  }
  await st.setJSON(K_THROTTLE, t);
  return t;
}
async function throttleClear() {
  await site().setJSON(K_THROTTLE, { fails: 0, until: 0 });
}
async function contentDoc() {
  const st = site();
  let doc = await readJson(st, K_CONTENT, null);
  if (!doc || !doc.content) {
    doc = { ver: verOf(DEFAULT_CONTENT), content: DEFAULT_CONTENT };
    await st.setJSON(K_CONTENT, doc);
  }
  return doc;
}
var CONTENT_KEYS = Object.keys(DEFAULT_CONTENT);
function sanitiseContent(incoming, base) {
  const out = JSON.parse(JSON.stringify(base));
  CONTENT_KEYS.forEach((k) => {
    if (incoming && Object.prototype.hasOwnProperty.call(incoming, k)) out[k] = incoming[k];
  });
  return out;
}
var clean = (v, max) => String(v == null ? "" : v).replace(/\u0000/g, "").trim().slice(0, max || 2e3);
function routeOf(event) {
  let p = event.path || event.rawUrl || "/";
  try {
    if (/^https?:\/\//.test(p)) p = new URL(p).pathname;
  } catch (e) {
  }
  p = p.replace(/^\/\.netlify\/functions\/api/, "").replace(/^\/api/, "");
  p = p.replace(/^\/+/, "").replace(/\/+$/, "");
  return p;
}
function bodyOf(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}
exports.handler = async function(event) {
  const route = routeOf(event);
  const method = (event.httpMethod || "GET").toUpperCase();
  try {
    if (typeof connectLambda === "function") connectLambda(event);
  } catch (e) {
  }
  try {
    if (route.startsWith("img/")) {
      const key = decodeURIComponent(route.slice(4));
      if (!/^[A-Za-z0-9._-]{1,120}$/.test(key)) return bad(404, "Not found");
      const st2 = media();
      const blob = await st2.getWithMetadata(key, { type: "arrayBuffer" });
      if (!blob) return bad(404, "Not found");
      const ext = (key.split(".").pop() || "").toLowerCase();
      const type = blob.metadata && blob.metadata.type || IMAGE_TYPES[ext] || "application/octet-stream";
      return {
        statusCode: 200,
        headers: {
          "Content-Type": type,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff"
        },
        body: Buffer.from(blob.data).toString("base64"),
        isBase64Encoded: true
      };
    }
    if (route === "content" && method === "GET") {
      const doc = await contentDoc();
      return ok({ ver: doc.ver, content: doc.content });
    }
    if (route === "contact" && method === "POST") {
      const b = bodyOf(event);
      if (clean(b.website)) return ok({ stored: false });
      const name = clean(b.name, 120);
      const email = clean(b.email, 160);
      const message = clean(b.message, 5e3);
      if (!name || !message || message.length < 10) return bad(422, "Please fill in your name and message.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad(422, "Please enter a valid email address.");
      const st2 = site();
      const list = await readJson(st2, K_MSG, []);
      list.unshift({
        id: crypto.randomBytes(8).toString("hex"),
        at: (/* @__PURE__ */ new Date()).toISOString(),
        name,
        email,
        phone: clean(b.phone, 60),
        service: clean(b.service, 120),
        message
      });
      await st2.setJSON(K_MSG, list.slice(0, 500));
      return ok({ stored: true });
    }
    if (route === "login" && method === "POST") {
      const t = await throttleState();
      if (t.until && t.until > Date.now()) {
        const mins = Math.ceil((t.until - Date.now()) / 6e4);
        return bad(429, "Too many attempts. Try again in " + mins + " minute" + (mins > 1 ? "s" : "") + ".");
      }
      const b = bodyOf(event);
      const rec = await auth();
      const userOk = clean(b.user, 80) === rec.user;
      const passOk = verifyPassword(String(b.pass || ""), rec);
      if (!userOk || !passOk) {
        await throttleFail();
        return bad(401, "Wrong username or password.");
      }
      await throttleClear();
      const maxAge = SESSION_HOURS * 3600;
      const token = sign({ u: rec.user, g: rec.gen || 0, exp: Date.now() + maxAge * 1e3 }, rec.secret);
      return ok({ user: rec.user, mustChange: rec.isDefault === true }, setCookie(token, maxAge));
    }
    if (route === "logout") {
      return ok({}, { "Set-Cookie": "ak_sess=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0" });
    }
    if (route === "session") {
      const a2 = await requireAuth(event);
      return a2 ? ok({ user: a2.rec.user, mustChange: a2.rec.isDefault === true }) : json(200, { ok: false });
    }
    const a = await requireAuth(event);
    if (!a) return bad(401, "Please sign in again.");
    const st = site();
    if (a.rec.isDefault === true && route !== "account") {
      return bad(403, "Set your own password first \u2014 Admin Account in the sidebar. Nothing can be saved until then.");
    }
    if (route === "save" && method === "POST") {
      const b = bodyOf(event);
      if (!b || typeof b.content !== "object" || !b.content) return bad(422, "Nothing to save.");
      const doc = await contentDoc();
      const c = sanitiseContent(b.content, doc.content);
      const next = { ver: verOf(c), content: c };
      await st.setJSON(K_CONTENT, next);
      return ok({ ver: next.ver });
    }
    if (route === "reset" && method === "POST") {
      const fresh = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
      const next = { ver: verOf(fresh), content: fresh };
      await st.setJSON(K_CONTENT, next);
      return ok({ ver: next.ver, content: next.content });
    }
    if (route === "account" && method === "POST") {
      const b = bodyOf(event);
      const rec = a.rec;
      if (!verifyPassword(String(b.current || ""), rec)) return bad(403, "Your current password is not correct.");
      const user = clean(b.user, 80) || rec.user;
      let next = Object.assign({}, rec, { user, gen: (rec.gen || 0) + 1 });
      const pass = String(b.pass || "");
      if (pass) {
        if (pass.length < 8) return bad(422, "Use at least 8 characters for the new password.");
        if (pass !== String(b.pass2 || "")) return bad(422, "The two new passwords do not match.");
        if (pass === DEFAULT_PASS) return bad(422, "Please choose a password of your own, not the one the site shipped with.");
        next = Object.assign(next, hashPassword(pass));
        next.isDefault = false;
      } else if (rec.isDefault === true) {
        return bad(422, "Set a new password before changing anything else.");
      }
      await st.setJSON(K_AUTH, next);
      const maxAge = SESSION_HOURS * 3600;
      const token = sign({ u: next.user, g: next.gen, exp: Date.now() + maxAge * 1e3 }, next.secret);
      return ok({ user: next.user, mustChange: next.isDefault === true }, setCookie(token, maxAge));
    }
    if (route === "upload" && method === "POST") {
      const b = bodyOf(event);
      const name = clean(b.name, 160);
      const data = String(b.data || "");
      const m = data.match(/^data:([a-z0-9/+.-]+);base64,(.+)$/i);
      if (!m) return bad(422, "Could not read that file.");
      let ext = (name.split(".").pop() || "").toLowerCase();
      if (!IMAGE_TYPES[ext]) {
        ext = Object.keys(IMAGE_TYPES).find((k) => IMAGE_TYPES[k] === m[1].toLowerCase());
        if (!ext) return bad(422, "Only PNG, JPG, GIF, WEBP, AVIF or SVG images are allowed.");
      }
      const buf = Buffer.from(m[2], "base64");
      if (!buf.length) return bad(422, "That file is empty.");
      if (buf.length > MAX_IMAGE_BYTES) return bad(413, "That image is larger than 3.5 MB \u2014 please compress it first.");
      if (ext === "svg") {
        const text = buf.toString("utf8");
        if (/<script|on\w+\s*=|javascript:|<foreignObject/i.test(text)) {
          return bad(422, "That SVG contains scripting and was rejected.");
        }
      } else {
        const sig = buf.slice(0, 12);
        const isPNG = sig.slice(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        const isJPG = sig[0] === 255 && sig[1] === 216;
        const isGIF = sig.slice(0, 3).toString("ascii") === "GIF";
        const isRIFF = sig.slice(0, 4).toString("ascii") === "RIFF";
        const isAVIF = sig.slice(4, 8).toString("ascii") === "ftyp";
        if (!(isPNG || isJPG || isGIF || isRIFF || isAVIF)) return bad(422, "That file is not a real image.");
      }
      const slug = (name.replace(/\.[^.]+$/, "") || "image").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";
      const key = slug + "-" + crypto.randomBytes(4).toString("hex") + "." + ext;
      await media().set(key, buf, {
        metadata: { type: IMAGE_TYPES[ext], name, size: buf.length, at: (/* @__PURE__ */ new Date()).toISOString() }
      });
      return ok({ key, path: "/api/img/" + key, size: buf.length });
    }
    if (route === "media" && method === "GET") {
      const st2 = media();
      const { blobs } = await st2.list();
      const items = [];
      for (const b of blobs || []) {
        let meta = {};
        try {
          const g = await st2.getMetadata(b.key);
          meta = g && g.metadata || {};
        } catch (e) {
        }
        items.push({ key: b.key, path: "/api/img/" + b.key, name: meta.name || b.key, size: meta.size || 0, at: meta.at || "" });
      }
      items.sort((x, y) => String(y.at).localeCompare(String(x.at)));
      return ok({ items });
    }
    if (route === "media/delete" && method === "POST") {
      const key = clean(bodyOf(event).key, 140);
      if (!/^[A-Za-z0-9._-]{1,120}$/.test(key)) return bad(422, "Bad file name.");
      await media().delete(key);
      return ok({});
    }
    if (route === "messages" && method === "GET") {
      return ok({ items: await readJson(st, K_MSG, []) });
    }
    if (route === "messages/delete" && method === "POST") {
      const id = clean(bodyOf(event).id, 40);
      const list = await readJson(st, K_MSG, []);
      await st.setJSON(K_MSG, list.filter((m) => m.id !== id));
      return ok({});
    }
    return bad(404, "Unknown endpoint: " + route);
  } catch (err) {
    return bad(500, "Server error: " + (err && err.message ? err.message : "unknown"));
  }
};
