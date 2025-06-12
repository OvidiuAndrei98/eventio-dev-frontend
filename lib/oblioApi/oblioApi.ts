'use server';

import axios, { AxiosInstance } from 'axios';

class OblioApi {
  _cif = '';
  _email = '';
  _secret = '';
  _baseURL = 'https://www.oblio.eu';

  constructor(email: string, secret: string) {
    this._email = email;
    this._secret = secret;
  }

  async list(type: string, filters: Map = {}): Promise<Map> {
    const request = await this.buildRequest();
    let response;
    try {
      if (!('cif' in filters)) {
        filters.cif = this.getCif();
      }
      response = await request.get(`/api/docs/${type}/list`, {
        params: filters,
      });
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response = (err as any).response;
      } else {
        throw err;
      }
    }
    this._checkErrorResponse(response);
    return response.data;
  }

  setCif(cif: string): void {
    this._cif = cif;
  }

  getCif(): string {
    return this._cif;
  }

  async buildRequest(): Promise<AxiosInstance> {
    const accessToken: AccessToken = await this._generateAccessToken();
    const request = axios.create({
      baseURL: this._baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken.token_type + ' ' + accessToken.access_token,
      },
    });
    return request;
  }

  async _generateAccessToken(): Promise<AccessToken> {
    if (!this._email || !this._secret) {
      throw new OblioApiException('Email or secret are empty!');
    }
    const response = await axios.request({
      method: 'post',
      url: `${this._baseURL}/api/authorize/token`,
      data: {
        client_id: this._email,
        client_secret: this._secret,
        grant_type: 'client_credentials',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status < 200 || response.status >= 300) {
      throw new OblioApiException(
        `Error authorize token! HTTP status: ${response.status}`,
        response.status
      );
    }
    return new AccessToken(response.data);
  }

  _checkType(type: string): void {
    if (['invoice', 'proforma', 'notice', 'receipt'].indexOf(type) === -1) {
      throw new OblioApiException('Type not supported');
    }
  }

  _checkErrorResponse(response: Map): void {
    if (response.status < 200 || response.status >= 300) {
      if (!('statusMessage' in response.data)) {
        response.data = {
          statusMessage: `Error! HTTP response status: ${response.status}`,
        };
      }
      throw new OblioApiException(response.data.statusMessage, response.status);
    }
  }
}

interface Map {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

class OblioApiException {
  message = '';
  code = 0;
  constructor(message = '', code = 0) {
    this.message = message;
    this.code = code;
  }
}

class AccessToken {
  request_time: number;
  expires_in: number;
  token_type: string;
  access_token: string;

  constructor(data: Map) {
    this.request_time = data.request_time;
    this.expires_in = data.expires_in;
    this.token_type = data.token_type;
    this.access_token = data.access_token;
  }
}

const oblioApi = new OblioApi(
  process.env.API_EMAIL || '',
  process.env.API_SECRET || ''
);

oblioApi.setCif(process.env.CIF || '');

// make this a singleton instance
declare global {
  // eslint-disable-next-line no-var
  var oblioApiSingleton: OblioApi | undefined;
}

const oblioApiInstance = globalThis.oblioApiSingleton || oblioApi;

if (process.env.NODE_ENV !== 'production') {
  globalThis.oblioApiSingleton = oblioApiInstance;
}

export async function listDocuments(
  type: string,
  filters: Map = {}
): Promise<Map> {
  return await oblioApiInstance.list(type, filters);
}
