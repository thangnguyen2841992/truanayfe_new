import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Merchant} from '../../model/merchant';
import {CouponService} from '../../service/coupon/coupon.service';
import {NotificationService} from '../../service/notification/notification.service';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth/auth.service';
import {MerchantService} from '../../service/merchant/merchant.service';
import {Dish} from '../../model/dish';
import {Category} from '../../model/category';
import {DishService} from '../../service/dish/dish.service';
import {CategoryService} from '../../service/category/category.service';


declare var $: any;

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css']
})
export class CreateCouponComponent implements OnInit {
  couponForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    reduction: new FormControl('', Validators.required)
  });
  merchant: Merchant = {};
  currentUserId: number;

  constructor(private dishService: DishService,
              private notificationService: NotificationService,
              private categoryService: CategoryService,
              private router: Router,
              private authService: AuthService,
              private merchantService: MerchantService,
              private couponService: CouponService) {
    this.currentUserId = this.authService.currentUserValue.id;
  }

  ngOnInit() {
    this.getMerchant();
  }

  get nameControl() {
    return this.couponForm.get('name');
  }

  get priceControl() {
    return this.couponForm.get('quantity');
  }

  get descriptionControl() {
    return this.couponForm.get('description');
  }

  get reductionControl() {
    return this.couponForm.get('reduction');
  }
  getMerchant() {
    this.merchantService.getMerchantByUser(this.currentUserId).subscribe(merchantBE => {
      this.merchant = merchantBE;
    });
  }

  createCoupon() {
    if (this.couponForm.valid) {
     let newCoupon = {
       name : this.couponForm.value.name,
       merchant: this.merchant,
       description: this.couponForm.value.description,
       value: this.couponForm.value.quantity,
       reduction: this.couponForm.value.reduction
     };
      this.couponService.createCoupon(newCoupon).subscribe(() => {
        this.notificationService.showMessage('success', 'Tạo voucher thành công');
        this.router.navigateByUrl('/merchant/coupon/list');
      }, error => {
        this.notificationService.showMessage('error', error.error.message);
      });
    } else {
      this.notificationService.showMessage('error', 'Vui lòng kiểm tra lại thông tin nhập');
    }
  }



}



