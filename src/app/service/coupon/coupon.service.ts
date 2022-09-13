import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Coupon} from "../../model/coupon";
import {Observable} from "rxjs";


const API_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private httpClient: HttpClient) {
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.httpClient.post<Coupon>(`${API_URL}/coupons/create-coupon`, coupon);
  }

  getCouponByDishId(dishId: number) {
    return this.httpClient.get(`${API_URL}/coupons/dishes/${dishId}`);
  }

  getCouponByMerchantId(merchantId: number) {
    return this.httpClient.get(`${API_URL}/coupons/merchants/${merchantId}`);
  }
  getCouponByMerchant(merchantId: number): Observable<Coupon[]> {
    return this.httpClient.get<Coupon[]>(`${API_URL}/coupons/merchant/${merchantId}`);
  }
}
