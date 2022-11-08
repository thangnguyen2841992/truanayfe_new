import {Component, Input, OnInit} from '@angular/core';
import {CouponService} from '../../service/coupon/coupon.service';
import {Router} from '@angular/router';
import {AuthService} from "../../service/auth/auth.service";
import {Coupon} from "../../model/coupon";

@Component({
  selector: 'app-coupon-delete',
  templateUrl: './coupon-delete.component.html',
  styleUrls: ['./coupon-delete.component.css']
})
export class CouponDeleteComponent implements OnInit {
  @Input()
  couponId: number;
  userId: number;
  constructor(private couponService: CouponService,
              private router: Router,
              private authService: AuthService) {
    this.userId = this.authService.currentUserValue.id;
  }

  ngOnInit() {
  }
  deleteCoupon() {
    this.couponService.deleteCoupon(this.couponId).subscribe((coupon) => {
      this.router.navigateByUrl('/merchant/coupon/list)');
      this.getAllCoupon();
    });
  }
  getAllCoupon() {
    this.couponService.getCouponByUser(this.userId).subscribe((coupons) => {
    });
  }
}
