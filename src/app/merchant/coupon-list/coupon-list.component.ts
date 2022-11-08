import {Component, OnInit} from '@angular/core';
import {Merchant} from "../../model/merchant";
import {Dish} from "../../model/dish";
import {MerchantService} from "../../service/merchant/merchant.service";
import {DishService} from "../../service/dish/dish.service";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {CouponService} from "../../service/coupon/coupon.service";
import {Coupon} from "../../model/coupon";
import {NotificationService} from "../../service/notification/notification.service";

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.css']
})
export class CouponListComponent implements OnInit {
  merchant: Merchant = {};
  coupons: Coupon[];
  userId: number;
  couponId: number;
  constructor(private merchantService: MerchantService,
              private authService: AuthService,
              private router: Router,
              private couponService: CouponService,
              private notificationService: NotificationService) {

    this.userId = this.authService.currentUserValue.id;
  }

  ngOnInit() {
    this.getMerchant();
    this.getAllCoupons();
  }

  getMerchant() {
    this.merchantService.getCurrentUserMerchant().subscribe(
      merchant => {
        this.merchant = merchant;
        if (!merchant.active) {
          this.router.navigateByUrl('/merchant/banned');
        }
      }
    );
  }

  getAllCoupons() {
    this.couponService.getCouponByUser(this.userId).subscribe((coupons) => {
      this.coupons = coupons;
    });
  }

  deleteCoupon() {
    this.couponService.deleteCoupon(this.couponId).subscribe((coupon) => {
      this.getAllCoupons();
      this.notificationService.showSuccessMessage('Xóa voucher thành công!');
    });
  }

  getCouponId(id: number) {
    this.couponId = id;
  }
}
