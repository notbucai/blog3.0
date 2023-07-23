interface IBaiduLocationIp {
  address: string;
  content: BaiduLocationIpContent;
  status: number;
}

interface BaiduLocationIpContent {
  address: string;
  address_detail: BaiduLocationIpAddressDetail;
  point: BaiduLocationIpPoint;
}

interface BaiduLocationIpPoint {
  x: string;
  y: string;
}

interface BaiduLocationIpAddressDetail {
  city: string;
  city_code: number;
  province: string;
}