import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {OrderDto} from '../../model/order-dto';
import {Observable} from 'rxjs';
import {Order} from "../../model/order";
import {OrderResponse} from "../../model/order-response";

const API_URL = `${environment.apiUrl}`;


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) {
  }

  createOrder(userId: number, orderDto: OrderDto): Observable<{ id?: number }> {
    return this.httpClient.post(`${API_URL}/current-user/create-order/user/${userId}`, orderDto);
  }

  getOrder(orderId: number): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(`${API_URL}/orders/${orderId}`);
  }

  cancelOrder(orderId: number, orderDto: OrderDto) {
    return this.httpClient.post(`${API_URL}/orders/${orderId}/cancels`, orderDto);
  }
}
