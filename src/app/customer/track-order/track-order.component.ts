import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {OrderService} from '../../service/order/order.service';
import {OrderDto} from '../../model/order-dto';
import {Merchant} from '../../model/merchant';
import {Order} from "../../model/order";
import {OrderResponse} from "../../model/order-response";

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {

  orderId: number;
  merchant: Merchant = {};
  orderStatus?: string;
  order: OrderResponse;
  total: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.orderId = +paramMap.get('orderId');
    });
  }

  ngOnInit() {
    this.getOrder();
  }

  getOrder() {
    this.orderService.getOrder(this.orderId).subscribe(
      (order) => {
        this.total = (order.totalFee + order.discountAmount) - (order.shippingFee + order.serviceFee);
        this.order = order;
        switch (this.order.status) {
          case -1: {
            this.orderStatus = 'Đã hủy';
            break;
          }
          case 1: {
            this.orderStatus = 'Đã xác nhận';
            break;
          }
          case 0:
          default: {
            this.orderStatus = 'Chờ xác nhận';
            break;
          }
        }
      }
    );
  }

}
