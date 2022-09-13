import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cart} from '../../model/cart';
import {AuthService} from '../../service/auth/auth.service';
import {CartService} from '../../service/cart/cart.service';
import {NotificationService} from '../../service/notification/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from "@angular/forms";
import {CouponService} from "../../service/coupon/coupon.service";
import {Coupon} from "../../model/coupon";

@Component({
  selector: 'app-cart-table-checkout',
  templateUrl: './cart-table-checkout.component.html',
  styleUrls: ['./cart-table-checkout.component.css']
})
export class CartTableCheckoutComponent implements OnInit {


  @Input()
  merchantId: number;

  cart: Cart;

  @Input()
  showCheckoutButton: boolean;

  @Input()
  showRestaurantNote: boolean;

  @Output()
  changeCart = new EventEmitter();

  @Output() noteRestaurant1 = new EventEmitter<string>();

  noteRestaurantForm = new FormGroup({
    noteRestaurant: new FormControl('')
  });
  currentUser: any;

  coupons: Coupon[];

  constructor(private authService: AuthService,
              private cartService: CartService,
              private notificationService: NotificationService,
              private router: Router,
              private couponService: CouponService
  ) {
  }
  getNoteRestaurant() {
    this.noteRestaurant1.emit(this.noteRestaurantForm.value.noteRestaurant);
  }
  ngOnInit() {
    this.getCart();
    this.getCouponsOfMerchant();
  }

  increaseDishQuantity(cartId: number, dishId: number) {
    this.cartService.increaseDishQuantity(cartId, dishId).subscribe(
      (response) => {
        this.getCart();
      }
    );
  }

  decreaseDishQuantity(cartId: number, dishId: number) {
    this.cartService.decreaseDishQuantity(cartId, dishId).subscribe(
      (response) => {
        this.getCart();
      }
    );
  }

  getCart() {
    this.cartService.getCurrentUserCartByMerchant(this.merchantId).subscribe(
      (response) => this.cart = response as Cart
    );
  }

  getNoteRestaurant1($event) {
      this.noteRestaurant1.emit($event.target.value);
  }
  getCouponsOfMerchant() {
    this.couponService.getCouponByMerchant(this.merchantId).subscribe((coupons) => {
      this.coupons = coupons;
    });
  }
}
