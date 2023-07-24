interface IQQLocationIpResponse {
  status: number;
  message?: string;
  request_id?: string;
  result?: IQQLocationIpResponseResult;
}

interface IQQLocationIpResponseResult {
  ip?: string;
  location?: IQQLocationIpResponseLocation;
  ad_info?: IQQLocationIpResponseAdinfo;
}

interface IQQLocationIpResponseAdinfo {
  nation?: string;
  province?: string;
  city?: string;
  district?: string;
  adcode?: number;
  nation_code?: number;
}

interface IQQLocationIpResponseLocation {
  lat?: number;
  lng?: number;
}